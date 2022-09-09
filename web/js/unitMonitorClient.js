var storeParams = false;
var transcript = [];
var username = 'User_' + parseInt(Math.random() * 10000);
var tformat = "YYYY MMM dd HH:mm:ss"
var privs = {
    refreshTime: function () {
        $("#refreshTime").remove()
        t = "<div id=refreshTime class=navbuttons>Refresh Time:<select name=refreshTimeSelect id=refreshTimeSelect>";
        for (var i = 0; i <= 120; i++) {
            t += "<option value='" + i * 1000 + "'>" + i + " sec</option>\n"
        }
        t += "</select>"
        t += "<div id=counter></div></div>"
        $("#top").append(t)
        $("#refreshTimeSelect").val(refreshTime).on('change', function () {
            var rt = $(this).val()
            socket.emit('updateRefreshTime', rt, function (d) {
                console.log(d)
            })

        })
        if (typeof countdown !== 'undefined') {
            clearInterval(countdown)

        }
        var r = $("#refreshTimeSelect").val() / 1000
        countdown = setInterval(function () {

            $("#counter").html(r)
            --r
            if (r == 0) {
                r = $("#refreshTimeSelect").val() / 1000
            }
        }, 1000)


    },
    reload: function () {
        $("#reload").remove()
        $("#top").append("<div class='navbuttons' id=reload>Reload</div>")
        $("#reload").on('click', function () {
            socket.emit('fromClient', { reload: 0 })
        })


    },
    getAvlunits: function () {
        $("#getAvlUnits").remove()
        $(".tokens").remove()
        $("<div id='getAvlUnits' class=navbuttons >Get Vehicle List</div>").appendTo("#top").on('click', function () {
            url = location.href + '?params={}&svc=avl_unit'
            ApiQueryResponse('avl_unit', url)
            $.ajax({
                url: url,
                success: function (d) {
                    console.table(d)
                }
            })
        })
    },
    messageStats: function () {
        window.messageStats = function () {

            popwindow("Stats", "MEssage Stats", "Messages", function () {

                $.ajax({
                    url: location.protocol + "//" + location.hostname + ":" + StatStorePort + "/get",
                    dataType: "json",
                    success: function (d) {
                        window.statData = d
                        window.StatChart = {}, rows = []
                        $.each(statData, function (a, b) {
                            console.log()
                            rows.push([new Date(b.t * 1000), b.units])
                        })
                        StatChart.LineChart = new google.visualization.LineChart(document.getElementById("Stats"));
                        StatChart.ChartData = new google.visualization.DataTable();
                        StatChart.ChartData.addColumn('date', 'date time');
                        StatChart.ChartData.addColumn('number', 'Updates');
                        StatChart.ChartData.addRows(rows);
                        window.StatChartOptions = {

                            width: '98%',
                            height: '98%',
                            legend: 'none',
                            animation: {
                                duration: 1000,
                                easing: 'in'
                            },
                            chartArea: {
                                left: 50,
                                right: 50,
                                top: 20,
                                width: '90%',
                                height: '90%',
                            },
                            hAxis: {
                                title: 'Intervals'
                            },
                            vAxis: {
                                title: u.nm
                            }
                        };
                        StatChart.LineChart.draw(StatChart.ChartData, StatChartOptions)



                    }
                })


            })

        }
        $("#MessageStats").remove()
        $("#top").append("<div class='navbuttons' id=MessageStats>Message History Chart</div>")
        $("#MessageStats").on('click', function () {
            if ($("#Stats").length > 0) {
                $("#Stats").remove()
            } else {
                messageStats()
            }
        })
    },
    showStats: function () {
        $("#LiveStats").remove()
        $("<div class='navbuttons' id=LiveStats>Live Stats</div>").appendTo("#top").on('click', function () {
            ShowStats()
        })
    }
}

var itemFlags = {
    avl_unit: [{ id: 1, n: 'base flag', set: 1 },
    { id: 2, n: 'custom properties', set: 1 },
    { id: 4, n: 'billing properties', set: 1 },
    { id: 8, n: 'custom fields', set: 1 },
    { id: 16, n: 'image', set: 1 },
    { id: 32, n: 'messages', set: 1 },
    { id: 64, n: 'GUID', set: 1 },
    { id: 128, n: 'administrative fields', set: 1 },
    { id: 256, n: 'advanced properties', set: 1 },
    { id: 512, n: 'available for current moment commands', set: 1 },
    { id: 1024, n: 'last message and position', set: 1 },
    { id: 4096, n: 'sensors', set: 1 },
    { id: 8192, n: 'counters', set: 1 },
    { id: 32768, n: 'maintenance', set: 1 },
    { id: 131072, n: 'unit configuration in reports: trip detector and fuel consumption', set: 1 },
    { id: 524288, n: 'list of all possible commands for current unit', set: 1 },
    { id: 1048576, n: 'message parameters', set: 1 },
    { id: 2097152, n: 'unit connection status', set: 1 },
    { id: 4194304, n: 'position', set: 1 },
    { id: 8388608, n: 'profile fields', set: 1 }
    ],
    avl_resource: [
        { id: 1, n: 'base flag', set: 1 },
        { id: 2, n: 'custom properties', set: 1 },
        { id: 4, n: 'billing properties', set: 1 },
        { id: 8, n: 'custom fields', set: 1 },
        { id: 32, n: 'messages', set: 1 },
        { id: 64, n: 'GUID', set: 1 },
        { id: 128, n: 'administrative fields', set: 1 },
        { id: 256, n: 'drivers', set: 1 },
        { id: 512, n: 'jobs', set: 1 },
        { id: 1024, n: 'notifications', set: 1 },
        { id: 2048, n: 'POIs', set: 1 },
        { id: 4096, n: 'geofences', set: 1 },
        { id: 8192, n: 'report templates', set: 1 },
        { id: 16384, n: 'list of auto attachable units for drivers', set: 1 },
        { id: 32768, n: 'driver groups', set: 1 },
        { id: 65536, n: 'trailers', set: 1 },
        { id: 131072, n: 'trailer groups', set: 1 },
        { id: 262144, n: 'list of auto attachable units for trailers', set: 1 },
        { id: 524288, n: 'orders', set: 1 },
        { id: 1048576, n: 'geofences groups', set: 1 },
        { id: 2097152, n: 'tags (passengers)', set: 1 },
        { id: 4194304, n: 'automatic binding list of units (for tags)', set: 1 },
        { id: 8388608, n: 'tags groups(passengers)', set: 1 }
    ],

    user: [{ id: 1, n: 'base flag', set: 1 },
    { id: 2, n: 'custom properties', set: 1 },
    { id: 4, n: 'billing properties', set: 1 },
    { id: 8, n: 'custom fields', set: 1 },
    { id: 32, n: 'messages', set: 1 },
    { id: 64, n: 'GUID', set: 1 },
    { id: 128, n: 'administrative fields', set: 1 },
    { id: 256, n: 'other properties', set: 1 },
    { id: 512, n: 'notifications', set: 1 },
    ],

    avl_retranslator: [
        { id: 1, n: 'base flag', set: 1 },
        { id: 2, n: 'custom properties', set: 1 },
        { id: 4, n: 'billing properties', set: 1 },
        { id: 64, n: 'GUID', set: 1 },
        { id: 128, n: 'administrative fields', set: 1 },
        { id: 256, n: 'state and configuration', set: 1 },
        { id: 512, n: 'units', set: 1 }
    ],
    avl_unit_group: [{ id: 1, n: 'base flag', set: 1 },
    { id: 2, n: 'custom properties', set: 1 },
    { id: 4, n: 'billing properties', set: 1 },
    { id: 8, n: 'custom fields', set: 1 },
    { id: 16, n: 'image', set: 1 },
    { id: 64, n: 'GUID', set: 1 },
    { id: 128, n: 'administrative fields', set: 1 }
    ],

    avl_route: [{ id: 1, n: 'base flag', set: 1 },
    { id: 2, n: 'custom properties', set: 1 },
    { id: 4, n: 'billing properties', set: 1 },
    { id: 64, n: 'GUID', set: 1 },
    { id: 128, n: 'administrative fields', set: 1 },
    { id: 256, n: 'configuration', set: 1 },
    { id: 512, n: 'check points', set: 1 },
    { id: 1204, n: 'schedules', set: 1 },
    { id: 2048, n: 'rounds', set: 1 },
    ],

    cfl: [{ id: 0, n: 'Mileage counter: GPS', set: 0 },
    { id: 1, n: 'Mileage counter: Mileage sensor', set: 0 },
    { id: 2, n: 'Mileage counter: Relative odometer', set: 0 },
    { id: 3, n: 'Mileage counter: GPS + engine ignition sensor', set: 0 },
    { id: 16, n: 'Engine hours counter: Engine ignition sensor', set: 0 },
    { id: 32, n: 'Engine hours counter: Absolute engine hours sensor', set: 0 },
    { id: 64, n: 'Engine hours counter: Relative engine hours sensor', set: 0 },
    { id: 256, n: 'Auto calculation of mileage from new messages', set: 0 },
    { id: 512, n: 'Auto calculation of engine hours from new messages', set: 0 },
    { id: 1024, n: 'Auto calculation of GPRS traffic', set: 0 },
    ],
    teltonikaDoor340: [
        { id: 256, n: 'FL', set: 0 },
        { id: 512, n: 'FR', set: 0 },
        { id: 1024, n: 'RL', set: 0 },
        { id: 2048, n: 'RR', set: 0 },
        { id: 4096, n: 'H', set: 0 },
        { id: 8192, n: 'T', set: 0 }]
}
$('#sendcmd').click(function (e) {
    e.preventDefault(); // prevents page reloading
    console.log(socket.id)

    socket.emit('fromClient', {
        msg: $('#m').val()
    });
    $('#m').val('');
    return false;
});
function updateList() {

}
function ShowStats() {
    let t = "<table width='100%' class=statTable>"
    $.each(ServerStats, function (a, b) {
        t += "<tr>"
        t += "<td class='statVar'>"
        t += a
        t += "</td>"

        t += "<td id='stat_" + a + "' class=statVal>"
        t += b
        t += "</td>"
        t += "</tr>"
    })
    t += "<table>"
    $("#ServerStats").html(t)

    popwindow("ServerStats", t, "Server Stats", function () {
        $("#ServerStats").dialog({
            width: 600,
            height: "auto"
        })
    })
}
function savleLocalList() {
    if (typeof broker_units == 'undefined') {
        broker_units = {}
    }
    broker_units[tokenlist.operateAs] = Object.keys(custom_units)
    localStorage.broker_units = JSON.stringify(broker_units)
}

$(document).ready(function () {
    window.socket = io();
    window.custom_units = {}
    window.avl_unit = {}
    window.proxy = ObservableSlim.create({ avl_unit: {}, custom_units: {} }, true, function (changes) {
        //         console.log(changes);
        $.each(changes, function (a, b) {
            if (b.type == 'update'
                && typeof b.target !== 'undefined'
            ) {
                //                 console.table(b.property)
                try {
                    if (typeof b.property !== 'undefined' && typeof renumber(custom_template, 'path')[b.property] !== 'undfined') {
                        var col = renumber(custom_template, 'path')[b.property].txt
                        // console.log(b.target.device_id, b.target.nm, b.property, b.newValue)
                        cell = $("#custom_units tr[row='" + b.target.device_id + "'] td[col='" + col + "']")
                        cell.html(b.newValue)
                        cell.css({ 'background-color': 'rgb(233 255 0)' })

                        setTimeout(function () {
                            cell.removeAttr('style')
                        }, 500)

                    }
                } catch (e) {
                    //                     console.log(b.property, e)
                }


            }
        })
    });
    logiDialog()
})

function logiDialog() {
    t = "<div class=ffield><label for=loginUsername>Username</label><input name='username' type=text id=loginUsername value=''></div>"
    t += "<div class=ffield><label for=loginPassword>Password</label><input name='password' type=password id=loginPassword value=''></div>"
    if (typeof localStorage.nodeDashBoardLogin !== 'undefined') {
        login = JSON.parse(localStorage.nodeDashBoardLogin)
        userlogin(login)

    } else {
        popwindow("login", t, "Login", function () {
            $("#login").dialog({
                width: 400,
                height: "auto",
            })
            $("#pop_ok").off('click').on('click', function () {
                login = { username: $("#loginUsername").val(), password: md5($("#loginPassword").val()) }
                localStorage.nodeDashBoardLogin = JSON.stringify(login)
                userlogin(login)

            })
        })
    }
}
function userlogin(login) {
    console.log(login)
    socket.emit("login", login, function (d) {
        console.log(d)
        if (d.error == 0) {
            $("#login").dialog('close')
            init()

        } else {
            delete localStorage.nodeDashBoardLogin
        }
    })
}
function init() {
    $("#indicator").remove()
    google.charts.load('current', { 'packages': ['corechart'] });
    socket.on('connect', function (msg) { // TIP: you can avoid listening on `connect` and listen on events directly too!
        console.log(msg)
        $("#container").show()
        if (typeof readCookie("chatNick") !== "undefined") {
            $("#thisuser").val(readCookie("chatNick")).trigger("keyup")
        }

        if (typeof readCookie("activeChatUser") !== "undefined") {
            $(".cuser [activeChatUser='" + readCookie("activeChatUser") + "']")
            // .trigger("click")
        }

        // socket.emit('adduser', {
        //     name: username,
        //     id: socket.id
        // });


    });
    archive = {}

    socket.on('unitchange', function (cu) {
        window.unitchange = cu
        console.log(unitchange)
        beep()
        init()
    })
    socket.on('showstatchart', function (status) {
        if (status == 1 && typeof messageStats !== 'undefined') {
            messageStats()
        } else {
            $("#Stats").dialog('close')
        }

        beep()

    })
    socket.on('showStats', function (status) {
        if (status == 1 && typeof messageStats !== 'undefined') {
            ShowStats()
        } else {
            $("#ServerStats").dialog('close')
        }

        beep()

    })

    socket.on('event_update', function (d) {
        window.sid = d.sid
        $("#indicator").fadeIn(500, function () {
            $("#indicator").fadeOut(500)
        })
        window.avl_evts = d.avl_evts
        var mCount = avl_evts.events.length
        processStats(d.stats)
        for (var k = 0, len = avl_evts.events.length; k < len; k++) {


            var m = avl_evts.events[k];
            if (typeof avl_unit[m.i] !== 'undefined') {
                //                 console.log(m.i, m.d)
                //                 console.table(m.d.p)
            }

            if (typeof avl_unit[m.i] !== 'undefined' && typeof archive[avl_unit[m.i].uid] !== 'undefined') {
                uid = avl_unit[m.i].uid
                archive[uid].avl_evts.push(m.d)

            }
            if (m.i === -5) {
                if (

                    typeof m.d !== "undefined" &&
                    typeof m.d.a !== "undefined" &&
                    typeof m.d.a[0] !== "undefined" &&
                    m.d.a[0].t == "avl_unit"

                ) {
                    for (var ui = 0; ui < m.d.a[0].ids.length; ui++) {
                        var au_id = m.d.a[0].ids[ui]
                        console.log("Unit Addition", au_id)
                    }
                }

                if (

                    typeof m.d !== "undefined" &&
                    typeof m.d.r !== "undefined" &&
                    m.d.r.length > 0
                ) {
                    for (var ui = 0; ui < m.d.r.length; ui++) {
                        var du_id = m.d.r[ui]
                        console.log("Unit Deletion", du_id)
                        if (typeof avl_unit[du_id] !== 'undefined') {
                            delete custom_units[avl_unit[du_id].uid]
                            delete avl_unit[du_id]
                        }

                    }
                    buildTable()
                }
            }
            // console.log(m)
            if (typeof m.t !== "undefined" &&
                m.t == "m" &&
                typeof m.d !== "undefined" &&
                typeof m.d.tp !== "undefined" &&
                m.d.tp == "ucr"

            ) {
                console.log(m.i, m.d.cp)


                storeMessageLog(m.i, { t: m.d.t, uid: m.i, d: m.d.cp, mtype: 'out' })

            }
            if (typeof proxy !== 'undefined'
                && typeof proxy.avl_unit !== 'undefined'
                && typeof proxy.avl_unit[m.i] !== 'undefined'
                && typeof proxy.avl_unit[m.i].lmsg !== 'undefined'
                && typeof proxy.avl_unit[m.i].lmsg.p !== 'undefined'

            ) {
                // console.log(m.d.p)
                $.each(m.d.p, function (pk, pv) {
                    // console.log(m.i, pk, pv)
                    proxy.avl_unit[m.i].lmsg.p[pk] = m.d.p[pk]

                })



            }
            if (storeParams == true && typeof avl_unit[m.i] !== 'undefined') {
                u = avl_unit[m.i]

                if (typeof u.msgs == 'undefined') {
                    u.msgs = []

                }
                if (typeof custom_units[u.uid] !== 'undefined') {
                    if (
                        typeof m.d !== 'undefined'
                        && typeof m.d.p !== 'undefined'
                        && typeof m.d.p.text == 'undefined'
                        && Object.keys(m.d.p).length > 1


                    ) {
                        console.log(Object.keys(m.d.p).length)
                        u.msgs.push(m.d.p)



                        console.table(u.msgs)

                    }

                }



            }

        }
        if (typeof StatChart !== 'undefined' && mCount > 0) {
            StatChart.ChartData.addRows([[new Date(), mCount]]);
            StatChart.LineChart.draw(StatChart.ChartData, StatChartOptions)

        }

        window.custom_unit_events = d.custom_unit_events
        // console.log(custom_unit_events)
        $.each(custom_unit_events, function (a, b) {
            if (typeof custom_units[a] !== 'undefined') {
                //                 console.log(b.nm, b.ignition)
            }

        })
        if (typeof custom_units == 'undefined') return;
        for (k in custom_unit_events) {
            if (typeof custom_units[k] == 'undefined') return;
            archive[k].custom_events.push(custom_unit_events[k])
            var b = custom_unit_events[k]
            for (c in b) {
                v = b[c]
                //                 console.log(k, c, v)
                if (typeof proxy !== 'undefined') {
                    proxy.custom_units[k][c] = v
                }

                // if ($("tr[row='" + k + "'] [col='" + c + "']").html() !== v) {
                //     // console.log(k, c, v)

                //     if (c == 'recorded_at') {
                //         v = moment(v * 1000).format("MM-DD-YY HH:mm:ss")
                //         // console.log(v)
                //     }
                //     $("#custom_units tr[row='" + k + "'] [col='" + c + "']").html(v).effect("highlight", { color: 'blue' }, 600);
                // }
            }


        }
        // SetIcons()


        custom_units_table.draw()

        $.each(avl_evts.events, function (a, b) {
            //             console.log(b.i, b.d.t)
        })

        SetIcons()
    });


    socket.on('browser', function (c) {
        if (c == 'reload') {
            location.href = location.protocol + "//" + location.host + "?" + Math.random(1)
        }
    })



    socket.on('initialize', function (d) {
        console.log("SOCKET CONNECTION")
        console.log(d)
        // window.avl_unit = d.avl_unit;

        window.custom_template = d.template
        window.tokenlist = d.tokenlist
        window.currentaccount = d.currentaccount
        window.StatStorePort = d.StatStorePort
        window.serverStartTime = d.startTime;
        window.refreshTime = d.refreshTime;
        console.log("currentaccount:", currentaccount)
        console.log("Units Updated", custom_units)

        if (typeof d.browseruserPrivs !== 'undefined') {
            window.browseruserPrivs = d.browseruserPrivs.privs
        }
        $("#container, #StatChartDiv").remove()
        $("body").append(`<div id="container"></div>`)
        // $("body").append(`<div id="StatChartDiv"></div>`)
        $("#container").append(`<div id="status" class=defaultStyle></div>`)
        $("#container").append(`<div id="top" class=defaultStyle></div>`)
        $("#container").append(`<div id="right" class=defaultStyle></div>`)
        $("#account").remove()
        $("#status").append("<div id=account class='statusEl'>Current Account: " + tokenlist.operateAs + "</div>")

        $("#counter").remove()
        // counter()
        $("#top").append("<div class='navbuttons' id=logout>Logout</div>")
        $("#logout").on('click', function () {
            delete localStorage.nodeDashBoardLogin
            location.reload()
        })

        $.each(browseruserPrivs.access, function (a, b) {
            try {
                if (typeof b == 'string' && privs[b] !== 'undefined') {
                    privs[b]()
                }
            } catch (e) {
                console.log(e)
            }

        })
        buildTable()

        fetch_stored_list()


        $("#top").append("<div id=searchDiv class='BrokerdropDown'><label for=search class=navbuttons>Search<input type=text name=BrokerSearch id=BrokerSearch autocomplete='off'></label></div>")
        $("<div id=indicator></div>").appendTo("#top")
        $("#BrokerSearch").off('keyup').on('keyup', function (a, b) {
            searchString = $("#BrokerSearch").val()
            $("#custom_units tr").removeClass('ui-selected')
            if (searchString !== "*") {
                $.each(custom_units, function (a, b) {
                    if (b.nm.search(searchString) > -1) {
                        console.log(a)
                        $("#custom_units tr[row='" + a + "']").prependTo($("#custom_units tbody")).addClass('ui-selected')
                    }
                })
            }


            if (typeof searchTimout !== 'undefined') return
            window.searchTimout = setTimeout(function () {

                console.log("Performing Search", searchString)
                setCookie("searchString", searchString)
                if (searchString.length > 2 || searchString == "*") {

                    console.log("searching ", searchString)
                    socket.emit("getItem", { string: searchString.toLowerCase() }, function (d) {
                        window.SearchResult = d

                        $("#searchResults").remove()
                        $("#searchDiv").append("<div id='searchResults' class='dropDownContent'></div>")
                        $("#searchResults").append('<div   id=addAll>AddAll</div>')
                        $.each(SearchResult.custom_units, function (a, b) {
                            $("#searchResults").append('<div class=resultItem uid=' + a + '>' + b.nm + "  - " + b.ignition + '</div>')
                        })
                        $("#searchResults").show(200)
                        $(".resultItem").click(function () {
                            uid = $(this).attr("uid")
                            id = renumber(SearchResult.avl_unit, 'uid')[uid].id

                            custom_units[uid] = SearchResult.custom_units[uid]

                            avl_unit[id] = SearchResult.avl_unit[id]

                            if (typeof proxy !== 'undefined') {
                                proxy.custom_units = custom_units
                                proxy.avl_unit = avl_unit

                            }
                            console.log(custom_units, avl_unit)
                            buildTable()
                            $(this).remove()
                            savleLocalList()

                        })
                        // custom_units = d.custom_units
                        // avl_unit = d.avl_unit
                        $("#searchResults").on('mouseleave', function () {
                            window.searchResultHide = setTimeout(function () {
                                $("#searchResults").hide(200)
                                $("#custom_units tr").removeClass('ui-selected')
                                delete searchResultHide
                            }, 1000)
                        })
                        $("#searchResults").on('mouseover', function () {
                            if (typeof searchResultHide !== 'undefined') {
                                clearTimeout(searchResultHide)
                                delete searchResultHide
                            }
                        })
                        $("#addAll").on('click', function () {
                            custom_units = SearchResult.custom_units
                            if (typeof proxy !== 'undefined') {
                                proxy.custom_units = custom_units
                                proxy.avl_unit = avl_unit
                            }

                            avl_unit = SearchResult.avl_unit

                            buildTable()
                            $(".resultItem").remove()
                            savleLocalList()
                        })
                    })

                } else {
                    console.log("Search is Too Short, minimum 4 characters is required")
                }
                clearInterval(searchTimout)
                window.lastSearch = searchString
                delete searchTimout
            }, 2000)

        })
        $("#BrokerSearch").on('click', function () {
            if (typeof SearchResult == 'undefined') return
            $("#searchResults").show(50)
        })
        $("<div class='navbuttons' id=RemoveAll>Remove All</div>").appendTo("#top").on('click', function () {
            $.each(custom_units, function (uid, b) {
                delete custom_units[uid]
                id = renumber(avl_unit, 'uid')[uid].id
                delete avl_unit[id]
                $("#custom_units tr[row='" + uid + "']").remove()
            })

            savleLocalList()

        })
        columnMenu()

    });

    socket.on('monu', function (monu) {

        window.monu = monu
        units = []
        $.each(monu, function (a, b) {
            if (typeof avl_unit !== 'undefined' && typeof avl_unit[b] !== 'undefined' && typeof avl_unit[b].uid !== 'undefined') {
                units.push(avl_unit[b].uid)
            }
        })


    })

    socket.on('fromServer', function (d) {
        window.fromServer = d
        serverText = JSON.stringify(d.text)


        if (FromServer('startTime')) {
            var now = moment(new Date()); //todays date
            var serverStartTime = d.startTime
            var end = moment(serverStartTime); // another date
            var duration = moment.duration(now.diff(end));
            var hours = parseInt(duration.asHours());
            $("#status").html("Start Time:" + serverStartTime + " Elapsed Hours:" + hours)

        }
        if (FromServer('users')) {
            // Update Userlist
            $(".cuser").remove();
            //         console.log("Update Userlist", d.users)
            window.users = d.users
            $.each(d.users, function (a, b) {
                if (socket.id !== a) {
                    // $("#left").append("<div class=cuser chatuserid='" + a + "'>" + b.name + "</div>");
                }
                $("[chatuserid=" + a + "]").html(b.name)
            })
            // console.log("Last id", a)
            $(".cuser").unbind("click").bind("click", function () {
                $(".cuser").removeClass("active")
                $(this).addClass("active")
                setCookie("activeChatUser", $(this).attr("chatuserid"));
            })
            if (typeof readCookie("activeChatUser") !== "undefined") {
                $(".cuser[chatuserid='" + readCookie("activeChatUser") + "']").trigger("click")
            }

        }


        if (FromServer('text')) {
            console.log(d)
            window.transcript.push(d)
            renderMsg(d)
        }




        // console.log("Connected")

    });
    socket.on('connect_error', function (err) {
        console.log("Error")
        // $("#container").hide()
    });

    if (typeof readCookie('searchString') !== 'undefined' && readCookie('searchString') !== '') {
        $("#BrokerSearch").val(readCookie('searchString'))
    }
    socket.on('deviceCallback', function (d) {
        // console.log(d)
        storeMessageLog(d.uid, d)
        // console.table(deviceComLog)
    })
    socket.on('browserTrigger', function (d) { // To initiate Reload when device is updated
        console.log(d)
        fetch_stored_list()
    })





    socket.on('pastmessages', function (d) {
        window.pastmessages = d
        archive[pastmessages.uid].custom_events = pastmessages.custom_events
        archive[pastmessages.uid].avl_evts = pastmessages.avl_evts
        // console.log(d)
        makeChart(pastmessages.uid)
        // console.log(Object.size(pastmessages))
    })

    socket.on('browserUser', function (c) {
        console.log("browserUser", c.name)
        $("#logout").attr("title", "Logout:" + c.name)
        $(".navbuttons").tooltip()
    })
}



function processStats(d) {

    window.ServerStats = d
    $.each(ServerStats, function (a, b) {
        $("#stat_" + a).html(b)
    })
    if ($("#avgrt").length == 0) {
        $("#status").append(`<div id=avgrt class='statusEl'></div>`)
    } else {
        $("#avgrt").html(" Average Response time " + d.AverageResponseTime)
    }



}
function check_acl(type, uacl) {
    if (typeof itemFlags[type] == 'undefined') return;
    t = []
    for (var a = 0, l = itemFlags[type].length; a < l; a++) {
        var b = itemFlags[type][a];
        chk = uacl & b.id;
        if (chk === 0) {

        } else {
            t.push(b.n)
        }

    }



    return t;
}

function ApiQueryResponse(cmd, url) {
    // console.log(url)
    popwindow("displayAPI", "", "API call Command: " + cmd, function () {
        $("#displayAPI").html("<fieldset class='code'><legend>Query:</legend><div id='query'>" + url + "</div></fieldset><fieldset class='code'><legend>Response:</legend><div id='response'></div></fieldset>")
        $("#displayAPI").dialog({
            width: 600,
            height: 600,
            maxHeight: $(window).height() - 100
        })
        $.ajax({
            url: url, success: function (d) {
                console.log(d)
                var t = syntaxHighlight(d)
                $(this).html("<div id=query class='code'>" + url + "</div>")
                $("#response").html(t)
                $("#displayAPI").dialog({ height: 'auto' })
            }
        })
    })
}

function FromServer(d) {
    // console.log("checking", d);
    return (typeof fromServer[d] !== 'undefined' ? true : false);
}
function renderMsg(d) {
    $('#messages').append($('<div class="msgdiv ' + d.class + '" ><div class=ts>' + d.t + '</div><div class=user chatuserid="' + d.fromUser +
        '">' + users[d.fromUser].name + '</div><div class="msgtxt">' + d.text + '</div></div>'));

}
function renumber(obj, h) {
    var o = {};
    for (i in obj) {
        id = obj[i][h]
        o[id] = obj[i]
    }
    return o;
}
function post(d) {
    $.ajax({
        url: "http://final-lap.staging.ekar.io/",
        type: "post",
        data: {
            basic_auth_username: "admin",
            basic_auth_password: "3GBqx8nh9F0Nwz2L",
            api_host: "https://api.staging.ekar.io/",
            api_key: "yqsIUjn49d8yL2M7oiflG6CQWdL0DzVA61cWIBqv"
        },

        success: function (d) {
            console.log(d)
        }
    })

}
function getCombinations(valuesArray, f) {
    var combi = [];
    var temp = [];
    var slent = Math.pow(2, valuesArray.length);
    for (var i = 0; i < slent; i++) {
        temp = [];
        for (var j = 0; j < valuesArray.length; j++) {
            if ((i & Math.pow(2, j))) {
                temp.push(valuesArray[j]);
            }
        }
        if (temp.length > 0) {
            sum = temp.reduce(function (acc, val) { return acc + val; }, 0)
            combi.push(temp);
        }
    }
    combi.sort((a, b) => a.length - b.length);
    if (typeof f !== 'undefined') {
        f(combi)
    } else {
    }
    return combi;
}
function UpdateDoorStatusSensor(itemId, f) {
    var combinationArray = []
    $.each(itemFlags.teltonikaDoor340, function (a, b) {
        combinationArray.push(b.id)
    })
    console.log(combinationArray)
    getCombinations(combinationArray, function (d) {
        var sensorstateTable = {}
        for (var i = 1; i < d.length; i++) {
            v = d[i].reduce(function (acc, val) { return acc + val; }, 0)
            sensorstateTable[v] = check_acl('teltonikaDoor340', v)
        }
        console.log("Combination = ", i)
        console.log(JSON.stringify(sensorstateTable))
        paramsC = {
            "appear_in_popup": true,
            "show_time": false,
            "pos": 11,
            "cm": 1,
            "mu": "0",
            "act": 1,
            "text_params": 0,
            "uct": 0,
            "timeout": 0,
            "ci": sensorstateTable
        }

        svc = "unit/update_sensor";
        params = {
            "n": "Door Status",
            "t": "custom",
            "d": "",
            "m": "",
            "p": "io_90",
            "f": 0,
            "c": JSON.stringify(paramsC),
            "vt": 1,
            "vs": 0,
            "tbl": [],
            "id": 1,
            "itemId": itemId,
            "callMode": "update"
        }
        console.log(params)


    })


}



function columnMenu() {
    $("#columnmenu").remove();
    t = "<div id=columnmenu class='BrokerdropDown'>"
    t += "<div id=showHide class=navbuttons>Column Selector</div>"
    t += "<ul id=columnList class='dropDownContent'>"
    if (typeof localStorage.SelectedColumns !== 'undefined') {
        window.SelectedColumns = JSON.parse(localStorage.SelectedColumns)
    } else {
        window.SelectedColumns = []
    }

    for (a in custom_template) {
        b = custom_template[a]
        t += "<li class='colselect'>"
        if (SelectedColumns.indexOf(a) > -1) {
            checked = ' checked '
        } else {
            checked = '  '
        }
        // console.log(typeof SelectedColumns[a], a, checked)
        t += "<label for='col" + a + "'>";

        t += "<input type=checkbox name='columnselect' id='col" + a + "' " + checked + " ref='" + a + "'>"
        t += b.txt


        t += "</label></li>\n"
    }

    t += "</ul>"
    t += "</div>"
    $("#top").append(t)
    $("#showHide").bind('click', function () {
        $("#columnList").fadeToggle(200);
    });
    $(".colselect").bind('click', function () {
        SelectedColumns = [];
        $("input:checkbox:checked").each(function () {
            SelectedColumns.push($(this).attr('ref'));
        });
        console.log(SelectedColumns)
        localStorage.SelectedColumns = JSON.stringify(SelectedColumns)
        buildTable()
    })
    $("#columnList").off('mouseleave').on('mouseleave', function () {
        console.log("mouseleave")
        setTimeout(function () {
            $("#columnList").fadeOut(200)
        }, 500)
    })
}
function buildTable(fn) {
    var cols = {}
    if (typeof custom_template == 'undefined') return;
    $.each(custom_template, function (a, b) {
        if (typeof SelectedColumns !== 'undefined' && SelectedColumns.indexOf(a) > -1) {
            cols[a] = b
            cols[a].icon = "./css/" + a + ".png"
        }
    })
    if (Object.size(cols) == 0) {
        $.each(custom_template, function (a, b) {
            cols[a] = b
        })
    }
    for (a in custom_units) {


        if (typeof archive[a] == 'undefined') {
            archive[a] = { custom_events: [], avl_evts: [] }
        }



        u = custom_units[a]
        var recorded_at = moment(u.recorded_at * 1000)
        if (recorded_at.isValid()) {
            u.recorded_at = moment(u.recorded_at * 1000).format("MM-DD-YY HH:mm:ss")
        }
    }
    $("#right").html(table_builder('custom_units', cols, custom_units, 'device_id'));// Build the Table
    if (typeof custom_units_table !== 'undefined') {
        custom_units_table.destroy()
        delete custom_units_table
    }
    custom_units_table = $("#custom_units").DataTable({
        scrollResize: true,
        // scrollY: '75vh',
        // scrollCollapse: false,
        // paging: false,
        bSort: true,
        columnDefs: [
            { width: 160, targets: 0 },

        ],
        dom: "Rtsp",
        scrollY: '90vh',
        scrollCollapse: true,
        paging: false,
        autoWidth: true,
        stateSave: true,
        initComplete: function () {

        },
        drawCallback: function () {

        }
    });

    if (typeof browseruserPrivs.tablecommands !== 'undefined') {
        $("td[col=command]").each(function () {
            var uid = $(this).parent().attr('row')
            // console.log(uid)

            if (typeof renumber(avl_unit, 'uid')[uid] == 'undefined') return
            cmds = renumber(avl_unit, 'uid')[uid].cmds;
            // console.log(cmds)

            t = "<div class='icons' cmd='remove' uid='" + uid + "' title='Remove Unit'></div>"

            var apicmds = browseruserPrivs.tablecommands
            for (var i = 0; i < apicmds.length; i++) {
                c = apicmds[i]
                if (c == 'unitmsg') {
                    t += "<div class='ops icons' cmd='unitmsg' uid='" + uid + "' title='Get Unit Messages'></div>"
                } else {
                    if (typeof renumber(cmds, 'n')[c] !== 'undefined') t += "<div class='ops icons' cmd='" + c + "' uid='" + uid + "' title='" + c + "'></div>";
                }

            }

            $(this).html(t)
            $(".icons").tooltip()
        })

    }



    SetIcons()
    if (typeof fn !== 'undefined') fn()
    CleanUp()

}
function GetHW() {
    exec('core/get_hw_types', { "includeType": true }, function (d) {
        console.log(renumber(d, 'id'))

    })
}
function getItem(id) {
    socket.emit('getItem', { id: id }, function (d) {

    });

}
function exec(svc, params, f) {
    socket.emit("wq", { svc: svc, params: params }, function (d) {
        f(d)
    })

}
function selectAll() {
    $(".ui-selectee").addClass('ui-selected')
    r = $('#custom_units').find(".ui-selected").map(function () {
        return $(this).attr('row');
    }).get();
    window.selectedUnits = r
    localStorage.selectedUnits = JSON.stringify(selectedUnits)
    // buildAPIlaunchBtns(selectedUnits)


}


function fuelCharts() {
    $("<div id='chart'>").dialog({

        width: $(window).width() - 50,
        height: $(window).height() - 50,
        title: "Chart",
        show: "fadeIn",
        hide: "fadeOut",
        close: function () {
            $(this).remove()
        },
        resizable: true,
        buttons: [{
            text: "ok",
            id: "pop_ok",
            click: function () {
                $(this).dialog("close");
            }
        }, {
            text: "close",
            id: "pop_close",
            click: function () {
                $(this).dialog("close");
            }
        }],

        open: function () {
            $(this).html("<div id=curve_chart></div>");
            $(this).dialog({ position: 'top' });

            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Year', 'Sales', 'Expenses'],
                    ['2004', 1000, 400],
                    ['2005', 1170, 460],
                    ['2006', 660, 1120],
                    ['2007', 1030, 540]
                ]);
                var options = {
                    title: 'Company Performance',
                    curveType: 'function',
                    //                     legend: { position: 'bottom' }
                    'width': "100%",
                    'height': "100%",
                    'chartArea': { 'width': '100%', 'height': '80%' },
                };
                var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
                chart.draw(data, options);
            }
            google.charts.setOnLoadCallback(drawChart);
        }
    })

}




function sequentialMessage(f) {
    window.msgstore = {}
    msgunits = []
    // $.each(avl_unit, function (a, b) {
    //     if (selectedUnits.includes(b.uid)) {
    //         msgunits.push(a)
    //     }
    // })

    for (a in avl_unit) {
        b = avl_unit[a]
        if (selectedUnits.includes(b.uid)) {
            msgunits.push(a)
        }
    }
    //     console.log(msgunits)
    function GetUnitMessage(i) {
        // console.log(msgunits.length, i)
        var id = msgunits[i]
        svc = 'render/create_messages_layer'
        from = moment().subtract(12, 'hours').format("X")
        to = moment().format("X")
        params =
        {
            "layerName": "messages",
            "itemId": id,
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
        exec(svc, params, function (d) {
            if (typeof d.units == 'undefined') return
            console.log(d.units[0].msgs.count)
            exec('render/get_messages', {
                "layerName": "messages",
                "indexFrom": 0,
                "indexTo": d.units[0].msgs.count,
                "unitId": id
            }, function (d) {
                if (i < msgunits.length - 1) {
                    msgstore[id] = d
                    console.log(d, msgunits.length)
                    GetUnitMessage(++i)
                } else {
                    console.log(msgstore)
                    if (typeof f !== 'undefined') {
                        f()
                    }
                }
            })


        })
    }
    GetUnitMessage(0)
}


function doHeatMap(f) {
    heatmapData = [];
    if (typeof heatMap !== 'undefined') {
        heatMap.remove()
    }
    for (i in msgstore) {
        var b = msgstore[i];
        console.log(b)
        for (k in b) {
            var v = b[k];
            if (v.pos !== null && typeof v.pos !== 'undefined' && v.p.hdop !== 'undefined') {
                heatmapData.push([v.pos.y, v.pos.x, v.p.hdop])
            }
        }
    }
    console.log(heatmapData)
    window.heatMap = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);
}

function floatMap(f) {
    if ($("#mapDialog").length == 0) {
        $("<div id=mapDialog>").dialog({
            title: "Map",
            width: $(window).width() - 20,
            height: $(window).height() - 20,
            show: {
                effect: 'fadeIn',
                complete: function () {
                    console.log("Opened")
                }
            },
            hide: "fadeOut",
            close: function () { // $(this).dialog('destroy').remove()
            },
            open: function () {
                if (typeof map === 'undefined') {
                    $(this).html("<div id=map >");

                    $("#map").appendTo($("#mapDialog"))
                    $("#map").html("")
                    $("#map").css({
                        width: "100%",
                        background: "#aaa",
                        height: "100%"
                    })
                    //Here Maps Key ehHIG9UA1r7IkQeh3vCx
                    YOUR_BING_API_KEY = "AmDPK5s3hyoq8991Lbsr_9Pw0DXe_in8m0AyJdm9s9djTKy9oZYzxuq7M034dCsV";
                    window.map = new L.Map('map', { center: new L.LatLng(24, 55), zoom: 10 });
                    var bing = new L.BingLayer(YOUR_BING_API_KEY);
                    map.addLayer(bing);
                    if (typeof f !== 'undefined') {
                        f()
                    }

                }
            }
        })
    } else {
        $("#mapDialog").dialog('open')

        if (typeof f !== 'undefined') {
            f()
        }
    }

}

function counter() {

}







function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function crash() {
    socket.emit("exit", {}, function (d) {

    })
}




function AddTestUnit() {
    var uniqueId = new Date() * 1 + "" + parseInt(Math.random(1) * 10);
    exec('core/create_unit', { "creatorId": browseruserPrivs.loginData.userid, "name": "EKAR_test_Unit " + uniqueId, "hwTypeId": "62", "dataFlags": 1 }, function (d) {
        var itemId = d.item.id
        if (typeof TestUnits == 'undefined') {
            window.TestUnits = []
        }
        TestUnits.push(d.item.id)
        itemId = TestUnits[TestUnits.length - 1]

        var batch = [
            { "svc": "unit/update_device_type", "params": { "itemId": itemId, "deviceTypeId": "62", "uniqueId": uniqueId } },
            { "svc": "unit/update_unique_id2", "params": { "itemId": itemId, "uniqueId2": "" } },
            { "svc": "unit/update_access_password", "params": { "itemId": itemId, "accessPassword": "" } },
            { "svc": "unit/update_phone", "params": { "itemId": itemId, "phoneNumber": "" } },
            { "svc": "unit/update_phone2", "params": { "itemId": itemId, "phoneNumber": "" } },
            { "svc": "unit/update_mileage_counter", "params": { "itemId": itemId, "newValue": 0 } },
            { "svc": "unit/update_eh_counter", "params": { "itemId": itemId, "newValue": 0 } },
            { "svc": "unit/update_traffic_counter", "params": { "itemId": itemId, "newValue": 0, "regReset": 0 } },
            { "svc": "unit/update_calc_flags", "params": { "itemId": itemId, "newValue": 16 } },
            { "svc": "unit/update_hw_params", "params": { "itemId": itemId, "hwId": "62", "params_data": { "reset_all": 1, "params": [], "full_data": 0 }, "action": "set" } },

            { "svc": "unit/update_fuel_rates_params", "params": { "itemId": itemId, "idlingSummer": 0, "idlingWinter": 0, "consSummer": 10, "consWinter": 12, "winterMonthFrom": 11, "winterDayFrom": 1, "winterMonthTo": 1, "winterDayTo": 29 } },
            { "svc": "unit/update_sensor", "params": { "n": "Ignition", "t": "engine operation", "d": "", "m": "On/Off", "p": "io_1", "f": 0, "c": "{\"appear_in_popup\":true,\"show_time\":false,\"pos\":1,\"cm\":1,\"validate_driver_unbound\":0,\"unbound_code\":\"\",\"mu\":\"0\",\"act\":1,\"uct\":0,\"timeout\":0,\"ci\":{},\"consumption\":0}", "vt": 1, "vs": 0, "tbl": [], "id": 0, "itemId": itemId, "callMode": "create" } },
            { "svc": "unit/update_trip_detector", "params": { "itemId": itemId, "type": 3, "gpsCorrection": true, "minSat": 2, "minMovingSpeed": 1, "minStayTime": 300, "maxMessagesDistance": 10000, "minTripTime": 60, "minTripDistance": 100 } }
        ]

        exec('core/batch', batch, function (d) {
            console.log("ADDED UNIT: ", itemId)
            console.table(TestUnits)
        })
    })

}
function deleteTestUnits() {

    batch = []
    $.each(avl_unit, function (a, b) {
        if (b.nm.search("EKAR_test_Unit") > -1) {
            batch.push({ "svc": "item/delete_item", params: { "itemId": b.id } })
        }
    })
    console.log(batch)
    exec('core/batch', batch, function (d) {
        console.log(d)
    })

}










function fetch_stored_list() {
    if (typeof localStorage.broker_units !== 'undefined' && Object.size(JSON.parse(localStorage.broker_units)) > 0) {
        var lsbu = JSON.parse(localStorage.broker_units)
        if (typeof lsbu[tokenlist.operateAs] === 'undefined') {
            lsbu[tokenlist.operateAs]
        }

        socket.emit("getItem", { string: lsbu[tokenlist.operateAs] }, function (d) {
            window.SearchResult = d
            custom_units = SearchResult.custom_units
            if (typeof proxy !== 'undefined') {
                proxy.custom_units = custom_units
                proxy.avl_unit = avl_unit
            }

            avl_unit = SearchResult.avl_unit

            buildTable()


        })
    }
}

function storeMessageLog(id, d) {
    // console.log(id)
    if (typeof window.deviceComLog == 'undefined') {
        window.deviceComLog = {}
    }
    if (typeof deviceComLog[id] == 'undefined') {
        deviceComLog[id] = []
    }
    deviceComLog[id].push(d)
    // console.table(deviceComLog)
}

function CheckUnits() {
    function getSensor(u, s) {
        if (typeof u.sens !== 'undefined' &&
            typeof u.prms !== 'undefined' &&
            typeof renumber(u.sens, 'n')[s] !== 'undefined'
        ) {

            $.each(u.prms, function (sk, sv) {
                window[sk] = sv.v
            })

            if (typeof renumber(u.sens, 'n')[s].p !== 'undefined') {
                p = renumber(u.sens, 'n')[s].p.replace("const", "")

                try {
                    if (typeof eval(p) == 'undefined') {
                        console.table(u.nm, s)
                        console.table(renumber(u.sens, 'n')[s])
                        console.table(u.prms)

                        return { e: "SENSOR ERROR " + " UNIT " + u.nm + " " + renumber(u.sens, 'n')[s].p + " value unavailable", t: renumber(u.sens, 'n')[s].n }
                    } else {
                        return { v: eval(p), t: renumber(u.sens, 'n')[s].n }
                    }


                } catch (e) { console.log(e) }

            } else {
                return 0
            }
        } else {


            return 0
        }
        //  console.log(p)
    }
    $.each(custom_template, function (k, v) {
        if (typeof v.opath == 'undefined' && k !== 'command' && k !== 'provider')
            $.each(avl_unit, function (a, b) {
                $cell = $("#custom_units tr[row='" + b.uid + "'] td[col='" + k + "']");
                if (typeof getSensor(b, k) !== 'undefined') {
                    if (k == "Ignition") {
                        console.log(getSensor(b, k))
                        if (getSensor(b, k).v == 1) {
                            //                             $cell.css({ "background": "green" }).html("on")
                        } else {
                            //                             $cell.css({ "background": "red" }).html("off")
                        }
                    }

                } else {
                    console.log(getSensor(b, k))
                }


            })

    })


}

function SetIcons() {
    $(".ops").off('click').on('click', function () {
        var cmd = $(this).attr('cmd')
        var uid = $(this).attr('uid')

        // console.log(cmds)
        if (cmd == 'unitmsg') {
            from = moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss")
            to = moment().format("YYYY-MM-DD HH:mm:ss")
            url = location.href + '?params={"id":' + uid + ',"from":"' + from + '","to":"' + to + '"}&svc=get_messages&sid=' + sid
            ApiQueryResponse(cmd, url)
        } else {
            // cmds[fn].fn(uid)
            url = location.href + '?params={"id":' + uid + ',"commandName":"' + cmd + '"}&svc=exec_cmd&sid=' + sid
            ApiQueryResponse(cmd, url)
        }
    })
    $(".icons[cmd='remove']").off('click').on('click', function () {

        var uid = $(this).attr('uid')
        delete custom_units[uid]
        id = renumber(avl_unit, 'uid')[uid].id
        delete avl_unit[id]
        $("#custom_units tr[row='" + uid + "']").remove()
        savleLocalList()

    })
    $(".thicon").tooltip()

    if (typeof custom_template == 'undefined') return
    $.each(custom_template, function (x, y) {
        $.each(custom_units, function (a, b) {
            var v = b[y.path]
            $cell = $("#custom_units tr[row='" + a + "'] td[col='" + x + "']");
            if (x == "Ignition") {
                if (v == 1) {
                    $cell.css({ "background": "green" }).html("on")
                } else {
                    $cell.css({ "background": "red" }).html("off")
                }
            }
            if (x == "Door Status") {
                $cell.html("<img src='css/door_status_base.svg' class=doorStatus>")
                if (v > 0) {
                    // $cell.append(check_acl('teltonikaDoor340', v))
                    $.each(check_acl('teltonikaDoor340', v), function (imkk, imgurl) {
                        $cell.append("<img src='css/door_status_" + imgurl + ".svg' class=doorStatus>\n")
                    })
                }
            }
            if (x == "direction") {
                // console.log(x, a, v)
                // console.log("#custom_units tr[row='" + a + "'] td[col='" + x + "']")
                $cell.html("<div class='diricon' title='" + v + "'></div>")
                $("#custom_units tr[row='" + a + "'] td[col='" + x + "'] .diricon").css({ "-webkit-transform": "rotate(" + v + "deg)" })
                // $cell.html("on")
            }
            if (x == "Fuel Level" && typeof renumber(avl_unit, 'uid')[a] !== 'undefined') {
                unitsens = renumber(avl_unit, 'uid')[a].sens
                if (typeof unitsens !== 'undefined'
                    && typeof renumber(unitsens, 'n')[x] !== 'undefined'
                    && renumber(unitsens, 'n')[x].tbl.length > 0
                ) {
                    tank = renumber(unitsens, 'n')['Fuel Level'].tbl[0].a
                    // console.log("tank ", tank * 100, v)
                }
            }


        })
    })

}




function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


function doGraphs(from, to) {
    selectedIds = Object.keys(renumber(custom_units, 'wid'))
    from = moment(new Date(from)).local().format("X");
    to = moment(new Date(to)).local().format("X");
    console.log(from, to)
    var fromX = from, toX = to;
    $("#charts").remove()
    $("<div id=charts>").appendTo("body")
    $.each(custom_units, function (uid, b) {
        // console.log(uid)
        var chartDiv = 'chart_' + uid
        $("#charts").append("<div class=chartRow id=" + chartDiv + ">Loading...</div>")
    })
    var chartHeight = parseInt(($("#charts").height() - (Object.size(custom_units) * 6)) / Object.size(custom_units))
    $(".chartRow").height(chartHeight)
    socket.emit('GetMessages', {
        selectedIds: selectedIds, from: fromX, to: toX,
    }, function (d) {
        // window.payload = d
        // makeChart()

    })

    $(window).on('resize', function () {
        $.each(custom_units, function (uid, b) {
            if (typeof b.LineChart !== 'undefined') {
                makeChart(uid)
            }
        })

    })
}
function getData(uid) {
    var rows = []
    var custom_evts = archive[uid].custom_events
    var avl_evts = archive[uid].avl_evts
    $.each(custom_evts, function (a, b) {
        var evt = avl_evts[a]
        var date = moment(b.recorded_at * 1000)
        dateTime = new Date(date)
        if (typeof evt.p.io_87 === 'undefined') {
            p = 0
        } else {
            p = evt.p.io_87 * 0.001
        }

        row = [dateTime, b.mileage]
        rows.push(row)
    })
    return rows
}

// doGraphs(Object.keys(renumber(custom_units,'wid')), ['io_87'], '2021 February 15 10:00', '2021 February 15 10:59:00')

function makeChart(uid) {

    google.charts.load('current', { 'packages': ['corechart'] });
    var u = custom_units[uid]
    chartDiv = 'chart_' + uid
    u.LineChart = new google.visualization.LineChart(document.getElementById(chartDiv));
    u.ChartData = new google.visualization.DataTable();
    u.ChartData.addColumn('date', 'date time');
    u.ChartData.addColumn('number', 'Updates');

    u.ChartData.addRows(getData(uid));
    console.log(uid)
    $("#toggleChart").remove()
    $("<div id='toggleChart' class='navbuttons'>Show List</div>").appendTo("#top")
    $("#toggleChart").off('click').on('click', function () {
        $("#charts").toggle({
            duration: 210,
            complete: function (a, d) {
                if ($(this).is(":visible")) {
                    $("#toggleChart").html("Show List")
                } else {
                    $("#toggleChart").html("Show Chart")

                }
            }
        });
    })

    var options = {
        width: '95%',
        height: '95%',
        legend: 'none',
        animation: {
            duration: 1000,
            easing: 'in'
        },
        chartArea: {
            left: 50,
            right: 50,
            top: 20,

            width: '80%',
            height: '80%',
        },

        hAxis: {
            title: 'Intervals'
        },
        vAxis: {
            title: u.nm
        }
    };
    u.LineChart.draw(u.ChartData, options)
    // })
}

function testMileage(uid) {
    // uid = 359632108012524
    console.log(custom_units[uid].nm)
    cevts = archive[uid].custom_events
    aevts = archive[uid].avl_evts
    console.log(cevts.length, aevts.length)
    for (i = 0, l = cevts.length; i < l; i++) {
        te = cevts[i]
        if (i > 0) {
            pe = cevts[i - 1]
            if (te.mileage < pe.mileage) {

                console.log(uid, i - 1, moment(aevts[i - 1].t * 1000).format("DD MMM YYYY hh:mm:ss"), pe.mileage, "Next Mileage:", te.mileage, aevts[i - 1].t, aevts[i].t)
                // console.log(uid, i, te.mileage, aevts[i].t)
                // console.log(uid, i + 1, te.mileage, aevts[i + 1].t)
            } else {
            }

        }
    }

}





function CleanUp() {
    $("[style='position: absolute; display: none;']").remove()
    $(".ui-helper-hidden-accessible").remove()
}


function beep() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function MessageTable() {
    // doGraphs('2021 February 23 10:00', '2021 February 23 16:15')
    console.log(pastmessages.avl_evts.length)
    console.log(pastmessages.custom_events.length)
    $.each(pastmessages.custom_events, function (a, b) {
        evts = pastmessages.avl_evts[a]
        cvts = pastmessages.custom_events[a]
        b.time = moment(cvts.recorded_at * 1000).format("YYYY DD MMM HH:mm:ss")
        console.log(moment(evts.t * 1000).format("YYYY DD MMM HH:mm:ss"), cvts.mileage, moment(cvts.recorded_at * 1000).format("YYYY DD MMM HH:mm:ss"))
    })

    t = table_builder("messages", {
        1: { txt: "time", path: "time" },
        2: { txt: "mileage", path: "mileage" },

    }, pastmessages.custom_events)
    popwindow("MessageTableDiv", t, "Messages", function () {

        if (typeof Message_table !== 'undefined') {
            Message_table.destroy()
            Message_table = undefined
        }


        window.Message_table = $("#messages").DataTable({
            scrollResize: true,
            // scrollY: '75vh',
            // scrollCollapse: false,
            // paging: false,
            bSort: true,
            columnDefs: [
                { width: 160, targets: 0 },

            ],
            dom: "Rtsp",
            scrollY: '90vh',
            scrollCollapse: true,
            paging: false,
            autoWidth: true,
            stateSave: true,
            initComplete: function () {

            },
            drawCallback: function () {

            }
        });

    })
}
// doGraphs('2021 February 23 10:00', '2021 February 23 16:15')



function getDelays() {
    $.each(statData, function (a, b) {
        if (a > 0) {
            p = statData[a - 1]
            delay = b.t - p.t
            if (delay > 5) {
                console.log(moment(b.t * 1000).format("YYYY-MM-DD HH:mm:ss"), delay)
            }

        }

    })
}