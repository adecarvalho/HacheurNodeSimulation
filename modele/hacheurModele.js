let RungeKutta = require('./rungeKutta')

const valmax = 1000

class HacheurModele {
    //
    constructor() {
        this.modele = {
            ve: 50,
            r: 33,
            l: 0.11,
            vd0: 1.0,
            rdson: 0.1,
            freq: 200,
            alpha: 50
        }
        //
        this.mrunge = new RungeKutta(this.modele.freq, this.modele.alpha, this.modele.ve,
            this.modele.r, this.modele.rdson, this.modele.l, this.modele.vd0)
    }
    //
    afficheModele() {
        console.log(this.modele)
    }
    //
    getModele() {
        return this.modele
    }
    //
    setModele(ve, r, l, vd0, rdson, freq, alpha) {
        this.modele.ve = ve
        this.modele.r = r
        this.modele.l = l
        this.modele.vd0 = vd0
        this.modele.rdson = rdson
        this.modele.freq = freq
        this.modele.alpha = alpha
        //
        this.mrunge.setParametres(freq, alpha, ve, r, rdson, l, vd0)
    }
    //
    process(cb) {
        //
        this.mrunge.traitement()
        //
        cb({
            temps: this.mrunge.getTime(5),
            uc: this.mrunge.getUc(3),
            ic: this.mrunge.getIc(4),
            ucmoyenne: this.mrunge.getUcMoyenne(),
            icmoyen: this.mrunge.getIcMoyen()
        })

    }

}
//
module.exports = HacheurModele
