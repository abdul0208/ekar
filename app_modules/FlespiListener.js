var cors = require('cors')
global.app = express();
server = require('http').createServer(app);
ListenerPort = 4021;
_log("Port: ", ListenerPort)
app.use(cors())
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.listen(ListenerPort);
app.get('/', function (req, res) {
    // _log("OK")
    ApiResponse(req, res)

})
app.post('/', function (req, res) {
    // _log("Post: ")
    ApiResponse(req, res)

})