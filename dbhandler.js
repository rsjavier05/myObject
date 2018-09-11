const mongoose = require('mongoose');
const Logger = require('./logger');
const logger = new Logger();
const config = require('config');

let Object, object;

class DBHandler {
    
    init() {
        mongoose.connect(config.get('db'))
            .then(() => console.log(`Connected to ${config.get('db')}...`))
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
        try {
            const result = await object.save();
            logger.log(result);
            return result;
        }
        catch(err) {
            throw new Error('Error in saving data : ' + err.message);
        }
    }

    async getData(latest, timestamp) {
        let condition = timestamp ? { timestamp : { $lte : timestamp}} : {}

        try {
            const object = await Object
                .find(condition)
                .limit(1)
                .sort({timestamp : -1})
            logger.log(object);
            return object[0];
        }

        catch(err) {
            throw new Error('Error in getting data : ' + err.message);
        }
    }
}

module.exports = DBHandler;