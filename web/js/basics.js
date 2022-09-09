var active_sort_data = {};

function setCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays == null || nDays == 0) nDays = 1;
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) +
        ";expires=" + expire.toGMTString() + '/; samesite=strict';

};

function readCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
};
var Loader = function () { }
Loader.prototype = {
    require: function (scripts, callback) {
        this.loadCount = 0;
        this.totalRequired = scripts.length;
        this.callback = callback;

        for (var i = 0; i < scripts.length; i++) {
            this.writeScript(scripts[i]);
        }
    },
    loaded: function (evt) {
        this.loadCount++;

        if (this.loadCount == this.totalRequired && typeof this.callback == 'function') this.callback.call();
    },
    writeScript: function (src) {
        var self = this;
        var s = document.createElement('script');
        s.type = "text/javascript";
        s.async = true;
        s.src = src;
        s.addEventListener('load', function (e) { self.loaded(e); }, false);
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    }
}


Array.prototype.getUnique = function () {
    var u = {},
        a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};

$(document).ready(function () {


    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    }

    $.fn.sortElements = (function () {
        var sort = [].sort;
        return function (comparator, getSortable) {
            getSortable = getSortable || function () {
                return this;
            };
            var placements = this.map(function () {
                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling);
                return function () {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another.");
                    }
                    parentNode.insertBefore(this, nextSibling);
                    parentNode.removeChild(nextSibling);
                };

            });

            return sort.call(this, comparator).each(function (i) {
                placements[i].call(getSortable.call(this));
            });

        };

    })();

    window.sb_width = getScrollBarWidth();
    window.sb_width = 0;

})
var sPositions = localStorage.positions || "{}",
    positions = JSON.parse(sPositions);

function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

renumber = function (obj, h) {
    var o = {};
    $.each(obj, function (k, v) {
        v[h];
        o[v[h]] = v;
    });
    return o;
}
function fixheader(fht, footer, f) {
    // Exsample:
    //     footer = {
    //         fht: 50,
    //         fhw: 400,
    //         c: "<button>do nothing</button>"
    //     }


    window.current_table = fht;
    if (footer) {
        window[fht + "_footer"] = footer
    }
    if (typeof window[fht + "_footer"] != 'undefined') {
        footer = window[fht + "_footer"];
    }

    if ($("#" + fht + " th").length == 0) {
        return
    }
    killfixheader(fht)
    var ph = parseInt($("#" + fht).parent().height())
    var pw = parseInt($("#" + fht).parent().width())
    var ot = $("#" + fht).position().top
    var ol = parseInt($("#" + fht).offset().left - $("#" + fht).parent().offset().left)
    var head_h_offset = $("#" + fht + " thead").height()
    var head_h_offset = $("#" + fht).parent().parent().find(" .fixed_header").height()
    $("#" + fht).css({
        width: $("#" + fht).parent().width()
    })
    $("#" + fht).parent().find('.fh_wrapper').remove()
    $("#" + fht).addClass('fixbody')
    $("#" + fht).parent().prepend("<div class=fh_wrapper>")

    //     var top = (ot + head_h_offset);
    // console.log("top", top);
    $("#" + fht).parent().find(" .fh_wrapper").css({
        // top: top,
        //left:ol,
        background: "rgba(102, 102, 102, 0.19)",
        position: 'absolute',
        "overflow-y": "auto",
        "overflow-x": "hidden",
        width: pw,
        bottom: 0,
        //        height: ph-(ot+head_h_offset)
    })
    $parent = $("#" + fht).parent().find(".fh_wrapper");
    $("#" + fht).appendTo($parent)
    $("#" + fht).parent().parent().append("<table class='fixed_header sortable' ref=" + fht + ">")
    $("#" + fht).parent().parent().find('.fixed_header').css({
        position: 'absolute',
        top: ot,
        //left:ol,
        width: pw
    })
    if ($("#" + fht).parent().parent().find(".fh_wrapper").hasScrollBar()) {
        var this_sb_width = sb_width
    } else {
        var this_sb_width = 0
    }
    $("#" + fht).css({
        width: pw - this_sb_width
    })
    cthead = $("#" + fht + " thead").clone()
    $("#" + fht).parent().parent().find('.fixed_header').append(cthead)
    var w = []
    $("#" + fht + " tr:first-child td").each(function (k, v) {
        w.push($(this).width())
    })
    head_c = $("#" + fht).parent().parent().find(" .fixed_header th").length
    $("#" + fht + " tbody tr").each(function (k, v) {
        $(this).find('td').each(function (kk, vv) {
            $(this).width(w[kk])
        })
    })
    $("#" + fht).parent().parent().find(" .fixed_header th").each(function (k, v) {
        if (k == w.length - 1) {
            $(this).width(w[k] + this_sb_width)
        } else {
            $(this).width(w[k])
        }
    })
    $("#" + fht).css({
        width: pw - this_sb_width
    })
    var top_offset = $("#" + fht).parent().parent().find(".fixed_header").position().top + $("#" + fht).parent().parent().find(" .fixed_header").height()

    $("#" + fht).parent().parent().find(".fh_wrapper").css({
        top: $("#" + fht).parent().parent().find(".fixed_header").position().top + $("#" + fht).parent().parent().find(" .fixed_header").height(),
        height: ($("#" + current_table).closest(".fh_wrapper").height() >
            $("#" + current_table).height()) ? $("#" + current_table).height() : "inherit"

    })
    $("#" + fht + " thead").hide()
    var table = $('#' + fht);
    $('.fixed_header thead [sortcol]').each(function () {
        var th = $(this),
            thIndex = th.index()

        th.unbind('click').bind("click", function () {
            dir = $(this).attr('dir')
            if (dir == 'asc') {
                header_sort(table, th.attr('sortcol'), true, thIndex)
                $(this).attr('dir', 'desc')
            } else {
                header_sort(table, th.attr('sortcol'), false, thIndex)
                $(this).attr('dir', 'asc')
            }

            console.log(table, th.attr('sortcol'), dir, thIndex)

        })
    });
    $(".fh_wrapper").on("scrollstart", function () {
        epause = 1
    });
    $(".fh_wrapper").on("scrollstop", function () {
        epause = 0
    });

    active_sort = undefined
    $(".fixed_header th, .fixbody td").css({
        'font-size': '12px'
    })
    $(".fixbody, .fixed_header").css({
        'border-collapse': 'collapse'
    })
    $(".uarr, .darr").css({
        'float': 'right',
        "color": "#4a7081"
    })
    var header = $("#" + fht).parent().parent().find(".fixed_header")
    var table = $("#" + fht).parent().parent().find(".fh_wrapper")

    $(table).position({
        my: "top",
        at: 'bottom',
        of: header,
        collision: "fit"
    });





    // tHeight = $("#" + current_table).height()
    // wHeight = $("#" + current_table).closest(".fh_wrapper").height()

    // console.log("wHeight", wHeight, "tHeight", tHeight);
    // if (tHeight < wHeight) {
    //     $("#" + current_table).closest(".fh_wrapper").height(tHeight)
    // }


    if (footer) {
        fh = footer.fh
        fw = $parent.width()
        c = footer.c
        $("#" + fht).parent().parent().append("<div class='fixed_footer' ref='" + fht + "' style='height:" + fh + "px; width:" + fw + "px'>" + c + "</div>")
        if (footer.fn) {
            footer.fn()
        }

        if ($("#" + fht).parent().parent().find(".fixed_footer").length == 1) {
            footer = $("#" + fht).parent().parent().find(".fixed_footer")
            tbody = $("#" + fht).parent()
            tbody.css({
                bottom: footer.height() + 4
            })
            //console.log(footer.height(), )
        }
    }


    b = active_sort_data.zxid
    if (b) {
        $(".fixed_header th[sortcol='" + b.col + "']").trigger('click')
        header_sort(b.table, b.col, b.inverse, b.thIndex)
    }



}

function header_sort(tbl, col, inverse, thIndex) {
    window['sortingtable'] = tbl

    th = $("th[sortcol='" + col + "']")
    active_sort = {
        table: tbl,
        col: col,
        inverse: inverse,
        thIndex: thIndex
    }
    active_sort_data[tbl.find('table').attr('id')] = active_sort
    // console.log(tbl, th.attr('sortcol'), inverse, thIndex)
    $(".uarr, .darr").remove() // Remove Arrowas
    if (inverse == true) {
        th.append("<span class=uarr>&#x25B2;</span>")
    } else {
        th.append("<span class=darr>&#x25BC;</span>")
    }
    tbl.find('td').filter(function () {
        return $(this).index() === thIndex;
    }).sortElements(function (a, b) {
        var ca = (isNaN($.text([a])) == false) ? parseFloat($.text([a])) : $.text([a])
        var cb = (isNaN($.text([b])) == false) ? parseFloat($.text([b])) : $.text([b])
        if (ca == cb) {
            return 0;
        }
        return ca > cb ?
            inverse ? -1 : 1 : inverse ? 1 : -1;
    }, function () {
        return this.parentNode;
    });

    $(".uarr, .darr").css({
        'float': 'right',
        "color": "#4a7081"
    })
    inverse = !inverse;
}

function getQuery(str) {
    urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(str);
}

function killfixheader(fht) {
    //  var  fht = 'pax_man'
    if ($("#" + fht).parent().parent().find(".fh_wrapper").length == 1) {
        $("#" + fht).parent().parent().append($("#" + fht))
        $("#" + fht).parent().find('.fixed_header').remove()
        $("#" + fht).parent().find('.fh_wrapper').remove()
        $("#" + fht).parent().find('.fixed_footer').children().insertAfter("#" + fht);
        $("#" + fht).parent().find('.fixed_footer').remove()
        $("#" + fht).removeAttr('style')
        $("#" + fht + " td").removeAttr('style')
        $("#" + fht + " thead").show()
    }

}

function table_builder(table_id, colset, dataset, handle_id) {
    function td_builder(coldata, dataset, handle) {
        var c = "";
        $.each(dataset, function (r, v) {
            if (handle) {
                c += "<tr row='" + v[handle] + "'>"
            } else {
                c += "<tr row='" + r + "'>\n"
            }


            $.each(coldata, function (k, col) {
                if (col.tclass) {
                    var tclass = col.tclass
                } else {
                    var tclass = ''
                }

                try {
                    if (col.path && typeof eval("v." + col.path) != 'undefined') {
                        // Evaluates path of node
                        var val = eval("v." + col.path)
                        if (val == null) {
                            val = ""
                        }
                        c += "<td col='" + k + "' value='" + val + "' class='" + tclass + "'>" + val + "</td>"

                        // if (typeof col.e != 'undefined' && col.e == true) {

                        // } else {
                        //     c += "<td col='" + k + "'>" + val + "</td>"
                        // }


                    } else {
                        // function here

                        if (typeof col.e != 'undefined' && col.e == true) {

                            c += "<td col='" + k + "'  class='edit_field'></td>"
                        } else {
                            c += "<td col='" + k + "'></td>"
                        }


                    }

                } catch (e) {
                    c += "<td></td>"
                }
            })
            c += "</tr>\n"
        })
        return c;
    }

    function th_builder(coldata) {
        var s = ""
        $.each(coldata, function (k, v) {

            if (typeof v.icon !== 'undefined') {
                thc = "<img src = '" + v.icon + "' class=thicon alt='" + v.txt + "' title='" + v.txt + "'>";
            } else {
                thc = v.txt
            }

            if (v.sortcol) {
                s += "<th sortcol='" + k + "' dir='asc'>" + thc + "</th>"
            } else {
                s += "<th>" + thc + "</th>"
            }
        })
        return s;
    }
    var c = "<table id=" + table_id + "     style='width:100%' width='100%'>"
    c += "<thead>"
    c += "<tr>"
    c += th_builder(colset)
    c += "</tr>\n"
    c += "</thead>"
    c += "<tbody>"
    if (typeof handle_id != 'undefined') {
        c += td_builder(colset, dataset, handle_id)

    } else {
        c += td_builder(colset, dataset)
    }


    c += "</tbody>"
    c += "</table>"
    return c

}

function popwindow(id, str, title, fn) {
    var t = $("#" + id)
    t.remove()
    $("<div id='" + id + "'>").dialog({
        width: $(window).width() - 50,
        height: $(window).height() - 50,
        title: title,
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
            $(this).html("Hang on , things are being cooked");
            $(".dialogstatus").remove()
            // $(this).dialog({ position: 'top' });
            $(".ui-dialog-buttonpane").prepend("<div class=dialogstatus></div>")

            $(this).html(str)
            fn();

        }
    })
}

function reloadCss() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}



replaceAll = function (string, search, replace) {
    return string.split(search).join(replace);
}
isObject = function (arg) { return Object.prototype.toString.call(arg).indexOf('Object') !== -1; }
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
global = window

_log = (function (undefined) {
    var Log = Error; // does this do anything?  proper inheritance...?
    Log.prototype.write = function (args) {
        /// <summary>
        /// Paulirish-like console.log wrapper.  Includes stack trace via @fredrik SO suggestion (see remarks for sources).
        /// </summary>
        /// <param name="args" type="Array">list of details to log, as provided by `arguments`</param>
        /// <remarks>Includes line numbers by calling Error object -- see
        /// * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
        /// * https://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
        /// * https://stackoverflow.com/a/3806596/1037948
        /// </remarks>

        // via @fredrik SO trace suggestion; wrapping in special construct so it stands out
        var suffix = ["line:" + (this.lineNumber
            ? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
            : extractLineNumberFromStack(this.stack)
        ) + "\t"];

        args = suffix.concat(args);
        // _log(args);
        // via @paulirish console wrapper
        if (console && console.log) {
            if (console.log.apply) { console.log.apply(console, args); } else { _log(args); } // nicer display in some browsers
        }
    };
    var extractLineNumberFromStack = function (stack) {
        /// <summary>
        /// Get the line/filename detail from a Webkit stack trace.  See https://stackoverflow.com/a/3806596/1037948
        /// </summary>
        /// <param name="stack" type="String">the stack string</param>

        if (!stack) return '?'; // fix undefined issue reported by @sigod

        // correct line number according to how Log().write implemented
        var line = stack.split('\n')[2];
        // fix for various display text


        line = (line.indexOf(' (') >= 0
            ? line.split(' (')[1].substring(0, line.length - 1)
            : line.split('at ')[1]
        );
        line = line.split(":")[2] + ":" + line.split(":")[3]
        // _log(line)
        return line;
    };

    return function (params) {
        /// <summary>
        /// Paulirish-like console.log wrapper
        /// </summary>
        /// <param name="params" type="[...]">list your logging parameters</param>
        // only if explicitly true somewhere
        if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;

        // call handler extension which provides stack trace
        Log().write(Array.prototype.slice.call(arguments, 0)); // turn into proper array
    };//--  fn  returned

})();//--- _log