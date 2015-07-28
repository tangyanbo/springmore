/**
 * 图片、视频、附件的上传地址配置
 * 
 * 因为UEditor自己内部绑定上传url，
 * 所以这块重写图片、视频、附件的上传地址
 * 
 * @author Say
 * @date 2015年1月4日
 */
;(function(_) {
	_.Editor.prototype._bkGetActionUrl = _.Editor.prototype.getActionUrl;// 备份原来的方法
	_.Editor.prototype.getActionUrl = function(action) {
		if (action == 'uploadimage' || action == 'uploadscrawl'
				|| action == 'uploadfile' || action == 'uploadvideo') {
			return '/syfile/ueditorUpload.action?fileInfo.belongTo=UEditor&ftpId=1';
		} else if (action == 'listimage') {
			return '/syfile/onLineImagesList.action';
		} else if (action == 'listfile') {
			return '/syfile/onLineFilesList.action';
		} else {
			return this._bkGetActionUrl.call(this, action);
		}
	}
}(UE));