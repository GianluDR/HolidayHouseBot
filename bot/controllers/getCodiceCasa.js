const UTILS = require('../helpers/utils');
const fs = require('fs');
const path = require('path');

const getCodiceCasa = (req,res) => {

    let outputContexts = req.body.queryResult.outputContexts;

    let codiceCasa = req.body.queryResult.parameters.CodiceCasa;
    console.log("L'utente ha fornito il codice: "+codiceCasa)
    var trovato = false;

    
    const fileName  = '../database/db.json'
    const file = require(fileName)

    for(var i = 0; i < file.length; i++){
        console.log(file[i].codice+codiceCasa)
        if(file[i].codice === codiceCasa){
            trovato = true;
        }
    }

    if(trovato){
        const fileName  = '../database/dbUser.json'
        const file = require(fileName)
        var casaTrovata = false;
        var posUtente = -1;

        for(var i = 0; i < file.length; i++){
            if(file[i].id === req.body.session){
                if(file[i].codiceCasa === codiceCasa){
                    casaTrovata = true;
                } 
                posUtente = i;
            }
        }

        if(posUtente != -1 && casaTrovata){
            let oc = [];
            return UTILS.formatDialogflowResponse(
                `Hai già la casa impostata con il codice ' ${file[posUtente].codiceCasa} '.`,
                oc
            );
        } 

        if(posUtente == -1){
            var newUser = {
                "id" : req.body.session,
                "codiceCasa" : codiceCasa
            };
            file.push(newUser)
        } else {
            file[posUtente].codiceCasa = codiceCasa
        }
        fs.readFile('./database/dbUser.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
              console.log(err);
            } else {
              fs.writeFile('./database/dbUser.json', JSON.stringify(file, null, 2), 'utf8', err => {
                if (err) throw err;
                console.log('File has been saved!');
              });
            }
        });

        /*let session = req.body.session;
        let awaitCodiceCasa = `${session}/contexts/await-CodiceCasa`;
        let sessionContext = `${session}/contexts/session`;
        let oc = [
            {
                name: awaitCodiceCasa,
                lifespanCount: 1
            },
            {
                name: sessionContext,
                lifespanCount: 20
            }
        ];*/
        let oc = [];
        return UTILS.formatDialogflowResponse(
            `La casa con il codice ' ${codiceCasa} ' è stata impostata come tua.`,
            oc
        );
        
    } else {
        let oc = [];
        return UTILS.formatDialogflowResponse(
            `Ripeti un nuovo codice, ' ${codiceCasa} ' non è presente o non è valido.`,
            oc
        );
    }
};

module.exports = {
    getCodiceCasa
};