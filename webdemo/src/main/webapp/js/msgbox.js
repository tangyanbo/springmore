(function($){
	var msgbox;
	init = function(){
		var box = $("#sy_Msgbox");
		if(box.length){
			msgbox = box;
			return;
		}
		msgbox = $('<div id="sy_Msgbox" class="msgbox_layer_wrap" style="display: none;"></div>');
		$("body").append(msgbox);
		return msgbox;
	};
	/**
	 * 弹出消息对话框
	 * msg:字符串消息
	 * type:消息类型(数字) 0:无 ,1:普通 ,2:成功 ,3:失败 ; default:1
	 * duration:消息框停留多久（一个字符串或者数字）default:"slow"
	 */
	showMsgBox = function(msg,type,duration){
		type = type || 1;
		duration = duration || "slow";
		if(!msgbox){
			init();
		}
		var gtl_ico;
		if(type == 1){
			gtl_ico = "gtl_ico_hits";
		}else if(type == 2){
			gtl_ico = "gtl_ico_succ";
		}else if(type == 3){
			gtl_ico = "gtl_ico_fail";
		}else{
			gtl_ico = "gtl_ico_clear";
		}
		msgbox.html('<span class="msgbox_layer" style="z-index:10000;">'
					+'<span class="'+gtl_ico+'"></span>'
					+ msg
					+'<span class="gtl_end"></span>'
					+'</span>'
				);
		msgbox.show().delay(duration).fadeOut("slow").toggleClass("gtl_ico_clear");
	};
	$.showSMsgBox=function(msg,duration){
		showMsgBox(msg,2,duration);
	};
	$.showFMsgBox=function(msg,duration){
		showMsgBox(msg,3,duration);
	};
	$.showMsgBox=showMsgBox;
	
	return $;
})(jQuery);