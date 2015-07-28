// JavaScript Document
$(function(){
	$(".tab1 tr:odd td").addClass("bgcol");
	
	function objWidth(){
		var h=$(window).height()-95;
		$("#cont .right").css("min-height",h);
	}
	objWidth();
	$(window).resize(function(){
		objWidth();
	});
	
	$(".c_flexible").click(function(){
		var d=$(".left").hasClass("c_view");
		//alert(d);
		if(!d){
			$(".left").stop().animate({"width":"0px"},500).addClass("c_view");
			$(".right").stop().animate({"margin-left":"0px"},500);
			$(".c_flexible").stop().animate({"left":"8px"},500);
			
		}else{
			$(".left").removeClass("c_view").stop().animate({"width":"159px"},500);
			$(".right").stop().animate({"margin-left":"160px"},500);
			$(".c_flexible").stop().animate({"left":"167px"},500);
		}
	});
	
	$(".c_flex").hover(function(){
		$(".c_flexible").css("visibility","visible");
	},function(){
		$(".c_flexible").css("visibility","hidden");});
	
	//if($(".parent_node").next(".parent_node"))	
		
	$(".parent_node .sp0").toggle(function(){
		$(this).parents(".parent_node").nextUntil(".parent_node").slideUp();
		$(this).find("em").removeClass("ico_unfold").addClass("ico_fold");
	},function(){
		$(this).parents(".parent_node").nextUntil(".parent_node").slideDown();
		$(this).find("em").removeClass("ico_fold").addClass("ico_unfold");
	});
	
	
	function editArea(){
		var c_r_h=$(".c_r_view .c_r_right").height();
		var c_l_h=$(".c_r_view .c_r_left").height();
		//alert(c_l_h > c_r_h);
		c_l_h > c_r_h ? $(".c_r_left_website").height(c_l_h) :$(".c_r_left_website").height(c_r_h);
		
	}
	editArea();
});