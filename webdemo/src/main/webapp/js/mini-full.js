// ## KISSY MINI
//
// KISSY MINI 是面向移动终端的KISSY瘦身版，在保持API和KISSY一致的情况下，着重优化、精简核心模块代码，保证高可用的同时做到身材苗条。
//
// KISSY MINI 提供`mini.js`和`mini-full.js`两个种子，其中
// - **[mini.js](../build/mini.js)**(8k)：`core`、`node`、`event`、`io`
// - **[mini-full.js](../build/mini-full.js)**(13k)：`core`、`node`、`event`、`io`、`loader`
//
// KISSY MINI 提供的官方模块有
//
//| 模块名                 | 内置 				| 说明			|
//| --------------------     |:--------------------:|:--------------------:|
//| core             | YES                  | 构造KISSY全局对象  |
//| node			| YES			|Node模块   |
//| io		| YES			|Ajax模块   |
//| event			| YES			|Event 模块   |
//| loader			| YES<br/>(`mini-full.js`)			|简版的loader	|
//| base			|			|KISSY Base 模块   |
//| ua			|			|浏览器嗅探模块   |
//| uri			|			|KISSY URI 模块   |
//| anim			|			|动画模块   |
//| lang			|			|语言工具方法集合   |
//| juicer			|			|Juicer模版渲染引擎   |
//| form			|			|Form表单处理   |
//|              |&nbsp;                | &nbsp;            |
//
// 在使用**mini-full.js**时，可以通过`KISSY.use('ua')`来拉取非内置的官方模块。
//
// ## Core 模块
/*
 * KISSY MINI
 * by: @kissyteam
 * created: 2014-02-12
 * contains: core node event io
 * license: MIT
 **/
;(function(root) {

var S = {
    version: '0.1.1',
    Env: {
        host: root
    }
};

var arrayProto = Array.prototype,
    class2type = {},
    doc = document;

// **S.map(els,function(items){...})**
//
// 遍历数组，数组结果是在对每个原数组元素调用fn的返回值.
// - els:需要遍历的数组
// - fn:能够根据原数组当前元素返回新数组元素的函数.
//
//	```
//	S.map(["foot", "goose", "moose"],function(single){
//		return single.replace(/o/g, "e");
//	}); // =>  ["feet", "geese", "meese"]
//	```
S.map = function(els, cb) {
    var val,
        key,
        ret = [];

    if (!S.isObject(els)) {
        arrayProto.forEach.call(els, function(el, index) {
            val = cb(el, index);
            if (val !== null) {
                ret.push(val);
            }
        });
    } else {
        for (key in els) {
            val = cb(els[key], key);
            if (val !== null) {
                ret.push(val);
            }
        }
    }

    return ret.length > 0 ? arrayProto.concat.apply([], ret) : ret;
};

// **S.each(collection, function(index, item){ ... },ctx)**
//
// 遍历数组中的每一项, 执行回调函数中的方法
// - collection:需要遍历的数组或者对象
// - fn:回调函数，回传三个参数
// 	1. 当前项的值
// 	2. 索引（index）或者键值（key）
// 	3. 数组或者对象
// - ctx: fn的上下文对象，默认为`window`
//
//
//		S.each(['a', 'b', 'c'], function(index, item){
//  		console.log('item %d is: %s', index, item)
//		})
//
//		var hash = { name: 'kissy.js', size: 'micro' }
//		S.each(hash, function(key, value){
//			console.log('%s: %s', key, value)
//		})
//
S.each = function(obj, iterator, context) {
    var keys, i, len;
    if (!obj) {
        return obj;
    }
    if (obj.forEach === arrayProto.forEach) {
        obj.forEach(iterator, context);
    } else if (S.isArray(obj)) {
        for (i = 0, len = obj.length; i < len; i++) {
            if (iterator.call(context, obj[i], i, obj) === false) {
                return;
            }
        }
    } else {
        keys = Object.keys(obj);
        for (i = 0, len = keys.length; i < len; i++) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === false) {
                return;
            }
        }
    }
    return obj;
};

// **S.mix(receiver , supplier)**
//
// 将 supplier 对象的成员复制到 receiver 对象上.
// - receiver: 属性接受者对象.
// - supplier: 属性来源对象.
function mix(obj) {
    var k;
    S.each(arrayProto.slice.call(arguments, 1), function(source) {
        if (source) {
            for (var prop in source) {
                if((k = source[prop]) !== undefined) {
                    obj[prop] = k;
                }
            }
        }
    });
    return obj;
}

S.mix = mix;

// **S.makeArray(list)**
//
// 把list(任何可以迭代的对象)转换成一个数组，在转换 arguments 对象时非常有用。
//
// 	(function(){
// 		return S.toArray(arguments).slice(1);
// 	})(1, 2, 3, 4); // => [2, 3, 4]
//
S.makeArray = function (o) {
	if (o == null) {
		return [];
	}
	if (S.isArray(o)) {
		return o;
	}
	var lengthType = typeof o.length,
		oType = typeof o;
	if (lengthType !== 'number' ||
			o.alert ||
			oType === 'string' ||
			/* https://github.com/ariya/phantomjs/issues/11478 */
			(oType === 'function' && !( 'item' in o && lengthType === 'number'))) {
				return [o];
			}
	var ret = [];
	for (var i = 0, l = o.length; i < l; i++) {
		ret[i] = o[i];
	}
	return ret;
};

// **S.augment (r, s1, [wl])**
//
// 类的扩充，将 `s1` 的 `prototype` 属性的成员复制到 `r.prototype` 上。`Base` 使用。
// - r: 将要扩充的函数
// - s1: 扩充来源函数或对象. 非函数对象时复制的就是 s 的成员.
// - wl: 属性来源对象的属性白名单, 仅在名单中的属性进行复制.
S.augment = function (r, o, wl) {
	if(o instanceof Function){
		S.mix(r.prototype, o.prototype);
	}
	if(o instanceof Object){
		S.mix(r.prototype, o);
	}
	if(wl instanceof Object){
		S.mix(r.prototype, wl);
	}
	return r;
};

// **S.filter(list, iterator, [context])**
//
// 遍历list中的每个值，返回包含所有通过iterator真值检测的元素值。默认使用原生的filter方法。`Base`使用
//
// 	var evens = S.filter([1, 2, 3, 4, 5, 6], function(num){
// 		return num % 2 == 0;
// 	}); // => [2, 4, 6]
S.filter = function (arr, fn, context) {
	return Array.prototype.filter.call(arr, fn, context || this);
} ;

// **S.clone(input,[filter])**
//
// 创建一个 普通对象 或数组的深拷贝, 并且返回新对象，Base 使用。
// - input: 待深拷贝的对象或数组.
// - filter: 过滤函数, 返回 false 不拷贝该元素. 传入参数为:
// 	1. 待克隆值为数组, 参数同 `S.filter()`, 上下文对象为全局 `window`
// 	2. 待克隆值为普通对象, 参数为对象的每个键, 每个键对应的值, 当前对象, 上下文对象为当前对象.
S.clone = function (input, filter) {
	var destination = input;

	if(!input) return destination;

	var constructor = input.constructor;
	if (S.inArray(constructor, [Boolean, String, Number, Date, RegExp])) {
		destination = input.valueOf();
	}
	/* ImageData , File, Blob , FileList .. etc */
	else if (S.isArray(input)) {
		destination = filter ? S.filter(input, filter) : input.concat();
	} else if (S.isPlainObject(input)) {
		destination = {};
	}

	if(S.isArray(input)){
		for (var i = 0; i < destination.length; i++) {
			destination[i] = S.clone(destination[i], filter);
		}
	} else if (S.isPlainObject(input)){
		for (k in input) {
			if (!filter || (filter.call(input, input[k], k, input) !== false)){
				destination[k] = S.clone(input[k], filter);
			}
		}
	}
	return destination;
};

// **S.ucfirst(string)**
//
// 将字符串首字母大写，Base使用
S.ucfirst= function (s) {
	s += '';
	return s.charAt(0).toUpperCase() + s.substring(1);
};

// **S.trim(string)**
//
// 去除字符串两端的空白字符. Base使用
S.trim = function (str) {
	return str == null ? '' : String.prototype.trim.call(str);
};

// **S.now()**
//
// 返回当前日期时间，Base 使用
S.now = Date.now;

// **S.reduce(arr,fn,[initialValue])**
//
// 从左向右对每个数组元素调用给定函数，并把返回值累积起来，返回这个累加值，Base使用
// - arr: 需要遍历的数组.
// - fn: 在每个数组元素上执行的函数.
// - initialValue: 对象类型，初次执行 fn 时的第一个参数值，如果不指定则为第一个元素值，后续从第二个元素开始遍历
//
// ```
// S.reduce([0,1,2,3,4],function(p, c, index){
// 	return p + c;
// });
// // 首次调用
// p = 0, c = 1, index = 1
// //第二次调用
// p = 1, c = 2, index = 2
// // 第三次调用
// p = 3, c= 3, index = 3
// // 第四次调用
// p = 6, c = 4, index = 4
// // 最终返回：10
// ```
S.reduce = function (arr, callback, initialValue) {
	var len = arr.length;
	if (typeof callback !== 'function') {
		throw new TypeError('callback is not function!');
	}

	/* 如果初始值是空数组，则无返回值，报错 */
	if (len === 0 && arguments.length == 2) {
		throw new TypeError('arguments invalid');
	}

	var k = 0;
	var accumulator;
	if (arguments.length >= 3) {
		accumulator = arguments[2];
	}
	else {
		do {
			if (k in arr) {
				accumulator = arr[k++];
				break;
			}

			/* 如果初始值是空数组，则无返回值，报错 */
			k += 1;
			if (k >= len) {
				throw new TypeError();
			}
		}
		while (TRUE);
	}

	while (k < len) {
		if (k in arr) {
			accumulator = callback.call(undefined, accumulator, arr[k], k, arr);
		}
		k++;
	}

	return accumulator;
};

// **S.substitute(str,o)**
//
// 将字符串中的占位符替换为对应的键值。`Base`使用
//
// ```
// str = '{name} is {prop_1} and {prop_2}.',
// obj = {name: 'Jack Bauer',
// 			prop_1: 'our lord',
// 			prop_2: 'savior'};
//
// S.substitute(str, obj);
// 		// => 'Jack Bauer is our lord and savior.'
// ```
S.substitute =  function (str, o, regexp) {
	if (typeof str != 'string' || !o) {
		return str;
	}

	return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
		if (match.charAt(0) === '\\') {
			return match.slice(1);
		}
		return (o[name] === undefined) ? '': o[name];
	});
};

// **S.indexOf (elem,arr)**
//
// 返回元素 elem 在数组 arr 中的序号.
S.indexOf = function(item, arr) {
	return Array.prototype.indexOf.call(arr, item);
};

// **S.inArray (elem,arr)**
//
// 判断元素 elem 是否在数组 arr 中.
S.inArray = function(item, arr) {
	return S.indexOf(item, arr) > - 1;
};

// **S.merge (s1,s2[,...])**
//
// 将多个对象的成员合并到一个新对象上. 参数中, 后面的对象成员会覆盖前面的.
//
// ```
// a = { a: 'a' },
// b = { b: 'b' },
// c = { b: 'b2', c: 'c' };
//
// var o = S.merge(a, b, c);
// S.log(o.a); // => 'a'
// S.log(o.b); // => 'b2'
// S.log(o.c); // => 'c'
// ```
S.merge = function() {
	var args = arrayProto.slice.call(arguments, 0);
    return mix.apply(null, [{}].concat(args));
};

// **S.extend (r,s[,px,sx])**
//
// 让函数对象 r 继承函数对象 s
// - r: 将要继承的子类函数
// - supplier: 继承自的父类函数
// - px: 需要添加/覆盖的原型成员
// - sx: 需要添加/覆盖的静态成员.
S.extend = function(receiver, supplier, protoPros, staticProps) {
    var supplierProto = supplier.prototype,
        receiverProto;

    supplierProto.constructor = supplier;

    receiverProto = Object.create(supplierProto);
    receiverProto.constructor = receiver;
    receiver.prototype = S.mix(receiverProto, receiver.prototype);
    receiver.superclass = supplierProto;

    if (protoPros) {
        S.mix(receiverProto, protoPros);
    }

    if (staticProps) {
        S.mix(receiver, staticProps);
    }

    return receiver;
};

// **S.type(object)**
//
// 返回`object`的类型，如果要判断是否是plainObject（普通对象）需要使用`S.isPlainObject()`方法
//
// ```
// S.type(S.one('div')) // => 'array'
// S.type(Number(2)) // => 'number'
// S.type(S.Node)  // => 'function'
// ```
//
// 如果需要验证是否是Node节点类型，使用**S.Node.isNode()**
S.type = function(obj) {
    return obj == null ?
		String(obj) : class2type[{}.toString.call(obj)] || 'object';
};

// **S.unique (arr)**
//
// 返回一个新数组, 仅包含 arr 去重后的值
//
// ```
// KISSY.unique(['a', 'b', 'a']) => ['a', 'b']
// ```
S.unique = function(array) {
    return arrayProto.filter.call(array, function(item, index) {
        return array.indexOf(item) == index;
    });
};

// **S.isWindow (o)**
//
// 判断参数是否为浏览器 window
S.isWindow = function(obj) {
    return obj && obj == obj.window;
};

// **S.isPlainObject(obj)**
//
// 判断是否是普通对象, 通过 {} 或 new FunctionClass/Object() 创建的, 不包括内置对象以及宿主对象.
//
// ```
// S.isPlainObject({}); // => true
// S.isPlainObject(new Date()); // => false
// S.isPlainObject(document.body); // => false
// ```
S.isPlainObject = function(obj) {
    return S.isObject(obj) && !S.isWindow(obj)
		&& Object.getPrototypeOf(obj) == Object.prototype;
};

// 类型诊断函数
//
// **S.isBoolean()**
//
// **S.isNumber()**
//
// **S.isString()**
//
// **S.isFunction()**
//
// **S.isArray()**
//
// **S.isDate()**
//
// **S.isRegExp()**
//
// **S.isObject()**
//
// **S.isError()**
//
// **S.isUndefined()**
//
// **S.isNull()**
['Boolean', 'Number', 'String', 'Function',
	'Array', 'Date', 'RegExp', 'Object',
	'Error'].forEach(function(name) {
    var name2lc = name.toLowerCase();

    class2type['[object ' + name + ']'] = name2lc;

    S['is' + name] = function(obj) {
        return S.type(obj) === name2lc;
    };
});

S.isUndefined = function(o){
	return o === undefined;
};

S.isNull = function(o){
	return o === null;
};

S.isArray = Array.isArray || S.isArray;

// **S.startsWith (str,prefix)**
//
// 判断 str 是否以 prefix 开头
S.startsWith = function(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
};

// **S.endsWith(str,suffix)**
//
// 判断 str 是否以 suffix 结尾
S.endsWith   = function(str, suffix) {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind;
};

var guid = 0;

// **S.guid (prefix)**
//
// 返回全局唯一 id.
S.guid = function(pre) {
    return (pre || '') + guid++;
};

// **S.ready(function(S){...})**
//
// DOM Ready 事件，Ready 后再监听会立即执行回调
//
// 与 DOMContentLoaded 事件此类似的事件还有 avaiable 和 contentready，在 PC 端产品多使用这两个方法来监听某个节点是否可用以及节点内的结构是否构造完整，这两个事件在无线端不常用，这里不提供，只提供 `ready()` 方法
//
// ```
// KISSY.ready(function(S){
//		var $ = S.all;
// });
// ```
S.ready = function(fn){
    if (/complete|loaded|interactive/.test(doc.readyState) && doc.body) fn(S);
    else doc.addEventListener('DOMContentLoaded', function(){ fn(S); }, false);
    return this;
};

(function (S, undefined) {
    /* ios Function.prototype.bind === undefined */
    function bindFn(r, fn, obj) {
        function FNOP() {
        }

        var slice = [].slice,
            args = slice.call(arguments, 3),
            bound = function () {
                var inArgs = slice.call(arguments);
                return fn.apply(
                    this instanceof FNOP ? this :
                        /* fix: y.x=S.bind(fn); */
                        obj || this,
                    (r ? inArgs.concat(args) : args.concat(inArgs))
                );
            };
        FNOP.prototype = fn.prototype;
        bound.prototype = new FNOP();
        return bound;
    }

    S.mix(S, {

		// **S.noop()**
		//
		// 空函数
        noop: function () {
        },

		// **S.bind (fn , context)**
		//
		// 创建一个新函数，该函数可以在固定的上下文以及传递部分固定参数放在用户参数前面给原函数并执行
		// - fn: 需要固定上下文以及固定部分参数的函数
		// - context: 执行 fn 时的 this 值. 如果新函数用于构造器则该参数无用.
        bind: bindFn(0, bindFn, null, 0),
        rbind: bindFn(0, bindFn, null, 1)
    });
})(S);

var fns    = {},
    config = {
        debug : false,
        fns   : fns
    };

S.Config = config;

// **S.config(configName,configValue)**
//
// 设置或获取 KISSY 配置参数，有三种用法
//
// ```
// config(configJSON) //⇒ void
// config(name,value) //⇒ void，name：参数名，value：参数值
// config(name) //⇒ data，返回参数名的值
// ```
//
// 其中`S.config(configJSON)`的用法参照：
//
//		KISSY.config({
//			// 开启自动 combo 模式
//			combine:true,
//			// kissy 库内置模块的时间戳
//			tag:'2012',
//			// kissy 的基准路径
//			base:'http://x.com/a',
//			packages:{},
//			modules:{}
//		})
//
// 完整参数可以参照[KISSY1.4的loader用法](http://docs.kissyui.com/1.4/docs/html/guideline/loader.html)的config部分
//
// [mini.js](../mini.js)支持完整的KISSY模块规范（KMD），[规范详情移步这里](http://docs.kissyui.com/1.4/docs/html/guideline/kmd.html)
//
// ```
// // 判断是否引用mini版本
// var isMini = S.config('mini');
// ```
S.config = function (configName, configValue) {
    var cfg,
        r,
        self = this,
        fn,
        Config = S.Config,
        configFns = Config.fns;
    if (S.isObject(configName)) {
        S.each(configName, function (configValue, p) {
            fn = configFns[p];
            if (fn) {
                fn.call(self, configValue);
            } else {
                Config[p] = configValue;
            }
        });
    } else {
        cfg = configFns[configName];
        if (configValue === undefined) {
            if (cfg) {
                r = cfg.call(self);
            } else {
                r = Config[configName];
            }
        } else {
            if (cfg) {
                r = cfg.call(self, configValue);
            } else {
                Config[configName] = configValue;
            }
        }
    }
    return r;
};

S.config('mini',true);

var modules = {};

var isString   = S.isString,
    isFunction = S.isFunction;

var RE_DIRNAME = /[^?#]*\//,
    RE_DOT = /\/\.\//g,
    RE_DOUBLE_DOT = /\/[^/]+\/\.\.\//,
    RE_DOUBLE_SLASH = /([^:/])\/\//g;

function parseDirName(name) {
    var mat = name.match(RE_DIRNAME);
    return name ? mat[0] : name + '/';
}

function parseRelativeName(name, refName) {
    if (refName && /^[\.\/]/.test(name)) {
        name = parseDirName(refName) + name;
        /* /a/b/./c/./d ==> /a/b/c/d */
        name = name.replace(RE_DOT, '/');

        /* a/b/c/../../d  ==>  a/b/../d  ==>  a/d */
        while (name.match(RE_DOUBLE_DOT)) {
            name = name.replace(RE_DOUBLE_DOT, '/');
        }

        /* a//b/c  ==>  a/b/c  */
        name = name.replace(RE_DOUBLE_SLASH, '$1/');
    }
    return name;
}

function parseModuleName(name, refName) {
    if (name.charAt(name.length - 1) === '/') {
        name += 'index';
    } else if (/.js$/.test(name)) {
        name = name.slice(0, -3);
    }

    return parseRelativeName(name, refName);
}

function execFnWithModules(fn, modNames, refName)  {
    var args = S.map(modNames || [], function(modName) {
        return S.require(modName, refName);
    });
    return isFunction(fn) ? fn.apply(S, [S].concat(args)) : undefined;
}

function execFnWithCJS(fn) {
    return isFunction(fn) ? fn.apply(S, [S, S.require]) : undefined;
}

// **S.add(name,fn,[cfg])**
//
// KISSY 添加模块/逻辑片段的函数，`config`为配置对象，包括`config.requires`，给出当前模块的依赖模块。模块返回一个对象，通过引用它的时候来调用到。
// - name (string) – 模块名。可选。
// - fn (function) – 模块定义函数
// - config (object) – 模块的一些格外属性, 是JSON对象，包含属性：
// - requires (Array) – 模块的一些依赖
//
// core中的`S.add()`只有基本功能，只支持上面三个参数
//
// 在[mini-full.js](../mini-full.js)中，包含完整的KMD规范的实现的loader。
//
// ```
// // package/a.js
// KISSY.add('a',function(S){
//	 return ObjA;
// },{
// 	 // 当前逻辑依赖一个包内的文件b，一个全局模块base
// 	 requires:['b','base']
// });
// ```
//
// `add()`方法符合基本的KMD规范，可以参照[KISSY 1.4 Loader的文档](http://docs.kissyui.com/1.4/docs/html/guideline/loader.html)

S.add = function(name, factory, config) {
    if (isString(name)) {
        name = parseModuleName(name);
        modules[name] = {
            factory  : factory,
            requires : config && config.requires
        };
    }
    return S;
};

// **S.require(name,[refName])**
//
// 如果模块已经载入，则可以通过`S.require()`方法来调用这个模块，通常如果use()的模块过多，回调参数需要和模块列表一一对应，最简单的办法就是使用`S.require()`方法
//
// 比如这段代码：
// ```
// // use 的模块太多，用肉眼来对应模块名称？
// S.use('a,b,c,d,e,f,g',function(S,A,B,C,D,E,F,G){
//     // Your code...
// });
//
// // 可以简写为这样
// S.use('a,b,c,d,e,f,g',function(S){
//     var A = S.require('a');
//     var B = S.require('b');
//     var C = S.require('c');
//     // Your code...
// });
// ```
S.require = function(name, refName) {
    var mod;
    if (isString(name)) {
        name = parseModuleName(name, refName);
        mod  = modules[name];
        if (mod) {
            if (!mod.exports) {
                mod.exports = isFunction(mod.factory) ?
                    mod.requires ?
                        execFnWithModules(mod.factory, mod.requires, name) :
                        execFnWithCJS(mod.factory)
                    :
                    mod.factory;
            }
            return mod.exports;
        }
    }
};

// **S.use(names, callback)**
//
// 载入并运行模块,和add一起使用，详细用法参照[KISSY模块规范](http://docs.kissyui.com/1.4/docs/html/kmd.html)（KMD），fn 类型是functio。参数说明：
// - modNames (String) – 以逗号（,）分割的模块名称,例如 `S.use("custommod,custommod2")`
// - callback (function|Object) – 当 modNames 中所有模块载入并执行完毕后执行的函数或者对象描述
//
// 当callback类型为Object时，可传入两个属性：
//
// 1. success (function) : 当 modNames 中所有模块加载完毕后执行的函数
// 2. error (function) : 当前 use 失败时调用的函数，参数为失败的模块对象
//
S.use = function(names, success) {
    /* assign callback functions */
    if (S.isObject(success)) {
        success = success.success;
    }
    /* parse string to array */
    if (isString(names)) {
        names = names.replace(/\s+/g, '').split(',');
    }

    execFnWithModules(success, names);

    return S;
};


// **S.log(msg,[cat,type])**
//
// 输出调试信息
// - msg : 试信息
// - cat : 调试信息类别. 可以取 info, warn, error, dir, time 等 console 对象的方法名, 默认为 log.
// - src : 调试代码所在的源信息
S.log = function(msg, cat, type) {
    var logger = console;
    cat = cat && logger[cat] ? cat : 'log';
    logger[cat](type ? type + ': ' + msg : msg);
};

// **S.error(msg)**
//
// 抛出错误异常
S.error = function(msg) {
    if (S.config('debug')) {
        throw msg instanceof Error ? msg : new Error(msg);
    }
};

root.KISSY = S;


}(this));
// <style>pre{-moz-tab-size:4;-webkit-tab-size:4;tab-size:4;}</style>
// <style>td {border-top:1px solid #ccc} table {border-collapse: collapse;}</style>

// Loader API
// ==========
//
// ### How to use
// ---
// 用法同KISSY Seed
//
//     //定義模塊
//     KISSY.add('pkg/mod1', function(S, Dep) {
//         return {
//             name: 'mod1'
//         };
//     }, {
//         requires: [
//             'dep1'
//         ]
//     })
//
//     //使用模塊
//     KISSY.use('pkg/mod1', function(S, Mod1) {
//         alert(Mod1.name);
//     });
//
// ### API Delete
// ---
//
// **未列出的API與KISSY保持用法一致 (包括 CMD, Combo, download CSS, etc. )**
//
// | API                  | KISSY                | KISSY-MINI           |
// | -------------------- |:--------------------:|:--------------------:|
// | getScript            | YES                  | NO                   |
// | importStyle          | YES                  | NO                   |
//
//
//
// ### API Differences
// ---
// － package config不支持 **group** 參數
//
// － package config不支持 **suffix** 參數

;(function(root) {

/* cache KISSY object */
var S = root.KISSY;

var Env      = S.Env,
    Config   = S.Config,
    config   = S.config,
    log      = S.log;

var mix        = S.mix,
    map        = S.map,
    each       = S.each,
    isObject   = S.isObject,
    isArray    = S.isArray,
    isString   = S.isString,
    isFunction = S.isFunction,
    startsWith = S.startsWith,
    endsWith   = S.endsWith;

/* cache native object */
var doc      = root.document,
    ua       = root.navigator.userAgent,
    loc      = root.location,
    href     = loc.href,
    protocol = loc.protocol;

var substring     = function(str, start, end) {
    return str.substring(start, end);
},  indexOf    = function(str, value, index) {
    return str.indexOf(value, index);
},  slice      = function(str, start, end) {
    return str.slice(start, end);
},  charAt     = function(str, index) {
    return str.charAt(index);
},  split      = function(str, flag) {
    return str.split(flag);
},  replace    = function(str, reg, val) {
    return str.replace(reg, val);
},  toLowerCase = function(str) {
    return str.toLowerCase();
};


var now = Date.now,
    keys = Object.keys,
    reduce = function(arr, fn, initialVal) {
        return arr.reduce(fn, initialVal);
    },
    filter = function(arr, fn) {
        return arr.filter(fn);
    },
    indexOf = function(arr, val) {
        return arr.indexOf(val);
    },
    setImmediate = function(fn)  {
        setTimeout(fn, 0);
    };

var noop  = function() {},
    TRUE  = !0,
    FALSE = !1;

var isOldWebKit = ( +ua.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536 );

/** A hack for xiaomi mobile, xiaomi mobile's user agent is like below:
 * Xiaomi_2013061_TD/V1 Linux/3.4.5 Android/4.2.1 Release/09.18.2013
   Browser/AppleWebKit534.30 Mobile Safari/534.30 MBBMS/2.2 System/Android 4.2.1
   XiaoMi/MiuiBrowser/1.0
*/
if (ua.match(/^XiaoMi/gim)) {
    isOldWebKit = ( +ua.replace(/.*Safari\/(\d+)\..*/, "$1") < 536 );

/** h hack for ZTE mobile ua like below
 * ZTE U970_TD/1.0 Linux/2.6.39 Android/4.0 Release/2.21.2012 Browser/AppleWebKit534.30
 */
} else if (ua.match(/^ZTE/)) {
    isOldWebKit = ( +ua.replace(/.*AppleWebKit(\d+)\..*/, "$1") < 536 );
}


/* Remove .. and . in path array */
function normalizeArray(parts, allowAboveRoot) {
    /* level above root */
    var up = 0,
        i = parts.length - 1,
        newParts = [],
        last;

    for (; i >= 0; i--) {
        last = parts[i];
        if (last !== '.') {
            if (last === '..') {
                up++;
            } else if (up) {
                up--;
            } else {
                newParts[newParts.length] = last;
            }
        }
    }

    /* if allow above root, has to add .. */
    if (allowAboveRoot) {
        for (; up--; up) {
            newParts[newParts.length] = '..';
        }
    }

    newParts = newParts.reverse();

    return newParts;
}

/* Extract the directory portion of a path
* dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
* ref: http://jsperf.com/regex-vs-split/2
*/
var RE_DIRNAME = /[^?#]*\//;

function pathGetDirName(path) {
    var mat = path.match(RE_DIRNAME);
    return mat ? mat[0] : '.';
}

function pathRemoveExt(path) {
    return path.replace(/\.[^\/]+$/, '');
}

var RE_DOT = /\/\.\//g,
    RE_DOUBLE_DOT = /\/[^/]+\/\.\.\//,
    RE_DOUBLE_SLASH = /([^:/])\/\//g;

/* Canonicalize a path */
/* realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c" */
function pathParseRelative(path) {
    /* /a/b/./c/./d ==> /a/b/c/d */
    path = path.replace(RE_DOT, "/");

    /* a/b/c/../../d  ==>  a/b/../d  ==>  a/d */
    while (path.match(RE_DOUBLE_DOT)) {
        path = path.replace(RE_DOUBLE_DOT, "/");
    }

    /* a//b/c  ==>  a/b/c */
    path = path.replace(RE_DOUBLE_SLASH, "$1/");

    return path;
}

function pathResolveRelative(from, to) {
    var resolvedPath = '',
        resolvedPathStr,
        i,
        args = (arguments),
        path,
        absolute = 0;

    for (i = args.length - 1; i >= 0 && !absolute; i--) {
        path = args[i];
        if (!isString(path) || !path) {
            continue;
        }
        resolvedPath = path + '/' + resolvedPath;
        absolute = charAt(path, 0) === '/';
    }

    resolvedPathStr = normalizeArray(filter(split(resolvedPath, '/'), function (p) {
        return !!p;
    }), !absolute).join('/');

    return ((absolute ? '/' : '') + resolvedPathStr) || '.';
}

function pathGetRelative(from, to) {
    from = pathParseRelative(from);
    to = pathParseRelative(to);

    var fromParts = filter(split(from, '/'), function (p) {
            return !!p;
        }),
        path = [],
        sameIndex,
        sameIndex2,
        toParts = filter(split(to, '/'), function (p) {
            return !!p;
        }), commonLength = Math.min(fromParts.length, toParts.length);

    for (sameIndex = 0; sameIndex < commonLength; sameIndex++) {
        if (fromParts[sameIndex] !== toParts[sameIndex]) {
            break;
        }
    }

    sameIndex2 = sameIndex;

    while (sameIndex < fromParts.length) {
        path.push('..');
        sameIndex++;
    }

    path = path.concat(slice(toParts, sameIndex2));

    path = path.join('/');

    return /**@type String  @ignore*/path;
}

/* Normalize an id
*  normalize("path/to/a") ==> "path/to/a.js"
* NOTICE: substring is faster than negative slice and RegExp
*/
function pathNormalizeName(id) {
    var last = id.length - 1,
        lastC = charAt(id, last);

    /* If the uri ends with `#`, just return it without '#' */
    if (lastC === "#") {
        return id.substring(0, last);
    }

    return (endsWith(id, '.js')  ||
            endsWith(id, '.css') ||
            indexOf(id, '?') > 0 ||
            lastC === '/' ) ? id :
                              id + '.js';
}


var RE_ABSOLUTE = /^\/\/.|:\//,
    RE_ROOT_DIR = /^.*?\/\/.*?\//;

function pathNormalizeBase(base) {
    if (!base) { return loaderDir; }
    base = base.replace(/\\/g, '/');
    if (!endsWith(base, '/')) {
        base += '/';
    }

    return pathAddBase(base);
}

function pathAddBase(id, base) {
    var result, baseDir, mat;
        firstC = charAt(id, 0);

    baseDir = base ? pathGetDirName(base) : workDir;

    /* Absolute */
    if (RE_ABSOLUTE.test(id)) {
        result = id;
    }
    /* Relative */
    else if (firstC === ".") {
        result  = pathParseRelative(baseDir + id);
    }
    /* Root */
    else if (firstC === "/") {
        mat = baseDir.match(RE_ROOT_DIR);
        result = mat ? mat[0] + substring(id, 1) : id;
    }
    /* Top-level */
    else {
        result = baseDir + id;
    }

    /* Add default protocol when uri begins with "//" */
    if (startsWith(result, '//')) {
        result = protocol + result;
    }

    return result;
}

function pathAddQuery(path, key, value) {
    return path + ( indexOf(path, '?') > -1 ? '&' : '?' ) + key + '=' + value;
}

var workDir   = pathGetDirName(doc.URL);
var loaderDir = (function() {
    var scripts      = doc.scripts,
        loaderScript = scripts[scripts.length - 1];
    return loaderScript ? pathGetDirName(loaderScript.src) : workDir;
}());

/**
 * @ignore
 * setup data structure for kissy loader
 * @author yiminghe@gmail.com
 */

var Loader = S.Loader = {};

    /** error */
var ERROR = -1,
    /** init */
    INIT  = 0,
    /** loading */
    LOADING = 1,
    /** loaded */
    LOADED = 2,
    /**dependencies are loaded or attached*/
    READY_TO_ATTACH = 3,
    /** attaching */
    ATTACHING = 4,
    /** attached */
    ATTACHED = 5;

/**
 * Loader Status Enum
 * @enum {Number} KISSY.Loader.Status
 */
Loader.Status = {
    /** error */
    ERROR: ERROR,
    /** init */
    INIT: INIT,
    /** loading */
    LOADING: LOADING,
    /** loaded */
    LOADED: LOADED,
    /**dependencies are loaded or attached*/
    READY_TO_ATTACH: READY_TO_ATTACH,
    /** attaching */
    ATTACHING: ATTACHING,
    /** attached */
    ATTACHED: ATTACHED
};

/**
 * @ignore
 * Utils for kissy loader
 * @author yiminghe@gmail.com
 */

/**
 * @class KISSY.Loader.Utils
 * Utils for KISSY Loader
 * @singleton
 * @private
 */

/* http://wiki.commonjs.org/wiki/Packages/Mappings/A */
/* 如果模块名以 / 结尾，自动加 index */
function addIndexAndRemoveJsExt(s) {
    if (isString(s)) {
        return addIndexAndRemoveJsExtFromName(s);
    } else {
        var ret = [],
            i = 0,
            l = s.length;
        for (; i < l; i++) {
            ret[i] = addIndexAndRemoveJsExtFromName(s[i]);
        }
        return ret;
    }
}

function addIndexAndRemoveJsExtFromName(name) {
    /* 'x/' 'x/y/z/' */
    if (charAt(name, name.length - 1) === '/') {
        name += 'index';
    }
    if (endsWith(name, '.js')) {
        name = slice(name, 0, -3);
    }
    return name;
}

function pluginAlias(runtime, name) {
    var index = indexOf(name, '!');
    if (index !== -1) {
        var pluginName = substring(name, 0, index);
        name = substring(name, index + 1);
        S.use(pluginName, {
            sync: true,
            success: function (S, Plugin) {
                if (Plugin.alias) {
                    /* noinspection JSReferencingMutableVariableFromClosure */
                    name = Plugin.alias(runtime, name, pluginName);
                }
            }
        });
    }
    return name;
}



/**
 * Get absolute path of dep module.similar to {@link KISSY.Path#resolve}
 * @param {String} moduleName current module 's name
 * @param {String|String[]} depName dependency module 's name
 * @return {String|String[]} normalized dependency module 's name
 */
function normalDepModuleName(moduleName, depName) {
    var i = 0, l;

    if (!depName) {
        return depName;
    }

    if (isString(depName)) {
        if (startsWith(depName, '../') || startsWith(depName, './')) {
            /* x/y/z -> x/y/ */
            return pathResolveRelative(pathGetDirName(moduleName), depName);
        }

        return pathParseRelative(depName);
    }

    for (l = depName.length; i < l; i++) {
        depName[i] = normalDepModuleName(moduleName, depName[i]);
    }
    return depName;
}

/**
 * create modules info
 * @param runtime Module container, such as KISSY
 * @param {String[]} modNames to be created module names
 */
function createModulesInfo(runtime, modNames) {
    each(modNames, function (m) {
        createModuleInfo(runtime, m);
    });
}

/**
 * create single module info
 * @param runtime Module container, such as KISSY
 * @param {String} modName to be created module name
 * @param {Object} [cfg] module config
 * @return {KISSY.Loader.Module}
 */
function createModuleInfo(runtime, modName, cfg) {
    modName = addIndexAndRemoveJsExtFromName(modName);

    var mods = runtime.Env.mods,
        module = mods[modName];

    if (module) {
        return module;
    }

    /* 防止 cfg 里有 tag，构建 fullpath 需要 */
    mods[modName] = module = new Module(mix({
        name: modName,
        runtime: runtime
    }, cfg));

    return module;
}

/**
 * Get modules exports
 * @param runtime Module container, such as KISSY
 * @param {String[]} modNames module names
 * @return {Array} modules exports
 */
function getModules(runtime, modNames) {
    var mods = [runtime], module,
        unaliasArr,
        allOk,
        m,
        runtimeMods = runtime.Env.mods;

    each(modNames, function (modName) {
        module = runtimeMods[modName];
        if (!module || module.getType() !== 'css') {
            unaliasArr = unalias(runtime, modName);
            allOk = reduce(unaliasArr, function (a, n) {
                m = runtimeMods[n];
                /* allow partial module (circular dependency) */
                return a && m && m.status >= ATTACHING;
            }, true);
            if (allOk) {
                mods.push(runtimeMods[unaliasArr[0]].exports);
            } else {
                mods.push(null);
            }
        } else {
            mods.push(undefined);
        }
    });

    return mods;
}

/**
 * attach modules and their dependency modules recursively
 * @param {String[]} modNames module names
 * @param runtime Module container, such as KISSY
 */
function attachModsRecursively(modNames, runtime) {
    var i,
        l = modNames.length;
    for (i = 0; i < l; i++) {
        attachModRecursively(modNames[i], runtime);
    }
}

function checkModsLoadRecursively(modNames, runtime, stack, errorList, cache) {
    /* for debug. prevent circular dependency */
    stack = stack || [];
    /* for efficiency. avoid duplicate non-attach check */
    cache = cache || {};
    var i,
        s = 1,
        l = modNames.length,
        stackDepth = stack.length;
    for (i = 0; i < l; i++) {
        s = s && checkModLoadRecursively(modNames[i], runtime, stack, errorList, cache);
        stack.length = stackDepth;
    }
    return !!s;
}

function checkModLoadRecursively(modName, runtime, stack, errorList, cache) {
    var mods = runtime.Env.mods,
        status,
        m = mods[modName];
    if (modName in cache) {
        return cache[modName];
    }
    if (!m) {
        cache[modName] = FALSE;
        return FALSE;
    }
    status = m.status;
    if (status === ERROR) {
        errorList.push(m);
        cache[modName] = FALSE;
        return FALSE;
    }
    if (status >= READY_TO_ATTACH) {
        cache[modName] = TRUE;
        return TRUE;
    }
    if (status !== LOADED) {
        cache[modName] = FALSE;
        return FALSE;
    }

    if (indexOf(stack, modName) > -1) {
        /*'find cyclic dependency between mods */
        cache[modName] = TRUE;
        return TRUE;
    }
    stack.push(modName);

    if (checkModsLoadRecursively(m.getNormalizedRequires(),
        runtime, stack, errorList, cache)) {
        m.status = READY_TO_ATTACH;
        cache[modName] = TRUE;
        return TRUE;
    }

    cache[modName] = FALSE;
    return FALSE;
}

/**
 * attach module and its dependency modules recursively
 * @param {String} modName module name
 * @param runtime Module container, such as KISSY
 */
function attachModRecursively(modName, runtime) {
    var mods = runtime.Env.mods,
        status,
        m = mods[modName];
    status = m.status;
    /* attached or circular dependency */
    if (status >= ATTACHING) {
        return;
    }
    m.status = ATTACHING;
    if (m.cjs) {
        /* commonjs format will call require in module code again */
        attachMod(runtime, m);
    } else {
        attachModsRecursively(m.getNormalizedRequires(), runtime);
        attachMod(runtime, m);
    }
}

/**
 * Attach specified module.
 * @param runtime Module container, such as KISSY
 * @param {KISSY.Loader.Module} module module instance
 */
function attachMod(runtime, module) {
    var factory = module.factory,
        exports;

    if (isFunction(factory)) {
        /* compatible and efficiency */
        /* KISSY.add(function(S,undefined){}) */
        var require;
        if (module.requires && module.requires.length) {
            require = function() {
                return module.require.apply(module, arguments);
            };
        }
        /* 需要解开 index，相对路径 */
        /* 但是需要保留 alias，防止值不对应 */
        /* noinspection JSUnresolvedFunction */
        exports = factory.apply(module,
            /* KISSY.add(function(S){module.require}) lazy initialize */
            (module.cjs ? [runtime, require, module.exports, module] : getModules(runtime, module.getRequiresWithAlias())));
        if (exports !== undefined) {
            /* noinspection JSUndefinedPropertyAssignment */
            module.exports = exports;
        }
    } else {
        /* noinspection JSUndefinedPropertyAssignment */
        module.exports = factory;
    }

    module.status = ATTACHED;
}

/**
 * Get module names as array.
 * @param {String|String[]} modNames module names array or  module names string separated by ','
 * @return {String[]}
 */
function getModNamesAsArray(modNames) {
    if (isString(modNames)) {
        modNames = split(replace(modNames, /\s+/g, ''), ',');
    }
    return modNames;
}

/**
 * normalize module names
 * 1. add index : / => /index
 * 2. unalias : core => dom,event,ua
 * 3. relative to absolute : ./x => y/x
 * @param {KISSY} runtime Global KISSY instance
 * @param {String|String[]} modNames Array of module names
 *  or module names string separated by comma
 * @param {String} [refModName]
 * @return {String[]} normalized module names
 */
function normalizeModNames(runtime, modNames, refModName) {
    return unalias(runtime,
        normalizeModNamesWithAlias(runtime, modNames, refModName));
}

/**
 * unalias module name.
 * @param runtime Module container, such as KISSY
 * @param {String|String[]} names moduleNames
 * @return {String[]} unalias module names
 */
function unalias(runtime, names) {
    var ret = [].concat(names),
        i,
        m,
        alias,
        ok = 0,
        j;
    while (!ok) {
        ok = 1;
        for (i = ret.length - 1; i >= 0; i--) {
            if ((m = createModuleInfo(runtime, ret[i])) && ((alias = m.getAlias()) !== undefined)) {
                ok = 0;
                if (typeof alias === 'string') {
                    alias = [alias];
                }
                for (j = alias.length - 1; j >= 0; j--) {
                    if (!alias[j]) {
                        alias.splice(j, 1);
                    }
                }
                ret.splice.apply(ret, [i, 1].concat(addIndexAndRemoveJsExt(alias)));
            }
        }
    }
    return ret;
}

/**
 * normalize module names with alias
 * @param runtime Module container, such as KISSY
 * @param {String[]} modNames module names
 * @param [refModName] module to be referred if module name path is relative
 * @return {String[]} normalize module names with alias
 */
function normalizeModNamesWithAlias(runtime, modNames, refModName) {
    var ret = [], i, l;
    if (modNames) {
        /* 1. index map */
        for (i = 0, l = modNames.length; i < l; i++) {
            if (modNames[i]) {
                ret.push(pluginAlias(runtime, addIndexAndRemoveJsExt(modNames[i])));
            }
        }
    }
    /* 2. relative to absolute (optional) */
    if (refModName) {
        ret = normalDepModuleName(refModName, ret);
    }
    return ret;
}

/**
 * register module with factory
 * @param runtime Module container, such as KISSY
 * @param {String} name module name
 * @param {Function|*} factory module's factory or exports
 * @param [config] module config, such as dependency
 */
function registerModule(runtime, name, factory, config) {
    name = addIndexAndRemoveJsExtFromName(name);

    var mods = runtime.Env.mods,
        module = mods[name];

    if (module && module.factory !== undefined) {
        return;
    }

    /* 没有 use，静态载入的 add 可能执行 */
    createModuleInfo(runtime, name);

    module = mods[name];

    /* 注意：通过 S.add(name[, factory[, config]]) 注册的代码，无论是页面中的代码， */
    /* 还是 js 文件里的代码，add 执行时，都意味着该模块已经 LOADED */
    mix(module, {
        name    : name,
        status  : LOADED,
        factory : factory
    });

    mix(module, config);
}

/**
 * Returns hash code of a string djb2 algorithm
 * @param {String} str
 * @returns {String} hash code
 */
function getHash(str) {
    var hash = 5381,
        i;
    for (i = str.length; --i > -1;) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        /* hash * 33 + char */
    }
    return hash + '';
}

function getRequiresFromFn(fn) {
    var requires = [];
    fn.toString()
        .replace(commentRegExp, '')
        .replace(requireRegExp, function (match, dep) {
            requires.push(getRequireVal(dep));
        });
    return requires;
}


var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
    requireRegExp = /[^.'"]\s*require\s*\(([^)]+)\)/g;

function getRequireVal(str) {
    var m = str.match(/^\s*["']([^'"\s]+)["']\s*$/);
    return m ? m[1] : '';
}

function forwardSystemPackage(self, property) {
    return property in self ?
        self[property] :
        self.runtime.Config[property];
}

/**
 * @class KISSY.Loader.Package
 * @private
 * This class should not be instantiated manually.
 */
function Package(cfg) {
    mix(this, cfg);
}

Package.prototype = {
    constructor: Package,

    reset: function (cfg) {
        mix(this, cfg);
    },

    /**
     * Tag for package.
     * tag can not contain ".", eg: Math.random() !
     * @return {String}
     */
    getTag: function () {
        return forwardSystemPackage(this, 'tag');
    },

    /**
     * Get package name.
     * @return {String}
     */
    getName: function () {
        return this.name;
    },

    getPath: function () {
        return this.path || (this.path = this.getUri());
    },

    /**
     * get package uri
     */
    getUri: function () {
        return this.uri;
    },

    /**
     * Whether is debug for this package.
     * @return {Boolean}
     */
    isDebug: function () {
        return forwardSystemPackage(this, 'debug');
    },

    /**
     * Get charset for package.
     * @return {String}
     */
    getCharset: function () {
        return forwardSystemPackage(this, 'charset');
    },

    /**
     * Whether modules are combined for this package.
     * @return {Boolean}
     */
    isCombine: function () {
        return forwardSystemPackage(this, 'combine');
    },

    /**
     * Get package group (for combo).
     * @returns {String}
     */
    getGroup: function () {
        return forwardSystemPackage(this, 'group');
    }
};

Loader.Package = Package;

var systemPackage = new Package({
    name: '',
    runtime: S
});

systemPackage.getUri = function () {
    return this.runtime.Config.baseUri;
};

function getPackage(self, modName) {
    var packages = self.Config.packages || {},
        modNameSlash = modName + '/',
        pName = '',
        p;
    for (p in packages) {
        if (startsWith(modNameSlash, p + '/') && p.length > pName.length) {
            pName = p;
        }
    }
    return packages[pName] || systemPackage;
}


/**
 * @class KISSY.Loader.Module
 * @private
 * This class should not be instantiated manually.
 */
function Module(cfg) {
    /**
     * exports of this module
     */
    this.exports = {};

    /**
     * status of current modules
     */
    this.status = INIT;

    /**
     * name of this module
     */
    this.name = undefined;

    /**
     * factory of this module
     */
    this.factory = undefined;

    /**
     * lazy initialize and commonjs module format
     */
    this.cjs = 1;
    mix(this, cfg);
    this.waitedCallbacks = [];
}

Module.prototype = {
    kissy: 1,

    constructor: Module,

    /**
     * resolve module by name.
     * @param {String|String[]} relativeName relative module's name
     * @param {Function|Object} fn KISSY.use callback
     * @returns {String} resolved module name
     */
    use: function (relativeName, fn) {
        relativeName = getModNamesAsArray(relativeName);
        return S.use(normalDepModuleName(this.name, relativeName), fn);
    },

    /**
     * resolve path
     * @param {String} relativePath relative path
     * @returns {KISSY.Uri} resolve uri
     */
    resolve: function (relativePath) {
        return pathAddBase(relativePath, this.getUri());
    },

    /* use by xtemplate include */
    resolveByName: function (relativeName) {
        return normalDepModuleName(this.name, relativeName);
    },

    /**
     * require other modules from current modules
     * @param {String} moduleName name of module to be required
     * @returns {*} required module exports
     */
    require: function (moduleName) {
        return S.require(moduleName, this.name);
    },

    wait: function (callback) {
        this.waitedCallbacks.push(callback);
    },

    notifyAll: function () {
        var callback;
        var len = this.waitedCallbacks.length,
            i = 0;
        for (; i < len; i++) {
            callback = this.waitedCallbacks[i];
            try {
                callback(this);
            } catch (e) {
                /*jshint loopfunc:true*/
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
        this.waitedCallbacks = [];
    },

    /**
     * Get the type if current Module
     * @return {String} css or js
     */
    getType: function () {
        var v = this.type;
        if (!v) {
            if (endsWith(toLowerCase(this.name), '.css')) {
                v = 'css';
            } else {
                v = 'js';
            }
            this.type = v;
        }
        return v;
    },

    getAlias: function () {
        var name = this.name,
            aliasFn,
            packageInfo,
            alias = this.alias;
        if (!('alias' in this)) {
            packageInfo = this.getPackage();
            if (packageInfo.alias) {
                alias = packageInfo.alias(name);
            }
            if (!alias && (aliasFn = this.runtime.Config.alias)) {
                alias = aliasFn(name);
            }
        }
        return alias;
    },

    /**
     * Get the path uri of current module if load dynamically
     * @return String
     */
    getUri: function () {
        var uri;
        if (!this.uri) {
            /* path can be specified */
            if (this.path) {
                uri = this.path;
            } else {
                var name        = this.name,
                    packageInfo = this.getPackage(),
                    packageUri  = packageInfo.getUri(),
                    packageName = packageInfo.getName(),
                    extname     = '.' + this.getType(),
                    tag         = this.getTag(),
                    min         = '-min', subPath;
                /* name = Path.join(Path.dirname(name), Path.basename(name, extname)); */
                if (packageInfo.isDebug()) {
                    min = '';
                }
                subPath = pathRemoveExt(name) + min + extname;
                if (packageName) {
                    subPath = pathGetRelative(packageName, subPath);
                }
                uri = pathAddBase(subPath, packageUri);

                if (tag) {
                    uri = pathAddQuery(uri, 't', tag + extname);
                }
            }
            this.uri = uri;
        }
        return this.uri;
    },

    /**
     * Get the path of current module if load dynamically
     * @return {String}
     */
    getPath: function () {
        return this.path || (this.path = this.getUri());
    },

    /**
     * Get the name of current module
     * @return {String}
     */
    getName: function () {
        return this.name;
    },

    /**
     * Get the package which current module belongs to.
     * @return {KISSY.Loader.Package}
     */
    getPackage: function () {
        return this.packageInfo ||
            (this.packageInfo = getPackage(this.runtime, this.name));
    },

    /**
     * Get the tag of current module.
     * tag can not contain ".", eg: Math.random() !
     * @return {String}
     */
    getTag: function () {
        return this.tag || this.getPackage().getTag();
    },

    /**
     * Get the charset of current module
     * @return {String}
     */
    getCharset: function () {
        return this.charset || this.getPackage().getCharset();
    },

    /**
     * get alias required module names
     * @returns {String[]} alias required module names
     */
    getRequiresWithAlias: function () {
        var requiresWithAlias = this.requiresWithAlias,
            requires = this.requires;
        if (!requires || !requires.length) {
            return requires || [];
        } else if (!requiresWithAlias) {
            this.requiresWithAlias = requiresWithAlias =
                normalizeModNamesWithAlias(this.runtime, requires, this.name);
        }
        return requiresWithAlias;
    },

    /**
     * Get module objects required by this module
     * @return {KISSY.Loader.Module[]}
     */
    getRequiredMods: function () {
        var runtime = this.runtime;
        return map(this.getNormalizedRequires(), function (r) {
            return createModuleInfo(runtime, r);
        });
    },

    /**
     * Get module names required by this module
     * @return {String[]}
     */
    getNormalizedRequires: function () {
        var normalizedRequires,
            normalizedRequiresStatus = this.normalizedRequiresStatus,
            status = this.status,
            requires = this.requires;
        if (!requires || !requires.length) {
            return requires || [];
        } else if ((normalizedRequires = this.normalizedRequires) &&
            /* 事先声明的依赖不能当做 loaded 状态下真正的依赖 */
            (normalizedRequiresStatus === status)) {
            return normalizedRequires;
        } else {
            this.normalizedRequiresStatus = status;
            this.normalizedRequires = normalizeModNames(this.runtime, requires, this.name);
            return this.normalizedRequires;
        }
    }
};

Loader.Module = Module;

/**
 * @ignore
 * script/css load across browser
 * @author yiminghe@gmail.com
 */

var /* central poll for link node */
    timer = 0,
    /* node.id:{callback:callback,node:node} */
    monitors = {},
    monitorLen = 0;

function startCssTimer() {
    if (!timer) {
        cssPoll();
    }
}

function isCssLoaded(node, url) {
    var sheet = node.sheet,
        loaded;

    if (isOldWebKit) {
        /* http://www.w3.org/TR/Dom-Level-2-Style/stylesheets.html */
        if (node.sheet) {
            loaded = 1;
        }
    } else if (node.sheet) {
        try {
            var cssRules = node.sheet.cssRules;
            if (cssRules) {
                loaded = 1;
            }
        } catch (ex) {
            /* http://www.w3.org/TR/dom/#dom-domexception-code */
            if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
            /* for old firefox */
                loaded = 1;
            }
        }
    }
    return loaded;
}

function cssPoll() {
    for (var url in monitors) {
        var callbackObj = monitors[url],
            node = callbackObj.node;
        if (isCssLoaded(node, url)) {
            if (callbackObj.callback) {
                callbackObj.callback.call(node);
            }
            delete monitors[url];
            monitorLen--;
        }
    }

    timer = monitorLen ? setTimeout(cssPoll, 30) : 0;
}

/* refer : http://lifesinger.org/lab/2011/load-js-css/css-preload.html */
function pollCss(node, callback) {
    var href = node.href,
        arr;
    arr = monitors[href] = {};
    arr.node = node;
    arr.callback = callback;
    monitorLen++;
    startCssTimer();
}

/*
 References:
 - http://unixpapa.com/js/dyna.html
 - http://www.blaze.io/technical/ies-premature-execution-problem/

 `onload` event is supported in WebKit since 535.23
 - https://bugs.webkit.org/show_activity.cgi?id=38995
 `onload/onerror` event is supported since Firefox 9.0
 - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
 - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events

 monitor css onload across browsers.issue about 404 failure.
 - firefox not ok（4 is wrong）：
 - http://yearofmoo.com/2011/03/cross-browser-stylesheet-preloading/
 - all is ok
 - http://lifesinger.org/lab/2011/load-js-css/css-preload.html
 - others
 - http://www.zachleat.com/web/load-css-dynamically/
 */

/**
 * @ignore
 * getScript support for css and js callback after load
 * @author yiminghe@gmail.com
 */

var jsCssCallbacks = {},
    headNode = doc.getElementsByTagName('head')[0] || doc.documentElement;

/**
 * Load a javascript/css file from the server using a GET HTTP request,
 * then execute it.
 *
 * for example:
 *      @example
 *      getScript(url, success, charset);
 *      // or
 *      getScript(url, {
 *          charset: string
 *          success: fn,
 *          error: fn,
 *          timeout: number
 *      });
 *
 * Note 404/500 status in ie<9 will trigger success callback.
 * If you want a jsonp operation, please use {@link KISSY.IO} instead.
 *
 * @param {String} url resource's url
 * @param {Function|Object} [success] success callback or config
 * @param {Function} [success.success] success callback
 * @param {Function} [success.error] error callback
 * @param {Number} [success.timeout] timeout (s)
 * @param {String} [success.charset] charset of current resource
 * @param {String} [charset] charset of current resource
 * @return {HTMLElement} script/style node
 * @member KISSY
 */
var getScript = function (url, success, charset) {
    /* can not use KISSY.Uri, url can not be encoded for some url */
    /* eg: /??dom.js,event.js , ? , should not be encoded */
    var config = success,
        css = 0,
        error,
        timeout,
        attrs,
        callbacks,
        timer;

    if (endsWith(url.toLowerCase(), '.css')) {
        css = 1;
    }

    if (isObject(config)) {
        success = config.success;
        error   = config.error;
        timeout = config.timeout;
        charset = config.charset;
        attrs   = config.attrs;
    }

    callbacks = jsCssCallbacks[url] = jsCssCallbacks[url] || [];

    callbacks.push([success, error]);

    if (callbacks.length > 1) {
        return callbacks.node;
    }

    var node = doc.createElement(css ? 'link' : 'script'),
        clearTimer = function () {
            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        };

    if (attrs) {
        each(attrs, function (v, n) {
            node.setAttribute(n, v);
        });
    }

    if (charset) {
        node.charset = charset;
    }

    if (css) {
        node.href = url;
        node.rel = 'stylesheet';
    } else {
        node.src = url;
        node.async = true;
    }

    callbacks.node = node;

    var end = function (error) {
        var index = error,
            fn;
        clearTimer();
        each(jsCssCallbacks[url], function (callback) {
            if ((fn = callback[index])) {
                fn.call(node);
            }
        });
        delete jsCssCallbacks[url];
    };

    var useNative = 'onload' in node;
    /*
        onload for webkit 535.23  Firefox 9.0
        https://bugs.webkit.org/show_activity.cgi?id=38995
        https://bugzilla.mozilla.org/show_bug.cgi?id=185236
        https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
        phantomjs 1.7 == webkit 534.34
    */
    var forceCssPoll = Config.forceCssPoll || (isOldWebKit);

    if (css && forceCssPoll && useNative) {
        useNative = false;
    }

    function onload() {
        var readyState = node.readyState;
        if (!readyState ||
            readyState === 'loaded' ||
            readyState === 'complete') {
            node.onreadystatechange = node.onload = null;
            end(0);
        }
    }

    /* 标准浏览器 css and all script */
    if (useNative) {
        node.onload = onload;
        node.onerror = function () {
            node.onerror = null;
            end(1);
        };
    } else if (css) {
        /* old chrome/firefox for css */
        pollCss(node, function () {
            end(0);
        });
    } else {
        node.onreadystatechange = onload;
    }

    if (timeout) {
        timer = setTimeout(function () {
            end(1);
        }, timeout * 1000);
    }

    if (css) {
        /* css order matters so can not use css in head */
        headNode.appendChild(node);
    } else {
        /* can use js in head */
        headNode.insertBefore(node, headNode.firstChild);
    }
    return node;
};
/*
 yiminghe@gmail.com refactor@2012-03-29
 - 考虑连续重复请求单个 script 的情况，内部排队

 yiminghe@gmail.com 2012-03-13
 - getScript
 - 404 in ie<9 trigger success , others trigger error
 - syntax error in all trigger success
 */

/**
 * @ignore
 * Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */

var PACKAGE_MEMBERS = ['alias', 'debug', 'tag', 'group', 'combine', 'charset'];
mix(Config.fns, {
    packages : function (config) {
        var name,
            Config = this.Config,
            ps = Config.packages = Config.packages || {};
        if (config) {
            each(config, function (cfg, key) {
                /* 兼容数组方式 */
                name = cfg.name || key;
                var path = cfg.base || cfg.path;
                var newConfig = {
                    runtime: S,
                    name: name
                };
                each(PACKAGE_MEMBERS, function (m) {
                    if (m in cfg) {
                        newConfig[m] = cfg[m];
                    }
                });
                if (path) {
                    if (!endsWith(path, '/')) {
                        path += '/';
                    }
                    if (!cfg.ignorePackageNameInUri) {
                        path += name + '/';
                    }
                    newConfig.uri = normalizeBase(path);
                }
                if (ps[name]) {
                    ps[name].reset(newConfig);
                } else {
                    ps[name] = new Package(newConfig);
                }
            });
            return undefined;
        } else if (config === false) {
            Config.packages = {};
            return undefined;
        } else {
            return ps;
        }
    },
    modules: function (modules) {
        var self = this;
        if (modules) {
            each(modules, function (modCfg, modName) {
                var mod = createModuleInfo(self, modName, modCfg);
                if (mod.status === INIT) {
                    mix(mod, modCfg);
                }
            });
        }
    },
    base: function (base) {
        if (!base) {
            return Config.baseUri;
        } else {
            Config.baseUri = normalizeBase(base);
            return undefined;
        }
    }
});


function normalizeBase(base) {

    base = replace(base, /\\/g, '/');
    if (charAt(base, base.length - 1) !== '/') {
        base += '/';
    }
    return pathAddBase(base);
}

/**
 * combo loader for KISSY. using combo to load module files.
 * @ignore
 * @author yiminghe@gmail.com
 */

/* ie11 is a new one! */

function loadScripts(runtime, rss, callback, charset, timeout) {
    var count = rss && rss.length,
        errorList = [],
        successList = [];

    function complete() {
        if (!(--count)) {
            callback(successList, errorList);
        }
    }

    each(rss, function (rs) {
        var mod;
        var config = {
            timeout: timeout,
            success: function () {
                successList.push(rs);
                if (mod && currentMod) {
                    /* standard browser(except ie9) fire load after KISSY.add immediately */
                    registerModule(runtime, mod.name, currentMod.factory, currentMod.config);
                    currentMod = undefined;
                }
                complete();
            },
            error: function () {
                errorList.push(rs);
                complete();
            },
            charset: charset
        };
        if (!rs.combine) {
            mod = rs.mods[0];
            if (mod.getType() === 'css') {
                mod = undefined;
            }
        }

        getScript(rs.path, config);
    });
}




/**
 * @class KISSY.Loader.ComboLoader
 * using combo to load module files
 * @param runtime KISSY
 * @param waitingModules
 * @private
 */
function ComboLoader(runtime, waitingModules) {
    this.runtime = runtime;
    this.waitingModules = waitingModules;
}


var currentMod,
    startLoadModName,
    startLoadModTime,
    groupTag = now();

ComboLoader.groupTag = groupTag;

function checkKISSYRequire(config, factory) {
    /* use require primitive statement */
    /* function(S,require){require('node')} */
    if (!config && isFunction(factory) && factory.length > 1) {
        var requires = getRequiresFromFn(factory);
        if (requires.length) {
            config = config || {};
            config.requires = requires;
        }
    } else {
        /* KISSY.add(function(){},{requires:[]}) */
        if (config && config.requires && !config.cjs) {
            config.cjs = 0;
        }
    }
    return config;
}

ComboLoader.add = function (name, factory, config, runtime, argsLen) {
    /* KISSY.add('xx',[],function(){}); */
    if (argsLen === 3 && isArray(factory)) {
        var tmp = factory;
        factory = config;
        config = {
            requires: tmp,
            cjs: 1
        };
    }
    /* KISSY.add(function(){}), KISSY.add('a'), KISSY.add(function(){},{requires:[]}) */
    if (isFunction(name) || argsLen === 1) {
        config = factory;
        factory = name;
        config = checkKISSYRequire(config, factory);
        /* 其他浏览器 onload 时，关联模块名与模块定义 */
        currentMod = {
            factory: factory,
            config: config
        };
    } else {
        currentMod = undefined;
        config = checkKISSYRequire(config, factory);
        registerModule(runtime, name, factory, config);
    }
};

function getCommonPrefix(str1, str2) {
    str1 = split(str1, /\//);
    str2 = split(str2, /\//);
    var l = Math.min(str1.length, str2.length);
    for (var i = 0; i < l; i++) {
        if (str1[i] !== str2[i]) {
            break;
        }
    }
    return slice(str1, 0, i).join('/') + '/';
}

ComboLoader.prototype = {
    /**
     * load modules asynchronously
     */
    use: function (normalizedModNames) {
        var self = this,
            allModNames,
            comboUrls,
            timeout = Config.timeout,
            runtime = self.runtime;

        allModNames = keys(self.calculate(normalizedModNames));

        createModulesInfo(runtime, allModNames);

        comboUrls = self.getComboUrls(allModNames);

        /* load css first to avoid page blink */
        each(comboUrls.css, function (cssOne) {
            loadScripts(runtime, cssOne, function (success, error) {

                each(success, function (one) {
                    each(one.mods, function (mod) {
                        registerModule(runtime, mod.name, noop);
                        mod.notifyAll();
                    });
                });

                each(error, function (one) {
                    each(one.mods, function (mod) {
                        mod.status = ERROR;
                        mod.notifyAll();
                    });
                });
            }, cssOne.charset, timeout);
        });

        /* jss css download in parallel */
        each(comboUrls.js, function (jsOne) {
            loadScripts(runtime, jsOne, function (success) {

                each(jsOne, function (one) {
                    each(one.mods, function (mod) {
                        if (!mod.factory) {
                            mod.status = ERROR;
                        }
                        mod.notifyAll();
                    });
                });
            }, jsOne.charset, timeout);
        });
    },

    /**
     * calculate dependency
     */
    calculate: function (modNames, cache, ret) {
        var i,
            m,
            mod,
            modStatus,
            self = this,
            waitingModules = self.waitingModules,
            runtime = self.runtime;

        ret = ret || {};
        cache = cache || {};

        for (i = 0; i < modNames.length; i++) {
            m = modNames[i];
            if (cache[m]) {
                continue;
            }
            cache[m] = 1;
            mod = createModuleInfo(runtime, m);
            modStatus = mod.status;
            if (modStatus >= READY_TO_ATTACH) {
                continue;
            }
            if (modStatus !== LOADED) {
                if (!waitingModules.contains(m)) {
                    if (modStatus !== LOADING) {
                        mod.status = LOADING;
                        ret[m] = 1;
                    }
                    /*jshint loopfunc:true*/
                    mod.wait(function (mod) {
                        waitingModules.remove(mod.name);
                        /* notify current loader instance */
                        waitingModules.notifyAll();
                    });
                    waitingModules.add(m);
                }
            }
            self.calculate(mod.getNormalizedRequires(), cache, ret);
        }

        return ret;
    },

    /**
     * get combo mods for modNames
     */
    getComboMods: function (modNames, comboPrefixes) {
        var comboMods = {},
            runtime = this.runtime,

            packageUri, mod, packageInfo, type, typedCombos, mods,
            tag, charset, comboName, packageName;

        each(modNames, function(modName) {
            mod = createModuleInfo(runtime, modName);
            type = mod.getType();

            packageInfo = mod.getPackage();
            packageName = packageInfo.name;
            charset = packageInfo.getCharset();
            tag = packageInfo.getTag();

            packageUri = packageInfo.getUri();
            comboName = packageName;

            /* remove group feature, leave the origin definition code here */
            mod.canBeCombined = packageInfo.isCombine();

            comboPrefixes[packageName] = packageUri;

            typedCombos = comboMods[type] = comboMods[type] || {};
            if (!(mods = typedCombos[comboName])) {
                mods = typedCombos[comboName] = [];
                mods.charset = charset;
                mods.tags = [tag];
            } else {
                if (!(mods.tags.length === 1 && mods.tags[0] === tag)) {
                    mods.tags.push(tag);
                }
            }
            mods.push(mod);
        });

        return comboMods;
    },

    /**
     * Get combo urls
     */
    getComboUrls: function (modNames) {
        var runtime = this.runtime,
            Config = runtime.Config,
            comboPrefix = Config.comboPrefix,
            comboSep = Config.comboSep,
            maxFileNum = Config.comboMaxFileNum,
            maxUrlLength = Config.comboMaxUrlLength;

        var comboPrefixes = {};
        /* {type, {comboName, [modInfo]}}} */
        var comboMods = this.getComboMods(modNames, comboPrefixes);
        /* {type, {comboName, [url]}}} */
        var comboRes = {};

        /* generate combo urls */
        for (var type in comboMods) {
            comboRes[type] = {};
            for (var comboName in comboMods[type]) {
                var currentComboUrls = [];
                var currentComboMods = [];
                var mods = comboMods[type][comboName];
                var tags = mods.tags;
                var tag = tags.length > 1 ? getHash(tags.join('')) : tags[0];

                var suffix = (tag ? '?t=' + encodeURIComponent(tag) + '.' + type : ''),
                    suffixLength = suffix.length,
                    basePrefix = comboPrefixes[comboName].toString(),
                    baseLen = basePrefix.length,
                    prefix = basePrefix + comboPrefix,
                    res = comboRes[type][comboName] = [];

                var l = prefix.length;
                res.charset = mods.charset;
                res.mods = [];

                /*jshint loopfunc:true*/
                var pushComboUrl = function () {
                    res.push({
                        combine: 1,
                        path: prefix + currentComboUrls.join(comboSep) + suffix,
                        mods: currentComboMods
                    });
                };

                for (var i = 0; i < mods.length; i++) {
                    var currentMod = mods[i];
                    res.mods.push(currentMod);
                    var path = currentMod.getPath();
                    if (!currentMod.canBeCombined) {
                        res.push({
                            combine: 0,
                            path: path,
                            mods: [currentMod]
                        });
                        continue;
                    }
                    /* ignore query parameter */
                    var subPath = path.slice(baseLen).replace(/\?.*$/, '');
                    currentComboUrls.push(subPath);
                    currentComboMods.push(currentMod);

                    if (currentComboUrls.length > maxFileNum ||
                        (l + currentComboUrls.join(comboSep).length + suffixLength > maxUrlLength)) {
                        currentComboUrls.pop();
                        currentComboMods.pop();
                        pushComboUrl();
                        currentComboUrls = [];
                        currentComboMods = [];
                        i--;
                    }
                }
                if (currentComboUrls.length) {
                    pushComboUrl();
                }
            }
        }
        return comboRes;
    }
};

Loader.ComboLoader = ComboLoader;

/*
 2013-09-11
 - union simple loader and combo loader

 2013-07-25 阿古, yiminghe
 - support group combo for packages

 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback

 2012-02-20 yiminghe note:
 - three status
 0: initialized
 LOADED: load into page
 ATTACHED: factory executed
 */

/**
 * @ignore
 * mix loader into KISSY and infer KISSY baseUrl if not set
 * @author yiminghe@gmail.com
 */

function WaitingModules(fn) {
    this.fn = fn;
    this.waitMods = {};
    this.waitModsNum = 0;
}

WaitingModules.prototype = {
    constructor: WaitingModules,

    notifyAll: function () {
        var fn = this.fn;
        if (fn && !this.waitModsNum) {
            this.fn = null;
            fn();
        }
    },

    add: function (modName) {
        this.waitMods[modName] = 1;
        this.waitModsNum++;
    },

    remove: function (modName) {
        delete this.waitMods[modName];
        this.waitModsNum--;
    },

    contains: function (modName) {
        return this.waitMods[modName];
    }
};

Loader.WaitingModules = WaitingModules;

mix(S, {
    /**
     * Registers a module with the KISSY global.
     * @param {String} name module name.
     * it must be set if combine is true in {@link KISSY#config}
     * @param {Function} factory module definition function that is used to return
     * exports of this module
     * @param {KISSY} factory.S KISSY global instance
     * @param {Object} [cfg] module optional config data
     * @param {String[]} cfg.requires this module's required module name list
     * @member KISSY
     *
     *
     *      // dom module's definition
     *      KISSY.add('dom', function(S, xx){
     *          return {css: function(el, name, val){}};
     *      },{
     *          requires:['xx']
     *      });
     */
    add: function (name, factory, cfg) {
        ComboLoader.add(name, factory, cfg, S, arguments.length);
    },
    /**
     * Attached one or more modules to global KISSY instance.
     * @param {String|String[]} modNames moduleNames. 1-n modules to bind(use comma to separate)
     * @param {Function} success callback function executed
     * when KISSY has the required functionality.
     * @param {KISSY} success.S KISSY instance
     * @param success.x... modules exports
     * @member KISSY
     *
     *
     *      // loads and attached overlay,dd and its dependencies
     *      KISSY.use('overlay,dd', function(S, Overlay){});
     */
    use: function (modNames, success) {
        var normalizedModNames,
            loader,
            error,
            sync,
            tryCount = 0,
            finalSuccess,
            waitingModules = new WaitingModules(loadReady);

        if (isObject(success)) {
            sync = success.sync;
            error = success.error;
            success = success.success;
        }

        finalSuccess = function () {
            success.apply(S, getModules(S, modNames));
        };

        modNames = getModNamesAsArray(modNames);
        modNames = normalizeModNamesWithAlias(S, modNames);

        normalizedModNames = unalias(S, modNames);

        function loadReady() {
            ++tryCount;
            var errorList = [],
                start = now(),
                ret;
            ret = checkModsLoadRecursively(normalizedModNames, S, undefined, errorList);

            if (ret) {
                attachModsRecursively(normalizedModNames, S);
                if (success) {
                    if (sync) {
                        finalSuccess();
                    } else {
                        /* standalone error trace */
                        setImmediate(finalSuccess);
                    }
                }
            } else if (errorList.length) {
                if (error) {
                    if (sync) {
                        error.apply(S, errorList);
                    } else {
                        setImmediate(function () {
                            error.apply(S, errorList);
                        });
                    }
                }
            } else {

                waitingModules.fn = loadReady;
                loader.use(normalizedModNames);
            }
        }

        loader = new ComboLoader(S, waitingModules);

        /*  in case modules is loaded statically
            synchronous check
            but always async for loader
        */
        if (sync) {
            waitingModules.notifyAll();
        } else {
            setImmediate(function () {
                waitingModules.notifyAll();
            });
        }
        return S;
    },

    /**
     * get module exports from KISSY module cache
     * @param {String} moduleName module name
     * @param {String} refName internal usage
     * @member KISSY
     * @return {*} exports of specified module
     */
    require: function (moduleName, refName) {
        if (moduleName) {
            var moduleNames = unalias(S, normalizeModNamesWithAlias(S, [moduleName], refName));
            attachModsRecursively(moduleNames, S);
            return getModules(S, moduleNames)[1];
        }
    }
});

Env.mods = {}; /* all added mods */


/*
 2013-06-04 yiminghe@gmail.com
 - refactor merge combo loader and simple loader
 - support error callback
 */

/**
 * @ignore
 * init loader, set config
 */

function getBaseDir() {
    var scripts      = doc.scripts,
        loaderScript = scripts[scripts.length - 1],
        loaderSrc    = loaderScript.src || doc.URL;

    return loaderSrc.match(/[^?#]*\//)[0];
}

/* will transform base to absolute path */
config({
    debug       : false,
    base        : getBaseDir(),
    comboPrefix : '??',
    comboSep    : ',',
    charset     : 'utf-8',
    lang        : 'zh-cn',
    comboMaxUrlLength: 2000,
    comboMaxFileNum: 40
});

(function(){

	var scripts = document.getElementsByTagName('script')//获所有script标签
	    , script = scripts[scripts.length - 1]//获取当前加载到的script标签
		, src = script.src//获取当前加载到的script标签的src属性

	var S = KISSY;
	S.config({
		base:'http://g.tbcdn.cn/kissy/k/1.4.1',
		packages:[
			{
				name:"gallery",
				path:'http://a.tbcdn.cn/s/kissy/gallery',
				charset:"utf-8",
				ignorePackageNameInUri:true
			},
			{
				name:"m",
				path:/g\.assets/i.test(src)?
					'http://g.assets.daily.taobao.net/kissy/m/0.1.1'
					:'http://g.tbcdn.cn/kissy/m/0.1.1',
				charset:"utf-8",
				ignorePackageNameInUri:true
			}
		],
		modules:{
			'core':{
				alias:[
					'm/anim',
					'm/touch',
					'm/lang',
					'm/base',
					'm/ua',
					'm/uri',
					'm/juicer',
					'm/form'
				]
			},
			'anim':{
				alias:['m/anim']
			},
			'touch':{
				alias:['m/touch']
			},
			'lang':{
				alias:['m/lang']
			},
			'base':{
				alias:['m/base']
			},
			'ua':{
				alias:['m/ua']
			},
			'uri':{
				alias:['m/uri']
			},
			'form':{
				alias:['m/form']
			},
			'juicer':{
				alias:['m/juicer']
			}
		}
	});
})();


}(this));
// <style>td {border-top:1px solid #ccc} table {border-collapse: collapse;}</style>

// ### API Delete
// ---

// | API                  | KISSY                | KISSY-MINI           |
// |:-------------------- |:--------------------:|:--------------------:|
// | test                 | √                    | ╳                    |
// | replaceClass         | √                    | ╳                    |
// | style                | √                    | ╳                    |
// | innerWidth           | √                    | ╳                    |
// | innerHeight          | √                    | ╳                    |
// | outerWidth           | √                    | ╳                    |
// | outerHeight          | √                    | ╳                    |
// | addStyleSheet        | √                    | ╳                    |
// | docHeight            | √                    | ╳                    |
// | docWidth             | √                    | ╳                    |
// | viewportHeight       | √                    | ╳                    |
// | viewportWidth        | √                    | ╳                    |
// | scrollIntoView       | √                    | ╳                    |
// | unselectable         | √                    | ╳                    |
// | nodeName             | √                    | ╳                    |
// | outerHTML            | √                    | ╳                    |

// ### API TODO
// ---

// | API                  | KISSY                | KISSY-MINI           |
// |:-------------------- |:--------------------:|:--------------------:|
// | data                 | √                    | ╳                    |
// | removeData           | √                    | ╳                    |
// | hasData              | √                    | ╳                    |

// ### KISSY VS KISSY-MINI
// ---

// | KISSY                | KISSY-MINI           | Note                 |
// |:-------------------- |:--------------------:|:--------------------:|
// | S.DOM.css(el, name)  | S.all(el).css(name)  | 只支持链式写法         |
// | S.DOM.parent(el, 2)  | ╳                    | 不支持指定层级         |
// | S.DOM.clone()        |                      | 只支持元素复制         |

;(function(global, S) {

/**
 * @ignore
 * @file util
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var win   = window,
    doc   = document,
    docEl = doc.documentElement;

var emptyArray = [],
    some       = emptyArray.some,
    every      = emptyArray.every,
    slice      = emptyArray.slice,
    filter     = emptyArray.filter,
    concat     = emptyArray.concat,
    indexOf    = emptyArray.indexOf,
    forEach    = emptyArray.forEach;

function mix(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
}

function map(els, cb) {
    var val,
        ret = [];

    els && forEach.call(els, function(el, index) {
        val = cb(el, index);
        if (val !== null) {
            ret.push(val);
        }
    });

    return ret.length ? concat.apply([], ret) : ret;
}

function each(els, callback) {
    els && forEach.call(els, callback);
    return els;
}

function isWindow(node) {
    return node && node == node.window;
}

function isDocument(node) {
    return node && node.nodeType === 9;
}

function isElement(node) {
    return node && node.nodeType === 1;
}

function likeArray(nodes) {
    return nodes && typeof nodes.length == 'number';
}

function unique(array) {
    return filter.call(array, function(item, index) {
        return array.indexOf(item) == index;
    });
}

function getScript(url) {
    var script = doc.createElement('script'),
        head   = doc.getElementsByTagName('head')[0] || docEl;

    script.src = url;
    head.insertBefore(script, head.firstChild);
}

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    }
}

var isNumber   = isType('Number'),
    isString   = isType('String'),
    isObject   = isType('Object'),
    isArray    = Array.isArray || isType('Array'),
    isFunction = isType('Function');

var isPlainObject = function(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};
/**
 * @ignore
 * @file node
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var node = {};

mix(node, {

    // ** .indexOf() **
    //
    // * .indexOf(el)
    //
    //   逻辑类似 `Array.prototype.indexOf`
    //
    //   查找 el 在 els（元素列表）中的位置，el 类型可以是 Node，也可以是原生节点
    indexOf: function(el) {
        return likeArray(el) ?
            indexOf.call(this, el[0]) :
            indexOf.apply(this, arguments);
    },

    // ** .each() **
    //
    // * .each(cb)
    //
    //  遍历数组中的每一项，执行指定方法，函数返回 false 则遍历结束
    //
    //  this 关键字指向当前 item（作为函数的第一个参数传递）
    each: function(cb) {
        every.call(this, function(el, index) {
            el = $(el);
            return cb.call(el, el, index) !== false;
        });
        return this;
    },

    // ** .slice() **
    //
    // * .slice(start[, end])
    //
    //  返回一个新的 Node 集合对象，提取包含从 start 到 end （不包括该元素）的元素
    slice: function() {
        return $(slice.apply(this, arguments));
    },

    // ** .end() **
    //
    // * .end()
    //
    //   得到上一次 S.one() / S.all() 操作前的 Node 对象
    //
    //   引入该方法是为了更好的支持链式操作( chaining )
    //
    //   可以在一个语句内对不同层次得节点集合进行不同的操作
    end: function() {
        return this.__parent || this;
    },

    // ** .getDOMNode() **
    //
    // * .getDOMNode()
    //
    //   得到该 Node 对象包含的第一个原生节点
    getDOMNode: function() {
        return this[0]
    }

});

// ** .all() **
//
// * .all(selector[, context])
//
//   通过执行 css 选择器包装 dom 节点，创建元素或者从一个 html 片段来创建一个 Node 对象
//
//   Node 集合是一个类似数组的对象，它具有链式方法来操作它指向的 dom ，文档对象中的所有方法都是集合方法
//
//   如果选择器中存在 content 参数（css 选择器，dom，或者 Node 集合对象），那么只在所给的节点背景下进行 css 选择器，这个功能有点像使用 `S.all(context).all(selector)`
//
//   可以通过一个 html 字符串片段来创建一个 dom 节点。也可以通过给定一组属性映射来创建节点。最快的创建元素，使用 `<div>` 或 `<div/>` 形式
//
// ```
// var $ = S.all;
//
// $('div');          //=> 获取所有 div 节点
// $('#foo');         //=> 获取 ID 为 'foo' 的节点
// $('<p>Hello</p>'); //=> 创建 p 节点
// $('<div />', {
//     text: 'ok',
//     css : {
//         color: 'red'
//     }
// }); //=> <div style="color:red">ok</div>
// ```
var $ = function(selector, context) {
    var ret = [];

    if (selector) {
        if (isString(selector)) {
            selector = selector.trim();

            if (selector[0] == '<' && /<([\w:]+)/.test(selector)) {
                ret = node.create(selector);
            } else if (context !== undefined) {
                ret = find(selector, $(context));
            } else {
                ret = query(selector, doc);
            }
        } else if ($.isNode(selector)) {
            return selector;
        } else {
            if (selector.nodeType || selector.setTimeout) {
                ret = [selector];
            } else if (isArray(selector)) {
                ret = selector;
            } else if (!selector.nodeType && !selector.setTimeout && selector.item) {
                ret = slice.call(selector);
            }
        }
    }

    return $.node(ret);
};

$.all = function(selector, context) {
    return $(selector, context);
};

// ** .one() **
//
// * .one(selector[, context])
//
//   返回一个节点，用法同 `.all()`
$.one = function(selector, context) {
    return $(selector, context).item(0);
};

// ** .node() **
//
// * .node(els)
//
//   把一个节点（数组）转换为 Node（集合）对象
//
// 这里 `$.node` 实际指的是 `S.Node.node`，Node 对象实例将会继承 `S.node` 里的方法
//
// `S.Node.node` 一般情况下可以使用 `S.all()` 来代替
$.node = function(els) {
    els = els || [];
    els.__proto__ = node;
    return els;
};

$.node.prototype = node;

// ** .isNode() **
//
// * .isNode(obj)
//
//   判断一个变量是否为 Node 对象
$.isNode = function(obj) {
    return obj instanceof $.node;
};
/**
 * @ignore
 * @file node-selector
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var tempParent = document.createElement('div');

// ** .find() **
//
// * .find(selector, context)
//
//  内部方法，在 context 范围内查找节点（增强版）
function find(selector, context) {
    return context.length === 1 ?
        query(selector, context[0]) :
        unique(
            map(context, function(el) {
                return query(selector, el);
            })
        );
}

// ** .query() **
//
// * .query(selector, context)
//
//  内部方法，在 context 范围内查找节点
function query(selector, context) {
    var s        = selector.charAt(0), ret,
        maybeID  = s === '#',
        maybeCls = s === '.',
        nameOnly = maybeID || maybeCls ? selector.slice(1) : selector,
        isSimple = /^[\w-]*$/.test(nameOnly);

    return isDocument(context) || isElement(context) ?
        isDocument(context) && maybeID && isSimple ?
            (ret = context.getElementById(nameOnly)) ? [ret] : [] :
            slice.call(
                !maybeID && isSimple ?
                    maybeCls ?
                        context.getElementsByClassName(nameOnly) :
                        context.getElementsByTagName(selector) :
                    context.querySelectorAll(selector)
            )
        : [];
}

// ** .matches() **
//
// * .matches(el, selector)
//
//  内部方法，选择器匹配加速
function matches(el, selector) {
    if (!el || !selector || !isElement(el)) {
        return false;
    }

    var matchesSelector = el.webkitMatchesSelector ||
                          el.mozMatchesSelector ||
                          el.oMatchesSelector ||
                          el.matchesSelector;

    if (matchesSelector) {
        return matchesSelector.call(el, selector);
    } else {
        var parent    = el.parentNode,
            hasParent = !!parent,
            match;

        if (!hasParent) {
            parent = tempParent;
            parent.appendChild(el);
        }

        match = ~query(selector, parent).indexOf(el);
        !hasParent && parent.removeChild(el);

        return match;
    }
}

mix(S, {
    query: query
});

mix(node, {

    // ** .all() **
    //
    // * .all(selector)
    //
    //  给 `S.node` 参元类挂载 `.all()` 方法，推荐直接使用 `S.all()`
    all: function(selector) {
        var self = this,
            ret;

        ret = $(find(selector, self));
        ret.__parent = self;

        return ret;
    },

    // ** .one() **
    //
    // * .one(selector)
    //
    //  给 `S.node` 参元类挂载 `.one()` 方法，推荐直接使用 `S.one()`
    one: function(selector) {
        var self = this,
            ret;

        ret = self.all(selector);
        ret = ret.length ? ret.slice(0, 1) : null;

        if (ret) {
            ret.__parent = self;
        }

        return ret;
    },

    // ** .filter() **
    //
    // * .filter(selector)
    //
    //  给 `S.node` 参元类挂载 `.filter()` 方法，推荐直接使用 `els.filter()`
    filter: function(selector) {
        if (isFunction(selector)) {
            return $(filter.call(this, function(el) {
                return selector.call(el, el);
            }));
        } else {
            return $(filter.call(this, function(el) {
                return matches(el, selector);
            }));
        }
    }

});

/**
 * @ignore
 * @file node-class
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var classCache = {};

function classRE(name) {
    return name in classCache ?
        classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
}

function className(el, val) {
    if (val === undefined) {
        return el.className;
    } else {
        el.className = val;
    }
}

function classSplit(names) {
    return names.split(/[\.\s]\s*\.?/);
}

mix(node, {

    // ** .addClass() **
    //
    // * .addClass(names)
    //
    //  给符合选择器的所有元素添加指定 class
    //
    //  多个 class 类名通过空格分隔
    addClass: function(names) {
        if (!names) return this;
        return each(this, function(el) {
            var $el       = $(el),
                cls       = className(el),
                classList = [];

            each(classSplit(names), function(name) {
                !$el.hasClass(name) && classList.push(name)
            });

            classList.length && className(el, cls + (cls ? ' ' : '') + classList.join(' '))
        });
    },

    // ** .removeClass() **
    //
    // * .removeClass()
    //
    //  给符合选择器的所有元素移除所有 class
    //
    // * .removeClass(names)
    //
    //  给符合选择器的所有元素移除指定 class
    //
    //  多个 class 类名通过空格分隔
    removeClass: function(names) {
        return each(this, function(el) {
            if (names === undefined) {
                return className(el, '');
            } else {
                var classList = className(el);

                each(classSplit(names), function(name) {
                    classList = classList.replace(classRE(name), ' ');
                });

                className(el, classList.trim());
            }
        });
    },

    // ** .toggleClass() **
    //
    // * .toggleClass(names[, when])
    //
    //  操作符合选择器的所有元素，如果存在值为 names 的 class，则移除掉，反之添加
    //
    //  如果 when 的值为真，这个功能类似于 `.addClass()` 方法，如果为假，这个功能类似与 `.removeClass()` 方法
    toggleClass: function(names, when) {
        if (!names) return this;
        return each(this, function(el) {
            var $el = $(el);

            each(classSplit(names), function(name) {
                (when === undefined ? !$el.hasClass(name) : when) ?
                    $el.addClass(name) : $el.removeClass(name);
            });
        });
    },

    // ** .hasClass() **
    //
    // * .hasClass(names)
    //
    //  判断符合选择器的所有元素中是否有某个元素含有特定 class
    hasClass: function(names) {
        if (!names) return false;
        return some.call(this, function(el) {
            return every.call(this, function(name) {
                return name ? classRE(name).test(className(el)) : true;
            });
        }, classSplit(names));
    }

});

/**
 * @ignore
 * @file node-attr
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var RE_BOOLEAN = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i;

var attrMethod = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
    propFixMap = {
        hidefocus      : 'hideFocus',
        tabindex       : 'tabIndex',
        readonly       : 'readOnly',
        'for'          : 'htmlFor',
        'class'        : 'className',
        maxlength      : 'maxLength',
        cellspacing    : 'cellSpacing',
        cellpadding    : 'cellPadding',
        rowspan        : 'rowSpan',
        colspan        : 'colSpan',
        usemap         : 'useMap',
        frameborder    : 'frameBorder',
        contenteditable: 'contentEditable'
    };

function pluck(els, property) {
    return map(els, function(el) {
        return el[property];
    });
}

function setAttribute(el, name, val) {
    val == null ? el.removeAttribute(name) : el.setAttribute(name, val)
}

mix(node, {

    // ** .attr() **
    //
    // * .attr(name)
    //
    //   获取符合选择器的第一个元素的属性值
    //
    // * .attr(name, val)
    //
    //   给符合选择器的所有元素设置属性值
    //
    // * .attr(kv)
    //
    //   给符合选择器的所有元素设置属性值
    //
    // `.attr()` 和 `.prop()` 的区别
    //
    // ```
    // el.attr('checked') // => "checked"
    // el.prop('checked') // => true
    // ```
    //
    // `.attr()` 和 `.prop()` 的使用
    //
    // 从中文意思看，两者分别是获取 / 设置 attributes 和 properties 的方法，分别在这两个场景中使用：具有 true 和 false 两个属性的属性，如 checked，selected 或者 disabled 使用 `.prop()`，其他的使用 `.attr()`
    attr: function(name, val) {
        var key,
            ret;

        if (isPlainObject(name)) {
            for (key in name) {
                node.attr.call(this, key, name[key]);
            }
            return this;
        }

        if (~attrMethod.indexOf(name)) {
            return $(this)[name](val);
        }

        if (val == undefined) {
            var el = this[0];

            if (el && isElement(el)) {
                if (RE_BOOLEAN.test(name)) {
                    ret = $(el).prop(name) ? name.toLowerCase() : undefined;
                } else if (name == 'value' && el.nodeName == 'INPUT') {
                    ret = this.val();
                } else {
                    ret = el.getAttribute(name);
                    ret = !ret && name in el ? el[name] : ret;
                }
            }
        } else {
            ret = each(this, function(el) {
                isElement(el) && setAttribute(el, name, val);
            });
        }

        return ret === null ? undefined : ret;
    },

    // ** .removeAttr() **
    //
    // * .removeAttr(name)
    //
    //   移除符合选择器的所有元素的指定属性
    removeAttr: function(name) {
        return each(this, function(el) {
            isElement(el) && setAttribute(el, name)
        });
    },

    // ** .hasAttr() **
    //
    // * .hasAttr(name)
    //
    //   判断符合选择器的所有元素中是否有某个元素含有特定属性
    hasAttr: function(name) {
        if (!name) return false;
        return some.call(this, function(el) {
            return isElement(el) && el.getAttribute(name);
        });
    },

    // ** .prop() **
    //
    // * .prop(name)
    //
    //   获取符合选择器的第一个元素的对应 property 值
    //
    // * .prop(name, val)
    //
    //   给符合选择器的所有元素设置 property 值
    //
    // * .prop(kv)
    //
    //   给符合选择器的所有元素设置 property 值
    prop: function(name, val) {
        name = propFixMap[name] || name;
        return val == undefined ?
            this[0] && this[0][name] :
            each(this, function(el) {
                el[name] = val;
            });
    },

    // ** .hasProp() **
    //
    // * .hasProp(name)
    //
    //  判断符合选择器的第一个元素是否含有特定 property 属性
    hasProp: function(name) {
        if (!name) return false;
        name = propFixMap[name] || name;
        return some.call(this, function(el) {
            return isElement(el) && el[name];
        });
    },

    // ** .val() **
    //
    // * .val()
    //
    //  获取符合选择器的第一个元素所的 value 值
    //
    // * .val(val)
    //
    //  给符合选择器的所有元素设置 value 值
    //
    // 如果是 `<select multiple>` 标签，则返回一个数组
    val: function(val) {
        var el = this[0];

        if (!el) return this;

        if (el.multiple) {
            var opts = $('option', el);

            return val == undefined ?
                slice.call(
                    pluck(
                        opts.filter(function(opt) {
                            return opt.selected;
                        }), 'value'
                    )
                ) :
                each(opts, function(opt) {
                    opt.selected = ~val.indexOf(opt.value);
                });
        } else {
            return val == undefined ?
                el.value :
                each(this, function(el) {
                    el.value = val;
                });
        }
    },

    // ** .text() **
    //
    // * .text()
    //
    //  获取符合选择器的第一个元素所包含的文本值
    //
    // * .val(text)
    //
    //  给符合选择器的所有元素设置文本值
    text: function(text) {
        return text === undefined ?
            this.length ?
                this[0].textContent : null
            :
            each(this, function(el) {
                el.textContent = (text === undefined) ? '' : '' + text
            });
    }

});

/**
 * @ignore
 * @file node-style
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var cssNumber = {
        'column-count': 1,
        'columns'     : 1,
        'font-weight' : 1,
        'line-height' : 1,
        'opacity'     : 1,
        'z-index'     : 1,
        'zoom'        : 1
    },
    elDisplay = {};

function dasherize(str) {
    return str.replace(/::/g, '/')
              .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
              .replace(/([a-z\d])([A-Z])/g, '$1_$2')
              .replace(/_/g, '-')
              .toLowerCase();
}

// ** .camelCase() **
//
// * .camelCase(name)
//
//  内部方法，将一组字符串变成“骆驼”命名法的新字符串，如果该字符已经是“骆驼”命名法，则不变化
//
// ```
// .camelCase('abc-def'); //=> 'abcDef'
// .camelCase('abcDef');  //=> 'abcDef'
// ```
function camelCase(name) {
    return name.replace(/-+(.)?/g, function() {
        return arguments[1].toUpperCase();
    });
}

// ** .maybeAddPx() **
//
// * .maybeAddPx(name, val)
//
//  内部方法，根据情况将数字转换为带单位的值
//
// ```
// .maybeAddPx('width', 12); //=> '12px'
// ```
function maybeAddPx(name, val) {
    return isNumber(val) && !cssNumber[dasherize(name)] ? val + 'px' : val;
}

// ** .getComputedStyle() **
//
// * .getComputedStyle(el, name)
//
//  内部方法，获取元素所有最终使用的 CSS 属性值
function getComputedStyle(el, name) {
    return win.getComputedStyle(el, null).getPropertyValue(name);
}

// ** .getDefaultDisplay() **
//
// * .getDefaultDisplay(tagName)
//
//  内部方法，获取 tag 元素原始 display 属性
function getDefaultDisplay(tagName) {
    if (!elDisplay[tagName]) {
        var el = doc.createElement(tagName),
            display;

        doc.body.appendChild(el);
        display = getComputedStyle(el, 'display');
        el.parentNode.removeChild(el);
        display == 'none' && (display = 'block');
        elDisplay[tagName] = display;
    }

    return elDisplay[tagName];
}

mix(node, {

    // ** .css() **
    //
    // * .css(name)
    //
    //  获取符合选择器的第一个元素的样式值
    //
    // * .css(name, val)
    //
    //  给符合选择器的所有元素设置样式值
    //
    // * .css(kv)
    //
    //  给符合选择器的所有元素设置样式值
    //
    // ```
    // var el = $('h1');
    // el.css('background-color');         // 获取属性
    // el.css('background-color', '#369'); // 设置属性
    // el.css('background-color', '');     // 删除属性
    // // 设置多个属性
    // el.css({
    //     fontSize       : 28,
    //     backgroundColor: '#8EE'
    // });
    // ```
    css: function(name, val) {
        var key,
            ret = '';

        if (val == undefined) {
            if (isString(name)) {
                var el = this[0];

                return el ? el.style[camelCase(name)] || getComputedStyle(el, name) : '';
            } else if (isObject(name)) {
                for (key in name) {
                    ret += dasherize(key) + ':' + maybeAddPx(key, name[key]) + ';';
                }
            }
        } else {
            ret = dasherize(name) + ':' + maybeAddPx(name, val) + ';';
        }

        return each(this, function(el) {
            el.style.cssText += ';' + ret;
        });
    },

    // ** .show() **
    //
    // * .show()
    //
    //  显示符合选择器的所有元素
    show: function() {
        return each(this, function(el) {
            el.style.display == 'none' && (el.style.display = '');
            if (getComputedStyle(el, 'display') == 'none') {
                el.style.display = getDefaultDisplay(el.nodeName);
            }
        });
    },

    // ** .hide() **
    //
    // * .hide()
    //
    //  隐藏符合选择器的所有元素
    hide: function() {
        return this.css('display', 'none');
    },

    // ** .toggle() **
    //
    // * .toggle()
    //
    //  将符合选择器的所有元素切换显示/隐藏两个状态
    toggle: function() {
        return each(this, function(el) {
            var $el = $(el);

            $el.css('display') == 'none' ? $el.show() : $el.hide();
        });
    }

});

// ** .width() **
//
// * .width()
//
//  获取符合选择器的第一个元素的宽度值
//
// * .width(val)
//
//  给符合选择器的所有元素设置宽度值
//
// `.width()` 和 `.css('width')` 的区别
//
// `.width()` 返回不带单位的纯数值，`.css('width')` 返回带单位的原始值（例如：400px），当需要数值计算时, 推荐该方法.
//
// 获取 `window` 和 `document` 的宽度
//
// ```
// // 获取当前可视区域的宽度值, 相当于 viewportWidth
// S.all(window).width();
//
// // 获取页面文档 document 的总宽度, 相当于 docWidth
// S.all(document).width();
// ```
//
// ** .height() **
//
// * .height()
//
//  获取符合选择器的第一个元素的高度值
//
// * .height(val)
//
//  给符合选择器的所有元素设置高度值
//
// 获取 `window` 和 `document` 的高度
//
// ```
// // 获取当前可视区域的高度值, 相当于 viewportHeight
// S.all(window).height();
//
// // 获取页面文档 document 的总高度, 相当于 docHeight
// S.all(document).height();
// ```
each(['width', 'height'], function(method) {
    node[method] = function(val) {
        var el = this[0];

        if (val) {
            return $(this).css(method, val);
        } else {
            return isWindow(el) ? el[camelCase('inner-' + method)] :
                isDocument(el) ? docEl[camelCase('scroll-' + method)] :
                    this.offset()[method];
        }
    };
});

/**
 * @ignore
 * @file node-traversal
 * @author 莫争 <gaoli.gl@taobao.com>
 */

function filtered(els, selector) {
    var $els = $(els);

    return selector !== undefined ?
        $els.filter(
            isArray(selector) ?
                function(el) {
                    return some.call(selector, function(filter) {
                        return matches(el, filter);
                    });
                } :
                selector
        ) :
        $els;
}

function children(el) {
    return 'children' in el ?
        slice.call(el.children) :
        map(el.childNodes, function(el) {
            if (isElement(el)) {
                return el;
            }
        });
}

function nth(el, filter, property, includeSelf) {
    var ret   = [],
        array = isArray(filter);

    el = includeSelf ? el : el[property];

    while (el) {
        if (el && !isDocument(el) && isElement(el) && ret.indexOf(el) < 0) {
            ret.push(el);
        }
        el = el[property];
    }

    if (array && !filter.length) {
        filter = undefined
    }

    ret = filtered(ret, filter);

    return array ?
        ret :
        ret.item(0);
}

mix(node, {

    // ** .item() **
    //
    // * .item(index)
    //
    //  获取包含当前节点列表 index 位置处的单个原生节点的新 NodeList 对象
    item: function(index) {
        var self = this;

        return isNumber(index) ?
            index >= self.length ?
                null :
                $(self[index]) :
            $(index);
    },

    // ** .first() **
    //
    // * .first([filter])
    //
    //  获取符合选择器的第一个元素的第一个子节点
    first: function(filter) {
        return nth(this[0] && this[0].firstChild, filter, 'nextElementSibling', true);
    },

    // ** .last() **
    //
    // * .last([filter])
    //
    //  获取符合选择器的第一个元素的最后一个子节点
    last: function(filter) {
        return nth(this[0] && this[0].lastChild, filter, 'previousElementSibling', true);
    },

    // ** .next() **
    //
    // * .next([filter])
    //
    //  获取符合选择器的第一个元素的下一个同级节点
    next: function(filter) {
        return nth(this[0], filter, 'nextElementSibling');
    },

    // ** .prev() **
    //
    // * .prev([filter])
    //
    //  获取符合选择器的第一个元素的上一个同级节点
    prev: function(filter) {
        return nth(this[0], filter, 'previousElementSibling');
    },

    // ** .parent() **
    //
    // * .parent([filter])
    //
    //  获取符合选择器的第一个元素的祖先元素
    parent: function(filter) {
        return nth(this[0], filter, 'parentNode');
    },

    // ** .children() **
    //
    // * .children([filter])
    //
    //  获取符合选择器的所有非文字节点的子节点
    children: function(selector) {
        var el = this[0];

        return el ?
            filtered(children(el), selector) :
            this;
    },

    // ** .siblings() **
    //
    // * .siblings([filter])
    //
    //  获取符合选择器的第一个元素的相应同级节点
    siblings: function(selector) {
        var el = this[0];

        return el ?
            filtered(
                filter.call(children(el.parentNode), function(child) {
                    return child !== el;
                })
            , selector) :
            this;
    },

    // ** .contents() **
    //
    // * .contents()
    //
    //  获取符合选择器的所有子节点（包括文字节点）
    contents: function() {
        var el = this[0];

        return el ?
            $(slice.call(el.childNodes)) :
            this;
    },

    // ** .contains() **
    //
    // * .contains(contained)
    //
    //  判断某一容器（container）是否包含另一（contained）节点
    contains: function(contained) {
        var container = this[0],
            contained = likeArray(contained) ? contained[0] : contained;

        return container && contained ?
            container !== contained && container.contains(contained) :
            false;
    }

});

/**
 * @ignore
 * @file node-insertion
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// ** .filterScripts() **
//
// * .filterScripts(nodes, scripts)
//
//  内部方法，将 nodes 中的脚本节点过滤掉
function filterScripts(nodes, scripts) {
    var ret = [];

    each(nodes, function(node) {
        var name = node.nodeName,
            type = node.type,
            temp = [];

        if (name && name === 'SCRIPT' && (!type || type === 'text/javascript')) {
            node.parentNode && node.parentNode.removeChild(node);
            scripts && scripts.push(node);
        } else {
            if (isElement(node)) {
                each(node.getElementsByTagName('script'), function(el) {
                    temp.push(el);
                });
                filterScripts(temp, scripts);
            }
            ret.push(node);
        }
    });

    return ret;
}

// ** .nodeListToFragment() **
//
// * .nodeListToFragment(nodes)
//
//  内部方法，将 nodes 转换为文档片段，不会被添加到文档树中
function nodeListToFragment(nodes) {
    var ret = null;

    if (nodes && likeArray(nodes)) {
        ret = doc.createDocumentFragment();

        each(nodes, function(node) {
            ret.appendChild(node);
        });
    }

    return ret;
}

mix(node, {

    // ** .wrapAll() **
    //
    // * .wrapAll(wrapperNode)
    //
    //  在所有匹配元素外面包一层 HTML 结构
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrapAll('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    // ```
    wrapAll: function(wrapperNode) {
        var el = this[0];

        if (el) {
            var $wrapperNode = $(wrapperNode),
                $wrapperChildren;

            $wrapperNode.insertBefore(el);

            while (($wrapperChildren = $wrapperNode.children()).length) {
                $wrapperNode = $wrapperNode.first();
            }

            $wrapperNode.append(this);
        }

        return this;
    },

    // ** .wrap() **
    //
    // * .wrap(wrapperNode)
    //
    //  在每个匹配的元素外层包上一个 HTML 元素
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrap('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //     </div>
    //     <div class="new">
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    // ```
    wrap: function(wrapperNode) {
        var $wrapperNode = $(wrapperNode),
            wrapperClone = $wrapperNode[0].parentNode || this.length;

        return each(this, function(el) {
            $(el).wrapAll(
                wrapperClone ? $wrapperNode[0].cloneNode(true) : $wrapperNode[0]
            )
        });
    },

    // ** .unwrap() **
    //
    // * .unwrap()
    //
    //  移除集合中每个元素的直接父节点，并把他们的子元素保留在原来的位置
    //
    // ```
    // <div class="container">
    //     <div class="new">
    //         <div class="inner">Hello</div>
    //     </div>
    //     <div class="new">
    //         <div class="inner">Goodbye</div>
    //     </div>
    // </div>
    //
    // S.all('.inner').unwrap(); //=>
    //
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    // ```
    unwrap: function() {
        return each(this, function(el) {
            var $el     = $(el),
                $parent = $el.parent();

            $parent.replaceWith($parent.children());
        });
    },

    // ** .wrapInner() **
    //
    // * .wrapInner(wrapperNode)
    //
    //  将每个元素中的内容包裹在一个单独的结构中
    //
    // ```
    // <div class="container">
    //     <div class="inner">Hello</div>
    //     <div class="inner">Goodbye</div>
    // </div>
    //
    // S.all('.inner').wrapInner('<div class="new" />'); //=>
    //
    // <div class="container">
    //     <div class="inner">
    //         <div class="new">Hello</div>
    //     </div>
    //     <div class="inner">
    //         <div class="new">Goodbye</div>
    //     </div>
    // </div>
    // ```
    wrapInner: function(wrapperNode) {
        return each(this, function(el) {
            var $el       = $(el),
                $children = $el.children();

            if ($children.length) {
                $children.wrapAll(wrapperNode);
            } else {
                $el.append(wrapperNode);
            }
        });
    },

    // ** .replaceWith() **
    //
    // * .replaceWith(newNodes)
    //
    //  用给定的内容替换所有匹配的元素
    replaceWith: function(newNodes) {
        return this.before(newNodes).remove();
    }

});

// ** .after() **
//
// * .after(html)
//
//  在匹配元素集合中的每个元素后面插入内容，作为其兄弟节点
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .prepend() **
//
// * .prepend(html)
//
//  将内容插入到每个匹配元素的前面（元素内部）
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .before() **
//
// * .before(html)
//
//  在匹配元素的前面（元素外部）插入内容
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组
//
// ** .append() **
//
// * .append(html)
//
//  在每个匹配元素里面的末尾处插入内容
//
//  内容可以为 HTML字符串，DOM 元素，DOM元素数组

each(['after', 'prepend', 'before', 'append'], function(method, index) {
    var inside = index % 2;

    node[method] = function(html, loadScripts) {
        var nodes  = isString(html) ? node.create(html) : html,
            isCopy = this.length > 1,
            parent,
            target;

        if (loadScripts) {
            var scripts = [];
        }

        if (nodes.length) {
            nodes = nodeListToFragment(filterScripts(nodes, scripts));
        } else {
            return this;
        }

        return each(this, function(el) {
            parent = inside ? el : el.parentNode;

            switch (index) {
                case 0:
                    target = el.nextSibling;
                    break;
                case 1:
                    target = el.firstChild;
                    break;
                case 2:
                    target = el;
                    break;
                default:
                    target = null
            }

            parent.insertBefore(isCopy ? nodes.cloneNode(true) : nodes, target);

            each(scripts, function(el) {
                if (el.src) {
                    getScript(el.src);
                } else {
                    win['eval'].call(win, el.innerHTML);
                }
            });
        });
    };

    // ** .insertAfter() **
    //
    // * .insertAfter(target)
    //
    //  将集合中的元素插入到指定的目标元素后面（外部插入）
    //
    // ** .prependTo() **
    //
    // * .prependTo(target)
    //
    //  将所有元素插入到目标前面（内部插入）
    //
    // ** .insertBefore() **
    //
    // * .insertBefore(target)
    //
    //  将集合中的元素插入到指定的目标元素前面（外部插入）
    //
    // ** .appendTo() **
    //
    // * .appendTo(target)
    //
    //  将匹配的元素插入到目标元素的末尾（内部插入）
    node[inside ? method + 'To' : 'insert' + (index ? 'Before' : 'After')] = function(target) {
        $(target)[method](this);
        return this;
    };
});

/**
 * @ignore
 * @file node-offset
 * @author 莫争 <gaoli.gl@taobao.com>
 */

mix(node, {

    // ** .offset() **
    //
    // * .offset()
    //
    //  获取符合选择器的第一个元素相对页面文档左上角的偏移值
    //
    // * .offset(coordinates)
    //
    //  给符合选择器的所有元素设置偏移值
    offset: function(coordinates) {
        var ret;

        if (this.length) {
            if (coordinates === undefined) {
                var obj = this[0].getBoundingClientRect();

                ret = {
                    left  : obj.left + win.pageXOffset,
                    top   : obj.top  + win.pageYOffset,
                    width : Math.round(obj.width),
                    height: Math.round(obj.height)
                }
            } else {
                each(this, function(el) {
                    var ret = {},
                        $el = $(el),
                        old = $el.offset(),
                        key,
                        current;

                    if ($el.css('position') === 'static') {
                        $el.css('position', 'relative');
                    }

                    for (key in coordinates) {
                        current  = parseFloat($el.css(key)) || 0;
                        ret[key] = current + coordinates[key] - old[key];
                    }

                    $el.css(ret);
                });

                return this;
            }
        }

        return ret;
    }

});

// ** .scrollTop() **
//
// * .scrollTop()
//
//  获取窗口或元素的 scrollTop 值
//
// * .scrollTop(val)
//
//  设置窗口或元素的 scrollTop 值
//
// ** .scrollLeft() **
//
// * .scrollLeft()
//
//  获取窗口或元素的 scrollLeft 值
//
// * .scrollLeft(val)
//
//  设置窗口或元素的 scrollLeft 值
each(['scrollTop', 'scrollLeft'], function(method, index) {

    node[method] = function(val) {
        var el        = this[0],
            hasScroll = method in el;

        return val === undefined ?
            hasScroll ?
                el[method] :
                el['page' + (index ? 'X' : 'Y') + 'Offset']
            :
            hasScroll ?
                each(this, function(el) {
                    el[method] = val;
                }) :
                each(this, function(el) {
                    if (index) {
                        el.scrollTo(val, el.scrollY);
                    } else {
                        el.scrollTo(el.scrollX, val);
                    }
                });
    }

});

/**
 * @ignore
 * @file node-create
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var RE_TAG        = /<([\w:]+)/,
    RE_XHTML_TAG  = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    RE_SINGLE_TAG = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

var div        = doc.createElement('div'),
    table      = doc.createElement('table'),
    tableBody  = doc.createElement('tbody'),
    tableRow   = doc.createElement('tr'),
    containers = {
        '*'  : div,
        thead: table,
        tbody: table,
        tfoot: table,
        tr   : tableBody,
        th   : tableRow,
        td   : tableRow
    };

mix(node, {

    // ** .create() **
    //
    // * .create(html, props)
    //
    //  创建 dom 节点
    //
    // ```
    // S.node.create('<div>')
    // S.node.create('<div />')
    // S.node.create('<div></div>') //=> 创建 DIV 节点
    // ```
    // ```
    // S.node.create('<div></div>', {
    //     text: 'ok',
    //     css : {color: 'red'}
    // }); //=> 创建 DIV 节点，内容为'ok'，颜色为红色
    // ```
    create: function(html, props) {
        var key,
            ret = [],
            tag,
            container;

        if (!html || !isString(html)) {
            return ret;
        }

        if (RE_SINGLE_TAG.test(html)) {
            ret = $(doc.createElement(RegExp.$1));
        } else {
            html = html.replace(RE_XHTML_TAG, '<$1></$2>');
            tag  = RE_TAG.test(html) && RegExp.$1;

            container = containers[tag] || containers['*'];
            container.innerHTML = html;

            ret = each(slice.call(container.childNodes), function(el) {
                container.removeChild(el);
            });
        }

        if (isPlainObject(props)) {
            for (key in props) {
                ret.attr(key, props[key]);
            }
        }

        return ret;
    },

    // ** .html() **
    //
    // * .html()
    //
    //  获取符合选择器的第一个元素的 innerHTML
    //
    // * .html(html[, loadScripts])
    //
    //  给符合选择器的所有元素设置 innerHTML 值
    //
    //  loadScripts 表示是否执行 html 中的内嵌脚本，默认 false
    //
    // ```
    // var el   = S.node.create('<div id="J_check"></div>');
    // var html = [
    //     '<h3>This is the added part</h3>',
    //     '<script>alert(1)</script>'
    // ].join('');
    // el.html(html);
    // //=> 不会 alert(1)
    // el.html();
    // //=> <h3>This is the added part</h3>
    // el.html(html, true);
    // //=> alert(1)
    // ```
    html: function(html, loadScripts) {
        return html === undefined ?
            this.length ? this[0].innerHTML : null
            :
            each(this, function(el) {
                $(el).empty().append(html, loadScripts);
            });
    },

    // ** .remove() **
    //
    // * .remove()
    //
    //  将符合选择器的所有元素从 DOM 中移除
    remove: function() {
        var self = this;

        // 移除所有事件绑定
        self.detach && self.detach();

        return each(self, function(el) {
            el.parentNode && el.parentNode.removeChild(el)
        });
    },

    // ** .empty() **
    //
    // * .empty()
    //
    //  清除节点的所有子孙节点
    empty: function() {
        return each(this, function(el) {
            el.innerHTML = '';
        });
    },

    // ** .clone() **
    //
    // * .clone([deep])
    //
    //  获取符合选择器的第一个元素的克隆元素
    //
    //  deep 表示是否深度克隆（克隆节点的子孙节点），默认 false
    clone: function(deep) {
        return $(
            map(this, function(el) {
                return el.cloneNode(!!deep);
            })
        );
    }

});

/**
 * @ignore
 * @file ie
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// IE10 及以下浏览器不支持 `__proto__` 继承，需重写 `.node()` 和 `.isNode()` 方法来兼容
if (!('__proto__' in {})) {
    mix($, {
        node: function(els) {
            els = els || [];
            mix(els, node);
            els.__node = true;
            return els;
        },
        isNode: function(obj) {
            return isArray(obj) && '__node' in obj;
        }
    });
}
/**
 * @ignore
 * @file output
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// ** Node 模块提供的快捷方式 **
//
// ```
// mix(S, {
//     node    : node,  // 参元类
//     Node    : $,     // 构造器
//     NodeList: $,     // 构造器
//     one     : $.one, // 获取 / 创建一个 Node 对象
//     all     : $.all  // 获取 / 创建一批 Node 对象
// });
// ```
mix(S, {
    node    : node,
    Node    : $,
    NodeList: $,
    one     : $.one,
    all     : $.all
});

S.add && S.add('node', function (S) {
    return $;
});

}(this, KISSY));
// ## Event 模块
// 
// **Event 用法：**
//
// 1.直接使用
//
// ```
//	var $ = KISSY.Node.all;
//	$('body').on('click', function(ev){
//		console.log(ev)
//	});
// ```
//
// 2.普通对象的自定义事件
//
//	```
//	var a = {}, S = KISSY;
//	S.mix(a, S.Event.Target);
//	a.on('my_event', function(ev){
//		console.log(ev)
//	});
//	a.fire('my_event', {"data1": 1, "data2": 2});
//	```
// **未列出的Event API與KISSY保持用法一致**
//
//| API                      | KISSY                | KISSY-MINI           |
//| --------------------     |:--------------------:|:--------------------:|
//| Event.Object             | YES                  | NO                   |
//| Event.Target.publish     | YES                  | NO                   |
//| Event.Target.addTarget   | YES                  | NO                   |
//| Event.Target.removeTarget| YES                  | NO                   |
//| mouseenter               | YES                  | NO                   |
//| mouseleave               | YES                  | NO                   |
//| mousewheel               | YES                  | NO                   |
//| gestures                 | YES                  | `Import touch.js*`   |
//| &nbsp;|&nbsp;|&nbsp;| 
//
// **与 zeptojs 对比，有以下差异：**
//
// 1. 去除对鼠标兼容事件的支持，包括 mouseenter/mouseleave；
// 2. 提供对普通对象的自定义事件支持，需提前混入 S.Event.Target
//
// **与 KISSY 对比，有以下差异：**
//
// 1. 仅支持链式调用，不支持 Event.on 语法；
// 2. 自定义事件不支持冒泡等属性和方法；
// 3. 触控事件需额外引入 touch.js；
// 4. 回调返回的 event 对象是兼容处理后的原生事件对象，不再提供 ev.originalEvent

(function(S){

var $ = S.all,
    Node = S.node,
    _eid = 1,
    isFunction = function(obj){
        return typeof obj == 'function';
    },
    /* 简化 S.mix */
    mix = function(target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
    },
    /* 简化 S.each */
    each = function(obj, iterator, context) {
        Object.keys(obj).map(function(name){
            iterator.call(context, obj[name], name, obj);
        });
    },
    slice = [].slice,
    handlers = [],
    focusinSupported = 'onfocusin' in window,
    /* 焦点事件代理 */
    focusEvent = {
        focus: 'focusin',
        blur: 'focusout'
    },
    specialEvents = {
        "click": "MouseEvent"
    },
    eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
    };

/**
 * 生成返回布尔值函数的方法
 * @param  {[type]} trueOrFalse [description]
 * @return {[type]}             [description]
 */
// returnBool(trueOrFalse)
//
// 内部方法，生成返回布尔值函数的方法
function returnBool(trueOrFalse) {
   return function(){ return trueOrFalse; };
}

/**
 * 生成和 DOM 绑定的唯一 id
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
// eid(element)
//
// 内部方法，生成和 DOM 绑定的唯一 id
function eid(element) {
    return element._eid || (element._eid = _eid++);
}

/**
 * 解析事件字符串
 * @param  {String} event 原始的事件类型字符串
 * @return {Object}       解析后得到的事件类型对象
 */
// parse(event)
//
// 内部方法，解析事件字符串
function parse(event) {
    var parts = event.split('.');
    return {
        e : parts[0],
        ns: parts.slice(1).join(' ')
    };
}

/**
 * 根据事件类型 ns 生成匹配正则，用于判断是否在同一个分组
 * @param  {String} ns [description]
 * @return {RegExp}    [description]
 */
// matcherFor(ns)
//
// 内部方法，根据事件类型 ns 生成匹配正则，用于判断是否在同一个分组
function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |S)');
}

/**
 * 获得指定的 Handler
 * @param  {[type]}   element  [description]
 * @param  {[type]}   event    [description]
 * @param  {Function} fn       [description]
 * @param  {[type]}   selector [description]
 * @return {[type]}            [description]
 */
// findHandlers(el,event,fn)
//
// 内部方法，获得指定的 Handler
function findHandlers(element, event, fn, selector, scope) {
    var evt = parse(event);
    if (evt.ns) var matcher = matcherFor(event.ns);
    return (handlers[eid(element)] || []).filter(function(handler) {
        return handler &&
            (!evt.e || handler.e == evt.e) &&
            (!evt.ns || matcher.test(handler.ns)) &&
            (!fn || handler.fn === fn) &&
            (!selector || handler.sel == selector) &&
            (!scope || handler.scope === scope);
    });
}

/**
 * 获得是否捕获事件状态，焦点事件一律捕获
 * @param  {[type]}  handler        [description]
 * @param  {[type]}  captureSetting [description]
 * @return {Boolean}                [description]
 */
// isCapture(handler,capture)
//
// 内部方法，获得是否捕获事件状态，焦点事件一律捕获
function isCapture(handler, capture) {
    return handler.del &&
        (!focusinSupported && (handler.e in focusEvent)) || !!capture;
}

/**
 * 将焦点事件统一为真实事件，但 firefox 因为不支持 focusinout 所以不会被转换
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
// eventCvt(type)
//
// 内部方法，将焦点事件统一为真实事件，但 firefox 因为不支持 focusinout 所以不会被转换
function eventCvt(type) {
    return (focusinSupported && focusEvnet[type]) || type;
}

/**
 * 复制原事件对象，并作为原事件对象的代理
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
// createProxy(event)
//
// 内部方法，复制原事件对象，并作为原事件对象的代理
function createProxy(event) {
    var key, proxy = {
            originalEvent: event
        };
    for (key in event)
        if (event[key] !== undefined) proxy[key] = event[key];
    return compatible(proxy, event);
}

/**
 * 针对三个事件属性做兼容
 * @param  {[type]} event  [description]
 * @param  {[type]} source [description]
 * @return {[type]}        [description]
 */
// compatible(event,source)
//
// 内部方法，针对三个事件属性做兼容
function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
        source || (source = event);
        each(eventMethods, function(predicate,name) {
            var sourceMethod = source[name];
            event[name] = function() {
                this[predicate] = returnBool(true);
                return sourceMethod && sourceMethod.apply(source, arguments);
            };
            event[predicate] = returnBool(false);
        });

		event.halt = function(){
			this.preventDefault();
			this.stopPropagation();
		};

        if (source.defaultPrevented !== undefined ? source.defaultPrevented :
            'returnValue' in source ? source.returnValue === false :
            source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnBool(true);
    }
    return event;
}

/**
 * 生成原生事件对象
 * @param  {[type]} type  [description]
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
// createEvent(type,props)
//
// 内部方法，生成原生事件对象
function createEvent(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'),
        bubbles = true;
    if (props) {
        for (var name in props) {
            name == 'bubbles' ? (bubbles = !!props[name]) : (event[name] = props[name]);
        }
    }
    event.initEvent(type, bubbles, true);
    return compatible(event);
}

/**
 * 添加事件绑定的主函数
 * @param {[type]}   element   [description]
 * @param {[type]}   events    [description]
 * @param {Function} fn        [description]
 * @param {[type]}   data      [description]
 * @param {[type]}   selector  [description]
 * @param {[type]}   delegator [description]
 * @param {[type]}   capture   [description]
 */
// add(el,event,fn)
//
// 内部方法，添加事件绑定的主函数
function add(element, events, fn, selector, delegator, scope) {
    var id = eid(element),
        set = (handlers[id] || (handlers[id] = []));
    if (events == 'ready') return S.ready(fn);
    events.split(/\s/).map(function(event) {
        var handler = parse(event);
        handler.fn = fn;
        handler.sel = selector;
        handler.del = delegator;
        handler.scope = scope;
        var callback = delegator || fn;
        handler.proxy = function(e) {
            e = compatible(e);
            if (e.isImmediatePropagationStopped()) return;
            var result = callback.apply(scope || element, e._args == undefined ? [e] : [e].concat(e._args));
            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }
            return result;
        };
        handler.i = set.length;
        set.push(handler);
        element.addEventListener(eventCvt(handler.e), handler.proxy, isCapture(handler));
		/* 自定义 DOM 事件处理，初始化*/
		if(event in S.Event.Special){
			S.Event.Special[event].setup.apply(S.one(element,[handler.scope]));
		}
    });
}

/**
 * 移除事件绑定的主函数
 * @param  {[type]}   element  [description]
 * @param  {[type]}   events   [description]
 * @param  {Function} fn       [description]
 * @param  {[type]}   selector [description]
 * @param  {[Object]} scope    [description]
 * @return {[type]}            [description]
 */
// remove(el,event,fn)
//
// 内部方法，移除事件绑定的主函数
function remove(element, events, fn, selector, scope) {
    var id = eid(element),
        removeHandlers = function(set) {
            set.map(function(handler){
                delete handlers[id][handler.i];
                element.removeEventListener(eventCvt(handler.e), handler.proxy, isCapture(handler));
                /* 自定义 DOM 事件处理，销毁*/
                if(typeof event !== undefined && event in S.Event.Special){
                    S.Event.Special[event].teardown.apply(S.one(element));
                }
            });
        };
    if(events) {
        events.split(/\s/).map(function(event) {
            removeHandlers(findHandlers(element, event, fn, selector, scope));
        });
    }
    else removeHandlers(handlers[id] || []);
}

/**
 * 主要绑定函数，包括 delegate 的处理方法
 * @param  {[type]}   event    [description]
 * @param  {[type]}   selector [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   scope    [description]
 * @return {[type]}            [description]
 */
// **S.Node.on(event,selector,callback,[scope])**
//
// 事件绑定
//
// ```
// S.Event.on('click','div',function(e){...})
// ```
//
// 可以使用`els.on('click',callback)`
//
// **el.on(eventType,callback)**
//
// 在元素上进行事件绑定，el也可以是Node列表，比如
//
// ```
// S.one('div').on('click',function(){
//		alert('ok');
// });
// ```
Node.on = function(event, selector, callback, scope) {
    var delegator, _this = this;

    /* selector 为空的情况，即非 delegator */
    if (isFunction(selector)) {
        scope = callback;
        callback = selector;
        selector = undefined;
    }

    /* 阻止默认事件，kissy 不支持此方式 */
    if (callback === false) callback = returnFalse;

    _this.each(function(element) {
        /* delegate 处理逻辑 */
        if (selector) delegator = function(e) {
            var evt, match, matches = element.all(selector);
            if(!matches || !matches.length) return;
            match = matches.filter(function(el){
                return (el == e.target) || ($(el).contains(e.target));
            })[0];
            if (match && match !== element[0]) {
                evt = createProxy(e);
                evt.currentTarget = match;
                evt.liveFired = element[0];
                return callback.apply(scope || match, [evt].concat(slice.call(arguments, 1)));
            }
        };

        add(element[0], event, callback, selector, delegator, scope);
    });

    return _this;
};

/**
 * 取消事件绑定的主函数
 * @param  {[type]}   event    [description]
 * @param  {[type]}   selector [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   scope    [description]
 * @return {[type]}            [description]
 */
// **S.Node.detach(event,selector,callback,[scope])**
//
// 取消事件绑定，推荐直接调用**els.detach('click',callback)**
//
// **el.detach(eventType,callback)**
//
// 取消元素事件，el也可以是Node列表。
Node.detach = function(event, selector, callback, scope) {
    var _this = this;

    if (isFunction(selector)) {
        scope = callback;
        callback = selector;
        selector = undefined;
    }

    _this.each(function(element) {
        remove(element[0], event, callback, selector, scope);
    });

    return _this;
};

/**
 * delegate 主函数，只是 Node.on 的别名
 * @param  {[type]}   event    [description]
 * @param  {[type]}   selector [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   scope    [description]
 * @return {[type]}            [description]
 */
// **S.Node.delegate(event,selector,function(){...},[scope])**
//
// 事件委托，推荐直接调用**el.delegate('event',callback,scop)**
//
// **el.delegate(eventType,callback,scope)**
//
// 针对当前节点执行事件委托，scope 为委托的节点或选择器
Node.delegate = function(event, selector, callback, scope) {
    return this.on(event, selector, callback, scope);
};

/**
 * undelegate 主函数，只是 Node.detach 的别名
 * @param  {[type]}   event    [description]
 * @param  {[type]}   selector [description]
 * @param  {Function} callback [description]
 * @param  {[type]}   scope    [description]
 * @return {[type]}            [description]
 */
// **S.Node.undelegate(event,selector,function(){...},[scope])**
//
// 解除事件委托，是`Node.detach`的别名，推荐直接调用**el.undelegate()**
//
// **el.undelegate(eventType,callback,scope)**
//
// 针对当前节点执行解除事件委托，scope 为委托的节点或选择器
Node.undelegate = function(event, selector, callback, scope) {
    return this.detach(event, selector, callback, scope);
};


/**
 * 执行符合匹配的 dom 节点的相应事件的事件处理器
 * @param  {String} events [description]
 * @param  {Object} props  模拟处理原生事件的一些信息
 * @return {[type]}       [description]
 */
// **S.Node.fire(event,props)**
//
// 执行符合匹配的 dom 节点的相应事件的事件处理器，推荐直接调用
//
// ```
// el.fire('click')
// ```
//
// **el.fire(eventType,props)**
//
// 触发节点元素的`eventType`事件，el.fire 函数继承自 `S.Node.fire(event,props)`
// - eventType: 事件类型
// - props：触发事件的时候传入的回传参数
//
// ```
// S.one('div').on('click',function(e){
//		alert(e.a);
// });
// S.one('div').fire('click',{
//		a:1
// });
// // => 弹出框，值为1
// ```
Node.fire = function(events, props) {
    var _this = this;
    events.split(/\s/).map(function(event){
        event = createEvent(event, props);
        _this.each(function(element) {
            if ('dispatchEvent' in element[0]) element[0].dispatchEvent(event);
            else element.fireHandler(events, props);
        });
    });
    return _this;
};

/**
 * 执行符合匹配的 dom 节点的相应事件的事件处理器，不会冒泡
 * @param  {[type]} event [description]
 * @param  {[type]} props  [description]
 * @return {[type]}       [description]
 */
// **S.Node.fireHandler(event,props)**
//
// 执行符合匹配的 dom 节点的相应事件的事件处理器，不会冒泡
//
// 推荐直接执行
//
// ```
// el.fireHandler('click',{...})
// ```
//
// **el.fireHandler(eventType,props)**
//
// 以非冒泡形式触发回调，由`el.fire()`函数调用，在单纯希望执行事件绑定函数时使用此方法
Node.fireHandler = function(events, props) {
    var e, result, _this = this;
    events.split(/\s/).map(function(event){
        _this.each(function(element) {
            e = createEvent(event);
            e.target = element[0];
			if(e.target === null){
				e = getCustomDOMEvent(e);
			}
			mix(e,props);
            findHandlers(element[0], event).map(function(handler, i) {
                result = handler.proxy(e);
                if (e.isImmediatePropagationStopped()) return false;
            });
        });
    });
    return _this;
};

function getCustomDOMEvent(e){
	var eProxy = {};
	mix(eProxy,e);
	eProxy.__proto__ = e.__proto__;
	return eProxy;
}


S.Event || (S.Event = {});
/**
 * 将普通对象混入 Event.Target 后，即能拥有简单的自定义事件特性。
 * @type {Object}
 */
// **S.Event.Target**
//
// 简单自定义事件对象，将普通对象混入 `Event.Target` 后，即能拥有简单的自定义事件特性。
//
// 事件本身是一个抽象概念，和平台无关、和设备无关、更和浏览器无关，浏览器只是使用“事件”的方法来触发特定的行为，进而触发某段网页逻辑。而常见的DOM事件诸如click,dbclick是浏览器帮我们实现的“特定行为”。而这里的“特定行为”就是触发事件的时机，是可以被重新定义的，原理上，事件都是需要精确的定义的，比如下面这个例子，我们定义了一个新事件：“初始化1秒后”
//
// ```
// var EventFactory = function(){
// 		var that = this;
// 		setTimeout(function(){
// 			that.fire('afterOneSecond');
// 		},1000);
// };
// S.augment(EventFactory,S.Event.Target);
// var a = new EventFactory();
// a.on('afterOneSecond',function(){
// 		alert('1秒后');
// });
// // 1秒后弹框
// ```
//
// 这是一个很纯粹的自定义事件，它有事件名称`afterOneSecond`，有事件的触发条件`self.fire('afterOneSecond')`，有事件的绑定，`a.on('afterOneSecond')`。这样这个事件就能顺利的发生，并被成功监听。在代码组织层面，一般工厂类中实现了事件命名、定义和实现，属于内聚的功能实现。而绑定事件时可以是工厂类这段代码外的用户，他不会去关心事件的具体实现，只要关心工厂类"暴露了什么事件可以让我绑定"就可以了，这就是KISSY中使用自定义事件的用法。
// 
S.Event.Target = {
    /**
     * 用于存放绑定的事件信息
     * @type {Object}
     */
    _L: {
		/*
         "click": [
             {
                 E: "click touchstart",
                 F: fn1,
                 S: scope1
             },
             {
                 E: "click",
                 F: fn2,
                 S: scope2
             }
         ]
		 */
    },
    /**
     * 绑定事件
     * @param  {String}   eventType 必选，绑定的事件类型，以空格分隔
     * @param  {Function} fn        必选，触发事件后的回调方法
     * @param  {[type]}   scope     回调方法的 this 指针
     * @return {[type]}             返回对象本身
     */
    on: function(eventType, fn, scope) {
        var eventArr = s2a(eventType), T = this;
        eventArr.map(function(ev){
            var evt = ev in T._L ? T._L[ev] : (T._L[ev] = []);
            evt.push({
                E: eventType,
                F: fn,
                S: scope
            });
        });
        return T;
    },
    /**
     * 触发事件
     * @param  {String} eventType 必选，绑定的事件类型，以空格分隔
     * @param  {[type]} data      触发事件时传递给回调事件对象的信息，而 data 后面的参数会原封不动地传过去
     * @return {[type]}           返回对象本身
     */
	// on()
	//
	// Event.Target 的参元方法，绑定自定义事件
	//
	// fire(event,data)
	//
	// Event.Target 的参元方法，触发事件
    fire: function(eventType, data) {
        var eventArr = s2a(eventType), T = this;
        eventArr.map(function(ev){
            var evt = T._L[ev], 
                returnEv = S.mix(data || {}, {target: T, currentTarget: T});
            if(!evt) return;
            evt.map(function(group){
                group.F.apply(group.S || T, [returnEv].concat([].slice.call(arguments, 2)));
            });

        });
        return T;
    },

    /**
     * 解除绑定事件
     * @param  {String}   eventType 必选，绑定的事件类型，以空格分隔
     * @param  {Function} fn        如果需要指定解除某个回调，需要填写
     * @param  {[type]}   scope     同上，可以进一步区分某个回调
     * @return {[type]}             返回对象本身
     */
	// detach(event,fn)
	//
	// Event.Target 的参元方法，解除绑定事件
    detach: function(eventType, fn, scope) {
        var eventArr = s2a(eventType), T = this;
        eventArr.map(function(ev){
            /* 如果遇到相同事件，优先取消最新绑定的 */
            var evt = T._L[ev];
            if(!evt) return;
            if(!fn && (T._L[ev] = [])) return;
            for(var key=0; key < evT._Length; key++) {
                if(group.F == fn && group.S == scope) {
                    evt.split(key, 1);
                    continue;
                }
                else if(group.F == fn) {
                    evt.split(key, 1);
                    continue;
                }
            }
        });
        return T;
    }
};

S.Event.Special = {
	/*
	'myEvent':{
		setup:function(){

		},
		teardown:function(){

		}
	}
   */
};

/**
 * 把 event 字符串格式化为数组
 */
// s2a(str)
//
// 内部方法，把 event 字符串格式化为数组
function s2a(str) {
    return str.split(' ');
}

S.add('event',function(S){
	return S.Event;
});

})(KISSY);
// ## IO 模块
//
// **IO的配置項说明：**
//
// timeout 值的單位為秒，與KISSY保持一致。
//
// contentType配置，若未配置值，且滿足以下條件
// 1. data不為空
// 2. type不為get
//
// 此時默認
//
// ```
// Content-Type=application/x-www-form-urlencoded
// ```
//
// **KISSY MINI 删除的 API**
//
//| API                  | KISSY                | KISSY-MINI           |
//| -------------------- |:--------------------:|:--------------------:|
//| setupConfig          | YES                  | NO                   |
//| upload               | YES                  | NO                   |
//| serialize            | YES                  | NO                   |
//| getResponseHeader    | YES                  | NO                   |
//| Promise API          | YES                  | NO                   |
//|&nbsp;|&nbsp;|&nbsp;|
//
// 配置项：
//
//| Setting              | KISSY                | KISSY-MINI           |
//| -------------------- |:--------------------:|:--------------------:|
//| cfg.crossDomain      | YES                  | NO                   |
//| cfg.mimeType         | YES                  | NO                   |
//| cfg.password         | YES                  | NO                   |
//| cfg.username         | YES                  | NO                   |
//| cfg.xdr              | YES                  | NO                   |
//| cfg.xhrFields        | YES                  | NO                   |
//| cfg.form             | YES                  | NO                   |
//|&nbsp;|&nbsp;|&nbsp;|
//
//
// **KISSY VS KISSY-MINI，Ajax实现上的差异**
//
//| KISSY                | KISSY-MINI           | Note                 |
//|:-------------------- |:--------------------:|:--------------------:|
//| 回調函數的第二個參數支持更多的狀態  | 目前只支持  success/error/timeout/abort/parseerror | 更多的錯誤狀態可以通過getNativeXhr()得到原生的xhr對象來獲取。  |
//| jsonp返回多個數據源時，success回調得到的數據是一個包含所有數據源的數組 | 目前只取第一個數據源 | - |
//| IO的別名有S.Ajax/S.io/S.IO | 只有S.IO | - |
//| jsonpCallback支持函數返回全局函數名 | jsonpCallback只支持字符串 | - |
//| 對於url上的參數，會與data參數重新組合 | data附加在url上 | - |
//| cache增加的時間戳KISSY和KISSY MINI是不一致的 | - | - |
//|&nbsp;|&nbsp;|&nbsp;|
//
// 实例代码
//
// ```
// S.IO({
//		type: 'get',
//		url: 'http://www.taobao.com',
//		data: {...},
//		success: function(responseData,statusText,xhr){
//			//...
//		},
//		dataType:'json' // 可取值为'json'/'jsonp'
// });
// ```
//
// 快捷调用方法
// - S.IO.get(url,fn)
// - S.IO.post(url,fn)
// - S.IO.jsonp(url,fn)
// - S.IO.getJSON(url,fn)
// - S.IO.getScript(url,fn) 等同于 S.getScript(url,fn)
// - S.IO.jsonp(url,fn) 等同于 S.jsonp(url,fn)
//
// 具体用法参照[KISSY1.4.0 Ajax文档](http://docs.kissyui.com/1.4/docs/html/guideline/io.html)
;(function(global, S) {

var doc = global.document,
    location = global.location;

function mix(target, source) {
    var k, key;
    for (key in source) {
        if((k = source[key]) !== undefined) {
            target[key] = k;
        }
    }
    return target;
}

function merge(d, n) {
    return mix(mix({}, d), n);
}

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    }
}

var isObject   = isType('Object'),
    isArray    = Array.isArray || isType('Array'),
    isFunction = isType('Function');

function each(obj, iterator, context) {
    var keys = Object.keys(obj), i, len;
    for (i = 0, len = keys.length; i < len; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === false) {
            return;
        }
    }
}

var getScript = function(url, cfg) {
    cfg = cfg || {};

    if(cfg instanceof Function){
        cfg = {
            success:cfg
        };
    }

    var script = doc.createElement("script"),
        head = doc.getElementsByTagName("head")[0] || doc.documentElement;

    script.charset = cfg.charset || "";
    script.onload = cfg.success;
    script.onerror = cfg.error;
    script.src = url;

    head.insertBefore(script, head.firstChild);

    return script;
};

var jsonpID = 1,
    TRUE = !0,
    FALSE = !TRUE,
    NULL = null,
    ABORT = "abort",
    SUCCESS = "success",
    ERROR = "error",
    EMPTY = "",
    noop = function() {};

var transports = {},
    def = {
        type: 'GET',
        async: TRUE,
        serializeArray: TRUE,
        /* whether data will be serialized as String */
        processData: TRUE,
		/* contentType: "application/x-www-form-urlencoded; charset=UTF-8" */
        /* Callback that is executed before request */
        beforeSend: noop,
        /* Callback that is executed if the request succeeds */
        success: noop,
        /* Callback that is executed the the server drops error */
        error: noop,
        /* Callback that is executed on request complete (both: error and success) */
        complete: noop,
        context: NULL,
        /* MIME types mapping */
        accepts: {
            script: 'text/javascript,application/javascript',
            json:   "application/json,text/json",
            xml:    'application/xml,text/xml',
            html:   "text/html",
            text:   'text/plain'
        },
        /* Default timeout */
        timeout: 0,
        cache: TRUE
    };

function presetConfig(cfg) {
    if(!cfg.url) {
        cfg.url = location.toString();
    }

    /* 序列化data參數 */
    if (cfg.processData && isObject(cfg.data)) {
        cfg.data = param(cfg.data, cfg.serializeArray)
    }

    cfg.type = cfg.type.toUpperCase();

    if (cfg.data && cfg.type == 'GET') {
        cfg.url = appendURL(cfg.url, cfg.data)
    }

    if (cfg.cache === FALSE) {
        cfg.url = appendURL(cfg.url, 't=' + Date.now());
    }

    var testURL = /^([\w-]+:)?\/\/([^\/]+)/.test(cfg.url),
        protocol = testURL ? RegExp.$1 : location.protocol;

    cfg.local = protocol == 'file:';

    /* KISSY默認的上下文是config而不是io實例*/
    cfg.context || (cfg.context = cfg);

    return cfg;
}

function fireEvent(type, io) {
    IO.fire(type, {io: io});
}

/**
 * IO異步請求對象
 * @param config
 * @returns IO instance
 * @constructor
 */
function IO(config) {
    var self = this;

    if (!(self instanceof IO)) {
        return new IO(config);
    }
    /* 所有的io類型都先進行數據預處理。 */
    var cfg = presetConfig(merge(def, config)),
        timeout = cfg.timeout;

    self.cfg = cfg;

    fireEvent('start', self);

    /* 根據dataType獲取對應的transport對象。 */
    /* 每個transport實現對應的send、abort方法。 */
    var dataType = cfg.dataType,
        Transport = transports[dataType] || transports[EMPTY];

    var transport = new Transport(self);

    self.transport = transport;

    /* beforeSend回調可以阻止異步請求的發送。*/
    var fnBeforeSend = cfg.beforeSend;
    if(fnBeforeSend && fnBeforeSend.call(cfg.context, self, cfg) === false) {
        self.abort();
        return self;
    }

    fireEvent('send', self);

    if(timeout > 0) {
        self._timer = setTimeout(function() {

            self.abort("timeout");

        }, timeout * 1000);
    }

    try {

        transport.send();

    }catch(ex) {
        self._complete(FALSE, ex.message);
    }

    return self;
}

mix(IO, S.Event.Target);

mix(IO.prototype, {
    abort: function(s) {
        this.transport.abort(s);
    },
    /* 一個IO請求，必然要調用success或者error方法中的一個。*/
    /* 最終都需要調用complete回調方法，在這裡統一控制。*/
    _complete: function(status, statusText) {
        var self = this,
            cfg = self.cfg,
            context = cfg.context,
            param = [self.responseData, statusText, self],
            TYPE = status ? SUCCESS : ERROR,
            COMPLETE = "complete";

        /* IO對象不允許重複執行。*/
        if(self._end) return;
        self._end = TRUE;

        clearTimeout(self._timer);

        cfg[TYPE].apply(context, param);
        fireEvent(TYPE, self);

        cfg[COMPLETE].apply(context, param);
        fireEvent(COMPLETE, self);
    }
});

function setTransport(name, fn) {
    transports[name] = fn;
}

function appendURL(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}

var encode = encodeURIComponent;
function param(o, arr) {
    var rt = [];
    _serialize(rt, o, arr);
    return rt.join("&");
}

function _serialize(rt, o, arr, k) {
    var symbol = arr === true ? encode("[]") : EMPTY;

    each(o, function(val, key) {
        if(k) {
            key = k + symbol;
        }
        if(isArray(val)) {
            _serialize(rt, val, arr, key);
        }else{
            rt.push(key + "=" + encode(val));
        }
    });
}

var XHRNAME = "XMLHttpRequest",
    reBlank = /^\s*$/;

/* 標準的XMLHttpRequest對象 */
function createXHR() {
    return new global[XHRNAME]();
}

/**
 * 基於XMLHttpRequest對象的異步請求處理。
 * @constructor
 */
function xhrTransport(io) {
    this.io = io;
}

mix(xhrTransport.prototype, {
    _init: function() {
        var self = this,
            io = self.io,
            cfg = io.cfg,
            dataType = cfg.dataType,
            mime = cfg.accepts[dataType],
            baseHeaders = {},
            xhr = createXHR();

		/* io.xhr = xhr; */
        io.getNativeXhr = function() {
            return xhr;
        };

        /* 依照大部分庫的做法。 */
        if (!cfg.crossDomain) {
            baseHeaders['X-Requested-With'] = XHRNAME;
        }

        if (mime) {
            baseHeaders['Accept'] = mime;

            if(xhr.overrideMimeType) {
                if (mime.indexOf(',') > -1) {
                    mime = mime.split(',', 2)[0]
                }

                xhr.overrideMimeType(mime)
            }
        }

        /* 附加Content-Type */
        if (cfg.contentType || (cfg.data && cfg.type != 'GET')) {
            baseHeaders['Content-Type'] = cfg.contentType ||
				'application/x-www-form-urlencoded';
        }

        cfg.headers = merge(baseHeaders, cfg.headers || {})

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {

                var result, error = FALSE;

                if ((xhr.status >= 200 &&
                    xhr.status < 300) ||
                    xhr.status == 304 ||
                    (xhr.status == 0 && cfg.local)) {

                    /* 若dataType未設置，則取得結果的時候根據mime信息推斷dataType值，並進行對應的數據處理。*/
                    dataType = dataType || mimeToDataType(xhr.getResponseHeader('Content-Type'));

                    /* 利用xhr對象來獲取數據。*/
                    result = io.responseText = xhr.responseText;
                    io.responseXML = xhr.responseXML;

                    try {
                        if (dataType == 'script') {

                            (1,eval)(result);

                        }else if(dataType == 'xml') {

                            result = xhr.responseXML;

                        }else if (dataType == 'json') {

                            result = reBlank.test(result) ? NULL : parseJSON(result);

                        }
                    } catch (e) { error = e }

                    io.responseData = result;
                    if (error) {
                        io._complete(FALSE, 'parsererror')
                    }else {
                        io._complete(TRUE, SUCCESS);
                    }

                } else {
                    io._complete(FALSE, ERROR)
                }
            }
        };

        xhr.open(cfg.type, cfg.url, cfg.async);

        each(cfg.headers, function(v, k) {
            xhr.setRequestHeader(k, v);
        });

        xhr.send(cfg.data ? cfg.data : NULL);

    },
    abort: function(statusText) {
        var self = this,
            xhr = self.xhr,
            io = self.io;

        if(xhr) {
            xhr.onreadystatechange = noop;
            xhr.abort();
        }

        io._complete(FALSE, statusText || ABORT);
    },
    send: function() {
        this._init();
    }
});

setTransport(EMPTY, xhrTransport);

var regMimeType = /^(?:text|application)\/(json|javascript|xml|html)/i;
function mimeToDataType(mime) {
    var result = mime && regMimeType.test(mime),
        type = result ? RegExp.$1 : "text";

    return type === "javascript" ? "script" : type;
	/*
    return mime && ( mime == htmlType ? 'html' :
        reJsonType.test(mime) ? 'json' :
            reScriptType.test(mime) ? 'script' :
                reXMLType.test(mime) && 'xml' ) || 'text';
	*/
}

function parseJSON(text) {
    return JSON.parse(text);
}

/**
 * 基於script節點的異步請求處理，主要針對jsonp的場景
 * @param io io實例
 * @constructor
 */
function ScriptTransport(io) {
    this.io = io;
}

mix(ScriptTransport.prototype, {
    abort: function(statusText) {
        this._end(FALSE, statusText || ABORT)
    },
    /**
     * 完成請求以後的清理工作。
     * @param status
     * @param statusText
     * @private
     */
    _end: function(status, statusText) {
        var self = this,
            script = self.script,
            io = self.io,
            gvar = self._globalVar;
        /* 不直接刪除，避免有請求返回以後調用導致的報錯。 */
        global[gvar] = function() {
            delete global[gvar];
        };

        if(script) {
            script.src = NULL;
            script.onload = script.onerror = noop;

            script.parentNode.removeChild(script);
        }
        /* 調用io實例的方法，完成io請求狀態 */
        io._complete(status, statusText);
    },
    send: function() {
        var self = this,
            io = self.io,
            cfg = io.cfg,
            callbackName = cfg.jsonp || "callback",
            methodName = cfg.jsonpCallback || "jsonp"+jsonpID ++;

        /* methodName = (S.isFunction(methodName) ? methodName() : methodName) ||
		   "jsonp"+jsonpID ++; */

        self._globalVar = methodName;

        /* 添加jsonp的callback參數。 */
        var url = appendURL(cfg.url, callbackName + "=" + methodName);

        global[methodName] = function(data){
			/*
			r = data;
			*/
			/* 如果是多個數據的情況下，返回的數據是數組。*/
			/* 跟kissy保持一致。 */
			/*
			if(arguments.length >1) {
				r = makeArray(arguments);
			}
			*/
            io.responseData = data;

            self._end(TRUE, SUCCESS);
        };

        /* KISSY.getScript方法支持傳入指定的script節點元素。*/
        self.script = getScript(url, {
            charset: cfg.scriptCharset,
            error: function() {
                self._end(FALSE, ERROR);
            }
        });
    }
});

setTransport("jsonp", ScriptTransport);

function factory(t, dt) {
    return function(url, data, callback, dataType, type) {
        /* data 参数可省略 */
        if (isFunction(data)) {
            dataType = callback;
            callback = data;
            data = NULL;
        }

        return IO({
            type: t || type,
            url: url,
            data: data,
            success: callback,
            dataType: dt || dataType
        });
    };
}

/* 定義快捷方法 */
// Ajax API
//
// **S.IO.get(url,callback)**
//
// **S.IO.post(url,callback)**
//
// **S.IO.jsonp(url,callback)**
//
// **S.IO.getJSON(url,callback)**
//
// **S.IO.getScript(url,callback)** 同 **S.getScript(url,callback)**
mix(IO, {
    get: factory("get"),
    post: factory("post"),
    jsonp: factory(NULL, "jsonp"),
    getJSON: factory(NULL, "json"),
    getScript: getScript
});

// **S.IO.jsonp(url,callback)** 同 **S.jsonp()**
//
// **S.getScript (url , config)**
//
// 动态加载目标地址的资源文件，第二个参数可以是配置对象，也可以是回调函数
//
// 如果是配置对象，参数可以是：
// - charset：编码类型
// - success：成功的回调函数
// - error：失败的回调函数
//
// ```
// S.getScript(url , { success : success , charset : charset });
// S.getScript(url, function(){...});
//
// ```
mix(S, {
    IO: IO,
    jsonp: IO.jsonp,
    getScript: getScript
});

/* KMD封裝 */
S.add('io', function() {
    return IO;
});


})(this, KISSY);
// <style>td {border-top:1px solid #ccc} table {border-collapse: collapse;}</style>
