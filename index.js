const express = require('express');
const helmet = require('helmet');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const Dbhandler = require('./dbhandler');
const dbhandler = new Dbhandler();
const Logger = require('./logger');
const logger = new Logger();
const app = express();

const port = process.env.PORT || 3000;
console.log(`env : ${app.get('env')}`)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(helmet());
logger.log("testing")
var time = new Date();

dbhandler.init();
dbhandler.createSchema();

// var objects = [];
app.post('/object', (req, res) => {
    logger.log(req.body);
    var time = new Date();
    let object = {
        key: Object.keys(req.body)[0],
        value: Object.values(req.body)[0],
        timestamp: req.body.timestamp ? req.body.timestamp : Date.now()
    }
    logger.log(JSON.stringify(object))
    dbhandler.saveData(object)
        .then((result) => {
            logger.log(result);
            res.send(result);
        })
        .catch((err) => {
            logger.log(err.message);
        })
});

app.get('/object/mykey', (req, res) => {
    logger.log("^^ req.query : ", req.query )
    if(req.query && req.query.timestamp) {
        let object = dbhandler.getData(false, req.query.timestamp)
            .then((object) => {res.send({value: object.value})})
            .catch((err) => {
                logger.log(err.message);
            })
    }
    else {
        let object = dbhandler.getData(true, null)
            .then((object) => {res.send({value: object.value})})
            .catch((err) => {
                logger.log(err.message);
            })
    }
})

const server = app.listen(port, () => {
    console.log(`Listening in port ${port}...`)
})

module.exports = server;