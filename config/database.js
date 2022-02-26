const config = require('config');
const Sequelize = require('sequelize');

class database {
    diamantes() {
        return new Sequelize(
            config.get('diamantes.database'),
            config.get('diamantes.user'),
            config.get('diamantes.password'),
            {
                host: config.get('diamantes.host'),
                port: config.get('diamantes.port'),
                dialect: 'postgres'
            }
        )
    }
    campanhas() {
        return new Sequelize(
            config.get('campanhas.database'),
            config.get('campanhas.user'),
            config.get('campanhas.password'),
            {
                host: config.get('campanhas.host'),
                port: config.get('campanhas.port'),
                dialect: 'postgres'
            }
        )
    }

}

module.exports = new database()