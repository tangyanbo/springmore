function removeUeditors(){
	// 移除掉页面已有的ueditor，原因：页面已有同一ID的实例时再进入页面不会初始化新的ueditor Say 2015-01-28
	var UE = window.UE || {};//解决IE8兼容性问题
	if (UE) {
		if (UE.instants) {
			var instants = UE.instants;
			$.each(instants, function(i, u) {
				if (u.key) {
					var editor = UE.getEditor(u.key);
					if (editor.container.parentNode){
						editor.destroy();
					}
				}
			});
		}
	}
}