var amqp = require('amqplib/callback_api');

global.receiveUrl = "amqp://ekarClient2:dldoWqeu3ssSA39@134.209.206.250/ekar" // RabitMQ Recieve Que URL
amqp.connect(receiveUrl, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            text
            throw error1;
        }
        channel.assertQueue(queue, {
            durable: false
        });
        _log("Waiting for messages in  " + queue + " To exit press CTRL+C");
        channel.consume(queue, function (msg) {
            _log(JSON.parse(msg.content.toString()),);

        }, {
            noAck: true
        });
    });
});