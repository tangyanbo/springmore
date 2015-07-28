/**
 * 级联框组件
 * @author 唐延波
 * @date 2015-07-28
 */
(function($){
	
	var defaultOpts = 
	{
		url : "",				//请求后台数据url
		idName : "",			//请求后台param name
		renderId : "",			//级联select框的id
		renderDataKey : "",		//级联select框data key
		renderDataValue : "",	//级联select框data value
	};
	
	/**
	 * select框dom元素
	 */
	var _selectDom;
	
	/**
	 * 配置,参见默认配置
	 */
	var _opts;
	
	/**
	 * 渲染级联框
	 */
	function render(){
		init();
		_selectDom.change(function(){
			var idValue = $(this).val();
			var dataJson = "{\""+ _opts.idName+"\":"+idValue+"}";
			var dataObject = JSON.parse(dataJson);			
			getDataAndRender(dataObject,_opts);
		});
	}
	
	/**
	 * 初始化加载
	 */
	function init(){
		var idValue = _selectDom.find("option").val();
		var dataJson = "{\""+ _opts.idName+"\":"+idValue+"}";
		var dataObject = JSON.parse(dataJson);
		getDataAndRender(dataObject);
	}
	
	/**
	 * 获取数据并渲染级联框
	 */
	function getDataAndRender(dataObject){
		$.ajax({
			url : _opts.url,
			type : "POST",
			dataType : "json",
			data : dataObject,
			success : function(data){
				var render = $("#"+_opts.renderId);
				render.empty();
				for(var i=0;i<data.length;i++){						
					var option = $("<option></option>");
					option.val(data[i][_opts.renderDataKey]);
					option.html(data[i][_opts.renderDataValue]);
					render.append(option);
				}
			}
		});
	}
	
	/**
	 * 入口方法
	 */
	$.fn.cascadeSelect = function(opts){	
		_selectDom = $(this);
		_opts = opts;
		render();
	};		
		
})(jQuery);


/**
 * alert消息框
 */
$.alert = function(title,msg){
	$.messager.alert(title,msg);
}

/**
 * default ajax
 */
$.ajaxD = function(settings){
	$.ajax({
		url : settings.url,
		type : "POST",
		dataType : "json",
		data : settings.data,
		success : settings.success
	});
}

/**
 * 提示消息
 */
$.info = function(msg,duration){
	$.showMsgBox(msg,2,duration);
}

/**
 * @requires jQuery
 * 将form表单元素的值序列化成对象
 * @returns object
 */
$.serializeObject = function(form) {
	var o = {};
	$.each(form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;
};
