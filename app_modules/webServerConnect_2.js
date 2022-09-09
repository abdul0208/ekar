var cors = require('cors')
global.express = require('express');
global.app = express();
// app.use(express.static(path.join(__dirname, '/')));




global.server = app.listen(port, () => {
    _log("Web Server Connected on port: " + port);
});
app.get('*', function (req, res) {
    sendResponse(req, res)
})
app.use(ignoreFavicon);





// StatStore
global.statStore = express()
statStore.use(cors())
statStore.use(express.json())
statStore.listen(StatStorePort, () => {
    _log("StatServer Connected on port: /store:" + StatStorePort);
});
if (typeof global.UpdateFrequency == 'undefined') {
    global.UpdateFrequency = []
}

statStore.get('/store', function (req, res) {
    var dataset = req.query.data
    if (typeof req.query.data == 'undefined') {
        res.send("ERROR");
        return
    } else {
        dataset = JSON.parse(dataset);
        // _log(dataset)
        global.UpdateFrequency.push(dataset)
        // _log(global.UpdateFrequency)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.send(JSON.stringify(dataset));
        if (global.UpdateFrequency.length > 10000) {
            global.UpdateFrequency.shift()
        }
        // _log(global.UpdateFrequency.length)
    }
})
statStore.get('/get', function (req, res) {
    res.send(JSON.stringify(UpdateFrequency));
    return
})
function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end()
    }
    next();
}





// RabbitReceiver
global.app2 = express();
// app.use(express.static(path.join(__dirname, '/')));
global.server2 = app2.listen(receiveServerPort, () => {
    _log("RabbitreceiveServerPort Listening on port: " + receiveServerPort);
});



statStore.use(ignoreFavicon);
app2.use(ignoreFavicon);
app.use(ignoreFavicon);
