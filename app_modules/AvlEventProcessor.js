// const expressBasicAuth = require('express-basic-auth');
// const moment = require('moment');
// const request = require('request');
// const ffs = require('fs');
// var http = require("http");
// const _log = require('../log.js').log;


global.usernames = {}
global.users = {}
users['admin'] = {
    password: "dja4sd",
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats', ''],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],
    }
}
users['andro'] = {
    password: "dja4sd",
    privs: {
        access: ['refreshTime', 'messageStats', 'getAvlunits'],
        tablecommands: ['unitmsg'],
        // loginData: loginData,
    }
}
users['ekarmsgadmin'] = {
    password: "dja4sd5ghwuWdpo16",
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],
        // loginData: loginData,
    }
}
users['monitor'] = {
    password: "M0n1tor#",
    privs: {
        access: ['messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg'],
        // loginData: loginData,
    }
}

users['andro.tuason@locationsolutions.com'] = {
    password: 'c7eccf6f',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['henley.santillan@locationsolutions.com'] = {
    password: 'f5168c16',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['johnpaul.delacruz@locationsolutions.com'] = {
    password: '2e8f5cbe',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['eugenio.hernandez@locationsolutions.com'] = {
    password: '80e3a032',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['centle.mathew@locationsolutions.com'] = {
    password: '662e6a78',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['sediek.mohamed@locationsolutions.com'] = {
    password: 'c5685907',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
users['ibrahim.akkad@locationsolutions.com'] = {
    password: '8f4599bb2',
    privs: {
        access: ['refreshTime', 'reload', 'messageStats', 'getAvlunits', 'showStats'],
        tablecommands: ['unitmsg', 'lock', 'unlock', 'block', 'unblock'],

    }
}
global.deltaUnits = []
global.custom_template = {
    command: { txt: 'Commands', sortcol: true },
    recorded_at: { txt: 'Time', path: 'recorded_at', sortcol: false, opath: "u.updatetime" },
    device_id: { txt: 'Unit Id', path: 'device_id', sortcol: false, opath: "u.uid" },
    wialon: { txt: 'Wialon Id', path: 'wialon', sortcol: false, opath: "u.id" },
    provider: { txt: 'Telematics Provider', path: 'provider', sortcol: false, default: 'location_services' },
    nm: { txt: 'Unit Name', path: 'nm', sortcol: false, opath: "u.nm" },
    "Ignition": { txt: 'Ignition', path: 'ignition', sortcol: false },
    gps_latitude: { txt: 'Latitude', path: 'gps_latitude', sortcol: false, opath: "u.pos.y" },
    gps_longitude: { txt: 'Longitude', path: 'gps_longitude', sortcol: false, opath: "u.pos.x" },
    direction: { txt: 'Direction', path: 'direction', sortcol: false, opath: "u.pos.c" },
    ack: { txt: 'Acknowledgment', path: 'ack', sortcol: false, opath: "u.ack" },
    // "customdoor_status": { txt: 'Door Lock Status', path: 'customdoor_status', sortcol: false, opath: "u.prms.customdoor_status.v" },
    "Fuel Level": { txt: 'Fuel Level', path: 'fuel_level', sortcol: false },
    "gpsmileage": { txt: 'GPS Odometer', path: 'gpsmileage', sortcol: false, opath: "u.cnm" },
    "CAN Odometer": { txt: 'CAN Odometer', path: 'mileage', sortcol: false },
    // speed: { txt: 'GPS Speed', path: 'gpsspeed', sortcol: false, opath: "u.pos.s" },
    "CAN Speed": { txt: 'CAN Speed', path: 'speed', sortcol: false },
    // "Odometer": { txt: 'Odometer', path: 'mileage', sortcol: false },
    "Head Light": { txt: 'Head lights', path: 'lights', sortcol: false },
    "Door Status": { txt: 'Door Status', path: 'door_status', sortcol: false },
    "Main Power": { txt: 'Main Power', path: 'battery_voltage', sortcol: false },
    "Immobilization": { txt: 'Immobilization', path: 'immobilization', sortcol: false },
    "Key Tag": { txt: 'Key Tag', path: 'key_tag', sortcol: false },
    "Tag Count": { txt: 'Tag Count', path: 'tag_count', sortcol: false },
    "Accident": { txt: 'Accident', path: 'accident', sortcol: false },
    // "GPS": { txt: 'GPS', path: 'gps_signal', sortcol: false },

}

global.messageTimeAvg = function () {
    if (typeof global.lastMessageTime !== 'undefined') {
        if (typeof global.responseTime == 'undefined') {
            global.responseTime = []
        }
        lmst = moment.duration(moment().diff(moment(moment(global.lastMessageTime * 1000).format(global.Tformat)))).seconds()
        global.responseTime.push(lmst)
        if (responseTime.length > 200) {
            responseTime.shift()
        }
        if (responseTime.length > 2) {
            global.avgResponseTime = average(responseTime)
            if (avgResponseTime > 30) {
                _log("Average Response Time ", average(responseTime))
                SendTelegram("Average Response Time: " + average(responseTime).toFixed(2))
            }
            // global.io.sockets.emit("stats", { "avgResponseTime": avgResponseTime });
            // SendTelegram("Average Response Time: " + average(responseTime).toFixed(2) + "s")
        }
        // _log(responseTime)
        // _log(responseTime.length)
        // _log("Response Time", moment.duration(moment().diff(moment(moment(global.lastMessageTime * 1000).format("YYYY-MM-DD hh:mm:ss")))).seconds())
        // _log("Query Time", moment.duration(moment().diff(moment(moment(global.lastQueryTime * 1000).format("YYYY-MM-DD hh:mm:ss")))).seconds())


        JsonData = encodeURIComponent(JSON.stringify({ t: global.lastMessageTime, units: deltaUnits.length }))
        url = 'https://localhost:' + global.StatStorePort + '/store?data=' + JsonData;
        // _log(url)
        var options = {
            uri: url,
            query: dataset,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer token"
            }
        };
        request(options, function (error, response, body) {
            // _log(response) // Print the shortened url.
            // _log(error) // Print the shortened url.
            if (!error && response.statusCode == 200) {
                _log(body) // Print the shortened url.
            } else {
                // _log("Stat Store ERROR")
            }
        });

    }

}
global.getStats = function () {
    // _log(global.responseTime)
    ud = new Object()
    ud.title = "Info";
    // ud.type = "object";
    for (k in global.usernames) {
        var b = global.usernames[k]
        // ud += k + " \t" + b.t + " \t" + b.name + "\n"
        ud['RefreshTime'] += b.t;
    }

    // ud = "\nRefreshTime: " + global.refreshTime / 1000 + " seconds"
    ud['Vars'] = global.varscript;
    ud['Dashboard port'] = global.port;
    if (typeof StatStorePort !== 'undefined') ud['StatStorePort'] = StatStorePort
    if (typeof receiveServerPort !== 'undefined') ud['receiveServerPort'] = receiveServerPort
    if (typeof global.queue !== 'undefined') ud['RabbitQueue'] = global.queue

    ud['Config'] = account;
    ud['WialonAccount'] = global.operateAs;
    ud['ServerStartTime'] = moment(global.startTime).format(global.Tformat);
    ud['LoginTime'] = moment(global.loginTime).format(global.Tformat);

    ud['ConnectedUsers'] = Object.keys(global.usernames).length;
    ud['baseUrl'] = global.baseUrl;
    if (typeof global.unitDefects !== 'undefined') {
        ud['UnitsErrors'] = Object.keys(global.unitDefects).length
    }
    if (typeof global.avl_unit !== 'undefined') {
        ud['UnitsCount'] = Object.keys(global.avl_unit).length
    }
    if (typeof global.lastMessageTime !== 'undefined' && global.lastMessageTime != null) {
        ud['LastMessage'] = moment(global.lastMessageTime * 1000).format(global.Tformat)
        ud['DurationSinceLastMessage'] = durationAsString(global.lastMessageTime * 1000)
    }
    ud['DurationSinceServerStart'] = durationAsString(global.startTime);


    if (typeof global.responseTime !== 'undefined') {
        ud['AverageResponseTime'] = average(responseTime).toFixed(2) + "s "

    }
    if (typeof global.FailedCommands !== 'undefined' && global.FailedCommands.length > 0) {
        ud['FailedCommands'] = global.FailedCommands.length

    }

    if (typeof global.DisuptionTime !== 'undefined' && typeof global.loginTimeUnix !== 'undefined') {
        ud['DisruptionTime'] = global.loginTimeUnix - global.DisuptionTime
    }
    if (typeof global.messageCounter !== 'undefined') {
        ud['MessageCounter'] = global.messageCounter
        ud['MessagesPerMinute'] = getMsgPerMinute()
    }

    ud['RefreshTime'] = global.refreshTime / 1000 + "s";
    ud['sid'] = sid;
    return ud
}


function durationAsString(end) {

    // _log(end);
    var duration = moment.duration(moment().diff(moment(end)));
    //Get Days
    var days = Math.floor(duration.asDays()); // .asDays returns float but we are interested in full days only
    var daysFormatted = days ? `${days}d ` : ''; // if no full days then do not display it at all
    //Get Hours
    var hours = duration.hours();
    var hoursFormatted = `${hours}h `;
    //Get Minutes
    var minutes = duration.minutes();
    var minutesFormatted = `${minutes}m`;
    //Get Seconds
    var seconds = duration.seconds();
    var secondsFormatted = `${seconds}s`;
    r = [daysFormatted, hoursFormatted, minutesFormatted, secondsFormatted].join(' ');
    // _log(r)
    return r;
}
function updateUnitTime(u, t) {
    if (typeof u.updatetime !== 'undefined') {
        if (u.updatetime < t) {
            u.updatetime = t
        }
    } else {
        u.updatetime = t
    }
}

global.processSensors = function (u, m, udt) {
    try {
        if (typeof m.d !== 'undefined'
            && typeof m.d.p !== 'undefined'
            && typeof u !== 'undefined'
            && typeof u.prms !== 'undefined'
        ) {
            updateUnitTime(u, m.d.t)
            // _log("Event Time", m.d.t, moment(m.d.t * 1000).format("hh:mm:ss"), udt, udt - m.d.t, "Message Time", moment(udt * 1000).format("hh:mm:ss"))
            for (pk in u.prms) {
                for (mk in m.d.p) {
                    if (pk == mk) {
                        tformat = "MM DD YYYY hh:mm:ss"
                        timelog = {
                            nm: u.nm,
                            mk: mk,
                            // ct: u.prms[mk].ct,
                            // at: u.prms[mk].at,
                            // ctf: moment(u.prms[mk].ct * 1000).format(tformat),
                            // atf: moment(u.prms[mk].at * 1000).format(tformat),
                            "m.d.t": m.d.t,
                            "udt": udt,
                            eventTime: moment(m.d.t * 1000).format(tformat),
                            messsageTime: moment(udt * 1000).format(tformat),
                        }
                        if (typeof u.prms[mk] == 'undefined') {
                            u.prms[mk] = {}
                        }
                        if (mk == 'io_87') { // only update cumulative value
                            // _log(mk, " for ", u.nm, u.prms[mk].v, m.d.p[mk])
                            if (u.prms[mk].v <= m.d.p[mk]) {
                                // _log("Updating ", mk, " for ", u.nm, u.prms[mk].v, m.d.p[mk])
                                u.prms[mk].v = parseInt(m.d.p[mk])
                            }
                            else {
                                // _log("Keeping ", mk, " for ", u.nm, u.prms[mk].v, "New Value is ", m.d.p[mk])
                            }

                        } else {
                            u.prms[mk].v = m.d.p[mk]
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log(e)
    }
    if (typeof global.messageCounter == 'undefined') {
        global.messageCounter = 0
    }
    ++global.messageCounter

}

function renumber(obj, h) {
    var o = {};
    for (i in obj) {
        id = obj[i][h]
        o[id] = obj[i]
    }
    return o;
}
global.processLastMessage = function (ud) {
    // _log(ud)
    global.lastQueryTime = ud.tm
    if (ud.events.length == 0) return;
    deltaUnits = []
    global.unitsToSearch = []
    var sql = []
    global.lastMessageTime = ud.tm
    for (var k = 0, l = ud.events.length; k < l; k++) {
        var m = ud.events[k];

        // _log("avl_evt", lastQueryTime, lastMessageTime)
        var messageType = m.t;// Determine the Message Type
        var mi = m.i;
        if (typeof avl_unit[mi] !== 'undefined') {
            var u = avl_unit[mi];


            if (!deltaUnits.includes(mi)) {
                deltaUnits.push(mi);
            }
            if (messageType == "u") {
                if (typeof m.d.prms != 'undefined') {
                    for (mk in m.d.prms) {
                        // _log(u.nm, m.d.prms[mk])
                        if (typeof m.d.prms[mk].v !== 'undefined' && u.prms !== 'undefined') {
                            try {
                                u.prms[mk] = m.d.prms[mk]


                            } catch (e) {
                                // _log(e)
                                // _log("Error Unit: parameter error", u.id, u.nm)
                                registerError(mi, 'prms', 'parameter error')

                            }
                        }
                    }
                }
                // // Update Sensors Settings
                // if (typeof m.d.sensu != 'undefined') {
                //     // beep()
                //     // _log(u)
                //     sensIdx = m.d.sensu[0]
                //     sensObj = m.d.sensu[1]
                //     // _log("DigitalSensor Metric", sensIdx, sensObj)
                //     u.sens[sensIdx] = sensObj
                // }
                // Update Counters
                if (
                    typeof m.d.cneh != 'undefined' ||
                    typeof m.d.cnkb != 'undefined' ||
                    typeof m.d.cnm != 'undefined' ||
                    typeof m.d.cnm_km != 'undefined'

                ) {
                    // _log(messageType, m)
                    // beep()
                    for (var ck in m.d) {
                        u[ck] = m.d[ck]
                        // 
                        // _log(ck, u[ck])
                    }
                }

            }
            if (messageType == "m") {
                for (var idx in u.sens) {

                    var usens = u.sens[idx];
                    // _log(usens.id, usens.n)
                    if (u.lmsg == null) {
                        // _log(u.nm, u.id, " Unit has no Messages")
                        registerError(u.id, "lmsg", 'no Messages')
                        u.lmsg = {}
                    }

                    if (u.pos == null) {
                        _log(u.nm, u.id, " Unit has no Position")
                        registerError(u.id, "pos", 'Unit has no Position')

                        u.pos = {}
                    }
                    if (usens == null) {
                        _log(u.nm, u.id, " Unit has no sensors Configurerd")
                        registerError(u.id, "sens", 'Unit has no Sensors')
                    } else {
                        if (typeof m.d !== 'undefined') {
                            if (
                                typeof m.d.p !== 'undefined' &&
                                usens !== "" &&
                                usens !== null &&
                                typeof usens !== 'undefined' &&
                                typeof usens.p !== 'undefined' &&

                                typeof m.d.p[usens.p] !== 'undefined') {
                                var value = m.d.p[usens.p];


                                var sensc = JSON.parse(usens.c)
                                var sensorType = usens.t
                                // _log("sensc ", sensc)
                                if (Object.size(sensc.ci) > 0 && typeof sensc.ci[value] !== 'undefined') {
                                    // _log(idx, u.nm, b.n, sensc.ci[value].t) // Handle Arbitrary Sensor States
                                } else {
                                    if (sensorType == 'digital' || sensorType == 'engine operation') {
                                        // _log(b.m.split("/"))
                                        var metrics = usens.m.split("/")
                                        if (value == 0) {
                                            metric = metrics[1];
                                        } else {
                                            metric = metrics[0];
                                        }
                                        // _log(messageType, "sensorindex:", idx, "\tunitName:", u.nm, sensorType, b.n, value, metric)
                                        if (u.prms == null) {
                                            u.prms = {}
                                        }
                                        u.prms[usens.p] = value


                                    } else {
                                        // _log(messageType, "sensorindex:", idx, "\tunitName:", u.nm, sensorType, b.n, value, b.m)

                                    }
                                }
                            }

                            if (typeof m.d !== 'undefined') {
                                u.lmsg.t = m.d.t
                            }
                            if (typeof m.d.pos !== 'undefined') {
                                // Update Position
                                for (var pk in m.d.pos) {
                                    // _log(u.uid, m.d.pos[pk])
                                    u.pos[pk] = m.d.pos[pk];
                                }
                                // _log(u.pos)
                            }



                        }
                    }
                    // _log(u.lmsg)

                }

                if (typeof m.d !== 'undefined'
                    && typeof m.d.prms !== 'undefined'
                    && typeof m.d.text !== 'undefined'
                ) {

                    //special condition
                    if (typeof m.d.text !== 'undefined') {
                        // _log(u.nm, m.d.text)
                        if (m.d.text.v.search("DOUT1:0") > -1) {
                            avl_unit[mi].prms.customdoor_status = { v: 0 }
                            // process.stdout.write('\x07');
                        } if (m.d.text.v.search("DOUT1:1") > -1) {
                            // process.stdout.write('\x07');
                            avl_unit[mi].prms.customdoor_status = { v: 1 }
                        }

                    }
                }
                if (typeof m.d.tp !== 'undefined' && m.d.tp === 'ucr') {
                    var cmds = u.cmds
                    for (cmdk in cmds) {
                        cmd = cmds[cmdk]
                        if (m.d.cp == cmd.p) {
                            // _log("Command Received: " + u.uid)
                            // _log(m.d)
                            if (u.prms !== null) u.prms[m.d.ca] = { v: m.d.et }
                            u[m.d.ca] = m.d.et
                            if (m.d.ca.toLowerCase() == 'lock') {
                                _log(u.nm, " Unit Lock Command Sent")
                                if (u.prms !== null) u.prms.customdoor_status = { v: 1, et: m.d.et }
                                // SendTelegram(u.nm + " Received Lock Command")
                            }
                            if (m.d.ca.toLowerCase() == 'unlock') {
                                if (u.prms !== null) u.prms.customdoor_status = { v: 0, et: m.d.et }

                                _log(u.nm, " Unit is Unlocked")
                                // SendTelegram(u.nm + " Received unLock Command")
                            }
                        }
                    }
                    // _log(m.d.cp)
                }
                if (typeof m.d.prpu !== 'undefined' && typeof m.d.prpu.mon_units_update !== 'undefined') {
                    _log(m.d.prpu.mon_units_update)
                    // init(account)
                }

                // Device ACK
                avl_unit[mi].ack = 0
                if (typeof m.d.p !== 'undefined'
                    && typeof m.d.p.text !== 'undefined') {
                    avl_unit[mi].ack = m.d.p.text
                    _log(m.i, m.d.p.text, "IN")
                    SendTelegram(avl_unit[mi].nm + " Received from Device  " + m.d.p.text)
                    global.customEmit('deviceCallback', { t: ud.tm, uid: mi, d: m.d.p.text, mtype: 'in' })
                    // sql.push("(  '" + mi + "', '" + ud.tm + "', '" + m.d.p.text + "', 'Sent To Device')");

                }

                if (typeof m.t !== "undefined" &&
                    m.t == "m" &&
                    typeof m.d !== "undefined" &&
                    typeof m.d.tp !== "undefined" &&
                    m.d.tp == "ucr"

                ) {
                    // _log(m.i, m.d, "OUT")
                    // SendTelegram(avl_unit[mi].nm + " Sent To Device " + m.d.cp)
                    global.customEmit('deviceCallback', { t: ud.tm, uid: mi, d: m.d.cp, mtype: 'OUT' })
                    // sql.push("(  '" + mi + "', '" + ud.tm + "', '" + m.d.cp + "', ' Received from Device')");

                }




            }
        }


        if (m.i === -5) {
            // _log(m.i, m.d)
            // SendTelegram(m.i + " " + JSON.stringify(m.d))

            if (

                typeof m.d !== "undefined" &&
                typeof m.d.a !== "undefined" &&
                typeof m.d.a[0] !== "undefined" &&
                m.d.a[0].t == "avl_unit"
            ) {
                // _log(m.d.a)
                // SendTelegram("New Unit Added " + JSON.stringify(m.d))
                newUnitAdd(m.d.a[0].ids)
                global.newUnitAddFlag = true

            }
            if (
                typeof m.d !== "undefined" &&
                typeof m.d.r !== "undefined" &&
                m.d.r.length > 0
            ) {
                for (var ui = 0; ui < m.d.r.length; ui++) {
                    var du_id = m.d.r[ui]
                    // _log("Unit Deletion", du_id)
                    if (typeof avl_unit[du_id] !== 'undefined') {
                        delete avl_unit[du_id]
                    }
                }
                global.custom_units = transform(Object.keys(avl_unit), avl_unit)

            }
        }
        if (
            messageType == 'm' &&
            typeof m.d !== 'undefined' &&
            typeof m.d.tp !== 'undefined' &&
            m.d.tp == 'xx' &&
            typeof m.d.p !== 'undefined' &&
            m.d.p.p3 == 'avl_unit' &&
            typeof m.d.p.action !== 'undefined' &&
            m.d.p.action !== 'user_delete_item' &&
            m.d.p.action !== 'user_create_unit' &&
            m.d.p.action !== 'user_update_name' &&
            m.d.p.action !== 'update_name' &&
            m.d.p.host !== 'notification'

        ) {




            if (unitsToSearch.indexOf(m.d.p.user) == -1) {
                unitsToSearch.push(m.d.p.user)
            }

        }

        if (
            messageType == 'm' &&
            typeof m.d !== 'undefined' &&
            typeof m.d.tp !== 'undefined' &&
            m.d.tp == 'xx' &&
            typeof m.d.p !== 'undefined' &&
            m.d.p.p3 == 'avl_unit' &&
            typeof m.d.p.action !== 'undefined' &&
            m.d.p.action == 'user_update_name'


        ) {
            // _log(m.d.p)

            if (unitsToSearch.indexOf(m.d.p.p2) == -1) {
                unitsToSearch.push(m.d.p.p2)
            }

        }

        processSensors(u, m, ud.tm)





    }

    if (deltaUnits.length > 0) {
        messageTimeAvg()
        // console.log(non)
    }
    // _log("updated Units :", deltaUnits.length, "\tevents:", ud.events.length)
    // SendTelegram("updated Units :" + deltaUnits.length + " events:" + ud.events.length)


    global.processid = process.pid
    // _log(Object.keys(avl_unit))

    if (typeof lmsgTime !== 'undefined') {
        // _log("lmsgTime:", lmsgTime, " lastMessageTime", lastMessageTime, lastMessageTime - lmsgTime, LastMEssageStart)
    }
    if (typeof lmsgTime != 'undefined'
        && typeof LastMEssageStart !== 'undefined'
        && LastMEssageStart == true) {
        disruptionDuration = lastMessageTime - lmsgTime
        if (disruptionDuration > 120) {
            obj = {
                selectedIds: Object.keys(avl_unit),
                from: lmsgTime,
                to: moment().format("X"),
                // to: global.loginTimeUnix,
                sendToQue: true
            }
            global.LastMEssageStart = false // Starting Batch
            GetMessages(obj, function (d) {
                global.LastMEssageStart = true // Ending Batch
            })

        }

    }
    // }

    if (typeof global.QueryCount == 'undefined') {
        global.QueryCount = 0
    }
    global.QueryCount++
    if (typeof lmsgTime != 'undefined') {
        duration = lastQueryTime - lmsgTime
        pingInterval = QueryCount % 50
        if (pingInterval == 0) {
            // SendTelegram(" Ping: deltaUnits.length " + deltaUnits.length)
        }

    }
    global.lmsgTime = moment().format("X")

    return deltaUnits;
}


global.spawnLostMessage = function () {




}

global.search_item_by_nm = function (nm, f) {
    _log("Empty Query", nm, nm.length)

    _log("Executing Search  Query for  " + nm)
    exec('core/search_items', {
        "spec":
        {
            "itemsType": "avl_unit",
            "sortType": "sys_name",
            "propName": "sys_name",
            "propValueMask": "*" + nm + "*",
            "or_logic": 0
        }, "force": 1, "flags": -1, "from": 0, "to": 4294967295
    }
        , function (d) {
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
global.registerError = function (id, type, err) {
    if (typeof global.unitDefects == 'undefined') {
        global.unitDefects = {}
    }
    if (typeof global.unitDefects[id] == 'undefined') {
        global.unitDefects[id] = []
    }
    global.unitDefects[id].push({ type: type, err: err })

}

global.StringColumns = ['key_tag']
global.transform = function (du, avl_unit, query) {
    if (typeof query !== 'undefined') {
        _log("query ", query, du)
    }
    if (typeof global.dataset == 'undefined') {
        global.dataset = {}
    }
    global.unitsWithoutId = []
    for (var uk in du) {
        var u = avl_unit[du[uk]]
        if (typeof u == 'undefined' || u.uid == '') {
            // _log("Unit Has no UID ", du[uk])
            unitsWithoutId.push(u.nm)
            registerError(u.id, 'uid', 'no uid')
        }
        if (typeof u == 'undefined' || typeof u.uid == 'undefined' || u.uid == '') {
            if (typeof u == 'undefined') {
                _log("Error: Unit [" + u.nm + "] does not have UID")
                registerError(u.id, 'uid', 'no uid')
            }

        } else {

            if (typeof u.updatetime == 'undefined') {
                _log(u.nm, " NO Update Time")
            }
            var uid = u.uid

            dataset[uid] = {
                device_id: u.uid,
                wid: u.id,
                nm: u.nm,
                provider: "location_solutions",

            }

            if (Object.size(u.sens) == 1 && u.sens[1] == null) {
                var er = "Unit: " + u.nm + " has no sensors Configured"
                _log(er)
                // SendTelegram(er)
                registerError(u.id, 'sensor', er)
                return
            }
            if (u.sens == null || u.sens[1] == null) return;
            try {
                var sensors = renumber(u.sens, 'n');
            } catch (e) {
                _log(e)

                et = u.nm + " no Sensors Available "
                _log(et, u)
                SendTelegram(et)
                return
            }
            for (var tk in custom_template) {
                var tv = custom_template[tk]
                if (typeof tv.opath !== 'undefined') {
                    if (u.pos !== null) {
                        v = 0
                        try {
                            if (tk == 'recorded_at') { //Set Time
                                v = moment.unix(eval(tv.opath)).format("X")
                                if (u.lmsg.t > u.pos.t) {
                                    // _log(uid, "u.lmsg.t", tk, v, u.lmsg.t)
                                    v = u.lmsg.t
                                } else {
                                    // _log(uid, "u.pos.t", tk, v, u.pos.t)
                                    v = u.pos.t
                                }
                                if (typeof u.updatetime !== 'undefined') {
                                    v = u.updatetime
                                }
                                // _log(u.nm, u.updatetime, u.prms.io_87.v)
                            } else {
                                if (typeof eval(tv.opath) !== 'undefined') {
                                    v = eval(tv.opath)
                                }
                            }
                            dataset[uid][tk] = v
                        } catch (e) {
                            // _log("unknown parameter", u.nm, tv.opath)
                            registerError(u.id, 'sensor', 'unknown parameter ' + tv.opath)
                        }
                        // _log(v)
                    }
                }
                // _log(tk, sensors[tk])
                if (typeof sensors[tk] !== 'undefined') {
                    // _log(getSensor(u.id, sensors[tk].id))
                    var p = sensors[tk].p
                    var n = sensors[tk].n
                    var st = sensors[tk].t
                    var tbl = sensors[tk].tbl
                    var sensc = JSON.parse(sensors[tk].c)
                    var upper_bound = sensc.upper_bound
                    var lower_bound = sensc.lower_bound
                    var f = replaceAll(p, 'const', "")
                    fa = golbalizeParams(u, f)

                    for (k in u.prms) {
                        if (fa.includes(k)) {
                            var b = u.prms[k]
                            var val = 0
                            if (isObject(b) == true) {
                                val = b.v
                            } else {
                                val = b
                            }
                            if (typeof upper_bound !== 'undefined' || typeof lower_bound !== 'undefined') {
                                if (val <= lower_bound || val >= upper_bound) {
                                    continue;
                                }
                            }
                            if (tbl.length > 0) {
                                computed = val;
                                for (var a in tbl) {
                                    var tp = tbl[a]
                                    if (val <= tp.x) {
                                        computed = val * tp.a + tp.b
                                        break
                                    }
                                }
                                val = computed
                            }
                            // if (u.id == 19985 && tk == 'Fuel Level') {
                            //     _log(u.nm, u.id, "p ", p, "val ", u.prms[k].v, "computed ", computed, "k", k, "lower_bound", lower_bound, "upper_bound", upper_bound)
                            // }
                            if (k == 'in') {
                                // _log(u.nm, k, tk, val, val.toString(2), val.toString(2).length, val.toString(2)[val.toString(2).length - 1]);
                            } else {
                                global[k] = val
                                if (typeof custom_template[n] !== 'undefined') {
                                    try {
                                        if (typeof eval(f) == 'object') {
                                            f = f.replace(/const/g, '');
                                            var c = parseFloat(eval(f).v.toFixed(2))
                                        } else {
                                            if (isNumeric(eval(f))) {
                                                if (st == 'trailer') {
                                                    var c = eval(f)
                                                } else {
                                                    var c = parseFloat(eval(f).toFixed(2))
                                                }
                                            } else {
                                                var c = eval(f)
                                                if (StringColumns.indexOf(custom_template[n].path) == -1) {
                                                    c = parseFloat(c.toFixed(2))
                                                    // _log(custom_template[n].path, c)
                                                }
                                            }
                                            if (typeof custom_template[n].watch !== 'undefined') {
                                                // _log(u.nm, n, c)
                                                SendTelegram(u.nm + " n:" + n + " f:" + f + " c:" + c)
                                            }
                                        }
                                        dataset[uid][custom_template[n].path] = c
                                    } catch (e) {
                                        _log(e)
                                        err = "ERROR in Parameter Formula:\t" + u.nm + "\t" + u.uid + "\t" + k + "\t" + tk + "\t" + val + "\t" + p
                                        _log(err)
                                        registerError(u.id, 'prms', err)
                                    }
                                }


                            }
                        }
                    }
                }

            }
        }


    }
    // console.table(dataset)
    if (unitsWithoutId.length > 0 && unitsWithoutId[0] !== '0') {
        // _log(Object.keys(unitsWithoutId))
        _log(`There are ${unitsWithoutId.length} units With Missing UID`)

    }
    var tresponse = {}
    for (ti in du) {
        uid = avl_unit[du[ti]].uid
        // _log(uid)
        if (uid !== "") {
            tresponse[uid] = dataset[uid]
        }
    }
    // _log(Object.size(tresponse))
    return tresponse;
}
function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

isObject = function (arg) { return Object.prototype.toString.call(arg).indexOf('Object') !== -1; }



function golbalizeParams(u, f) {

    fs = f.split(/(?:\(|\)|\/|\*|\+|\-\\|\^|\:|\|)+/)
    if (u.prms == null) return;
    for (i in fs) {
        global[fs[i]] = undefined
        if (typeof u.prms[fs[i]] !== 'undefined') {
            var p = u.prms[fs[i]];

            if (isObject(p)) {
                val = p.v
            } else {
                val = p
            }

            // _log(val)
            global[fs[i]] = val

        }
        if (fs[i] == 'io_1') {
            // _log(p)
            // _log(u.nm, f, val, eval(f))
        }

    }
    // _log(fs)
    return fs
}


global.performUnitSearch = function (s, fn) {
    var t1 = new Date().getTime()
    // _log(s)
    if (typeof s.string == 'undefined') return
    if (typeof global.avl_unit == 'undefined') return
    // _log(Object.size(global.custom_units))
    var r = {
        custom_units: {},
        avl_unit: {}
    }
    if (typeof s.string == 'object') {
        var uar = []
        for (k in s.string) {
            uid = s.string[k]
            u = renumber(global.avl_unit, 'uid')[uid]
            if (typeof u !== 'undefined') {
                uar.push(u.id)
            } else {
                // _log("Browser request for UID: " + uid + " Yields no result")

            }

        }
        if (uar.length > 0) {
            r.custom_units = transform(uar, global.avl_unit)
            r.avl_unit = global.avl_unit;
        }
    } else if (s.string == "*") {
        cu = transform(Object.keys(global.avl_unit), global.avl_unit)
        r.custom_units = cu;
        r.avl_unit = global.avl_unit;

    } else {
        var uar = []
        _log("String Search")
        for (k in global.avl_unit) {
            u = global.avl_unit[k]
            try {
                if (u.nm.toLowerCase().search(s.string) > -1) {
                    uar.push(u.id)
                }
            } catch (e) {
                _log(e)
            }
            try {
                if (u.uid.toString().search(s.string) > -1) {
                    uar.push(u.id)
                }
                // _log(u.device_id)
            } catch (e) {
                _log(e)
            }
        }
        r.custom_units = transform(uar, global.avl_unit)
        r.avl_unit = global.avl_unit;

    }
    // _log(Object.size(r.custom_units), Object.size(r.custom_units))
    var t2 = new Date().getTime()
    // _log("QueryTime: ", t2 - t1, "Returned:", Object.size(r.custom_units))
    fn(r)// Callback

}


global.newUnitAdd = function (uar) {
    // _log(uar)
    _log("newUnitAdd:  ", uar.length)
    if (uar.length == 0) return;
    var unistToload = uar.join("|");
    exec('core/search_items', {
        "spec":
        {
            "itemsType": "avl_unit",
            "sortType": "sys_name",
            "propName": "sys_id",
            "propValueMask": unistToload,
            "or_logic": 1
        }, "force": 1, "flags": -1, "from": 0, "to": 4294967295
    }
        , function (d) {
            // _log(d)
            var newUnitAdditions = []
            if (d.items.length == 0) return;
            for (var i = 0; i < d.items.length; i++) {
                var u = d.items[i]
                newUnitAdditions.push({ title: "new Unit Addition", nm: u.nm, id: u.id, uid: u.uid })
                global.avl_unit[u.id] = u
                // SendTelegram("New Unit Additions " + u.nm)
            }
            // _log("newUnitAdd", uar)
            _log("New Unit Additions", newUnitAdditions)

            global.custom_units = transform(Object.keys(global.avl_unit), global.avl_unit)
            _log("Total Units: ", Object.size(global.custom_units), Object.size(global.avl_unit))
            global.io.sockets.emit('unitchange', Object.size(global.custom_units))
        });



}

global.load_updatedUnits = function () {
    return
    if (unitsToSearch.length > 0) {
        _log("unitsToSearch", unitsToSearch)
        var uar = []
        for (i = 0; i < unitsToSearch.length; i++) {
            nm = unitsToSearch[i]
            if (typeof renumber(avl_unit, 'nm')[nm] !== 'undefined') {
                uar.push(renumber(avl_unit, 'nm')[nm].id)
            }
        }
        newUnitAdd(uar)
        global.customEmit('browserTrigger', { uar: uar })
    }

}


global.MSQLInsert = function (sqlA) {
    if (sqlA.length == 0) return
    var q = "INSERT INTO `devicecomlog` (`uid`, `t`, `d`, `mtype`) VALUES " + sqlA.join(",")
    // console.log(q)
    // return
    global.con.query(q, function (err, result) {
        if (err) {
            console.log("Mysql err.code" + err.code)
            console.log("err.sqlMessage" + err.sqlMessage)
            console.log("Sql" + err.sql)
        } else {
            // _log("1 record inserted");
        }
        return
    });
}
global.MSQLgetlist = function (sqlA) {
    if (sqlA.length == 0) return
    var q = "SELECT * FROM `devicecomlog` ORDER BY `devicecomlog`.`id` ASC ";
    // console.log(q)
    // return
    global.con.query(q, function (err, result) {
        if (err) {
            console.log("Mysql err.code" + err.code)
            console.log("err.sqlMessage" + err.sqlMessage)
            console.log("Sql" + err.sql)
        } else {
            // _log("1 record inserted");
        }
        return
    });
}




function getMsgPerMinute() {
    if (typeof global.lmsgTime != 'undefined'
        && typeof global.startTime !== 'undefined'
        && typeof global.messageCounter !== 'undefined'
    ) {

        var c = global.messageCounter
        // var c = 5000
        var st = parseInt(global.startTime.format("X"))
        var lt = parseInt(global.lmsgTime)
        var mph = mph = (c / ((lt - st) / 60)).toFixed(3)
        // _log("st", st, "lt", lt, "c", c)
        // _log(mph)
        return mph
    } else {
        return 0
    }

}


global.updateNewUnitFlags = function (f) {
    exec('core/update_data_flags', {
        spec: [{
            type: "type",
            data: 'avl_unit',
            flags: -1,
            mode: 1
        }]
    }, function (d) {
        // _log(JSON.stringify(d))
        var m = { title: "New Unit Flag Updated" }
        _log("Updated Units:", Object.size(d))
        if (Object.size(d) == 0) {
            SendTelegram("Nothing to Update")
            global.newUnitAddFlag = false
            return;
        }
        for (i in d) {
            u = d[i]
            // _log(u)
            // _log("New Unit Flag Updated", u.d.nm)
            m[u.i] = u.d.nm
        }

        // SendTelegram("Flags Updated after Unit Addition")
        SendTelegram(m)
        _log("Flags Updated ------------------------", Object.size(d))
        global.newUnitAddFlag = false
        if (typeof f !== 'undefined') f(d);
    });
}



avl_evt = function (sid, f) {
    request(baseUrl + '/avl_evts?sid=' + sid, { json: true }, (err, res, body) => {
        if (typeof body == 'undefined') {
            SendTelegram("Body of Event is undefined" + JSON.stringify(body))
            init();
            return;
        }
        if (typeof body.events == 'undefined') {
            SendTelegram("Event is undefined" + JSON.stringify(body))
            init();
            return;
        }
        if (err) {
            SendTelegram(JSON.stringify(err))
            _log(err);
            init(); // Crash and Restart
            return
        }
        if (typeof body.error !== 'undefined') {
            SendTelegram(JSON.stringify(body.error))
            _log(body.error);
            init();

            return
        };
        if (typeof body.events !== 'undefined' && body.events.length > 0) {
            // io.sockets.emit("fromServer", body); //  Send Events
            // io.sockets.emit("avl_evts", body);
            channel.assertQueue(queue, {
                durable: false,
                // headers: { event: "telemetry" }
            });


            delatUnits = processLastMessage(body);

            if (typeof delatUnits !== 'undefined' && delatUnits.length > 0) {
                custom_unit_events = transform(delatUnits, avl_unit);
                // io.sockets.emit("custom_unit_events", custom_unit_events);
                io.sockets.emit("event_update", { custom_unit_events: custom_unit_events, avl_evts: body, stats: getStats(), sid: sid });
                // _log(Object.size(delatUnits))
                if (typeof custom_unit_events !== 'undefined') {
                    _log("Sending Messages for ", Object.size(custom_unit_events), " Units")
                    for (var i in custom_unit_events) {
                        var dataset = custom_unit_events[i]
                        o = {}
                        if (typeof dataset.ack !== 'undefined' && dataset.ack !== 0) {
                            MessageType = "ack"
                            o[i] = { ack: dataset.ack }
                            channel.sendToQueue(queue, Buffer.from(JSON.stringify(o)),
                                {
                                    persistent: true,
                                    headers: {
                                        event: MessageType,
                                        sid: sid,
                                        queue: queue,
                                        host: 'https://ekar.locationsolutions.com',
                                        port: port
                                    },
                                    type: MessageType

                                }
                            );
                        }
                        MessageType = "telemetry"
                        delete dataset.ack
                        o[i] = dataset
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(o)),
                            {
                                persistent: true,
                                headers: {
                                    event: MessageType,
                                    sid: sid,
                                    queue: queue,
                                    host: 'https://ekar.locationsolutions.com',
                                    serverPort: port,

                                },
                                type: MessageType
                            }
                        );

                    }
                } else {
                    _log(delatUnits)
                }


            }
            if (stopRefresh == 1) {
                init();
            }
            // load_updatedUnits();

            if (global.newUnitAddFlag == true && typeof updateNewUnitFlags !== 'undefined') {
                _log("newUnitAdd ", global.newUnitAddFlag)
                updateNewUnitFlags(function (d) {
                    // _log(d)
                    global.newUnitAddFlag = false
                    init_client()
                })
            }

        }

    });
}




require('dotenv').config()
if (typeof con == 'undefined') {
    global.mysql = require('mysql')
    MysqlOptions = {
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: 'ekar',
        port: process.env.SQL_PORT,
    }
    _log(MysqlOptions)
    global.con = mysql.createPool(MysqlOptions)
    con.getConnection(function () {
        _log("MYSQL Connected")

    })


}


// us = {
//     subscribeSensors(fn) {
//         RetentionGrid = undefined
//         if (typeof avl_unit == 'undefined') return;
//         var uidset = Object.keys(avl_unit)
//         var params = []
//         // _log(uidset)
//         for (i in uidset) {
//             var id = uidset[i]
//             params.push({ id: id, detect: { 'trips': 0 } })

//         }
//         wexec('events/update_units', {
//             "mode": "remove",
//             "units": uidset
//         }, function (d) {

//             _log('events/update_units')
//             wexec('events/update_units', {
//                 "mode": "add",
//                 "units": params
//             }, function (d) {
//                 _log("Units In Event Manager ", d.units)
//                 if (typeof fn !== 'undefined') fn()
//             })
//         })

//     },
//     async periodicSensurQuery() {
//         if (typeof global.evtUpdateTimer !== 'undefined') {
//             SendTelegram("restarting periodicSensurQuery")
//             clearInterval(evtUpdateTimer)
//             evtUpdateTimer = undefined
//         }
//         global.evtUpdateTimer = setInterval(async function () {
//             var params = {
//                 "detalization": "0x7",
//             }
//             r = await asynExec('events/check_updates', params)
//             rsp = await evtUpdate(r)
//             // _log("evtUpdate", Object.size(r), rsp)


//         }, 5000)
//     },
//     async evtUpdate(eventUpdate) {
//         // console.clear()
//         if (typeof retentionGrid == 'undefined') global.retentionGrid = {}
//         if (typeof global.mdbSetHashes == 'undefined') mdbSetHashes = [];
//         if (typeof eventUpdate.error == 'udefined') {
//             _Log("Abroting events/check_updates!")
//             return
//         }
//         for (i in eventUpdate) {
//             for (tk in eventUpdate[i]) {
//                 var te = eventUpdate[i][tk]
//                 if (typeof te.trips != 'undefined') {
//                     if (typeof retentionGrid[i] == 'undefined') retentionGrid[i] = []
//                     set = {
//                         unit: i,
//                         nm: avl_unit[i].nm,
//                         distance: te.trips.distance,
//                         fromdate: te.trips.from.t,
//                         todate: te.trips.to.t,
//                         state: te.trips.state,
//                         avg_speed: te.trips.avg_speed,
//                     }
//                     retentionGrid[i].push(set)
//                 }
//             }
//         }
//         tempTripTable = []



//         for (var i in retentionGrid) {
//             var unitLog = retentionGrid[i]
//             if (typeof avl_unit[i] !== 'undefined') {


//                 for (var k in unitLog) {
//                     if (k > 0) {
//                         var lastRow = unitLog[k - 1]
//                         var thisRow = unitLog[k]
//                         var diff = thisRow.distance - lastRow.distance
//                         if (diff < 0) {
//                             if (thisRow.fromdate == lastRow.fromdate || thisRow.fromdate < lastRow.fromdate) {

//                                 var set = {
//                                     unit: i,
//                                     user: 'TRIP EVENT',
//                                     nm: avl_unit[i].nm,
//                                     distance: lastRow.distance,
//                                     fromdate: lastRow.fromdate,
//                                     todate: lastRow.todate,
//                                     lastRowFromDate: lastRow.fromdate,
//                                     lastRowtoDate: lastRow.todate,
//                                     CurrRowFromDate: thisRow.fromdate,
//                                     CurrRowtoDate: thisRow.todate,
//                                     sbsSQLResponse: ""
//                                 }

//                             } else {
//                                 var set = {
//                                     unit: i,
//                                     user: 'TRIP EVENT',
//                                     nm: avl_unit[i].nm,
//                                     distance: lastRow.distance,
//                                     fromdate: lastRow.fromdate,
//                                     todate: thisRow.fromdate, //  thisRow.fromdate
//                                     lastRowFromDate: lastRow.fromdate,
//                                     lastRowtoDate: lastRow.todate,
//                                     CurrRowFromDate: thisRow.fromdate,
//                                     CurrRowtoDate: thisRow.todate,
//                                     sbsSQLResponse: ""
//                                 }
//                             }
//                             // _log(`Unit ${set.unit} Trip todate: ${set.todate} fromdate:${set.fromdate}   Distance ${lastRow.distance}`)
//                             lastRow.nm = avl_unit[i].nm
//                             lastRow.user = "TRIP EVENT"
//                             if (set.fromdate < set.todate) {
//                                 if (set.distance > 100) {
//                                     // set.batcherid = BatcherId
//                                     tempTripTable.push(set)
//                                 }
//                                 else {
//                                     // set.success = 1
//                                     // set.active = 1
//                                     set.sbsSQLResponse = "QUERY ignored <100m"
//                                     tempTripTable.push(set)
//                                 }
//                             } else {
//                                 _log(set)
//                                 try {
//                                     _log(moment(set.fromdate * 1000).format('MMM - DD hh:mm:ss'), moment(set.todate * 1000).format('MMM - DD hh:mm:ss'))
//                                 } catch (e) {
//                                     _log(e)
//                                 }

//                             }
//                             unitLog.shift()
//                             continue
//                         }
//                     }
//                 }
//                 if (unitLog.length > 4) {
//                     unitLog.shift()
//                 }
//             }
//         }


//         if (Object.size(tempTripTable) > 0) {
//             // _log("tempTripTable", BatcherId, Object.size(tempTripTable))
//             var r = await asyncInsertSQL('querybatcher', tempTripTable, ['id', 'nm', 'lastRowtoDate', 'lastRowFromDate', 'lastupdateRowtoDate', 'CurrRowFromDate', 'CurrRowtoDate'])
//             if (r.serverStatus == 34) {
//                 _log(`TRIP EVENT`)
//             }
//             tempTripTable = [];
//             // tempTripTable = undefined;
//             // insertSQL('querybatcher', tempTripTable, ['id', 'nm', 'lastRowtoDate', 'lastRowFromDate', 'lastupdateRowtoDate', 'CurrRowFromDate', 'CurrRowtoDate'], function (r) {

//             // })
//             // tempTripTable = [];

//         }

//         return true

//     }
// }

// us.subscribeSensors(function () {

// })