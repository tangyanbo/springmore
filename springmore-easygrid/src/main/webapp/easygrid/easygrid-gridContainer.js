/**
 * GridContainer类
 * 作者 唐延波
 * version 1.9
 * 创建时间 2013-10-16
 * v1.8 2013-12-24
 * v1.9 更新时间 2014-01-15
 */
function GridContainer(id) {
	
	/** 容器 */
	this.container = null;
	
	/**img 路径*/
	this.imagePath = "easygrid/imgs/";
	
	/**excel标题*/
	this.title = null;
	
	/**excel文件名称*/
	this.fileName = null;
	
	/**
	 * 是否多个表格展示，默认false，即单个
	 */
	this.multipleTable = false;
	
	/**
	 * grid数据，多个表格的数据，包括表头和内容
	 */
	this.girdData = [];
	
	this.excelData = [];

	/**设置img 路径*/
	this.setImagePath = function(imagePath){
		this.dataGrid.imagePath = imagePath;
	};	

	/**设置标题*/
	this.setTitle = function(title){
		this.title = title;
	};
	
	/**设置文件名*/
	this.setFileName = function(fileName){
		this.fileName = fileName;
	};
	
	/**
	 * 设置是否多个表格展示
	 */
	this.setMultipleTable = function(multipleTable){
		this.multipleTable = multipleTable;
	};
	
	/** grid初始化 */
	this.init = function() {
		this._initContainer();
	};
	
	/**初始化容器*/
	this._initContainer = function() {
		this.container = $("#" + id);
	};
	
	/**
	 * 加载数据
	 */
	this.load = function(url,param){
		if(this.container){
			this.container.empty();
		}		
		var outer = this;
		var back = null;
		$.ajax({
			url : url,
			type : "POST",
			dataType : "json",
			data:param,
			async : false,
			success:function(data){
				outer.parse(data);
				back = data;
			},
			error:function(jqXHR, textStatus, errorThrown){
				
			}
		});
		return back;
	};
	
	/**
	 * 解析数据
	 */
	this.parse = function(data) {		
		this.girdData = data;
		this._createMultipleTable(data);			
	};
	
	/**
	 * 创建多个表格
	 */
	this._createMultipleTable = function(data){
		for(var i=0;i<data.length;i++){
			var grid = data[i];
			//初始化GridObject
			var gridObject = new GridObject();
			gridObject.init(true);
			var gridDiv = gridObject.container;
			this.container.append(gridDiv);
			//设置表头和数据
			gridObject.setHeaderRowsData(grid.headerRows);
			gridObject.setData(grid.data);
			
			//创建表头div
			gridObject._createHeaderDiv();
			//创建数据div
			gridObject._createDataDiv();
			
		}
	};
	
	/**
	 * 导出Excel
	 */
	this.toExcel = function(){
		this._parseDataToExcel();
		var form = $("<form method='post' action='exportExcelMultipleTable.action'></form>");
		if(title!=null){
			var title = $("<input name='title' type='hidden' value='"+this.title+"'/>");
			form.append(title);
		}		
		var fileName = $("<input name='fileName' type='hidden' value='"+this.fileName+"'/>");
		var girds = $("<input name='girds' type='hidden' value='"+JSON.stringify(this.excelData)+"'/>");
		form.append(fileName);
		form.append(girds);
		this.container.append(form);
		form.submit();
	};
	
	/**
	 * 将数据转换为excel下载的格式
	 */
	this._parseDataToExcel = function(){
		this.excelData = [];
		for(var i=0;i<this.girdData.length;i++){
			var grid = this.girdData[i];
			var excelGrid = {};
			excelGrid.headerRows = this._getExcelHeaderRows(grid.headerRows);
			excelGrid.data = grid.data;
			this.excelData.push(excelGrid);
		}
	};
	
	/**
	 * 获取excel rows
	 */
	this._getExcelHeaderRows = function(headerRows){
		var excelHeaderRows = new Array();
		for(var i=0;i<headerRows.length;i++){
			var headerRow = headerRows[i];
			var excelHeaderRow = this._getExcelHeaderRow(headerRow);
			excelHeaderRows.push(excelHeaderRow);
		}
		return excelHeaderRows;
	};
	
	/**
	 * 获取excel row
	 */
	this._getExcelHeaderRow = function(headerRow){
		var excelHeaderRow = {columns:[]};
		var headerColumns = headerRow.columns;
		for(var i=0;i<headerColumns.length;i++){
			var column = headerColumns[i];
			excelHeaderRow.columns.push(this._getExcelColumn(column));
		}
		return excelHeaderRow;
	};
	
	/**
	 * 获取Excel列
	 */
	this._getExcelColumn = function(column){
		var excelColumn = {};
		excelColumn.name = column.name;
		excelColumn.width = column.tdObj.width();
		excelColumn.colspan = column.tdObj.prop("colspan");
		excelColumn.rowspan = column.tdObj.prop("rowspan");
		return excelColumn;
	};
}
