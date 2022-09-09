global.sendResponse = function (req, res) {
    // _log("0")
    var options = {
        root: path.join(__dirname, '../web'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    if (Object.size(req.query) > 0) {
        requestHandler(req, res);
    } else {
        var fileName = req.path
        // _log(req.params[0])
        res.sendFile(req.params[0], options, function (err) {
            if (err) {
                _log(err)
            } else {
                // _log('Sent:', fileName)
            }
        })
    }


}

