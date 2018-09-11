const env = process.env.NODE_ENV || 'development';
class Logger {
    log(message) {
        if(env === "development") {
            console.log(message);
        }
    }
}

module.exports = Logger;