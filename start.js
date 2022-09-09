console.clear()
const ProductionServer = '10.18.0.5';
global.PublicIp = '134.209.206.250'
process.env.NTBA_FIX_319 = 1;
global.path = require('path');
global.fs = require('fs');
global._log = require('./app_modules/log.js').log;
DEBUGMODE = true;
global.os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            global.serverIp = address.address
        }
    }
}
global.Tformat = "YYYY-MM-DD hh:mm:ss";
_log("Updated on Feb 21 10:12am" + global.serverIp)


global.checkLocalServer = function () {
    // _log('local Server', global.serverIp)
    if (ProductionServer == global.serverIp) {
        return false
    } else {
        return true
    }
}
console.log("Is Local ", checkLocalServer())
global.currentFolder = __dirname.split('\\')[__dirname.split('\\').length - 1]
// _log("currentFolder is: ", currentFolder)

global.stopRefresh = 0

global.SSLoptions = {
    key: global.fs.readFileSync(path.join(__dirname, 'app_modules/rsa/locationsolutions.key')),
    cert: global.fs.readFileSync(path.join(__dirname, 'app_modules/rsa/locationsolutions_com.crt'))
};


global.bodyParser = require('body-parser');
global.request = require('request');
const clear_require = require('clear-require');
global.md5 = require('md5');
global.moment = require('moment');

const querystring = require('querystring');
global.startTime = moment();
global.unitDefects = {}
global.version = "2";
// _log("version:" + version);
const { Transform } = require('stream');
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};

renumber = function (obj, h) {
    var o = {};
    for (i in obj) {
        id = obj[i][h]
        o[id] = obj[i]
    }
    return o;
}
global.average = responseTime => responseTime.reduce((sume, el) => sume + el, 0) / responseTime.length;
global.account = 1
global.protocol = "http:"

global.config = [
    {//0
        port: 3100, // Live
        receiveServerPort: 3500,
        StatStorePort: 3600,
        queue: 'fleet_01',
        baseUrl: protocol + "//ls2a.locationsolutions.com",
        token: "2f5a65408ef235ad9cb0d8f516ff8954EB6CFD3979D739B4123EDEFCB9F60E700B14EFE3",
        operateAs: 'ekargcc',
        refreshTime: 2000,


        amqpURL: "amqp://ekarmsgadmin:dja4sd5ghwuWdp116@134.209.206.250/ekar" // RabitMQ Recieve Que URL
    },
    {//1
        port: 3200,
        receiveServerPort: 3300,
        StatStorePort: 3900,
        queue: 'fleet_02',
        baseUrl: protocol + "//ekarme.locationsolutions.com",
        token: "a322518aadf76972068a3848a66805ce527EE86D8BA65058FE923A6ACF392F2A01F3BC82",
        operateAs: '',
        refreshTime: 2000,
        amqpURL: "amqp://ekarmsgadmin:dja4sd5ghwuWdp116@134.209.206.250/ekar" // RabitMQ Recieve Que URL
    },

]
global.delatUnits = []
global.tokenlist = config[account]
// _log(config[account].operateAs)
for (i in config[account]) {
    // _log(i, config[account][i])
    global[i] = config[account][i]
}

function LiveScripts(id) {
    var file = "./app_modules/" + id + ".js";
    try {
        require(file);
        global[id] = file
        SendTelegram(`${global[id]} file Loaded @` + moment().format("MM DD hh:mm:ss"))
        fs.watchFile(global[id], (curr, prev) => {
            _log(`${global[id]} file Changed @` + moment().format("MM DD hh:mm:ss"));
            SendTelegram(`${global[id]} file Changed @` + moment().format("MM DD hh:mm:ss"))
            clear_require(file); // Clear script
            require(file);
        });
    } catch (e) {
        _log(e)
    }


}




LiveScripts("telegrambot");
LiveScripts("TelegramResponses");
LiveScripts("webServerResponse");
LiveScripts("webServerConnect");
// LiveScripts("rabbitReceiveServer");
LiveScripts("rabbitConnect");
LiveScripts("AvlEventProcessor");
LiveScripts("wialonConnect");
LiveScripts("EkarAPI");


global.userTokens = {}
//Edited on 12/9/2021



