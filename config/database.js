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

}

module.exports = new database()