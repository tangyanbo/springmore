/**
 * 基于easyUI的弹出框扩展方法
 * 
 * @actor Rescue
 * @date 2014-04-25
 * 
 */
(function($) {
	/**
	 * 基于datagrid里面的dialog的saveOrUpdate
	 */
	$.fn.sydialog = function(setting) {
		var defaultSetting = {
			dialogId : "",
			title : "",
			href : "",
			width : 400,
			height : 300,
			refreshId : "",
			callback:function(){
				//成功后的回调函数
			}
		};
		defaultSetting = jQuery.extend(defaultSetting, setting);
		var $dialogId = $("#" + defaultSetting.dialogId);
		/** 关闭Dialog */
		var closeDialog = function(){
			$dialogId.dialog("close");
		};
		/** 根据传入的refreshType执行action */
		var closeAndRefresh = function() {
			var $refreshId=$("#" + defaultSetting.refreshId);
			closeDialog();
			if(defaultSetting.refreshId!=''){
				$refreshId.datagrid("reload");
			}
			defaultSetting.callback();
		};
		var $dialog = $dialogId.dialog({
			resizable : true,
			closed : true,
			width : defaultSetting.width,
			height : defaultSetting.height,
			modal : true,
			buttons : [ {
				text : '确定',
				handler : function() {
					//form表单验证 适用于easyUI的表单验证
					if ($("form", $dialog).form("validate")) {
						//form表单提交
						$("form", $dialog).ajaxSubmit({
							success : function(data) {
								closeAndRefresh();
							}
						});
					}
				}
			} ]

		});
		$dialog.dialog({
			closed : false,
			title : defaultSetting.title
		}).dialog("refresh", defaultSetting.href);
	};
})(jQuery);