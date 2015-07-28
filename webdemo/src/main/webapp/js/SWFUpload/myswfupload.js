(function($) {
	//当一个页面有多个上传的按钮是，需要写fileType
	swfLoad = function(fileUrl,fileType) {
		fType=fileType;
		fileType = new SWFUpload(
				{
					upload_url : fileUrl + "/uploadFile.action",
					flash_url : fileUrl + "/js/SWFUpload/Flash/swfupload.swf",
					file_size_limit : "200 MB",
					file_post_name : "upload",
					post_params : {
						'fileInfo.belongTo' : 'dy'
					},
					preserve_relative_urls : false, // 相对路径
					prevent_swf_caching : false,
					file_types : "*.rar;*.zip;*.doc;*.pdf;*.docx;*.xls;*.ppt;*.xlsx;*.pptx;*.mp4;*.flv;*.ogg;*.webm;*.m4v;*.rmvb;*.wmv;*.avi;*.mov;*.mpg;*.3gp;*.jpg;*.jpeg;*.png;*.bmp;*.gif;*.mp3;*.wav;",
					file_upload_limit : "0",
					file_queue_limit : 5,
					custom_settings : {
						upload_target : fileType+"DivFileProgressContainer",
						uplaad_fileType : fileType
					},
					debug : false,
					button_placeholder_id : fileType+"SpanButtonPlaceholder",
					button_width : 55,
					button_height : 23,
					button_text_top_padding : 0,
					button_text_left_padding : 8,
					button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
					button_cursor : SWFUpload.CURSOR.HAND,
					file_queue_error_handler : fileQueueError,
					file_dialog_complete_handler : fileDialogComplete,
					upload_progress_handler : uploadProgress,
					upload_error_handler : uploadError,
					upload_success_handler : uploadSuccess,
					upload_complete_handler : uploadComplete
				}		
		
		);
		
	};

	
	deleteFile=function(fileId){
		$("#"+fileId).remove();
	};
	
})(jQuery);