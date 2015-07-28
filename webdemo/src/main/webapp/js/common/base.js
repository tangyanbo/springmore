(function($){	
	$.confirm = function(title,msg,callback,cancelCallback) {
		cancelCallback = cancelCallback || $.noop;
		var dialogBox = $("<div id='confirm' style='display:none'>"+msg+"</div>");
		$("body").append(dialogBox);
		$("#confirm").dialog({
			resizable : true,
			height : 140,
			autoOpen : true,
			modal: true,
			title : title,
			buttons : {
				"确认" : function() {
					callback();
					$(this).dialog("close");
					$("#confirm").remove();
				},
				"取消" : function() {
					cancelCallback();
					$(this).dialog("close");
					$("#confirm").remove();
				}
			},
			close : function(){
				$(this).remove();
			}
		});
	};
})(jQuery);

function initTab(tab,tabId) {
	tab.tabs({
		active:tabId
	}).show();
}


function errorPlacement(error, element){
	var name = element.attr("name");
	$("span[errorFor='"+name+"']").append(error);
}

