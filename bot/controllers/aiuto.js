const UTILS = require('../helpers/utils');
const fs = require('fs');

const aiuto = (req,res) => {

    let dispositivo = req.body.queryResult.parameters.dispositivi;
    let ocString = "";

    if(dispositivo === "lavatrice"){
        ocString = `La lavatrice può essere accesa e spenta attraverso i comandi che invii a me oppure può essere utilizzata dalla pulsantiera annessa.\nProva con "accendi la lavatrice" per avviare il programma inserito nella manopola, oppure "spegni la lavatrice" per fermare anticipatamente un programma già avviato.`
    }else if(dispositivo === "riscaldamenti"){
        ocString = `I riscaldamenti possono essere utilizzati inviandomi dei comandi oppure attraverso il termostato in casa.\nProva con "accendi i riscaldamenti" per accendere i riscaldamenti all'ultima temperatura impostata, "imposta i termosifoni a 21 gradi" per cambiare la temperatura oppure "spegni i riscaldamenti" per staccare i riscaldamenti.`
    }else if(dispositivo === "televisione"){
        ocString = `Le televisioni in casa possono essere accese e spente attraverso i comandi che invii a me oppure possono essere utilizzate dai corrispettivi telecomandi.\nProva con "accendi la tv in cucina" per accenderla oppure "spegni la televisione della camera" per spegnerla.`
    }else{
        ocString = `I dispositivi della casa possono essere accesi e spenti attraverso i comandi che invii a me oppure possono essere utilizzati dai corrispettivi telecomandi.\nProva con "accendi la luce in salotto" per accenderla oppure "spegni la luce della camera" per spegnerla.`
    }

    let oc = [];
    return UTILS.formatDialogflowResponse(
        ocString,
        oc
    );
};

module.exports = {
    aiuto
};