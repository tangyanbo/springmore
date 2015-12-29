<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="/struts-tags" prefix="s"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<!-- InstanceBegin template="/Templates/mode.dwt" codeOutsideHTMLIsLocked="false" -->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>多gird测试</title>
<link rel="stylesheet" type="text/css"	href="easyui/default/easyui.css">
<link rel="stylesheet" type="text/css"	href="easyui/icon.css">
<script type="text/javascript" src="<c:url value='/js/jquery-1.8.2.min.js'/>"></script>
<script type="text/javascript" src="js/easyui/jquery.easyui.min.js"></script>
<script src="<c:url value="/js/jquery.blockUI.js"/>" type="text/javascript"></script>
<script type="text/javascript" src="easygrid/easygrid.js"></script>

<script type="text/javascript">
	$(function(){
		 var container = new GridContainer("myContainer");		
		 container.setMultipleTable(false);
		 container.init();
		 container.load("getMultipleGridData.action");
		 
		 $("#download").click(function(){
			 container.toExcel();			 
		 });
	});
</script>
</head>
<body>
	<div>
		<a href="#" id="download">下载</a>
	</div>
	<div id="myContainer" style="width:100%;"></div>

</body>
</html>