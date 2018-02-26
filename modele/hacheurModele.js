const valmax = 1000

class HacheurModele {
    //
    constructor() {
        this.modele = {
            ve: 50,
            r: 33,
            l: 0.11,
            vd0: 0.8,
            rdson: 0.01,
            freq: 200,
            alpha: 50
        }
        //
        this.tension_moyenne=0
        //
        this.courant_moyen=0

        this.tabTime = new Array(valmax)
        //
        this.tabUc = new Array(valmax)
        //
        this.tabIc = new Array(valmax)
        //
        for(let i=0;i<valmax;i++)
        {
            this.tabIc[i]=0.0
            this.tabTime[i]=0.0
            this.tabUc[i]=0.0
        }
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
    }
    //
    process(cb) {
        let period = 1 / (this.modele.freq)
        let pas = period / 100.0
        //
        for (let i = 0; i < valmax; i++) {
            this.tabTime[i] = (pas * i).toFixed(5)
            this.tabUc[i] = -this.modele.vd0
        }

        //uc
        for (let cmp = 0; cmp <= 900; cmp += 100) {
            //
            for (let i = 0 + cmp; i < this.modele.alpha + cmp; i++) {
                this.tabUc[i] = this.modele.ve

            }
        }
        //runge kutta
        let cour1=0
        let cour2=0
        let cour3=0
        let tens1=0
        let tens2=0
        let tens3=0
        let tens4=0
        let f1=0
        let f2=0
        let f3=0
        let f4=0

        let Rcharge = (this.modele.r + this.modele.rdson)
        let Lcharge = this.modele.l * 1.0

        let tmp = 0.0
        let inc2 = 1

        while (inc2 < valmax-1) {
            cour1 = this.tabIc[inc2]
            tens1 = this.tabUc[inc2]
            f1 = (tens1 - Rcharge * cour1) / Lcharge

            cour2 = cour1 + pas / 2
            tens2 = tens1 + f1 * pas / 2
            f2 = (tens2 - Rcharge * cour2) / Lcharge

            tens3 = tens1 + f2 * pas / 2
            f3 = (tens3 - Rcharge * cour2) / Lcharge

            cour3 = cour1 + pas
            tens4 = tens1 + f3 * pas
            f4 = (tens4 - Rcharge * cour3) / Lcharge

            tmp = this.tabIc[inc2] + pas * (f1 + 2 * f2 + 2 * f3 + f4) / 6

            if(tmp <0)
            {
                tmp=0
                this.tabUc[inc2]=0

            }
            else{
                this.tabIc[inc2 + 1] =tmp
            }
            //
            inc2++
        }
        //
        //uc=uc-rson*ic
        for (let cmp = 0; cmp <= 900; cmp += 100) {
            //
            for (let i = 0 + cmp; i < this.modele.alpha + cmp; i++) {
                this.tabUc[i] = this.tabUc[i]-this.modele.rdson*this.tabIc[i]
            }
        }
        //tension moyenne
        for(let i=900;i<valmax;i++){
            tmp+=this.tabUc[i]
        }
        this.tension_moyenne=tmp/100.0;

        //courant moyen
        this.courant_moyen=this.tension_moyenne/Rcharge
        //
        cb({
            temps: this.tabTime,
            uc: this.tabUc,
            ic: this.tabIc,
            ucmoyenne:this.tension_moyenne,
            icmoyen:this.courant_moyen
        })

    }

}
//
module.exports = HacheurModele
