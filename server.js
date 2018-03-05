
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyparser = require('body-parser')
const io = require('socket.io').listen(server)

const expressValidator = require('express-validator')
const expressSession = require('express-session')

const hacheurModele = require('./modele/hacheurModele')

//
app.set('view engine', 'ejs')

const path = require('path')

//middlewares
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressValidator())
app.use(expressSession({
    secret: "adelino",
    saveUninitialized: false,
    resave: false
}))

//********************
function tracer_courbes() {

    hacheur.process((datas)=> {
        //console.log("Ucmoy= "+datas.ucmoyenne)
        io.sockets.emit("tracer", datas)
    })
}
//
app.use((req, res, next) => {
    //
    if (req.session.success === undefined) {
        req.session.success = true
    }
    //
    if (req.session.error === undefined) {
        req.session.error = undefined
    }
    //
    next()
})
//
let hacheur = new hacheurModele()

//modele
app.get('/', (req, res) => {

    res.render('modele', {
        titre: "Hacheur Série",
        hacheur_datas: hacheur.getModele(),
        succes: req.session.success,
        error: req.session.error
    })
})
//post
app.post('/', (req, res) => {
    //check

    req.check('hacheur_ve', 'Problème de saisie pour Ve').isFloat({
        gt: 0.0
    });
    req.check('hacheur_r', 'Problème de saisie pour R').isFloat({
        gt: 0.0
    });
    req.check('hacheur_l', 'Problème de saisie pour L').isFloat({
        gt: 0.0
    });
    req.check('hacheur_vd0', 'Problème de saisie pour Vd0').isFloat({
        gt: 0.0
    });
    req.check('hacheur_rdson', 'Problème de saisie pour Rdson').isFloat({
        gt: 0.0
    });
    req.check('hacheur_frequence', 'Problème de saisie pour Freq').isFloat({
        gt: 0.0
    });
    req.check('hacheur_cyclique', 'Problème de saisie pour Rapport cyclique').isFloat({
        gt: 0.0
    });

    let ve = parseFloat(req.body.hacheur_ve)
    let r = parseFloat(req.body.hacheur_r)
    let l = parseFloat(req.body.hacheur_l)
    let vd0 = parseFloat(req.body.hacheur_vd0)
    let rdson = parseFloat(req.body.hacheur_rdson)
    let freq = parseFloat(req.body.hacheur_frequence)
    let alpha = parseFloat(req.body.hacheur_cyclique)
    //
    hacheur.setModele(ve, r, l, vd0, rdson, freq, alpha)

    let les_erreurs = req.validationErrors();

    if (les_erreurs) {
        req.session.error = les_erreurs
        req.session.success = false
        res.redirect('/')
    } else {
        req.session.error = undefined
        req.session.success = true
        //
        hacheur.process((datas)=> {
            //console.log("Ucmoy= "+datas.ucmoyenne)
            io.sockets.emit("tracer", datas)
            res.redirect('/visu')
        })
    }
})

//tracés courbes
app.get('/visu', (req, res) => {
    res.render('visu', {
        titre: "Hacheur en charge",
    })
})

//not found
app.get('*', (req, res) => {
    res.render('notfound', {
        titre: "Page not found"
    })
})

//listen port 8080
const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log("Serveur actif sur port: " + PORT)
})

//socket
io.sockets.on('connection', (socket) => {
    //console.log('nouvelle connection etablie')
    //emit les reglages
    socket.on('ready', () => {
        tracer_courbes()
    })
})

//exit
process.on('SIGINT',()=>{
    io.sockets.emit('exit')
    process.exit()
})
