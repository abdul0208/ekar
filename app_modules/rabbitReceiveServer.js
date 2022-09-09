var amqp2 = require('amqplib/callback_api');
sendRabbitReceive = function (req, res) {
    // _log(req.originalUrl)
    var options = {
        root: path.join(__dirname, '../web'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    if (req.originalUrl == '/') {
        fileName = "/brokerReceive.html"
        res.sendFile("/brokerReceive.html", options, function (err) {
            if (err) {
                _log(err)
            } else {
                _log('Sent:', fileName)
            }
        })

    } else {
        // _log(req.params[0])
        fileName = req.params[0]
        res.sendFile(fileName, options, function (err) {
            if (err) {
                _log(err)
            } else {
                // _log('Sent:', fileName)
            }
        })
    }
}



global.receiveUrl = "amqp://browserMonitor:sdfyodgwifmbsjfuHduyrhfF345Fhs@134.209.206.250/ekar"
global.recieverSocketList = {}

amqp2.connect(receiveUrl, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {

            throw error1;
        }
        channel.assertQueue(queue, {
            durable: false
        });
        console.log("Waiting for messages in  " + queue + " To exit press CTRL+C");
        channel.consume(queue, function (msg) {

            if (msg.properties.type == 'ack') {
                // _log(msg)
                // _log(JSON.parse(msg.content.toString()),)
            }
            if (typeof msg.properties !== 'undeifiend' && typeof msg.properties.headers !== 'undefined') {
                // _log(msg.properties.headers)
            }
            // console.table(JSON.parse(msg.content.toString()),);
            if (typeof io2 !== 'undefined')
                io2.sockets.emit("RabbitQue", JSON.parse(msg.content.toString()),); // Send Logged in User
        }, {
            noAck: true
        });
    });
});