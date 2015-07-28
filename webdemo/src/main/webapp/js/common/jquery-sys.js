$(function(){
	$(".navUI li").each(function(index, element) {
		//var index=index+1;
        $(this).find(".imgli").addClass("imgli"+(index+1));
    });
	$(window).load(function(){
				$("#conn .conUI").mCustomScrollbar({
					autoHideScrollbar:true
					//theme:"light-thin"
				});
			});

	$("#conn .chenji").toggle(
	function(){
		$("#conn .showhide").hide();
		$("#conn .right").css("margin","0px 0px 0px 5px");
		$(this).removeClass("clk");
		
		},
		
	function(){
		$("#conn .showhide").show();
		$("#conn .right").css("margin","0px 0px 0px 180px");
		$(this).addClass("clk")
		});
	
	
	function resize(){
		var height=$(window).height()-130;
		$("#conn").css("height",height);
		$("#conn .left").css("height",height);
		$("#conn .conUI").css("height",height-32);
		$("#conn .right .content").css("height",(height-29));}
	resize();
	$(window).resize(resize);
	
	var len=$("#conn .position").find("a").length;
	if(len==1){
		$("#conn .position").addClass("posbg1");}
	else if(len==2){
		$("#conn .position").addClass("posbg2");}
});