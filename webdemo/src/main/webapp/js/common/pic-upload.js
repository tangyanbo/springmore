var PicUpload = (function($){
	var P = function(sets){
		var server_url = sets.server_url;
		swfupload_settings.upload_url = server_url + swfupload_settings.upload_url;
		/*sets.upload_url = server_url + swfupload_settings.upload_url;*/
		sets.flash_url = server_url + swfupload_settings.flash_url;
		var swfbtn = $("<div></div>");
		var btn = $(sets.button);
		btn.append(swfbtn);
		sets.button_width = btn.width();
		sets.button_height = btn.height();
		sets.button_placeholder = swfbtn[0];
		
		var settings = jQuery.extend({
			uploadSuccess : function(){}
		},swfupload_settings,sets);
		jQuery.extend(settings,{
			upload_success_handler : function(file, fileUrl) {
				try {
					//var progress = new FileProgress(file,  this.customSettings.upload_target);
					settings.uploadSuccess(fileUrl);
					//progress.toggleCancel(false);
				} catch (ex) {
					this.debug(ex);
				}
			}
		});
		if(settings.fileName){
			settings.post_params.fileName = settings.fileName;
		}
		this.swfupload = new SWFUpload(settings);
	};
	
	var swfupload_settings = {
		upload_url : "/uploadNotSave.action",
		flash_url : "/js/SWFUpload/swfupload.swf",
		file_size_limit : "5 MB",
		file_post_name : "upload",
		post_params :{'fileInfo.belongTo':'basic/pic','fileName':'pic_'+new Date().getTime()},
		preserve_relative_urls: false,  //相对路径
		file_types : "*.jpg;*.gif;*.png;",
		file_upload_limit : "0",
		file_queue_limit:1,
		custom_settings : {
			upload_target : "divFileProgressContainer"
		},
		debug: false,
		
		// Button settings
		//button_image_url: "js/SWFUpload/images/TestImageNoText_65x29.png",
		//button_width: "65",
		//button_height: "29",
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		//button_placeholder_id: "btn-upload-pic",
		button_text: "",
		button_text_style: ".redText { color: #FF0000; }",
		button_text_left_padding: 12,
		button_text_top_padding: 3,
		button_cursor : SWFUpload.CURSOR.HAND,

		// The event handler functions are defined in handlers.js
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : function(){},
		upload_complete_handler : uploadComplete

	};
	
	return function(settings){
		return P(settings);
	};
})(jQuery);