const valmax = 1000

class RungeKutta {
    //
    constructor(frequence = 200, alpha = 50, ve = 50, rcharge = 33, rdson = 0.1, lcharge = 0.11, vd0 = 1.0) {
        //
        let period = 1 / (frequence)
        this.pas = period / 100.0
        this.alpha = alpha * 1.0

        this.ve = ve * 1.0

        this.rcharge = rcharge * 1.0
        this.rdson = rdson * 1.0
        this.lcharge = lcharge * 1.0
        this.vd0 = vd0 * 1.0

        this.tabIc = []
        this.tabUc = []
        this.tabTime = []

        this.tensionMoyenne = 0
        this.courantMoyen = 0
        //
    }
    //
    setParametres(frequence = 200, alpha = 50, ve = 50, rcharge = 33, rdson = 0.1, lcharge = 0.11, vd0 = 1.0) {
        let period = 1 / (frequence)
        this.pas = period / 100.0
        this.alpha = alpha * 1.0

        this.ve = ve * 1.0

        this.rcharge = rcharge * 1.0
        this.rdson = rdson * 1.0
        this.lcharge = lcharge * 1.0
        this.vd0 = vd0 * 1.0

        this.tabIc = []
        this.tabUc = []
        this.tabTime = []

        this.tensionMoyenne = 0
        this.courantMoyen = 0

    }
    //
    getTime(decimal) {
        let tab=[]
        for(let i=0;i<this.tabTime.length;i++)
        {
            tab.push(this.tabTime[i].toFixed(decimal))
        }
        return tab
    }
    //
    getUc(decimal) {
        let tab=[]
        for(let i=0;i<this.tabUc.length;i++)
        {
            tab.push(this.tabUc[i].toFixed(decimal))
        }
        return tab
    }
    //
    getIc(decimal) {
        let tab =[]
        for(let i=0;i <this.tabIc.length;i++){
            tab.push(this.tabIc[i].toFixed(decimal))
        }
        return tab
    }
    //
    getUcMoyenne() {
        return this.tensionMoyenne
    }
    //
    getIcMoyen() {
        return this.courantMoyen
    }

    traitement() {

        //init
        this.tabIc.splice(0)
        this.tabTime.splice(0)
        this.tabUc.splice(0)
        this.tensionMoyenne = 0
        this.courantMoyen = 0
        //
        for (let i = 0; i < valmax; i++) {
            this.tabTime.push(this.pas * i)
            this.tabUc.push(-this.vd0)
            this.tabIc.push(0)
        }
        //

        //uc
        for (let cmp = 0; cmp <= 900; cmp += 100) {
            //
            for (let i = 0 + cmp; i < this.alpha + cmp; i++) {
                this.tabUc[i] = this.ve

            }
        }
        //
        let Rcharge = (this.rcharge + this.rdson)
        //
        let cour1 = 0
        let cour2 = 0
        let cour3 = 0
        let tens1 = 0
        let tens2 = 0
        let tens3 = 0
        let tens4 = 0
        let f1 = 0
        let f2 = 0
        let f3 = 0
        let f4 = 0

        let tmp = 0.0
        let inc2 = 1
        //
        while (inc2 < valmax - 1) {
            cour1 = this.tabIc[inc2]
            tens1 = this.tabUc[inc2]
            f1 = (tens1 - Rcharge * cour1) / this.lcharge

            cour2 = cour1 + this.pas / 2
            tens2 = tens1 + f1 * this.pas / 2
            f2 = (tens2 - Rcharge * cour2) / this.lcharge

            tens3 = tens1 + f2 * this.pas / 2
            f3 = (tens3 - Rcharge * cour2) / this.lcharge

            cour3 = cour1 + this.pas
            tens4 = tens1 + f3 * this.pas
            f4 = (tens4 - Rcharge * cour3) / this.lcharge

            tmp = this.tabIc[inc2] + this.pas * (f1 + 2 * f2 + 2 * f3 + f4) / 6

            if (tmp < 0) {
                tmp = 0
                this.tabUc[inc2] = 0

            } else {
                this.tabIc[inc2 + 1] =tmp
            }
            //
            inc2++
        }
        //
        //uc=uc-rson*ic
        for (let cmp = 0; cmp <= 900; cmp += 100) {
            //
            for (let i = 0 + cmp; i < this.alpha + cmp; i++) {
                this.tabUc[i] = this.tabUc[i] - this.rdson * this.tabIc[i]
            }
        }
        //calcul tension moyenne
        tmp = 0
        for (let i = 900; i < valmax; i++) {
            tmp += this.tabUc[i]
        }
        this.tensionMoyenne = tmp / 100.0;

        //courant moyen
        this.courantMoyen = this.tensionMoyenne / Rcharge
    }
}
//
module.exports = RungeKutta
