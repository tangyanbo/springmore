var dataGrid;
$(function() {
	//初始化datagrid
	var gridOpts = {
			url:"getListData.json", //请求url
			singleSelect:true, //单行选择
			fitColumns : true, //自适应宽度
			rownumbers:true, //显示行号
			pagination:true, //是否分页
			selectOnCheck : false,
			checkOnSelect : false,
			pageSize:20,
			pageList:[10,20,30,40],
		    columns:[[
					  {field:'stageId',checkbox:true},
					  
		             /*  {field:'stageId',hidden:true}, */
		              {field:'stageName',title:'字段1',width:fixWidthTable(0.05)},
		              
		              {field:'grades',title:'字段2',width:fixWidthTable(0.1),
		            	  
		            	  formatter:function(val,row){ //格式化显示列,val为当前列的值,row为当前行的值
		            	  var data = "";
		            	  $.each(val,function(i,g){
		            		  data += g.gradeName;
		            		  if(i != val.length-1) {
		            			  data += "、"
		            		  }
		            	  })
		            	  return data;
		              }},
		              
		              {field:'cz',title:'操作',width:fixWidthTable(0.1),formatter:function(val,row,index){
		            	  var str = '<a style="cursor: pointer;" onclick="deleteRow(\''
								+ row.userId + '\',this);">删除</a>';
		            	  str += '<a style="cursor: pointer;" onclick="edit(\''
								+ row.userId + '\');" >编辑</a>';
						  return str;
		              }}
		              ]]
		};
	//$("#datagrid").datagrid(gridOpts);
	dataGrid = $('#datagrid').mydatagrid(gridOpts);
});


/**
 * 删除
 */
function deleteRow(id, obj) {
	dataGrid.deleteRow({
		"url" : "delete.json",
		data : {
			"user.userId" : id
		}
	});
}

function edit(id) {
	//编辑对话框
	var editdialog = {
		title : '编辑',
		width : 800,
		height : 600,
		href : 'edit.jsp?user.userId=' + id
	};
	dataGrid.edit(editdialog);
}

/**
* 重置
*/
function clearForm(){
    $('#queryForm').form('clear');
}

/**
* 查询
*/
function submitForm(){
	dataGrid.mydatagrid('load',$.serializeObject($("#queryForm")));
}

/**
* 下载
*/
function download(){
	
	/**
	if(confirm('确认要下载Excel？')){
		$.ajax({
	        type: "GET",
	        dataType: "text",
	        url:"<s:url value='/fundOpenAccount!fundOpenAccountDownloadExcel.html'/>",
	        error: function(data) {
	            alert("下载失败！");
	            dataGrid.datagrid("reload");
	        },
	        success: function(data) {
	            alert(data);
	            dataGrid.datagrid("reload");
	        }
	    	});
		}
	**/
	/*if(confirm('确认要下载Excel？')){
		window.location.href="${pageContext.request.contextPath}/fundOpenAccount!fundOpenAccountDownloadExcel.html?fundOpenAccount.buyerName="+$("#buyerName").val()
				+"&fundOpenAccount.buyerCertNo="+$("#buyerCertNo").val()+"&fundOpenAccount.bankCardNo="+$("#bankCardNo").val()
				+"&fundOpenAccount.retcode="+$("#retcode").combobox('getValue')+"&fundOpenAccount.accTime="+$("#accTime").val()
				+"&fundOpenAccount.endTime="+$("#endTime").val();
		//window.location.href="${pageContext.request.contextPath}/fundOpenAccount!fundOpenAccountDownloadExcel.html";
	}*/
}

/**
* 查看详情
*/
function detail(openAccountId){
	var url = "${pageContext.request.contextPath}/fundOpenAccount!detail.html?fundOpenAccount.openAccountId="+openAccountId;
	$('#right').panel('refresh', url);
}