<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css" href="easyui/default/easyui.css">
<link rel="stylesheet" type="text/css" href="easyui/icon.css">
<script type="text/javascript"
	src="<c:url value='/js/jquery-1.8.2.min.js'/>"></script>
<script type="text/javascript" src="js/easyui/jquery.easyui.min.js"></script>
<script src="<c:url value="/js/jquery.blockUI.js"/>"
	type="text/javascript"></script>
<script type="text/javascript" src="easygrid/easygrid.js"></script>

<script type="text/javascript">
	$(document).ready(function() {
		var mygrid = doInitGrid();
		mygrid.load("loadData.action");
	});

	/**初始化表格组件*/
	function doInitGrid() {
		mygrid = new GridObject('mygrid_container');
		mygrid.setHeader("单位类型,单位名称,总分,自评总分");
		mygrid.setInitWidths("350,350,*");
		mygrid.setFileName("${evaluate.name}-指标总分表");
		mygrid.enableLargeData(true);
		mygrid.init();
		return mygrid;
	}
</script>
</head>



<body style="background: #FFF">
	
	<div style="padding-top:30px;">
		<div id="mygrid_container"></div>
	
	</div>
	


</body>
</html>