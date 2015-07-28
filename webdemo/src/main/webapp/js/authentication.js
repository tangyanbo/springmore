jQuery(function($){
	$(document).ajaxError( function(event, jqXHR, ajaxSettings, thrownError){
		var _location = null;
		if(jqXHR.status == 403 && (_location = jqXHR.getResponseHeader("Login-url")) != null){
			window.top.location.reload();
			//window.top.location.href = _location;
		}
	});
});