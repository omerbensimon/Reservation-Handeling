class Logger {
    constructor() {
        this.logs = [];
    }
    log(msg) {
        let now = new Date();
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        msg = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} INFO> ${msg}`;
        console.log(msg);
        this.logs.push(msg);
    }

    getLogs() {
        return this.logs;
    }

}
var logger = new Logger();
module.exports = logger;