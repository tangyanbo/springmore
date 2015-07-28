/**
Function: $defined
	Returns true if the passed in value/object is defined, that means is not null or undefined.

Arguments:
	obj - object to inspect
*/

function $defined(obj){
	return (obj != undefined);
};

/**
Function: $chk
	Returns true if the passed in value/object exists or is 0, otherwise returns false.
	Useful to accept zeroes.

Arguments:
	obj - object to inspect
*/

function $chk(obj){
	return !!(obj || obj === 0);
};

/*****************************************************************
 * VCK javascript framework
 *****************************************************************/
/**
 * Constructor
 */
JSVCK = {
	jsvck_class: "jscom.shiyue.vck",
	version: "1.00"
};
/****************************************************************
 * jscom.shiyue.vck.utils.String
 *****************************************************************/
/**
 * Constructor
 */
JSVCK.String = function () {
	this.jsvck_class = "jscom.shiyue.vck.utils.String";
};
var VCKString = JSVCK.String;

/**
 * 判断给定的字符串是否为空白
 * @param value
 */
VCKString.isBlank = function(value) {
	if (!$defined(value)) {
		return true;
	}
	if (typeof value == "string") {
		return !$chk($.trim(value)); 
	} else {
		return !$chk(value);
	}
};

/**
 * 判断给定的字符串是否不为空白
 * @param value
 */
VCKString.isNotBlank = function(value) {
	return !VCKString.isBlank(value);
}
/**
 * 计算字符串长度
 * @param str 需要计算长度的字符串
 * @return 如果传参为<code>null<code>/<code>undefined</code>则返回<code>null<code>，
 * 否则返回当前字符串的长度，包括前后空白字符
 */
VCKString.strLength = function (str) {
	if (!$chk(str)) {
		return null;
	}
	var count = 0;
	for (var i = 0; i < str.length; i += 1) {
		count += 1;
	}
	return count;
}
/**
 * 判断给定的字符串是否为有效email
 * @param strEmail 需要验证的email字符串
 * @return 如果传参为<code>null<code>/<code>undefined</code>则返回<code>null<code>，
 * 否则有效返回<code>true</code>，无效返回<code>false</code>
 */
VCKString.isEmail = function (strEmail) {
	if (!$chk(strEmail)) {
		return null;
	}
   	var emailReg = /^[\w-_]+(\.[\w-_]+)*@[\w-_]+(\.[\w-_]+)+$/;
   	if (emailReg.test(strEmail)) {
   		return true;
   	} else {
   		return false;
   	}
}
VCKString.trimToEmpty = function (str) {
	if (!$chk(str)) {
		return "";
	} else if (typeof value == "string") {
		return $.trim(str);
	} else {
		return str;
	}
}
/**
 * 只能输入数字或字母长度不限
 * @param value 字符串
 */
VCKString.isStrNumber = function (value) {
	var regString = /^[A-Za-z0-9]*$/;
	var reg = new RegExp(regString);
	return reg.test(value);
}
/****************************************************************
 * jscom.shiyue.vck.utils.Date
 *****************************************************************/
/**
 * Constructor
 */
JSVCK.Date = function () {
	this.jsvck_class = "jscom.shiyue.vck.utils.Date";
}
var VCKDate = JSVCK.Date;

/**
 * 一小时的毫秒数
 * @param {Object} value
 * @return {TypeName} 
 */
var _hourMilliseconds = 3600000;
/**
 * 一天的毫秒数
 * @param {Object} value
 * @return {TypeName} 
 */
VCKDate._dayMilliseconds = 86400000;

/**
 * 日期验证，格式必须为yyyy-MM-dd
 * 平年：(\d{3}[1-9]|\d{2}[1-9]\d|\d[1-9]\d{2}|[1-9]\d{3})
 * 被400整除的闰年：((0[48]|[13579][26]|[2468][048])00)
 * 被4不被100整险的闰年：([0-9]{2}(0[48]|[13579][26]|[2468][048]))
 * 有31天的月：(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])
 * 有30天的月：(0[469]|11)-(0[1-9]|[12][0-9]|30)
 * 平年2月：(02)-(0[1-9]|1[0-9]|2[0-8])
 * 
 * 时间：( ([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d)
 */
VCKDate.isDate = function (value) {
	var regExp = new RegExp("^(((\\d{3}[1-9]|\\d{2}[1-9]\\d|\\d[1-9]\\d{2}|[1-9]\\d{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|((02)-(0[1-9]|1[0-9]|2[0-8]))))|((((0[48]|[13579][26]|[2468][048])00)|([0-9]{2}(0[48]|[13579][26]|[2468][048])))-02-29))$");
	return regExp.test(value);
}

VCKDate.isDatetime = function (value) {
	var regExp = new RegExp("^((((\\d{3}[1-9]|\\d{2}[1-9]\\d|\\d[1-9]\\d{2}|[1-9]\\d{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|((02)-(0[1-9]|1[0-9]|2[0-8]))))|((((0[48]|[13579][26]|[2468][048])00)|([0-9]{2}(0[48]|[13579][26]|[2468][048])))-02-29))( ([0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\d))$");
	return regExp.test(value);
}

/**
 * 日期解析，格式必须为yyyy-MM-dd
 * @param value 需要解析的日期字符串
 * @param fmt 日期格式
 */
VCKDate.parseDate = function (value) {
	if (!VCKDate.isDate(value) && !VCKDate.isDatetime(value)) {
		return null;
	}
	var times = value.substring(0, 10).split("-", 3);
	// 月/日/年
	var date = new Date();
	date.setTime(Date.parse(times[1] + "/" + times[2] + "/" + times[0]));
	return date;
}

VCKDate.parseDatetime = function (value) {
	if (!VCKDate.isDatetime(value)) {
		return null;
	}
	var d = value.substring(0, 10);
	var times = d.split("-", 3);
	// 月/日/年
	var date = new Date();
	date.setTime(Date.parse(times[1] + "/" + times[2] + "/" + times[0]));
	var t = value.substring(11);
	times = t.split(":", 3);
	date.setHours(parseInt(times[0], 10));
	date.setMinutes(parseInt(times[1], 10));
	date.setSeconds(parseInt(times[2], 10));
	return date;
}

/**
 * 日期格式化
 * @param d 日期
 * @param mask 格式串
 */
VCKDate.format = function(d, mask) {   
    var zeroize = function (value, length) {   
        if (!length) length = 2;   
        value = String(value);   
        for (var i = 0, zeros = ''; i < (length - value.length); i += 1) {   
            zeros += '0';   
        }   
        return zeros + value;   
    };     
  
    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {   
        switch($0) {   
            case 'd':   return d.getDate();   
            case 'dd':  return zeroize(d.getDate());   
            case 'ddd': return ['Sun','Mon','Tue','Wed','Thr','Fri','Sat'][d.getDay()];   
            case 'dddd':    return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];   
            case 'M':   return d.getMonth() + 1;   
            case 'MM':  return zeroize(d.getMonth() + 1);   
            case 'MMM': return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];   
            case 'MMMM':    return ['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()];   
            case 'yy':  return String(d.getFullYear()).substr(2);   
            case 'yyyy':    return d.getFullYear();   
            case 'h':   return d.getHours() % 12 || 12;   
            case 'hh':  return zeroize(d.getHours() % 12 || 12);   
            case 'H':   return d.getHours();   
            case 'HH':  return zeroize(d.getHours());   
            case 'm':   return d.getMinutes();   
            case 'mm':  return zeroize(d.getMinutes());   
            case 's':   return d.getSeconds();   
            case 'ss':  return zeroize(d.getSeconds());   
            case 'l':   return zeroize(d.getMilliseconds(), 3);   
            case 'L':   var m = d.getMilliseconds();   
                    if (m > 99) m = Math.round(m / 10);   
                    return zeroize(m);   
            case 'tt':  return d.getHours() < 12 ? 'am' : 'pm';   
            case 'TT':  return d.getHours() < 12 ? 'AM' : 'PM';   
            case 'Z':   return d.toUTCString().match(/[A-Z]+$/);   
            // Return quoted strings with the surrounding quotes removed   
            default:    return $0.substr(1, $0.length - 2);   
        }   
    });   
}

/**
 * 获取当前日期
 */
VCKDate.date = function() {
	return VCKDate.parseDate(VCKDate.format(new Date(),"yyyy-MM-dd"));
}

/**
 * 将给定的日期的域增加指定的数值
 * @param {String} calType [y/M/d/H/m/s]
 * @param {Date} d
 * @param {int} v
 */
VCKDate.add = function(calType, d, v) {
	v = parseInt(v);
	switch(calType) {
		case "y":
			d.setFullYear(d.getFullYear() + v);
			break;
		case "M": 
			d.setMonth(d.getMonth() + v);
			break;
		case "d": 
			d.setDate(d.getDate() + v);
			break;
		case "H":
			d.setHours(d.getHours() + v);
			break;
		case "m":
			d.setMinutes(d.getMinutes() + v);
			break;
		case "s":
			d.setSeconds(d.getSeconds() + v);
			break;
	}
	return d;
}
/****************************************************************
 * jscom.shiyue.vck.utils.Number
 *****************************************************************/
/**
 * Constructor
 */
JSVCK.Number = function () {
	this.jsvck_class = "jscom.shiyue.vck.utils.number";
}
var VCKNumber = JSVCK.Number;

/**
 * 把数四舍五入为最接近的给定精度的数
 * @param value
 * @param scale 精度 0 ~ 20 之间的值，包括 0 和 20
 */
VCKNumber.round = function (value, scale) {
	if (isNaN(value)) {
		return Number.NaN;
	}
	if (isNaN(scale)) {
		return Number.NaN;
	}
	if (scale < 0 || scale > 20) {
		return Number.NaN;
	} else if (scale == 0) {
		return Math.round(value);
	}
	var m = Math.pow(10,scale);
	return Math.round(value * m) / m;
}

/**
 * 判断给定的值是否为合法格式的数值
 * @param value 字符串或数值
 * @param length 有效位数
 * @param scale 精度
 */
VCKNumber.isNumber = function (value, length, scale) {
	if (isNaN(value) || isNaN(length) || isNaN(scale)) {
		return false;
	}
	
	if ($.type(value) === "number") {
		return true;
	} else if ($.type(value) !== "string") {
		return false;
	}
	
	if ($.type(length) !== "number" || $.type(scale) !== "number") {
		return false;
	}
	
	if (scale > length - 1) {
		return false;
	}
	
	var regString = "^\\d{1," + (length - scale) + "}";
	if (scale > 0) {
		regString += "(\\.\\d{1," + scale +"})?$";
	} else {
		regString += "$";
	}
	
	var reg = new RegExp(regString);
	return reg.test(value);
}