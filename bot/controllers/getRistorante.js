//npm install node-geocoder 
const UTILS = require('../helpers/utils'); 
var data = require('../database/db.json'); 
var fs = require('fs'); 
const fetch = require('node-fetch');
 
 
const getRistorante = async (req) => { 
    var fileName  = '../database/dbUser.json'
    var file = require(fileName)
    var posUtente = -1;

    for(var i = 0; i < file.length; i++){
        if(file[i].id === req.body.session && file[i].codiceCasa != ""){
            posUtente = i;
        }
    }
    
    if(posUtente != -1){
        let codHouse = file[posUtente].codiceCasa

        //controllo del locale ricercato e viene tradotto in inglese 
        let local=req.body.queryResult.parameters.location["business-name"]; 
        if(local=='bar'){ 
            local="cafe"; 
        }else if(local=='ristorante'){ 
            local="restaurant"; 
        } 

        //Sistemo la via prendendo le informazioni della casa dal file db.json 
        var address; 
        var rooms = new Map(); 
        for(rooms of data) { 
            if(rooms.codice==codHouse){ 
                address=rooms.posizione.indirizzo+" "+rooms.posizione.n+", "+rooms.posizione.cap+", "+rooms.posizione.paese+", "+rooms.posizione.provincia 
            } 
        } 

        //utilizzando l'API (nodeGeocoder) cerco le coordinate della via della casa vacanza 
        let nodeGeocoder = require('node-geocoder'); 
        let param = { 
            provider: 'openstreetmap' 
        }; 
        let geoCoder = nodeGeocoder(param); 
        let message= "**Ecco quelli più vicini** \n\n"; 
        let coordinate; 
        await geoCoder.geocode(address) 
        .then((res)=> { 
            coordinate=res[0].latitude+","+res[0].longitude; 
        }) 
        .catch((err)=> { 
            console.log(err); 
        }); 


        //una volta prenso le coordinate utilizzo l'API di foursquare per prendere i locali vicino le coordinate imposte 
        url = 'https://api.foursquare.com/v3/places/search?ll='+coordinate+"&query="+local+"&limit=3"; 
        const options = { 
            method: 'GET', 
            headers: { 
            accept: 'application/json', 
            Authorization: 'fsq3r6WIHXzrZ8Ng/XG1/ircplzlhm3N0FCxRgqCen5JUtU=' 
            } 
        }; 
        await fetch(url, options) 
        .then(res => res.json()) 
        .then(json => { 
            for(const key in json) { 
            const obj=json[key] 
            var local = new Map(); 
            for(local of obj) { 
                message+="Nome: "+local.name+"\n"; 
                message+="Via: "+local.location.address+"\n"; 
                message+="///\n";     
            } 
        } 
        }) 
        .catch(err => console.error('error:' + err)); 


        //una volta preso i 3 locali, invio il messaggio 
        return UTILS.formatDialogflowResponse( 
            message, 
            [] 
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
    getRistorante 
};