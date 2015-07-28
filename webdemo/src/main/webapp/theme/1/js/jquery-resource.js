$(function(){
	$(".navmenu li").each(function(index, element) {
		$(this).bind("click",function(){
			$(this).addClass("current").siblings().removeClass("current");
			if( $(this).hasClass("nav-show")){
				$(".currimg").show(500);
				$(".ColumnList").show(500);; 
			 }
		 else{
			 $(".currimg").hide(500);
			 $(".ColumnList").hide(500);
			 $(".banner #imgplay").location.reload();}
		});
       
    });
		
	$(".img-box img").VMiddleImg();	
	
	$(".spanUpDown").click(function(){
		if($(".listfirst").css("display")=="none"){
			$(this).addClass("spanDownUp");}
		else{
			$(this).removeClass("spanDownUp");}
		$(".listfirst").slideToggle();
		});
		
});