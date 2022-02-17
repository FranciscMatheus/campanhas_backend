const axios = require('axios');

class SmsMsg {
     
    constructor(){}

    async send(sms2){               
        try{
            let id = new Date().getTime() + Math.floor(Math.random() * 1000);
            const sms = await axios.post(`https://api-rest.zenvia.com/services/send-sms`, {
                "sendSmsRequest": {
                    "from": "DiamantesL",
                    "to": '55' + sms2.numero,
                    "msg": sms2.msg,
                    "callbackOption": "NONE",
                    "id": id,
                    "flashSms": false
                }
            }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ZGlhbWVudGVsLndlYjpraVVHaU1ydEFS',              
                  'Accept': 'application/json'
                }
              });
    
            if(sms.data.sendSmsResponse.statusCode == '00' && sms.data.sendSmsResponse.detailCode == '000'){
                return id;
            }else{
                //remover
                //colocar false
                return false;
            }            
        }catch(e){            
            throw {
                status: 500,
                result: 'Erro interno, tente novamente.'
            };
        }
    }

}

module.exports = SmsMsg;