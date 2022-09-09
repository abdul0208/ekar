

// TelegramToken: "1464447811:AAEh4WxVGgy4wGZNSF83yAq6MCNncl9C9aY", // nodeMessenger_dev_bot
// refreshTim = 2000;

login = function (f) {
    var url = baseUrl + '/wialon/ajax.html?svc=token/login&params={"token": "' + token + '", "operateAs":"' + operateAs + '"}'
    _log(url)
    request(url, { json: true }, function (err, res, body) {
        if (global.Disrupt == 1) { // Service unavailability Simulator
            body = undefined
        }
        if (typeof body !== 'undefined' && typeof body.eid !== 'undefined') {
            // _log(body.user.ld, moment().format("X"))
            // global.loginTime = body.user.ld
            global.sid = body.eid;
            global.loginTime = body.tm * 1000
            global.loginTimeUnix = body.tm
            global.wialonTimeZone = body.user.prp.tz
            // _log("SID", sid);
            global.loginData = {
                user: body.user.nm,
                sid: sid,
                baseUrl: baseUrl,
                userid: body.user.id,
                version: version,
                currentFolder: currentFolder,
                account: account,

            };

            if (typeof queue !== 'undefined') global.loginData.RabbitQueue = queue
            if (typeof receiveUrl !== 'undefined') global.loginData.rabbit_amqpURL = global.amqpURL
            if (typeof receiveServerPort !== 'undefined') global.loginData.RabbitFeedMonitor = receiveServerPort
            if (typeof port !== 'undefined') global.loginData.webServerport = port
            if (typeof StatStorePort !== 'undefined') global.loginData.StatStorePort = StatStorePort

            console.table(loginData);
            io.sockets.emit("browser", "reload");
            if (typeof f !== 'undefined') {
                f()
            }
        } else {
            _log("Retrying Login")

            if (typeof global.DisuptionTime == 'undefined') {
                global.DisuptionTime = parseInt(moment().format("X"))
                _log("Setting Disruption Time");

            }


            if (typeof lmsgTime !== 'undefined') {
                disruptionDelay = moment().format("X") - lmsgTime

                // _log("lmsgTime:", lmsgTime, " lastMessageTime", lastMessageTime, disruptionDelay)
            }
            SendTelegram("Retrying " + disruptionDelay);
            setTimeout(function () {

                if (typeof poll !== 'undefined') {
                    clearInterval(poll);
                    // _log("Polling Begin")
                }

                init();
                return

            }, 2000)
        }


    });
}
disruptionDelay = 0
init_client = function (socketid) {
    if (typeof avl_unit !== 'undefined') {
        var initializeData = {
            template: custom_template,
            currentaccount: account,
            tokenlist: global.tokenlist,
            StatStorePort: StatStorePort,
            refreshTime: refreshTime,

        }
        if (typeof socketid !== 'undefined') {

            // _log(usernames[socketid], socketid)
            initializeData.browseruserPrivs = usernames[socketid]
            io.to(socketid).emit("initialize", initializeData);
        } else {
            io.sockets.emit("initialize", initializeData); // Send  custom_unit 

        }

    }
}
eventPolling = function (rt) {
    global.stopRefresh = 0 // restart
    if (typeof poll !== 'undefined') {
        clearInterval(poll);
        _log("Polling Begin")
    }

    global.poll = setInterval(function () {
        avl_evt(sid, function (d) {


        })
    }, rt)
}
sqlq = function (sqla, f) {
    if (typeof con == 'undefined') {
        _log("MYSQL Connection does not Exist!")
        return
    }
    con.query(sqla, function (err, d) {
        if (err) {
            _log(err)
            var regex1 = /(column)\W(')(.+)(').+(\d+.)/
            let m;
            if ((m = regex1.exec(err.sqlMessage)) !== null) {

                // _log(cols.indexOf("`" + m[3] + "`"))
                _log(m[3], m[5])
                _log(m[3], m[5])
                // _log(rows[m[5]])
                // _log(rows[m[5]][m[3]])
            }

            sqlq("SHOW ERRORS", function (r2) {
                if (typeof r2[0] !== 'undefined' && typeof r2[0].Message != 'undefined') _log(r2[0].Message)
            })

            if (err.code == "ER_LOCK_DEADLOCK" || err.code == "ER_LOCK_WAIT_TIMEOUT") {
                _log("Attempting the Query again !")
                sqlq(sqla, f)
                return;
            }

            if (typeof f !== 'undefined') f({ "error": err.code });
        } else {
            // _log(d)
            try {
                var result = JSON.parse(JSON.stringify(d));
                if (typeof f !== 'undefined') f(result);
            } catch (e) {
                // _log(sqla)
                _log(e)
            }

        }
        return
    });
}
init = function () {
    sqlq(`SELECT * FROM ekar.wialon_access WHERE id =2`, function (d) {
        global.port = d[0].port
        global.queue = d[0].queue
        global.operateAs = d[0].operateAs
        global.token = d[0].token
        global.baseUrl = d[0].baseUrl
        login(function () {
            _log("Login ")
            SendTelegram("Wialon Login")
            ud = {}
            ud["Title"] = "Logging in";
            ud["Script Load Time"] = moment(global.startTime).format("YYYY-MM-DD hh:mm:ss");
            ud["Login Time"] = moment(global.loginTime).format("YYYY-MM-DD hh:mm:ss");
            ud["Port"] = global.port;
            ud["RabbitQueue"] = global.queue;
            ud["ServerIp"] = global.serverIp;
            ud['Vars'] = global.varscript;
            ud['Config'] = account;
            ud['Wialon Account'] = global.operateAs;

            ud["ServerIsLocal"] = (typeof checkLocalServer == 'undefined' ? "" : checkLocalServer());

            ud["varscript"] = global.varscript;
            ud["sid"] = sid;
            // _log(ud)
            SendTelegram(ud)
            getItems(-1, 'avl_unit', function (d) {
                for (k in avl_unit) {
                    u = avl_unit[k]
                    u.updatetime = u.ct
                    if (u.lmsg !== null && u.updatetime < u.lmsg.t) {
                        u.updatetime = u.lmsg.t
                    }
                    if (typeof u.prms !== 'undefined' && u.prms !== null) {
                        for (pk in u.prms) {
                            p = u.prms[pk]
                            if (u.updatetime < p.at) {
                                u.updatetime = p.at
                            }
                        }
                    }
                }
                global.custom_units = transform(Object.keys(avl_unit), avl_unit)
                updateDataFlags(Object.keys(avl_unit), -1, 1, function (d) {
                    SendTelegram("Flags Updated: " + Object.size(avl_unit) + " units")
                    eventPolling(refreshTime)
                    coldRefresh()
                })
            })



        });
    })


}
coldRefresh = function () {
    if (typeof colstartTimeout !== 'undefined') {
        return
    }
    global.colstartTimeout = setTimeout(function () {
        // _log(" Performing Cold Reload");
        init_client()
        clearTimeout(colstartTimeout)
        colstartTimeout = undefined
    }, 2000)

}
updateDataFlags = function (units, flags, mode, f) {
    global.monu = units
    var batch = []
    batch.push({
        params: {
            spec: [{
                type: "type",
                data: 'avl_unit',
                flags: 0,
                mode: 0
            }]
        }, svc: 'core/update_data_flags'
    })



    batch.push({
        params: {
            spec: [{
                type: "type",
                data: 'avl_unit',
                flags: flags,
                mode: mode
            }]
        }, svc: 'core/update_data_flags'
    })


    exec('core/batch', batch, function (d) {
        if (typeof monu !== 'undefined') {
            io.sockets.emit("monu", monu); // Send  custom_unit 
        }
        updateUserFlags()
        _log("Update Complete !------------------------", Object.size(d[1]))
        if (typeof f !== 'undefined') f(d);

    });

}
updateUserFlags = function () {
    // _log(wialonTimeZone)
    batch = [
        { "svc": "core/update_data_flags", "params": { "spec": [{ "type": "type", "data": "user", "flags": 4294967295, "mode": 2 }] } },
        {
            "svc": "core/update_data_flags",
            "params": {
                "spec": [
                    {
                        "type": "id",
                        "data": loginData.userid,
                        "flags": "0x3FFFFFFFFFFFFFFF",
                        "mode": 1
                    }
                ]
            }
        },
        { "svc": "core/update_data_flags", "params": { "spec": [{ "type": "access", "data": 1, "flags": 0, "mode": 0 }] } },
        { "svc": "core/update_data_flags", "params": { "spec": [{ "type": "col", "data": [], "flags": 32, "mode": 1 }] } },
        { "svc": "render/set_locale", "params": { "tzOffset": wialonTimeZone, "language": "en", "flags": 0, "formatDate": "%E.%m.%Y %H:%M:%S" } }

    ]
    // _log(batch)
    exec('core/batch', batch, function (d) {
        // _log(d)
    })
}

getItems = function (flags, itemsType, f) {
    exec('core/search_items', {
        "spec": {
            "itemsType": itemsType,
            "propName": "sys_name",
            "propValueMask": "*",
            "sortType": "sys_name"
        },
        "force": 1,
        "flags": flags,
        "from": 0,
        "to": 0
    }, function (d) {
        // _log(d)
        global[itemsType] = renumber(d.items, 'id');
        if (typeof f === 'function')
            f(d.items);
    });
}
search_item = function (id, f) {
    exec('core/search_item', { id: id, flags: -1 }
        , function (d) {
            if (typeof f === 'function')
                f(d.item);

        });
}
mapEventParams2Sensor = function (u, n, p) {
    var sens = renumber(u.sens, 'n');
    if (
        typeof sens[n] !== 'undefined' &&
        typeof sens[n].p !== 'undefined' &&
        typeof p[sens[n].p] !== 'undefined') {
        v = p[sens[n].p]
        // _log(u.nm, n, ":", v, p[sens[n].p])
    } else {
        v = 0
    }
    return v;

}

exec = function (svc, params, f) {
    // _log("sid", sid)
    if (typeof sid == 'undefined') return
    var url = global.baseUrl + '/wialon/ajax.html'
    // _log(url)


    var form = {
        sid: sid,
        svc: svc,
        params: JSON.stringify(params)
    };

    request(url, {
        json: true,
        form: form
    }, (err, resp, body) => {

        if (global.Disrupt == 1) {
            err = { error: 1 }
        }


        if (err) {
            // _log(svc)

            if (typeof global.FailedCommands == 'undefined') {
                FailedCommands = []
            }
            if (typeof global.doFailedCommands == 'undefined'
                || global.doFailedCommands == false) {
                if (svc == 'unit/exec_cmd') {
                    FailedCommands.push({ svc: svc, params: params })
                    // _log(FailedCommands)
                    try {
                        for (k in FailedCommands) {
                            p = FailedCommands[k].params
                            if (typeof avl_unit[p.itemId] !== "undefined") {
                                // _log(avl_unit[p.itemId].nm, p.commandName)
                            }
                        }
                    } catch (e) {
                        _log(e)
                    }
                }

            }

            return false;
        }




        if (typeof f !== 'undefined') f(body);
    })
}
average = responseTime => responseTime.reduce((sume, el) => sume + el, 0) / responseTime.length;
beep = function () {
}




init()






