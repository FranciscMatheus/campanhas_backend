const express =  require('express');
const app     =  express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const baseRouter = require('../routes/base');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(( req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Access-Control-Allow-Methods','POST,GET');
    res.header('Access-Control-Allow-Headers','Origin, X-Requrested-With, Content-Type, Accept, Authorization');
    res.header('Content-Type','application/json');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', baseRouter);

app.use(( req, res, next) => {
    const erro = new Error('Not found, sorry!');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next ) => {
    res.status(error.status || 500);

    res.send({
        msg: error.message
    });
});

module.exports = app