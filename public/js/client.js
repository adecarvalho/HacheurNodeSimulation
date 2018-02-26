//***************************
//****************************
jQuery(function($){
    //
    const valmax = 1000;

    let socket = undefined;

    let m_chart_uc = undefined;
    let m_chart_ic = undefined;

    let m_options_uc = undefined;
    let m_options_ic = undefined;

    let tabTemps = new Array(valmax);
    let tabUc = new Array(valmax);
    let tabIc = new Array(valmax);

    for(let i=0;i<valmax;i++)
    {
        tabTemps[i]=0;
        tabUc[i]=0;
        tabIc[i]=0;
    }

    //
    let gauge_tension_moyenne=$("#gauge_tension_moyenne");

    let gauge_courant_moyen=$("#gauge_courant_moyen");

    //*******************
    m_options_uc = {
        type: 'line',
        data: {
            labels: tabTemps,
            datasets: [{
                radius: 0,
                fill: true,
                label: 'Allure Uc(t)',
                borderColor: "#3e95cd",
                data:tabUc
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Allure de Uc(t)'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'V'
                    }
                }]
            },
        }
    };
    //*********************************************
    m_options_ic = {
        type: 'line',
        data: {
            labels: tabTemps,
            datasets: [{
                radius: 1,
                fill: false,
                label: 'Allure Ic(t)',
                borderColor: "#3e95cd",
                data:tabIc
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Allure de Ic(t)'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'A'
                    }
                }]
            },
        }
    };
    //*********************************************
    //
    socket = io.connect();
    //
    let ctx_uc = $("#m_canvas_uc").get(0).getContext("2d");

    let ctx_ic = $("#m_canvas_ic").get(0).getContext("2d");

    //
    m_chart_uc = new Chart(ctx_uc, m_options_uc);

    m_chart_ic = new Chart(ctx_ic, m_options_ic);

    socket.emit("ready");

    //
    socket.on("tracer", function(datas) {

        $("#card_tension").show();
        $("#card_courant").show();

        //console.log("tracer");
        gauge_tension_moyenne.text(datas.ucmoyenne.toFixed(2));

        gauge_courant_moyen.text(datas.icmoyen.toFixed(2));

        m_options_uc.data.labels.splice(0);
        m_options_uc.data.labels = datas.temps;

        m_options_ic.data.labels.splice(0);
        m_options_ic.data.labels = datas.temps;

        m_options_uc.data.datasets[0].data.splice(0);
        m_options_uc.data.datasets[0].data = datas.uc;

        m_options_ic.data.datasets[0].data.splice(0);
        m_options_ic.data.datasets[0].data = datas.ic;

        m_chart_uc.update();
        m_chart_ic.update();
    });
});
