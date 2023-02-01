const express = require('express');
const router = express.Router();

const CONTROLLERS = require('../controllers/export_controllers');
const UTILS = require('../helpers/utils');

router.post('/dialogflow', async (req, res) => {

    let action = req.body.queryResult.action;

    console.log('Webhook called.');
    //console.log(`${action}`+'getCodiceCasa');
    console.log(`Action name --> ${action}`);
    
    let responseData = {};
    
    if (action === 'getCodiceCasa') {
        responseData = CONTROLLERS.gcc.getCodiceCasa(req,res);
    } else if (action === 'welcome') {
        responseData = CONTROLLERS.wel.welcome(req,res);
    } else if (action === 'controlloCasa') {
        responseData = CONTROLLERS.con.controlloCasa(req,res);
    } else if (action === 'controlloTemp') {
        responseData = CONTROLLERS.tmp.controlloTemp(req,res);
    }  else if (action === 'getRistorante') {
        responseData = await CONTROLLERS.ris.getRistorante(req,res);
    }  else if (action === 'aiuto') {
        responseData = await CONTROLLERS.hel.aiuto(req,res);
    } else {
        responseData = UTILS.formatDialogflowResponse(
            `Unknown action ${action}. No handler for this action on the webhook.`,
            []
        );
    }

    res.send(responseData);
});

module.exports = {
    router
};