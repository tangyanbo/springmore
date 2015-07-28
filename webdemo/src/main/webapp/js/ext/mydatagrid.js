/**
 * easyui datagrid 扩展
 * @author 唐延波
 * 2014-09-19
 */
(function($){
	
	var editdialog = null;
	
	var dataGrid = null;
	
	var adddialog = null;
	
	
	
	
	
	
	/**
	 * 扩展主方法
	 */
	function mydatagrid(opts,obj){
		dataGrid = obj.datagrid(opts);
		/*var pager = dataGrid.datagrid('getPager');
		pager.pagination({
			pageSize:10,
			layout : [ 'sep', 'first', 'prev', 'links', 'next', 'last', 'sep',
					'refresh' ]
		});*/
	}
	
	/**
	 * 编辑
	 */
	function edit(editOpts) {
		/**
		 * 默认编辑配置
		 */
		var defEditOpts = {
				title: '编辑',
			    width: 400,
			    height: 280,
			    closed: false,
			    cache: false,
			    href: '',
			    modal: true,
			    buttons: [{
	                text:'保存',
	                iconCls:'icon-ok',
	                handler:function(){
	                	update();
	                }
	            },{
	                text:'取消',
	                handler:function(){
	                	editdialog.dialog("close");
	                }
	            }]
		};
		$.extend(true,defEditOpts,editOpts);
		var editDialogDiv = $("<div id='editDialog'></div>");
		$('body').append(editDialogDiv);
		editdialog = $('#editDialog').dialog(defEditOpts);
	}
	
	
	
	
	function update() {
		$('#updateForm').form('submit', {
			onSubmit : function() {
				return $(this).form('validate');
			},
			success : function(result) {
				var r = $.parseJSON(result);
				if (r&&r.msg) {
					$.messager.alert("提示","更新失败","info");
					editdialog.dialog('close');
				} else {
					$.messager.alert("提示","更新成功","info");
					editdialog.dialog('close');
					dataGrid.datagrid('reload');
				}
			}
		});
	}
	
	function changeStatus(opts){
		var obj = $(opts.obj);
		var status = obj.attr("status");
		var updateStatus = null;
		if (status == "1") {
			updateStatus = "0";
		} else {
			updateStatus = "1";
		}
		
		$.ajax({
			url : opts.url,
			async : false,
			data : opts.data,
			type : "POST",
			success : function(data, textStatus, jqXHR) {
				$.messager.alert("提示", obj.html() + "成功", "info");
				obj.html(opts.operName);
				obj.attr("status", updateStatus);
				dataGrid.datagrid("reload");
			}
		});
	}
	
	function deleteRow(opts){
		$.messager.confirm('提示', '确认要删除该行记录？', function(r) {
			if (r) {
				$.ajax({
					url : opts.url,
					async : false,
					data : opts.data,
					type : "POST",
					success : function(data, textStatus, jqXHR) {
						$.messager.alert("提示", "删除成功", "info", function() {
							dataGrid.datagrid("reload");
						});
					}					
				});
			}
		});
	}
	
	function toAdd(opts){
		/**
		 * 默认添加对话框配置
		 */
		var defAddOpts = {
				title: '添加',
			    width: 400,
			    height: 280,
			    closed: false,
			    cache: false,
			    href: '',
			    modal: true,
			    buttons: [{
	                text:'保存',
	                iconCls:'icon-ok',
	                handler:function(){
	                	add();
	                }
	            },{
	                text:'取消',
	                handler:function(){
	                	adddialog.dialog("close");
	                }
	            }]
		};
		$.extend(true,defAddOpts,opts);
		$('#addDialog').show();
		adddialog = $('#addDialog').dialog(defAddOpts);
		$('#addForm').form('clear');
	}
	
	function add(){
		$('#addForm').form('submit', {
			onSubmit : function() {
				return $(this).form('validate');
			},
			success : function(result) {
				var r = $.parseJSON(result);
				if (r&&r.msg) {
					$.messager.alert("提示","添加失败","info");
					adddialog.dialog('close');
				}else{
					$.messager.alert("提示","添加成功","info");
					adddialog.dialog('close');
					dataGrid.datagrid('reload');
				}				
			}
		});
	}
	
	/**
	 * mydatagrid
	 * arg1 若为json对象，则arg2为空
	 * 若arg1为字符串，则表示方法名称，arg2则表示方法参数等
	 */
	$.fn.mydatagrid = function(arg1,arg2){
		/**
		 * 默认grid配置
		 */
		var defGridOpts = {
				url : null,
				fit : false,		//true:grid自适应高度 false：指定高度
				fitColumns : true,
				border : true,
				pagination : true,
				pageSize : 2,
				pageList : [ 10, 20, 30, 40, 50 ],
				checkOnSelect : false,
				selectOnCheck : false,
				nowrap : false,
				striped : false,
				rownumbers : true,
				singleSelect : true
		};
		if(typeof(arg1) == "object"){
			$.extend(true,defGridOpts,arg1);		
			mydatagrid(defGridOpts,$(this));
		}else{
			dataGrid.datagrid(arg1, arg2);
		}
		return this;
	};	
	
	/**
	 * 编辑
	 */
	$.fn.edit = function(editOpts){
		edit(editOpts);
	};	
	
	/**
	 * 启用或禁用
	 */
	$.fn.changeStatus = function(opts){
		changeStatus(opts);
	};
	
	/**
	 * 删除
	 */
	$.fn.deleteRow = function(opts){
		deleteRow(opts);
	};
	
	/**
	 * 添加
	 */
	$.fn.toAdd = function(opts){
		toAdd(opts);
	};
	
})(jQuery);
