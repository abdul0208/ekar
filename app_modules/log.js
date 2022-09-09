global.moment = require('moment');
module.exports = {
    log: (function (undefined) {
        var Log = Error; // does this do anything?  proper inheritance...?
        Log.prototype.write = function (args) {
            // via @fredrik SO trace suggestion; wrapping in special construct so it stands out
            var suffix = (this.lineNumber
                ? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
                : extractLineNumberFromStack(this.stack)
            );
            args = [suffix].concat(args);
            // via @paulirish console wrapper
            if (console && console.log) {
                if (console.log.apply) { console.log.apply(console, args); } else { console.log(args); } // nicer display in some browsers
            }
        };
        var extractLineNumberFromStack = function (stack) {
            if (!stack) return '?'; // fix undefined issue reported by @sigod
            var line = stack.split('\n')[2];
            line = (line.indexOf(' (') >= 0
                ? line.split(' (')[1].substring(0, line.length - 1)
                : line.split('at ')[1]
            );

            d = moment().format("MMM DD hh:mm:ss")

            return d + " " + line;
        };

        return function (params) {
            if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;


            Log().write(Array.prototype.slice.call(arguments, 0)); // turn into proper array
        };//--  fn  returned

    })()
}