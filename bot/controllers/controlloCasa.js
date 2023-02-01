const UTILS = require('../helpers/utils');
const fs = require('fs');

const controlloCasa = (req,res) => {

    let dispositivo = req.body.queryResult.parameters.dispositivi;
    let stanza = req.body.queryResult.parameters.stanze;
    let azione = req.body.queryResult.parameters.azioni;

    console.log(dispositivo+";"+stanza+";"+azione)

    var fileName  = '../database/dbUser.json'
    var file = require(fileName)
    var posUtente = -1;

    for(var i = 0; i < file.length; i++){
        if(file[i].id === req.body.session && file[i].codiceCasa != ""){
            posUtente = i;
        }
    }

    if(posUtente != -1){
        let codiceCasa = file[posUtente].codiceCasa
        let ocString = " ";
        fileName  = '../database/db.json'
        file = require(fileName)
        for(var i = 0; i < file.length; i++){
            //console.log(file[i].codice+codiceCasa)
            if(file[i].codice === codiceCasa){
                for(var j = 0; j < file[i].casa.length; j++){
                    //console.log(file[i].casa[j].nome+stanza)
                    if(file[i].casa[j].nome === stanza){
                        if(dispositivo === "luce 1"){
                            if(azione === "accendere"){
                                if(file[i].casa[j].luci[0] === "0"){
                                    ocString = `La luce della stanza '${stanza}' è stata accesa`
                                    file[i].casa[j].luci[0] = "1"
                                }else{
                                    ocString = `La luce della stanza '${stanza}' è già accesa`
                                }
                            }else if(azione === "spegnere"){
                                if(file[i].casa[j].luci[0] === "1"){
                                    ocString = `la luce della stanza '${stanza}' è stata spenta`
                                    file[i].casa[j].luci[0] = "0"
                                }else{
                                    ocString = `La luce della stanza '${stanza}' è già spenta`
                                }
                            }else if(azione === "controllare"){
                                if(file[i].casa[j].luci[0] === "1"){
                                    ocString = `la luce della stanza '${stanza}' è accesa`
                                }else{
                                    ocString = `La luce della stanza '${stanza}' è spenta`
                                }
                            }
                        } else if(dispositivo === "luce 2"){
                            if(file[i].casa[j].luci[1] != "2"){
                                if(azione === "accendere"){
                                    if(file[i].casa[j].luci[1] === "0"){
                                        ocString = `La seconda luce della stanza '${stanza}' è stata accesa`
                                        file[i].casa[j].luci[1] = "1"
                                    }else{
                                        ocString = `La seconda luce della stanza '${stanza}' è già accesa`
                                    }
                                }else if(azione === "spegnere"){
                                    if(file[i].casa[j].luci[1] === "1"){
                                        ocString = `la seconda luce della stanza '${stanza}' è stata spenta`
                                        file[i].casa[j].luci[1] = "0"
                                    }else{
                                        ocString = `La seconda luce della stanza '${stanza}' è già spenta`
                                    }
                                }else if(azione === "controllare"){
                                    if(file[i].casa[j].luci[0] === "1"){
                                        ocString = `la seconda luce della stanza '${stanza}' è accesa`
                                    }else{
                                        ocString = `La seconda luce della stanza '${stanza}' è spenta`
                                    }
                                }
                            } else {
                                ocString = `La stanza '${stanza}' non ha una seconda luce`
                            }
                        } else if(dispositivo === "lavatrice"){
                            if(file[i].casa[j].lavatrice != "2"){
                                if(azione === "accendere"){
                                    if(file[i].casa[j].lavatrice === "0"){
                                        ocString = `la lavatrice della stanza '${stanza}' è stata accesa`
                                        file[i].casa[j].lavatrice = "1"
                                    }else{
                                        ocString = `la lavatrice della stanza '${stanza}' è già accesa`
                                    }
                                }else if(azione === "spegnere"){
                                    if(file[i].casa[j].lavatrice === "1"){
                                        ocString = `la lavatrice della stanza '${stanza}' è stata spenta`
                                        file[i].casa[j].lavatrice = "0"
                                    }else{
                                        ocString = `la lavatrice della stanza '${stanza}' è già spenta`
                                    }
                                }else if(azione === "controllare"){
                                    if(file[i].casa[j].lavatrice === "1"){
                                        ocString = `la lavatrice della stanza '${stanza}' è accesa`
                                    }else{
                                        ocString = `La lavatrice della stanza '${stanza}' è spenta`
                                    }
                                }
                            } else {
                                ocString = `La stanza '${stanza}' non ha una lavatrice`
                            }
                        } else if(dispositivo === "televisione"){
                            if(file[i].casa[j].tv != "2"){
                                if(azione === "accendere"){
                                    if(file[i].casa[j].tv === "0"){
                                        ocString = `la tv della stanza '${stanza}' è stata accesa`
                                        file[i].casa[j].tv = "1"
                                    }else{
                                        ocString = `la tv della stanza '${stanza}' è già accesa`
                                    }
                                }else if(azione === "spegnere"){
                                    if(file[i].casa[j].tv === "1"){
                                        ocString = `la tv della stanza '${stanza}' è stata spenta`
                                        file[i].casa[j].tv = "0"
                                    }else{
                                        ocString = `la tv della stanza '${stanza}' è già spenta`
                                    }
                                }else if(azione === "controllare"){
                                    if(file[i].casa[j].tv === "1"){
                                        ocString = `la tv della stanza '${stanza}' è accesa`
                                    }else{
                                        ocString = `La tv della stanza '${stanza}' è spenta`
                                    }
                                }
                            } else {
                                ocString = `La stanza '${stanza}' non ha una tv`
                            }
                        }
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

        /*let session = req.body.session;
        let awaitCodiceCasa = `${session}/contexts/await-CodiceCasa`;
        let sessionContext = `${session}/contexts/session`;*/
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
    controlloCasa
};