process.env.NTBA_FIX_319 = 1;
// const { Transform } = require('stream');
global.io = require('socket.io')(server, {
    // pingInterval: 25000,
    pingTimeout: 30000
});
io.sockets.on('connection', function (socket) {
    _log(socket.id)
    io.sockets.emit("fromServer", { users: usernames }); // Send Logged in User
    io.sockets.emit("fromServer", { startTime: startTime }); // Send StartTime
    socket.on('adduser', function (d) {
        _log(d)
        socket.username = d;
        global.usernames[socket.id] = d;

        io.sockets.emit("fromServer", { users: global.usernames }); // Send list of clients
        _log("New client ", socket.id)
        // SendTelegram("New client " + socket.id);
        if (Object.size(global.usernames) > 0) {
            TM = new Object()
            TM.type = 'object'
            TM.d = JSON.stringify(global.usernames);

        }
        // _log(socket.id)
        // _log(d)
        // _log(d.name)
        // _log(global.usernames)
        // _log(Object.keys(global.usernames))

        init_client()
    });
    socket.on('login', function (data, fn) {
        // console.clear()
        _log(data)
        if (typeof data == 'undefiend' || data == null) return
        if (typeof users[data.username] !== 'undefined') {
            if (md5(users[data.username].password) == data.password) {
                fn({ error: 0 })
                if (typeof avl_unit !== 'undefined') {
                    // _log("TRANSFORMER")
                    // global.custom_units = transform(Object.keys(avl_unit), avl_unit)
                }
                global.currentBrowserUser = data.username
                _log("user", data.username, socket.id)

                if (typeof global.usernames[socket.id] == 'undefined') {
                    global.usernames[socket.id] = {}
                }
                if (typeof loginData !== 'undefined') {
                    users[data.username].privs.loginData = loginData
                }
                global.usernames[socket.id] = { name: data.username, t: moment().format(Tformat), privs: users[data.username].privs }
                // _log("Current Browser User", global.usernames[socket.id], socket.id)
                setTimeout(function () {
                    init_client(socket.id)
                    io.to(socket.id).emit("browserUser", global.usernames[socket.id]);
                }, 200)
            } else {
                fn({ error: "Invalid Password" })
                SendTelegram("Invalid Password");
            }
        } else {
            fn({ error: "User Does not exist" })
            SendTelegram("User Does not exist");
        }
    })
    socket.on('wq', function (obj, fn) {
        _log("remote execute query:", obj.svc)
        exec(obj.svc, obj.params, function (d) {
            fn(d)
            _log("remote execute:", obj.svc)
        })


    })
    socket.on('GetMessages', function (obj) {
        _log(socket.id)
        if (typeof GetMessages != 'undefined') {
            obj.socketid = socket.id
            GetMessages(obj)
        }        // _log(fn)
    })

    socket.on('exit', function (data, fn) {
        fn("Exiting Script")
        console.log(nonexistentValue)
        SendTelegram("Exiting Script called from Browser");


    });

    socket.on('updateRefreshTime', function (data, fn) {
        _log(data)
        refreshTime = data
        eventPolling(data)
        fn("okay")
    });


    socket.on('reload', function (data, fn) {


    })
    socket.on('unitDefects', function (fn) {
        fn(global.unitDefects)
    })

    socket.on('getItem', function (data, fn) {
        performUnitSearch(data, fn)
    });

    socket.on('fromClient', function (data) {
        // _log(data)
        if (typeof data.msg !== 'undefined') {
            // _log("From: ", socket.id, "To:", data.ToUser, data.msg)
            // _log(data)
            timestamp = moment().format("YY-MMM-DD HH:mm:ss")
            io.sockets.connected[data.ToUser].emit("fromServer", { fromUser: socket.id, text: data.msg, class: "left", t: timestamp });
            io.sockets.connected[socket.id].emit("fromServer", { fromUser: socket.id, text: data.msg, class: "right", t: timestamp });
        }
        if (typeof data.updateUsername !== 'undefined') {
            _log("From: ", socket.id, data.updateUsername)
            io.sockets.emit("fromServer", { updateUsername: data.updateUsername, id: socket.id });
            // usernames[socket.id].name = data.updateUsername
            // usernames[socket.id].id = socket.id
            // _log(usernames)
            io.sockets.emit("fromServer", { users: usernames }); // Send Logged in User

        }
        if (typeof data.updateFlags !== 'undefined') {

            // restructure()
            if (Object.size(data.updateFlags.units) > 0)
                // _log("Updating Unit Flags", data.updateFlags.units, data.updateFlags.flags)
                updateDataFlags(data.updateFlags.units, data.updateFlags.flags, data.updateFlags.mode, function (d) {
                    _log(d)
                })
        }

        if (typeof data.getItem !== 'undefined') {
            _log(avl_unit[data.getItem.id])
            io.sockets.emit("fromServer", { unit: avl_unit[data.getItem.id] }); // Send Logged in User

        }
        if (typeof data.reload !== 'undefined') {
            // console.log(data.reload)
            _log("reload Request");
            coldRefresh()
            SendTelegram("System Restarting \nrefreshTime: " + global.refreshTime + "\nStartTime: "
                + moment(global.startTime).format("YY-MMM-DD hh:mm:ss")
                + "\nvarscript: " + global.varscript)
        }
    });

    socket.on('disconnect', function (d) {
        // remove the username from global usernames list
        // _log("disconnect " + d, socket.id)
        // SendTelegram("Client Disconnected " + socket.id);
        delete usernames[socket.id];
        delete io.sockets[socket.id];
        // echo globally that this client has left
        // _log(socket.id + ' has disconnected');
        // _log("Connected Clients: ", usernames)


    });
    init_client()

});

global.customEmit = function (handle, data) {
    io.sockets.emit(handle, data);
}






