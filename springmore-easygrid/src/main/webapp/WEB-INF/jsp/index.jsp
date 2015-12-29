<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<script type="text/javascript" src="<c:url value='/js/jquery-1.8.2.min.js'/>"></script>

</head>

<body>
	<div>
		<div style="padding:10px;">
			<a href="toSingleGrid.action" target="_blank">单个grid</a>
		</div>
		
		<div style="padding:10px;">
			<a href="toSingleGridComplex.action" target="_blank">单个grid-复杂表头</a>
		</div>
		
		
		<div style="padding:10px;">
			<a href="toSingleGroupGrid.action" target="_blank">单个grid-分组-二级</a>
		</div>
		
		
		<div style="padding:10px;">
			<a href="toSingleGroupGridThreeLevel.action" target="_blank">单个grid-分组-三级</a>
		</div>
		
		
		<div style="padding:10px;">
			<a href="toMultipleGrid.action" target="_blank">多个grid</a>
		</div>
		
		<div style="padding:10px;">
			<a href="toLargeDataGrid.action" target="_blank">大数据量grid</a>
		</div>
		
	</div>

</body>


</html>