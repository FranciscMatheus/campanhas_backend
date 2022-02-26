
const database = require('./database');


const bancos = {
    diamantes: database.diamantes(),
    campanhas: database.campanhas()
   
}

module.exports = bancos