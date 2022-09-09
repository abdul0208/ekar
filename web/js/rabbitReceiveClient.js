var custom_template = {
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
window.socket = io();
$(document).ready(function () {
    $("body").html("<div id=Qcontent>")
    t = "<table id=custom_units>"

    t += "<thead>"
    t += "<tr>"
    $.each(custom_template, function (a, b) {
        if (typeof b.path !== 'undefined') {
            t += "<th>"
            t += b.path
            t += "</th>\n"
        }
    })

    t += "</tr>"
    t += "</thead>"
    t += "<tbody>"
    t += "</tbody>"
    t += "</table>"
    $("#Qcontent").html(t)
    makeDT()
    socket.on('connect', function (msg) { // TIP: you can avoid listening on `connect` and listen on events directly too!
        console.log("Connected")
    });

    socket.on('RabbitQue', function (d) { // TIP: you can avoid listening on `connect` and listen on events directly too!
        window.msgs = d
        row = []
        $.each(custom_template, function (a, b) {
            if (typeof b.path !== 'undefined') {
                if (typeof msgs[Object.keys(msgs)][b.path] !== 'undefined') {
                    t += msgs[Object.keys(msgs)][b.path]
                    row.push(msgs[Object.keys(msgs)][b.path])
                } else {
                    row.push("")
                }
            }
        })
        QmessagesDT.row.add(row).draw()
        Analyse()
    });
})


function makeDT() {
    if (typeof QmessagesDT !== 'undefined') {
        QmessagesDT.destroy()
        QmessagesDT = undefined
    }
    window.QmessagesDT = $("#custom_units").DataTable({
        scrollResize: true,
        // scrollY: '75vh',
        // scrollCollapse: false,
        // paging: false,
        bSort: true,
        columnDefs: [
            { width: 160, targets: 0 },

        ],
        // dom: "Rtsp",
        dom: "Bft",
        autoWidth: true,
        buttons: ['copy', 'csv', 'excel'],
        scrollY: '90vh',
        scrollCollapse: true,
        paging: false,

        stateSave: true,
        initComplete: function () {

        },
        drawCallback: function () {

        }
    });
}


function exportData() {
    t = ""
    $.each(custom_template, function (a, b) {
        if (a !== 'command')
            t += a + "\t"
    })
    t += "\n\n"
    $.each(QmessagesDT.rows().data(), function (a, b) {
        $.each(b, function (c, d) {
            t += d + "\t"
        })
        t += "\n"
    })
    console.log(t)
}

function Analyse() {
    unitmsgs = {}
    if (typeof QmessagesDT == 'undefined') return
    $.each(QmessagesDT.rows().data(), function (a, b) {
        if (typeof unitmsgs[b[2]] == 'undefined') {
            unitmsgs[b[2]] = []
        }
        unitmsgs[b[2]].push({ recorded_at: moment(b[0] * 1000).format("MM DD hh:mm:ss"), nm: b[4], mileage: Number(b[12]) })
    })
    // console.log(unitmsgs)
    $.each(unitmsgs, function (a, b) {
        $.each(b, function (c, d) {
            if (c > 0) {
                pd = b[c - 1]

                if (d.mileage < pd.mileage) {
                    console.log(d.recorded_at, d.nm, "d", d.mileage, "pd", pd.mileage)
                }
            }
        })
    })
}