global.addListener = require("process")
// global.userInput = function (msg) {
//     if (msg.text == 'stop') {
//         SendTelegram("Unsubscribing from All Alerts", msg.from.id)
//         delete global.TelegramUsers[msg.from.id]

//     } else if (msg.text == 'users') {
//         var t = "Subscribed Users:\n"
//         for (i in global.TelegramUsers) {
//             u = global.TelegramUsers[i]
//             t += u.first_name + " " + u.last_name + " \n"
//         }
//         SendTelegram(t)
//     } else {
//         SendTelegram("Welcome " + msg.from.first_name + " to OPAL Alerts \n type '<b>stop</b>' to stop receiving alerts", msg.from.id)
//     }

// }



// const _log = require('./log.js').log;
// _log("Loading Telegram Handler")

// adimIds [301628184];
global.adimIds = [];
adimIds.push(301628184)
global.server_error = {};
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
global.GetMessages = function (obj, fn) {
    // fn("ok")
    var selectedIds = obj.selectedIds,
        // selectedParams = obj.selectedParams,
        from = obj.from,
        to = obj.to

    _log(obj)
    if (typeof obj.svcrequest !== 'undefined') {
        global.payload = []
    }
    if (typeof global.avl_unit == 'undefined') return
    var static_units = JSON.parse(JSON.stringify(global.avl_unit));

    for (i in static_units) {
        u = static_units[i]
        // if (typeof u.prms.io_187 !== 'undefined') {
        // u.prms.io_87 = { v: 0 }
        // u.prms.io_1 = { v: 0 }
        // delete u.prms.io_87
        // delete u.prms.io_1
        // _log(u.prms.io_87)
        // }
        for (s in u.prms) {
            delete u.prms[s]
        }
    }



    var batch = []

    mk = 0
    getUniMessage(mk, function (d) {
        _log("getUniMessage Completed: ")
        // _log(d)
        if (typeof fn !== 'undefined') {
            fn(d)
        }

    })
    function getUniMessage(mk, f) {
        if (typeof selectedIds[mk] !== 'undefined') {
            // _log(selectedIds[mk])
            var u = static_units[selectedIds[mk]]
            // _log(static_units[i])
            var uid = u.id
            exec('render/create_messages_layer', {
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
            }, function (d) {
                // _log(d, typeof obj.svcrequest !== 'undefined' && typeof d.error != 'undefined')
                if (typeof obj.svcrequest !== 'undefined' && typeof d.error != 'undefined') {
                    f(d)
                    return
                }
                if (typeof d.error != 'undefined' || typeof d.units == 'undefined') {

                    ++mk
                    getUniMessage(mk, f)
                    return
                }

                _log("Messages found", d.units[0].msgs.count);
                var params = {
                    "layerName": "messages",
                    "indexFrom": 0,
                    "indexTo": d.units[0].msgs.count,
                    "unitId": uid
                }
                // _log(params)
                exec('render/get_messages', params, function (um) {
                    // _log(um)
                    if (typeof um.error !== 'undefined') {
                        _log(um.error)
                        um.error_text = server_error[d.error]
                        ++mk
                        getUniMessage(mk, f)
                        return
                    }
                    var d = um
                    var uid = u.id
                    var messages = []
                    for (a in d) {
                        // _log(d)
                        if (typeof d[a].pos !== 'undefined' && d[a].pos !== null) {
                            var pos = d[a].pos
                            u.pos.t = d[a].t
                            for (pk in pos) {
                                if (typeof u.pos[pk] !== 'undefined') {
                                    u.pos[pk] = pos[pk]
                                }
                            }
                        }
                        if (typeof d[a].p !== 'undefined' && d[a].p !== null) {
                            var prms = d[a].p
                            for (pk in prms) {

                                if (typeof u.prms[pk] == 'undefined') {
                                    // if (selectedParams.indexOf(pk) > -1) {
                                    //     // _log(u.nm, a, pk, "new:", prms[pk], "old:", u.prms[pk].v)
                                    // }
                                    u.prms[pk] = { v: 0 }
                                }

                                if (typeof u.prms[pk].v !== 'undefined') {
                                    // if (selectedParams.indexOf(pk) > -1) {
                                    //     // _log(u.nm, a, pk, "new:", prms[pk], "old:", u.prms[pk].v)
                                    // }
                                    u.prms[pk].v = prms[pk]
                                }
                            }
                        }
                        r = transform([uid], static_units);
                        if (typeof r == 'undefined') {
                            ++mk
                            getUniMessage(mk, f)

                            return;
                        }
                        r[u.uid].recorded_at = d[a].t // Time correction
                        if (typeof obj.sendToQue !== 'undefined' && obj.sendToQue == true) {
                            r[u.uid].stored_data = true
                            channel.sendToQueue(queue, Buffer.from(JSON.stringify(r)),
                                { persistent: true }
                            );

                        }
                        messages.push(r[u.uid])
                    }
                    // payload[u.uid] = { custom_events: messages, avl_evts: d, uid: u.device_id, wid: u.wid }
                    if (typeof obj.sendToQue !== 'undefined' && obj.sendToQue == true) {
                        SendTelegram(u.nm + ":  Resent Lost Messages " + messages.length)
                    }
                    // SendTelegram(u.nm + ":  Generated Messages " + messages.length)
                    if (typeof obj.socketid !== 'undefined') {
                        io.to(obj.socketid).emit('pastmessages', { uid: u.uid, custom_events: messages, avl_evts: d });
                    }
                    if (typeof payload != 'undefined') {
                        payload.push(messages)
                    }
                    ++mk
                    getUniMessage(mk, f)

                })



            })



        } else {
            _log("Query Complete")
            // _log(payload)
            if (typeof payload != 'undefined') {
                f(payload)
            }


        }
    }
}
global.SendLostCommands = function () {
    if (typeof global.FailedCommands !== 'undefined' && global.FailedCommands.length > 0) {
        SendTelegram(global.FailedCommands.length + " API Requests were received during service disruptions")
        // _log(global.FailedCommands)
        global.doFailedCommands = true
        for (i in global.FailedCommands) {
            c = global.FailedCommands[i]
            _log(c.svc, c.params)
            exec(c.svc, c.params, function (d) {
                _log(Object.size(d))
                if (Object.size(d) == 0) {
                    _log(Object.size(d))
                    global.FailedCommands.shift()
                }
            })
        }
        global.doFailedCommands = false
    } else {
        // SendTelegram("No Failed API requests were received during disruption")
    }
}
global.watchStatus = function () {
    var t = {}
    for (i in global.custom_template) {
        tp = global.custom_template[i]
        if (typeof tp.watch !== 'undefined') {
            // t += "<pre>" + i + " " + tp.watch + "</pre>"
            t[i] = tp.watch
        }
    }
    // _log(t)
    return t;
}
global.SendWathButtons = function (msg) {
    var t = { inline_keyboard: [] }
    for (i in custom_template) {
        d = custom_template[i]
        if (typeof d.path !== 'undefined') {
            if (typeof d.watch == 'undefined') {
                t.inline_keyboard.push([{ text: "✅" + d.txt, callback_data: d.path }])
            } else {
                t.inline_keyboard.push([{ text: "❌" + d.txt, callback_data: d.path }])
            }

        }
    }
    // console.log(JSON.stringify(t))
    bot.sendMessage(301628184, "Sensor Watch Commands", {
        reply_markup: JSON.stringify(t)
    });
}
global.commands = {
    watch: {
        desc: "Watch Sensors",
        f: function (args, msg) {
            // _log(args[1], typeof args[1])
            if (typeof args[1] == "undefined") {
                SendWathButtons(msg)
            } else if (args[1] == 'none') {
                for (i in global.custom_template) {
                    t = global.custom_template[i]
                    delete t.watch
                }
                SendTelegram("Unwatching all Sensors")
            } else {
                var watchElement = renumber(global.custom_template, 'path')[args[1]]
                // _log(watchElement)

                if (typeof watchElement !== 'undefined') {
                    if (typeof watchElement.watch == 'undefined') {
                        watchElement.watch = true
                    } else {
                        delete watchElement.watch
                    }

                }

                SendTelegram("Okay")

            }

            bot.on('callback_query', function onCallbackQuery(callbackQuery) {
                const action = callbackQuery.data;
                const message = callbackQuery.message;

                const opts = {
                    chat_id: message.chat.id,
                    message_id: message.message_id,
                };
                let text;

                var watchElement = renumber(global.custom_template, 'path')[action]
                // _log(watchElement)
                if (typeof watchElement !== 'undefined') {
                    if (typeof watchElement.watch == 'undefined') {
                        watchElement.watch = true
                        text = "Watching: " + action
                    } else {
                        delete watchElement.watch
                        text = "UnWatching: " + action
                    }
                }
                SendWathButtons(msg)

            });
            // setTimeout(function () {

            //     SendWathButtons(msg)
            // }, 100)

        },
    },
    unwatch: {

        desc: "Unwatch  Sensors",
        f: function (args, msg) {
            _log(renumber(global.custom_template, 'path')[args[1]])
            if (typeof renumber(global.custom_template, 'path')[args[1]] !== 'undefined') {
                delete renumber(global.custom_template, 'path')[args[1]].watch
            }

            console.table(global.custom_template)
            SendTelegram(watchStatus())

        },
    },
    info: {
        oneclick: true,
        desc: "Get Current Session Info",
        f: function (args, msg) {
            if (typeof global.getStats !== 'undefined') {
                SendTelegram(global.getStats())
            } else {

            }

            if (typeof global.FailedCommands !== 'undefined') {
                // _log(FailedCommands)
            }
        },
    },

    reload: {
        oneclick: true,
        desc: "Reload All Client Browers",
        f: function (args, msg) {
            global.io.sockets.emit('browser', "reload")
        }
    },
    diagnose: {
        oneclick: true,
        desc: "Unit Error Summary",
        f: function (args, msg) {
            d = new Object()
            if (Object.keys(global.unitDefects).length > 0) {

                d.title = "Unit Errors"
                // =t = "<pre>Unit Errors</pre>"
                for (i in global.unitDefects) {
                    u = global.unitDefects[i]
                    for (k = 0, l = u.length; k < l; k++) {
                        a = u[k];
                        d[avl_unit[i].nm] = a.err
                    }
                }

                if (typeof global.unitsWithoutId !== 'undefined' && global.unitsWithoutId.length > 0) {

                    for (i = 0, l = global.unitsWithoutId.length; i < l; i++) {
                        d[global.unitsWithoutId[i]] = "No UID"
                        // t += "<pre>" + global.unitsWithoutId[i] + "</pre>"
                    }
                }

                SendTelegram(d)
            } else {
                SendTelegram("No Errors")
            }


        }
    },
    init: {
        oneclick: true,
        desc: "Initialize",
        f: function (args, msg) {

            if (adimIds.indexOf(msg.from.id) > -1) {
                init(global.account);
            } else {
                SendTelegram("Hello " + msg.from.first_name + ", you are not authorized to initiate Server Initialization")
            }

        },
    },
    disrupt: {
        desc: "Simulate LS Server Crash, 1 = true, 0 =  false",
        f: function (args, msg) {
            if (typeof args[1] != 'undefined' && args[1] !== '' && global.Disrupt !== args[1]) {

                global.Disrupt = args[1]
                // _log(global.Disrupt, args[1])
                if (Disrupt == 1) {
                    SendTelegram("Received disruption " + args[1])

                    if (adimIds.indexOf(msg.from.id) > -1) {
                        init()
                    } else {
                        SendTelegram("Hello " + msg.from.first_name + ", you are not authorized to initiate Disruption simulation")
                    }


                }
            }


        }
    },

    flagupdate: {
        oneclick: true,
        desc: "Update unit event Flags",
        f: function (args, msg) {
            _log(args)
            updateNewUnitFlags()
        }
    },
    statchart: {
        oneclick: true,
        desc: "Show Message History on All Browsers",
        f: function (args, msg) {
            global.io.sockets.emit('showstatchart', 1)
        }
    },
    showstats: {
        oneclick: true,
        desc: "Show Stats on All Browsers",
        f: function (args, msg) {
            global.io.sockets.emit('showStats', 1)
        }
    },
    search: {
        desc: "Search For Unit, You may use, ",
        f: function (args, msg) {
            if (typeof args[1] !== 'undefined') {
                // _log(args[1])
                search_item_by_nm(args[1], function (d) {
                    // _log(d)
                    for (i = 0, l = d; i < l; i++) {
                        u = d[i]
                        _log(u.nm)
                    }
                })
            }
            // _log(msg)

        },
    },
    users: {
        oneclick: true,
        desc: "List of Telegram Users",
        f: function (args) {
            console.clear()
            var t = ""
            if (typeof global.usernames == 'undefined') {
                _log("No Chat Users")
                return
            } else {
                _log(global.usernames)
            }
            if (Object.size(global.usernames) > 0) {
                t + "Web Dashboard Users \n"
                // t += "id:\t Name:\t Time\n"

                for (i in global.usernames) {
                    u = global.usernames[i]
                    t += "id: " + i + "\t"
                    t += "Name: " + u.name + "\t"
                    t += "Time: " + u.t + "\n"
                    // t += "Username: " + u.username + "\n"
                }
                _log(global.usernames)
                // global.bot.sendMessage(chat.from.id, t, { parse_mode: 'HTML' });
                SendTelegram(t)
            } else {
                SendTelegram("There are no Web Dashboard Users")
            }

        }
    },
    h: {
        oneclick: true,
        desc: "Help with all available Commands",
        f: function (args, msg) {
            // _log(msg)
            var t = "Show available Notification commands:<pre></pre>"
            d = {}
            d.title = "Available Commands"
            for (var i in global.commands) {
                c = global.commands[i]

                if (i == 'helpme') {
                    d.helpme = c.desc
                } else {
                    d[i] = c.desc

                }
            }

            SendTelegram(d)
            SendSystemCommandButtons(msg)
            bot.off('callback_query')
            bot.on('callback_query', function onCallbackQuery(callbackQuery) {
                const action = callbackQuery.data;
                const msg = callbackQuery.message;
                // _log(msg)
                const opts = {
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                };
                let text;

                var watchElement = renumber(global.custom_template, 'path')[action]
                // _log(watchElement)
                if (typeof watchElement !== 'undefined') {
                    if (typeof watchElement.watch == 'undefined') {
                        watchElement.watch = true
                        text = "Watching: " + action
                    } else {
                        delete watchElement.watch
                        text = "UnWatching: " + action
                    }
                }
                // SendWathButtons(msg)
                SendTelegram("Received Click:  " + action)
                global.commands[action].f(null, msg)

                SendSystemCommandButtons(msg)
                // 
            });
        }
    },
    // phone: {
    //     oneclick: true,
    //     desc: "Request Phone Call",
    //     f: function (args, msg) {
    //         var requestPhoneKeyboard = {
    //             "reply_markup": {
    //                 "one_time_keyboard": true,
    //                 "keyboard": [[{
    //                     text: "My phone number",
    //                     request_contact: true,
    //                     one_time_keyboard: true
    //                 }], ["Cancel"]]
    //             }
    //         };


    //         bot.sendMessage(msg.chat.id, 'Can we get access to your phone number?', requestPhoneKeyboard);

    //     }
    // },


}
global.SendSystemCommandButtons = function (msg) {
    var t = { inline_keyboard: [] }
    for (i in commands) {
        d = commands[i]
        if (typeof d.oneclick !== 'undefined' && d.oneclick == true) {
            t.inline_keyboard.push([{ text: i, callback_data: i, resize_keyboard: true, one_time_keyboard: false, force_reply: true, request_contact: true }])
        }
    }
    // _log(msg.chat.id)
    bot.sendMessage(msg.chat.id, "Sensor Watch Commands", {
        reply_markup: JSON.stringify(t)
    });
}

global.userInput = function (msg) {
    var svc = msg.text
    try {
        o = JSON.parse(svc)
    } catch (e) {
        o = svc

    }
    if (typeof svc !== 'undefined' && svc !== null) {
        args = svc.split(" ")
    }

    // _log(args)
    // res.send({ "pingresponse": o });
    // _log(o, typeof o)
    if (typeof global.commands[args[0]] !== 'undefined') {
        global.commands[args[0]].f(args, msg)
    }

}

global.SendTelegram = function (m) {
    if (m == '') return false

    if (typeof m == 'undefined') return false
    if (typeof m == 'object') {
        p = { type: 'object', d: m }
        msg = JSON.stringify(p)
        // _log("Message is JSON")
    } else {
        msg = JSON.stringify({ type: 'string', d: m })
        // _log("Message is NOT JSON")

    }
    // _log("SendTelegram", msg)
    var url = "http://" + global.serverIp + ":" + global.TelegramServerPort + "/Telegram/?msg=" + msg
    t = msg.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    // remove non-printable and other non-valid JSON chars
    msg = t.replace(/[\u0000-\u0019]+/g, "");
    msg = JSON.parse(msg);
    // _log(msg)
    if (typeof msg !== 'undefined') {
        // _log(msg)
        var html = ""
        if (msg.type == 'string') {
            html += "<pre>"
            html += msg.d + ":\t"
            html += "</pre>\n"
        } else {
            for (a in msg.d) {
                d = msg.d[a]
                html += "<pre>"
                html += a + ":\t"
                html += d + "\t"
                html += "</pre>\n"
            }
        }

    }


    if (typeof global.bot !== 'undefined') {
        if (html.length > 4096) {

            try {
                global.bot.sendMessage(301628184, "String is " + html.length + " which exceeds Telegram message limit of 4096", { parse_mode: 'HTML' });
            } catch (e) {
                _log(e)
            }
        } else {
            try {
                global.bot.sendMessage(301628184, html, { parse_mode: 'HTML' });
            } catch (e) {
                _log(e)
            }
        }

    }
}
function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}
// _log(global.DisuptionTime, global.loginTimeUnix)

