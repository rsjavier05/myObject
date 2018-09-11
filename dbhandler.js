const mongoose = require('mongoose');
const Logger = require('./logger');
const logger = new Logger();

let Object, object;

class DBHandler {
    
    init() {
        mongoose.connect('mongodb://localhost/myobject')
            .then(() => console.log('Connected to MongoDB...'))
            .catch(err => console.error('Could not connect to MongoDB...', err))
    }

    createSchema() {
        const objectSchema = new mongoose.Schema({
            key: {type: String, default: "mykey"},
            value: String,
            timestamp: {type: Date, default: Date.now}
        });

        Object = mongoose.model('Object', objectSchema);
    }

    async saveData(_object) {
        object = new Object({
            key: _object.key,
            value: _object.value,
            timestamp: _object.timestamp
        })
        const result = await object.save();
        logger.log(result);
    }

    async getData(latest, timestamp) {
        let condition = timestamp ? { timestamp : { $lte : timestamp}} : {}
        const object = await Object
            .find(condition)
            .limit(1)
            .sort({timestamp : -1})
        logger.log(object);
        return object[0];
    }
}

module.exports = DBHandler;