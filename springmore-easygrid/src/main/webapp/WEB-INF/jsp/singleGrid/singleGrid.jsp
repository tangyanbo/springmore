<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css"	href="easyui/default/easyui.css">
<link rel="stylesheet" type="text/css"	href="easyui/icon.css">
<script type="text/javascript" src="<c:url value='/js/jquery-1.8.2.min.js'/>"></script>
<script type="text/javascript" src="js/easyui/jquery.easyui.min.js"></script>
<script src="<c:url value="/js/jquery.blockUI.js"/>" type="text/javascript"></script>
<script type="text/javascript" src="easygrid/easygrid.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
		var mygrid = doInitGrid();	
		mygrid.load("loadData.action");
		
		$("#exportExcel").click(function(){
			mygrid.setFileName("单个报表-基础表格");
			mygrid.toExcel();
		});
		
		$("#exportExcel2").click(function(){
			mygrid.setFileName("单个报表-基础表格");
			mygrid.setTitle("单个报表-基础表格");
			mygrid.toExcel();
		});
	});
	
	
	
	
	/**初始化表格组件*/
	function doInitGrid(){		
		mygrid = new GridObject('mygrid_container');
		mygrid.setHeader("单位类型,单位名称,总分,自评总分");
		mygrid.init();
		return mygrid;
	}
</script>

</head>

<body>
	<div style="padding:10px;">
		<ul>
			<li>
				<a id="exportExcel" href="javascript:void(0);">导出Excel</a>
			</li>
			
			<li>
				<a id="exportExcel2" href="javascript:void(0);">导出有Title的Excel</a>
			</li>
		</ul>
		
		
	</div>

	<div id="mygrid_container">
                  
    </div>

</body>


</html>