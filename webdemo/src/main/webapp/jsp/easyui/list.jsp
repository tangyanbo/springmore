<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" import="java.util.*"%>
<%@include file="/jsp/includes/taglibs.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"/>
<jsp:include page="/jsp/includes/common.jsp" />
<script type="text/javascript" src="list.js"></script>

<script type="text/javascript">

</script>
</head>

<body>
<div class="easyui-panel" title="查询条件" style="width: auto;">
	<div style="padding: 10px 60px 20px 60px">
		<form id="queryForm" method="post" action="${pageContext.request.contextPath}/fundRedemption!fundRedemptionList.html">
			<table style="width:80%">
				
				<tr>
					<td height="25">银行卡号</td>
					<td>
						<input id="bankCardN" class="easyui-textbox" type="text" name="fundRedemption.bankCardNo"/>
					</td>
						
					<td>返回码:</td>
					
					<td>
						<select id="retcode" name="fundRedemption.retcode" class="easyui-combobox" 
				data-options="panelHeight:'auto',required:true,width:70">
					<option value="">请选择</option>
					<option value="0000">成功</option>
					<option value="-1">失败</option>
				</select>
					
						<!--  
						<input class="easyui-textbox" type="text" name="retcode"/>
						-->
					</td>
				</tr>
				
				<tr>
					<td height="25">交易起始日期</td>
					<td>
						<input class="textbox" id="timeEnd"
				type="text" name="fundRedemption.timeEnd"
						onClick="WdatePicker();"
						/>
					</td>
						
					<td>交易结束日期:</td>
					<td>
						<input class="textbox" id="overTime" type="text" name="fundRedemption.overTime"
						onClick="WdatePicker();"
						/>
					</td>
				</tr>
				<tr>
					<td height="25">基金交易账号:</td>
					<td>
					
						<input id="bankFundNo" name="fundRedemption.bankFundNo" class="easyui-textbox" type="text"/>
					</td>
						
					<td>CP流水号:</td>
					<td>
						<input id="transactionIdCp" name="fundRedemption.transactionIdCp" class="easyui-textbox" type="text" />
					</td>
				</tr>
				<tr>
					<td height="25">基金流水号:</td>
					<td>
					
						<input id="fundTradeNo"  name="fundRedemption.fundTradeNo" class="easyui-textbox" type="text"/>
					</td>
						
					<td>渠道流水号:</td>
					<td>
						<input id="transactionId" name="fundRedemption.transactionId" class="easyui-textbox" type="text" />
					</td>
				</tr>
			</table>
		</form>
		<div style="text-align: center; padding: 5px">
			<a href="javascript:void(0)" class="easyui-linkbutton"
				onclick="submitForm()">查询</a> <a href="javascript:void(0)"
				class="easyui-linkbutton" onclick="clearForm()">重置</a>
		</div>
	</div>
</div>
<!-- 表格 -->
<div style="text-align: right; padding: 5px;">
	<a href="javascript:download();" class="easyui-linkbutton">下载</a>
</div>
<div id="datagrid" style="height: 350px;"></div>

</body>
</html>
