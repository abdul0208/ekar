//http://localhost:3100/?svc=get_messages&params={%22id%22:867157040119224,%22from%22:%222020-09-10%2000:00:00%22,%22to%22:%222020-09-10%2023:59:00%22}

requestHandler = function (req, res) {
    if (typeof req.query.svc == 'undefined' && typeof req.query.params == 'undefined') {
        return {}
    }

    var svc = req.query.svc;
    var params = req.query.params;

    if (typeof req.query.sid == 'undefined' || req.query.sid !== sid) {
        err = { error: "Invalid Session " }
        // _log(err)
        // _log(req.query.sid)

        // res.send(err); return;
    } else {
        // err = "Valid Session "
        // _log(err)
    }

    if (req.query.sid !== sid) {
        // _log("SESSION Mismatch:", req.query.sid, sid)
    }

    var server_error = {};
    server_error[0] = "Successful operation";
    server_error[1] = "Invalid session";
    server_error[2] = "Invalid service name";
    server_error[3] = "Invalid result";
    server_error[4] = "Invalid input";
    server_error[5] = "Error performing request";
    server_error[6] = "Unknown error";
    server_error[7] = "Access denied";
    server_error[8] = "Invalid user name or password";
    server_error[9] = "Authorization server is unavailable";
    server_error[10] = "Reached limit of concurrent requests";
    server_error[1001] = "No messages for selected interval";
    server_error[1002] = "Item with such unique property already exists";
    server_error[1003] = "Only one request is allowed at the moment";
    if (typeof sid == 'undefined' || typeof avl_unit == 'undefined') {
        return ("Not loggedin")
    }

    var params = JSON.parse(params)

    var static_units = JSON.parse(JSON.stringify(avl_unit));

    var u = renumber(static_units, 'uid')[params.id]
    if (svc == 'avl_unit') {
        // _log(custom_units)
        res.send(custom_units);
    }
    if (svc == 'exec_cmd') {
        try {
            _log(params.commandName, params.id)
        } catch (e) {
            _log("exec_cmd error", e)
        }


        if (typeof u == 'undefined') {
            res.send({ error: "invalid unit id" });
            return;
        }
        var uid = u.id
        wsvc = 'unit/exec_cmd';


        if (typeof renumber(u.cmds, 'n')[params.commandName] !== 'undefined') {

            var commandName = params.commandName
            var param = renumber(u.cmds, 'n')[params.commandName].p
            wparams = { "itemId": uid, "commandName": commandName, "linkType": "", "param": param, "timeout": 60, "flags": 0 };
            // _log(wparams)
        } else {
            res.send({ error: "command unavailable" });
            return
        }
        exec(wsvc, wparams, function (d) {
            // console.clear()
            if (typeof d.error !== 'undefined') {

                d.error_text = server_error[d.error]
                _log("Messages", d);
                res.send(d);
                return d
            }
            // _log("command result", d, wparams);
            // SendTelegram(d + " Received unLock Command")

            wparams.internalDeviceID = wparams.itemId
            wparams.itemId = params.id
            wparams.serverResponse = d
            res.send(wparams);
        })
    }
    if (svc == 'get_messages') {

        var uid = u.id
        // var selectedIds = obj.selectedIds,
        // selectedParams = obj.selectedParams,

        // u.prms.io_87 = { v: 0 };// reset CAN Mileage and update on new Message
        // u.prms.io_1 = { v: 0 };// reset Ignition and update on new Message
        // delete u.prms.io_87
        // delete u.prms.io_81

        // from = obj.from,
        // to = obj.to
        obj = { selectedIds: [uid], from: moment(params.from).format("X"), to: moment(params.to).format("X"), svcrequest: true }
        GetMessages(obj, function (d) {
            // _log(d)
            if (typeof d.error !== 'undefined') {
                d.error_text = server_error[d.error]
                res.send(d);
            } else {
                res.send(d[0]);
            }

        })
        return;

        for (s in u.prms) {
            delete u.prms[s]
        }
        svc = 'render/create_messages_layer'
        from = moment(params.from).format("X")
        to = moment(params.to).format("X")
        params =
        {
            "layerName": "messages",
            "itemId": uid,
            "timeFrom": from,
            "timeTo": to,
            "tripDetector": 0,
            "flags": 0,
            "trackWidth": 4,
            "trackColor": "cc0000ff",
            "annotations": 0,
            "points": 1,
            "pointColor": "cc0000ff",
            "arrows": 1
        }
        // _log(params)
        exec(svc, params, function (d) {
            if (typeof d.error !== 'undefined') {
                d.error_text = server_error[d.error]
                res.send(d);
                // _log("Messages", d);
                return d
            }
            // _log("Messages", d.units[0].msgs.count);
            exec('render/get_messages',
                {
                    "layerName": "messages",
                    "indexFrom": 0,
                    "indexTo": d.units[0].msgs.count,
                    "unitId": uid
                },
                function (d) {
                    // _log(d.length)
                    var messages = []
                    for (a in d) {
                        // console.log(d[a])
                        var pos = d[a].pos
                        var prms = d[a].p
                        u.pos.t = d[a].t


                        for (pk in prms) {
                            if (typeof u.prms[pk] == 'undefined') {
                                // _log(u.nm, a, pk, "new:", prms[pk], "old:", u.prms[pk].v)
                                u.prms[pk] = { v: 0 }
                            }
                            if (typeof u.prms[pk].v !== 'undefined') {
                                // _log(u.nm, a, pk, "new:", prms[pk], "old:", u.prms[pk].v)
                                u.prms[pk].v = prms[pk]
                            }
                        }                  // console.log(d[a])
                        for (pk in pos) {
                            if (typeof u.pos[pk] != 'undefined') {
                                if (pk == 's') {
                                    // _log(u.nm, a, pk, "new:", pos[pk], "old:", u.pos[pk])
                                }
                                u.pos[pk] = pos[pk]

                            }

                        }

                        r = transform([uid], static_units);
                        // console.table(r)
                        messages.push(r)
                    }

                    res.send(messages);

                })
        })

    }



}


getSensor = function (u, sk, v) {
    var uid = u.uid
    // dataset[uid] = {} // Store some non essential data
    var sensors = renumber(u.sens, 'n');
    // _log(u.sens)
    for (sk in u.sens) {
        var s = u.sens[sk]
        if (typeof custom_template[s.n] !== 'undefined') {
            if (u.prms !== null && typeof u.prms[s.p] == 'object') {
                // _log(u.nm, typeof u.prms[s.p], s.n, s.p, u.prms[s.p].v)
                dataset[uid][s.n] = u.prms[s.p].v
            }
        }
    }

    for (var tk in custom_template) {
        var tv = custom_template[tk]
        // _log(tv.sensor)
        if (typeof tv.opath !== 'undefined') {
            if (u.pos !== null) {
                try {
                    if (tv.opath == 'u.pos.t') { //Set Time
                        v = moment.unix(eval(tv.opath)).format(moment.defaultFormat)
                        // _log(v)
                    } else {
                        v = eval(tv.opath)
                    }
                    dataset[uid][tk] = v
                } catch (e) {
                    // _log(u.pos)
                }
            } else {
                // _log(u.pos)
            }
        }


    }
    return dataset;
}


comupteSensor = function (u, s) {
    uid = avl_evts.events[0].i
    prms = avl_evts.events[0].d.p
    u = avl_unit[uid]
    s = "CAN_Odometer"
    var val = 0
    for (k in prms) {
        v = prms[k]
        for (a in u.sens) {
            b = u.sens[a]
            f = b.p.replace("const", "")
            if (b.n == s && f.search(k) > -1) {
                window[k] = v
                _log(u.nm, k, v, b.n, b.p, eval(f))
                val = eval(f)
            }
        }
    }
    _log(s, val)
}


console.clear()