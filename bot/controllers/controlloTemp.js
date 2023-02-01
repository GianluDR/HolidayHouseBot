const UTILS = require('../helpers/utils');
const fs = require('fs');

const controlloTemp = (req,res) => {

    let temp = req.body.queryResult.parameters.temperature.amount;
    let azione = req.body.queryResult.parameters.azioni;

    console.log(temp+azione)

    var fileName  = '../database/dbUser.json'
    var file = require(fileName)
    var posUtente = -1
    let ocString

    for(var i = 0; i < file.length; i++){
        if(file[i].id === req.body.session && file[i].codiceCasa != ""){
            posUtente = i;
        }
    }

    if(posUtente != -1){
        let codiceCasa = file[posUtente].codiceCasa
        fileName  = '../database/db.json'
        file = require(fileName)

        for(var i = 0; i < file.length; i++){
            if(file[i].codice === codiceCasa){
                if(azione === "accendere"){
                    if(file[i].riscaldamenti.stato === "0"){
                        ocString = `I riscaldamenti sono stati accesi`
                        file[i].riscaldamenti.stato = "1"
                        if(temp != null){
                            ocString = ocString + ` e sono stati impostati a ${temp}`
                            file[i].riscaldamenti.temperatura = temp
                        } else if (temp < 14 || temp > 26){
                            ocString = `Inserisci una temperatura valida fra 14 e 26 gradi`
                        }
                    }else{
                        ocString = `I riscaldamenti sono già accesi`
                        if(temp != null){
                            ocString = `I riscaldamenti sono stati impostati a ${temp}`
                            file[i].riscaldamenti.temperatura = temp
                        } else if (temp < 14 || temp > 26){
                            ocString = `Inserisci una temperatura valida fra 14 e 26 gradi`
                        }
                    }
                } else if(azione === "spegnere"){
                    if(file[i].riscaldamenti.stato === "1"){
                        ocString = `I riscaldamenti sono stati spenti`
                        file[i].riscaldamenti.stato = "0"
                    }else{
                        ocString = `I riscaldamenti sono già spenti`
                    }
                } else if(azione === "imposta"){
                    if (temp < 14 || temp > 26 || temp == null){
                        ocString = `Inserisci una temperatura valida fra 14 e 26 gradi`
                    } else {
                        if(file[i].riscaldamenti.stato === "0"){
                            file[i].riscaldamenti.stato = "1"
                            file[i].riscaldamenti.temperatura = temp
                            ocString = `I riscaldamenti sono stati accesi e sono stati impostati a ${temp}`
                        }else{
                            file[i].riscaldamenti.temperatura = temp
                            ocString = `Ho impostato i riscaldamenti a ${temp} gradi`
                        }
                    }
                } else {
                    if(file[i].riscaldamenti.stato === "0"){
                        ocString = `I riscaldamenti sono spenti e sono impostati a ${file[i].riscaldamenti.temperatura}`
                    }else{
                        ocString = `I riscaldamenti sono accesi e sono impostati a ${file[i].riscaldamenti.temperatura}`
                    }
                }
            } 
        }

        fs.readFile('./database/db.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
            console.log(err);
            } else {
            fs.writeFile('./database/db.json', JSON.stringify(file, null, 2), 'utf8', err => {
                if (err) throw err;
                console.log('File has been saved!');
            });
            }
        });

        let oc = [];

        return UTILS.formatDialogflowResponse(
            ocString,
            oc
        );
    }else{
        /*let session = req.body.session;
        let awaitCodiceCasa = `${session}/contexts/await-CodiceCasa`;
        let sessionContext = `${session}/contexts/session`;*/
        let oc = [];

        return UTILS.formatDialogflowResponse(
            `Non hai ancora inserito il codice della casa`,
            oc
        );
    }
};

module.exports = {
    controlloTemp
};