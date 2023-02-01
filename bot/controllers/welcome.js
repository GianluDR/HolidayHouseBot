const UTILS = require('../helpers/utils');
const fs = require('fs');

const welcome = (req,res) => {
    const fileName  = '../database/dbUser.json'
    const file = require(fileName)
    var posUtente = -1;

    for(var i = 0; i < file.length; i++){
        if(file[i].id === req.body.session && file[i].codiceCasa != ""){
            posUtente = i;
        }
    }

    if(posUtente != -1){
        let oc = [];
        return UTILS.formatDialogflowResponse(
            `Ciao, hai collegato la casa n° ${file[posUtente].codiceCasa}, di cosa hai bisogno?\nPuoi chiedermi di controllare una stanza ed i suoi dispositivi oppure chiedermi come utilizzare qualcosa in casa!\nProva con 'voglio controllare la cucina'. '`,
            oc
        );
    }
};

module.exports = {
    welcome
};