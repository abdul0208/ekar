$(document).ready(function () {
    window.socket = io();
    YOUR_BING_API_KEY = "AmDPK5s3hyoq8991Lbsr_9Pw0DXe_in8m0AyJdm9s9djTKy9oZYzxuq7M034dCsV";
    window.map = new L.Map('map', { center: new L.LatLng(24, 55), zoom: 10 });
    var bing = new L.BingLayer(YOUR_BING_API_KEY);
    map.addLayer(bing);
    if (typeof f !== 'undefined') {
        f()
    }
    map.on('click', onMapClick);
    if (typeof localStorage.params !== 'undefined') {
        window.params = JSON.parse(localStorage.params)
        placeMarker(params.pos)

        map.setView(params.pos, params.zoom)
    }

})


function onMapClick(e) {

    placeMarker(e.latlng)
    window.heading = 0
    window.distance = 0
    window.velocity = 0
    if (typeof params !== 'undefined') {
        heading = Math.abs(L.GeometryUtil.bearing(params.pos, e.latlng))
        distance = L.GeometryUtil.distance(map, params.pos, e.latlng)
        duration = parseInt(new Date() / 1000) - params.unixtime
        velocity = distance / duration
        console.log("duratioin", duration, "distance:", distance, "velocity:", velocity)
    }
    window.pos = e.latlng
    // console.log(pos)

    NMEApos = latLngtoNMEA(e.latlng.lat, e.latlng.lng)
    // console.log(e.latlng.lat + "\t" + e.latlng.lng)
    map.addLayer(marker);
    var date = moment().utc().format("DDMMYY")
    var time = moment().utc().format("HHmmss");
    //#SD#230920;135921;2506.72000;N;05007.40736;E;55;2;400;4
    params = {}
    params.pos = pos
    params.unixtime = parseInt(new Date() / 1000)
    params.distance = distance
    params.date = date
    params.zoom = map.getZoom()
    params.time = time
    params.heading = heading
    params.velocity = velocity
    localStorage.params = JSON.stringify(params);

    msg = "#SD#" + date + ";" + time + ";" + NMEApos + ";" + velocity + ";" + heading + ";5;15\r\n";
    // console.log(msg)
    socket.emit('pos', msg, function (d) {
        console.log(d)
    })

};

function placeMarker(pos) {
    if (typeof marker !== 'undefined') {
        marker.remove()
    }
    window.marker = new L.marker(pos, { draggable: 'true' }).addTo(map);
    marker.on('dragend', function (event) {
        var marker = event.target;
        var position = marker.getLatLng();
        marker.setLatLng(new L.LatLng(position.lat, position.lng), { draggable: 'true' });
        map.panTo(new L.LatLng(position.lat, position.lng))
    });
    marker.setLatLng(pos, { draggable: 'true' });
    map.panTo(pos)
}

function latLngtoNMEA(lat, lng) {
    // lat = -56.529176
    // lng = -33.386666

    if (lat < 0) {
        xp = "S"
    } else {
        xp = "N"
    }
    if (lat < 0) {
        yp = "W"
    } else {
        yp = "E"
    }

    xDD = Math.abs(parseInt(lat))
    xMM = (Math.abs((lat % 1)) * 60).toFixed(5)


    yDD = Math.abs(parseInt(lng))
    yMM = (Math.abs((lng % 1)) * 60).toFixed(5)
    if (yDD.length < 2) {
        console.log(yDD.length)
    }

    r = xDD + "" + xMM + ";" + xp + ";" + "0" + yDD + "" + yMM + ";" + yp
    return r
}
latLngtoNMEA()