function exceptionHandler(jqXHR){
	if(jqXHR == null || jqXHR.responseText.indexOf("<html>") > -1 || jqXHR.responseText == ""){
		window.location = "login.jsp";
	}else{
		var errorObj = JSON.parse(jqXHR.responseText);
		if(errorObj.msg){
			var errorMessage = errorObj.msg;			
			$.showFMsgBox(errorMessage);
		}else{
			$.showFMsgBox("操作失败!");
		}
	}	
}