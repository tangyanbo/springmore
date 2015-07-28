<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/jsp/includes/taglibs.jsp"%>
<form id="updateForm" method="post" action="${pageContext.request.contextPath}/update.html">
	<div class="fitem">
		<label>ID:</label> 
			<s:textfield name="user.userId" cssClass="easyui-textbox" required="true"/>
	</div>
	<div class="fitem">
		<label>姓氏:</label> 
		<s:textfield name="user.firstname" cssClass="easyui-textbox" required="true"/>
		
	</div>
	<div class="fitem">
		<label>名称:</label> 
		<s:textfield name="user.lastname" cssClass="easyui-textbox" required="true"/>
		
	</div>
	<div class="fitem">
		<label>电话:</label> 
		<s:textfield name="user.phone" cssClass="easyui-textbox" required="true"/>
	</div>
	<div class="fitem">
		<label>邮箱:</label> 
		<s:textfield name="user.email" cssClass="easyui-textbox" required="true"/>
	</div>
</form>

<style type="text/css">
#updateForm {
	margin: 0;
	padding: 10px 30px;
}

.ftitle {
	font-size: 12px;
	font-weight: normal;
	padding: 5px 0;
	margin-bottom: 10px;
	border-bottom: 1px solid #ccc;
}

.fitem {
	margin-bottom: 5px;
}

.fitem label {
	display: inline-block;
	width: 80px;
}

.fitem input {
	width: 160px;
}
</style>