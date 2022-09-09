global.amqp = require('amqplib/callback_api');
global.amqpURL = "amqp://ekarClient2:dldoWqeu3ssSA39@134.209.206.250/ekar" // RabitMQ Recieve Que URL
amqp.connect(amqpURL, function (error0, connection) {
    if (error0) {
        _log(error0);
    } else {
        _log("cluster_name:", connection.connection.serverProperties.cluster_name)
        connection.createChannel(function (error1, channel) {
            if (error1) {
                _log(error1);
            }
            global.channel = channel
            _log("Rabbit channel", amqpURL)
        });
    }
});

