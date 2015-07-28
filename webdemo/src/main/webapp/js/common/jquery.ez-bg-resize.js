/******************************************************
	* jQuery plug-in
	* Easy Background Image Resizer
	* Developed by J.P. Given (http://johnpatrickgiven.com)
	* Useage: anyone so long as credit is left alone
******************************************************/

var containerObj;

(function($) {
	// plugin definition
	$.fn.ezBgResize = function(options) {
		// First position object
		containerObj = this;
		
		containerObj.css("visibility","hidden");
		
		$(window).load(function() {
			resizeImage();
		});
		
		$(window).bind("resize",function() {
			resizeImage();
		});
		
	};
	
	function resizeImage() {
		
		containerObj.css({
			"position":"fixed",
			"top":"0px",
			"left":"0px",
			"z-index":"-1",
			"overflow":"hidden",
			"width":getWindowWidth() + "px",
			"height":getWindowHeight() + "px"
		});
		
		// Resize the img object to the proper ratio of the window.
		var iw = containerObj.children('img').width();
		var ih = containerObj.children('img').height();
		if (getWindowWidth() > getWindowHeight()) {
			if (iw > ih) {
				var fRatio = iw/ih;
				containerObj.children('img').css("width",getWindowWidth() + "px");
				containerObj.children('img').css("height",Math.round(getWindowWidth() * (1/fRatio)));

				var newIh = Math.round(getWindowWidth() * (1/fRatio));

				if(newIh < getWindowHeight()) {
					var fRatio = ih/iw;
					containerObj.children('img').css("height",getWindowHeight());
					containerObj.children('img').css("width",Math.round(getWindowHeight() * (1/fRatio)));
				}
			} else {
				var fRatio = ih/iw;
				containerObj.children('img').css("height",getWindowHeight());
				containerObj.children('img').css("width",Math.round(getWindowHeight() * (1/fRatio)));
			}
		} else {
			var fRatio = ih/iw;
			containerObj.children('img').css("height",getWindowHeight());
			containerObj.children('img').css("width",Math.round(getWindowHeight() * (1/fRatio)));
		}
		containerObj.css("visibility","visible");
	}
	
	// private function for debugging
	function debug($obj) {
		if (window.console && window.console.log) {
			window.console.log('Window Width: ' + $(window).width());
			window.console.log('Window Height: ' + $(window).height());
		}
	};
	
	// Dependable function to get Window Height
	function getWindowHeight() {
		var windowHeight = 0;
		if (typeof(window.innerHeight) == 'number') {
			windowHeight = window.innerHeight;
		}
		else {
			if (document.documentElement && document.documentElement.clientHeight) {
				windowHeight = document.documentElement.clientHeight;
			}
			else {
				if (document.body && document.body.clientHeight) {
					windowHeight = document.body.clientHeight;
				}
			}
		}
		return windowHeight;
	};
	
	// Dependable function to get Window Width
	function getWindowWidth() {
		var windowWidth = 0;
		if (typeof(window.innerWidth) == 'number') {
			windowWidth = window.innerWidth;
		}
		else {
			if (document.documentElement && document.documentElement.clientWidth) {
				windowWidth = document.documentElement.clientWidth;
			}
			else {
				if (document.body && document.body.clientWidth) {
					windowWidth = document.body.clientWidth;
				}
			}
		}
		return windowWidth;
	};
})(jQuery);