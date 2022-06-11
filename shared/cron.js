const baseController = require('../controllers/baseControllers');
const CronJob = require('cron').CronJob;
const CronTime = require('cron').CronTime;


module.exports = {

    initCron(data) {

        var newCron = new CronJob("00 " + minute + " " + hora + " * * *", function () {
            execute
        })
        newCron.start()

        // console.log(newCron);

    },

    async startCron() {
        let execute
        try {

            function intervalFunc() {
                var nowTime = new Date()
                var minute = nowTime.getMinutes()
                var hora = nowTime.getHours()
                var segund = nowTime.getSeconds()
                var horaImpri = hora + ":" + minute+":"+segund

                // console.log(horaImpri);
                switch (horaImpri) {
                    case "8:15:0":
                        execute = baseController.appcampanhasSms()
                        // this.initCron(hora, minute, execute)
                        break;
                    case "8:38:0":
                        execute = baseController.appcampanhasLojasSms()
                        // this.initCron(hora, minute, execute)
                        break;
                    default:
                        break;
                }

            }

            setInterval(intervalFunc, 1500);

            // var time = setInterval(() => {
            //     var nowTime = new Date()
            //     var minute = nowTime.getMinutes()
            //     var hora = nowTime.getHours()

            //     horaIm = { minute, hora }
            //     return horaIm

            // }, 2000);


            // console.log(time);

            // this.initCron()

        } catch (error) {
            console.log(error);
            throw new Error("Erro ao Inicializar")
        }
    }
}