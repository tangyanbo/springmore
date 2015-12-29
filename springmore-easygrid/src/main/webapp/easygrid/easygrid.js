/**
 * easy grid
 * 作者 唐延波
 * version 1.9
 * 创建时间 2013-10-16
 * v1.7 更新时间 2013-12-19
 * v1.9 更新时间 2014-01-15
 */
_createJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
};

var bootPATH = _createJSPath("easygrid.js");

document.write('<script src="' + bootPATH + 'easygrid-gridContainer.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'easygrid-gridObject.js" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + 'easygrid-datagrid.js" type="text/javascript" ></script>');
document.write('<script src="' + bootPATH + 'easygrid-largedata.js" type="text/javascript" ></script>');
document.write('<link href="' + bootPATH + 'easygrid.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + 'easygrid_custom.css" rel="stylesheet" type="text/css" />');


