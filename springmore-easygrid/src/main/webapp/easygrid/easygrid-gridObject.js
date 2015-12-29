/**
 * GridObject类
 * 作者 唐延波
 * version 1.9
 * v1.6 2013-10-16
 * v1.7 更新时间2013-12-24
 * v1.8 更新时间2014-01-09
 * v1.9 更新时间 2014-01-15
 */
function GridObject(id) {

	/** 容器 */
	this.container = null;

	/** 表头 
	 * [{columns:[
	 * 		{
	 * 		name:'name',    名称
	 * 		width:'80',		宽度
	 * 		colspan:1,		跨列数
	 * 		rowspan:1,		跨行数
	 * 		tdObj:tdObj     td对象
	 * 		}
	 * ]},
	 * {}]
	 * */
	this.headers = [];
	
	
	/***
	 * 列选项信息-宽度
	 * [20,30]
	 */
	this.colSettings = [];

	/** 表头table */
	this.headerTable = null;
	
	/**excel标题*/
	this.title = null;
	
	/**excel文件名称*/
	this.fileName = null;

	/** 数据 grid
	 * */
	this.dataGrid = new DataGrid(this);
	
	/**
	 * grid数据
	 * [[],[],[]]
	 */
	this.data = [];

	/** 分组后的数据 
	 * * 一级分组json结构
	 * {
	 * 	groupKey1:{
	 * 		options:[],
	 * 		cols:[],
	 * 		children:[[],[],[]] //rows
	 * 	}
	 * 	groupKey2:{group}
	 * }
	 * 
	 * 二级分组json结构
	 * {
	 * 	groupKey1:{
	 * 		groupName:xx,
	 * 		ols:[],
	 * 		children:null
	 * 		group:{一级分组结构}
	 * 	}
	 * 	groupKey2:{group}
	 * }
	 * 
	 * */
	this.groupData = {};
	
	/**
	 * 图片地址
	 */
	this.imagePath = "easygrid/imgs/";
	
	/**
	 * 列的排序类型
	 */
	this.colSorting = [];
	
	/**
	 * gird数据
	 */
	this.grid = {
		headerRows:[],
		data:[]
	};	
	
	/**
	 * 是否分组,true表示存在分组,false表示不存在分组
	 */
	this.group = false;
	
	/**
	 * 分组信息
	 * { 
	 * [{
	 * 	index:0
	 * 	options:[]
	 * },{}]
	 * }
	 */
	this.groupOptions = [];
	
	/**
	 * 是否处理大数据
	 */
	this.isLargeData = false;
	
	/**
	 * 导出报表的url
	 */
	this.exportExcelUrl = "exportExcel.action";
	
	/**
	 * grid 默认的高度
	 */
	this.height = 500;
	
	/**
	 * 设置gird的高度
	 */
	this.setHeight = function(height){
		this.height = height;
	}; 
	
	/**设置img 路径*/
	this.setImagePath = function(imagePath){
		this.dataGrid.imagePath = imagePath;
	};
	
	/**设置初始宽度*/
	this.setInitWidths = function(widthStr){
		var widthArray = widthStr.split(",");
		this.colSettings = widthArray;
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
	 * 设置表头的数据
	 */
	this.setHeaderRowsData = function(headerRows){
		this.headers = headerRows;
	};
	
	/**
	 * 设置数据
	 */
	this.setData = function(data){
		this.data = data;
		this.grid.data = data;
		this.dataGrid.data = data;
	};
	
	/**
	 * 设置列的排序类型
	 * 如 "str,number,str"
	 * 目前只支持number和str
	 */
	this.setColSorting = function(colSorting){
		var colSortingArray = colSorting.split(",");
		this.colSorting.push(colSortingArray);
	};
	
	/**
	 * 设置分组信息
	 */
	this.setGroup = function(groupOptions){
		this.group = true;
		this.groupOptions = groupOptions;
	};
	
	/**
	 * 开启大数据方式
	 */
	this.enableLargeData = function(isLargeData){
		this.isLargeData = isLargeData;
	};
	
	/**初始化容器*/
	this._initContainer = function(multipleTable) {
		if(multipleTable){
			this.container = $('<div style="height:500px;width:100%;overflow-x:auto;margin-top:30px;"></div>');
		}else{
			this.container = $("#" + id);	
			if(this.container.height()==0){
				this.container.height(this.height);
			}
		}
		this.container.addClass("gridbox gridbox_dhx_skyblue");
	};

	/** 设置表头 */
	this.setHeader = function(headStr) {
		var headerArray = headStr.split(",");
		var headerRowArray = new Array();
		var headerRow = {
				columns : headerRowArray
		};
		for ( var i = 0; i < headerArray.length; i++) {
			var headerColumn = {
				tdObj : null,
				name : headerArray[i],				
				width : function(){
					return this.tdObj.width();
				},
				colspan : function(){
					var colspan = this.tdObj.prop("colspan");
					return colspan;
				},
				rowspan : function(){
					var rowspan = this.tdObj.prop("rowspan");
					return rowspan;
				}
			};
			headerRow.columns.push(headerColumn);			
		}
		this.headers.push(headerRow);
	};
	
	/**
	 * 附加头部
	 * */
	this.attachHeader = function(headStr){
		this.setHeader(headStr);
	};

	/** grid初始化 */
	this.init = function(multipleTable) {
		this._initContainer(multipleTable);
		if(!multipleTable){
			this._createHeaderDiv();		
			var loadingDiv = $('<div style="display:none"><div id="loading"></div></div>');
			this.container.closest("body").append(loadingDiv);
		}		
	};
		
	this._setExcelHeaders = function(){
		if(this.grid.headerRows.length>0){
			return;
		}
		for(var i=0;i<this.headers.length;i++){
			var row = this.headers[i];
			var excelRow = {
					columns : new Array()
			};
			this.grid.headerRows.push(excelRow);
			var headersArray = row.columns;
			for(var j=0;j<headersArray.length;j++){
				var name = headersArray[j].name;
				var width = headersArray[j].width();
				var colspan = headersArray[j].colspan();
				var rowspan = headersArray[j].rowspan();
				var header = {
					name : name,
					width : width,
					colspan : colspan,
					rowspan : rowspan
				};
				excelRow.columns.push(header);
			}
		}
	};
	
	
	
	/**
	 * 解析数据
	 */
	this.parse = function(data) {		
		this.setData(data);
		if(this.group){
			this.groupBy();
		}else if(this.isLargeData){
			this.createLargeDataDiv();
		}else{
			this._createDataDiv();	
		}
	};
	
	/**
	 * 创建大数据量div
	 */
	this.createLargeDataDiv = function(){
		var dataDiv = this.dataGrid.createLargeDataDiv();
		this.container.append(dataDiv);
	};
	
	
	/**
	 * 加载数据
	 */
	this.load = function(url,param,callback){
		if(this.dataGrid.dataDiv){
			this.dataGrid.dataDiv.remove();
		}		
		var outer = this;
		var back = null;
		$.blockUI({ 
			message : $("#loading"),
			css: { 
				border: 'none', 
				height:'35px',
				background:"url("+this.imagePath+"loading.gif) 50% 50% no-repeat",
				opacity: 0.5, 
				color: '#fff' 
			} 
		});
		$.ajax({
			url : url,
			type : "POST",
			dataType : "json",
			data:param,
			async : true,
			success:function(data){				
				outer.parse(data);
				back = data;
				$.unblockUI();
				if(callback) {
					callback();
				}
			},
			error:function(jqXHR, textStatus, errorThrown){
				
			}
		});
		return back;
	};
	
	

	/** 设置列的宽度 */
	this.setColSettings = function() {
		var tds = this.headerTable.find("tr:first th");
		var outer = this;
		tds.each(function(i) {			
			outer.colSettings[i] = $(this).width();
		});
		this.dataGrid.colSettings = this.colSettings;
	};
	

	/**
	 * 创建表头DIV
	 */
	this._createHeaderDiv = function() {
		var div = $("<div class='xhdr'></div>");
		var table = this._createHeaderTable();
		this.headerTable = table;
		div.append(table);
		this.dataGrid.headerDiv = div;
		this.container.append(div);
		this.setColSettings();
	};
	
	/**
	 * 创建数据div
	 */
	this._createDataDiv = function(){
		var dataDiv = this.dataGrid.createDataDiv();
		this.container.append(dataDiv);
	};

	/**
	 * 创建表格
	 */
	this._createHeaderTable = function() {
		var tableWidth = 0;
		if(this.colSettings.length>0){
			for(var i=0; i<this.headers.length; i++){
				if(this.colSettings[i]!="*"&&this.colSettings[i]!=""){
					tableWidth += parseInt(this.colSettings[i]);
				}
			}
		}		
		if(tableWidth<this.container.width()){
			tableWidth = this.container.width();
		}
		var table = $("<table class='hdr' style='table-layout: fixed;' cellpadding='0' cellspacing='0'></table>");
		table.width(tableWidth);
		this._createHeaderTableTH(table, this.headers[0].columns);
		for( var i = 0; i < this.headers.length; i++){
			var tr = $("<tr></tr>");
			table.append(tr);
			var headerRow = this.headers[i];
			var preColumns = null;
			if(i>0){
				preColumns = this.headers[i-1].columns;
			}
			this._createHeaderTableTD(headerRow.columns,tr,preColumns);
		}
		return table;
	};
	
	/**
	 * 创建th
	 */
	this._createHeaderTableTH = function(table,columns){
		var tr = $("<tr style='height: auto;'></tr>");
		table.append(tr);
		for( var i = 0; i < columns.length; i++){
			var th = $("<th style='height: 0px;'></th>");
			if(this.colSettings.length>0){
				th.width(this.colSettings[i]);
			}else{
				if(columns[i].width>0){
					th.width(columns[i].width);
				}				
			}			
			tr.append(th);			
		}
		tr.append($("<th style='height: 0px;width:15px;'></th>"));
	};

	/**
	 * 创建表格td
	 * @param columns 当前行的所有列数据
	 * @param tr 行
	 * @param preColumns 上一行的所有列数据
	 */
	this._createHeaderTableTD = function(columns,tr,preColumns){
		for ( var i = 0; i < columns.length; i++) {
			var td = $("<td style='cursor:default;'></td>");			
			if(this.colSettings[i]!="*"){
				//td.css("width",this.colSettings[i]);				
			}
			var div = $("<div class='hdrcell' style='word-break: keep-all;white-space:nowrap;position: relative'></div>");
			
			//增加列索引
			div.attr("colindex",i);
			
			//排序事件
			this._addSortListener(div);
			
			if(columns[i].name == "#cspan"){
				//合并列
				//将tr的最后一个td的colspan+1
				var lasttd = tr.find("td:last");
				var colspan = lasttd.attr("colspan") || 1;
				colspan = parseInt(colspan);
				lasttd.attr("colspan",colspan + 1);
				lasttd.find("div").css("text-align","center");
			}else if(columns[i].name == "#rspan"){
				//合并行
				if(preColumns){
					var aboveTd = preColumns[i].tdObj;
					var rowspan = aboveTd.attr("rowspan") || 1;
					rowspan = parseInt(rowspan);
					aboveTd.attr("rowspan",rowspan + 1);
				}				
			}else{
				div.append(columns[i].name);
				td.append(div);
				tr.append(td);
			}		
			columns[i].tdObj = td;
		}
		this._addScrollTd(tr,preColumns,columns.length+1);
	};
	
	/**
	 * 添加滚动条td
	 */
	this._addScrollTd = function(tr,preColumns,tdIndex){
		if(preColumns){
			var preScrollTd = tr.prev().find("td:last");
			var rowspan = preScrollTd.attr("rowspan") || 1;
			rowspan = parseInt(rowspan);
			preScrollTd.attr("rowspan",rowspan + 1);
		}else{
			var scrollTd = $("<td style='cursor:default;' class='scroll'></td>");
			tr.append(scrollTd);
		}
	};
	
	
	/**
	 * 增加排序监听
	 */
	this._addSortListener = function(div){
		//如果存在分组,则不排序
		if(this.group){
			return;
		}
		var outer = this;
		div.click(function(){
			var img;
			if(!$(this).hasClass("asc")){
				img = $(this).find("img")[0];
				if(img == undefined){
					img = $("<img src='"+outer.imagePath+"sort_asc.gif' style='position: absolute;right:5px;'></img>");
				}else{
					$(img).attr("src",outer.imagePath+"sort_asc.gif");
				}		
				$(this).removeClass("desc");
				$(this).addClass("asc");
				outer._sort($(this).attr("colindex"),"asc");
			}else{
				img = $(this).find("img")[0];
				$(img).attr("src",outer.imagePath+"sort_desc.gif");
				$(this).removeClass("asc");
				$(this).addClass("desc");
				outer._sort($(this).attr("colindex"),"desc");
			}				
			$(this).append(img);				
		});
	};

	/**
	 * 导出Excel
	 */
	this.toExcel = function(url){
		if(url==null){
			url = this.exportExcelUrl;
		}
		this._setExcelHeaders();
		var form = $("<form method='post' action='"+url+"' id='easygrid-excelForm'></form>");
		if(this.title != null){
			var title = $("<input name='title' type='hidden' value='"+this.title+"'/>");
			form.append(title);
		}		
		var fileName = $("<input name='fileName' type='hidden' value='"+this.fileName+"'/>");
		var grid = $("<input name='grid' type='hidden' value='"+JSON.stringify(this.grid)+"'/>");		
		form.append(fileName);
		form.append(grid);
		this.container.find("#easygrid-excelForm").remove();
		this.container.append(form);
		form.submit();
	};
	
	
	
	/** 
	 * 分组 	
	 * 
	 * */
	this.groupBy = function() {
		var colIndex = this.groupOptions[0].index;
		var groupData = {};
		for ( var i = 0; i < this.data.length; i++) {
			var row = this.data[i];
			var groupCol = row[colIndex];			
			this._pushInGroup(groupCol, row,groupData,this.groupOptions[0]);			
		}
		this.groupData = groupData;

		// 二级分组
		if (this.groupOptions[1]) {
			this._groupLevel2(this.groupOptions[1]);
		}
		this.dataGrid.groupData = this.groupData;
		this.dataGrid.group(this.container);
	};
	

	/**
	 * 二级分组
	 */
	this._groupLevel2 = function(groupOption) {
		for ( var key in this.groupData) {
			var rows = this.groupData[key].children;
			if (rows) {
				var childGroup = {};
				for ( var i = 0; i < rows.length; i++) {
					var groupCol = rows[i][groupOption.index];
					this._pushInGroup(groupCol,rows[i],childGroup,groupOption);
					
				}
				this.groupData[key].children = null;
				this.groupData[key].group = childGroup;
			}
		}

	};

	/** 添加到分组 */
	this._pushInGroup = function(groupCol, row,groupData,groupOption) {		
		var group = groupData[groupCol];
		var cols;
		if (group) {
			cols = group.cols;			
			group.children.push(row);
		} else {
			cols = [];
			group = {
				name:groupCol,
				options : options,
				cols : cols,
				children : []
			};
			group.children.push(row);
			groupData[groupCol] = group;
		}
		var options = groupOption.options;
		for(var i=0;i<options.length;i++){
			if(options[i]=="#stat_total"){
				if(cols[i]==undefined){
					cols[i]=0;
				}
				if(row[i]==undefined){
					cols[i] += 0;
				}else{
					cols[i] = parseFloat((cols[i]+row[i]).toFixed(2));
				}				
			}else if(options[i]=="#title"){
				cols[i] = groupCol;
			}else{
				cols[i] = "";
			}
		}	
	};

	/**
	 * 排序
	 */
	this._sort = function(i,sortType){	
		if(this.dataGrid.dataDiv){
			this.dataGrid.dataDiv.remove();
		}
		if(sortType == "asc"){
			this.data.sort(sortAsc);
		}else{
			this.data.sort(sortDesc);
		}		
		this.parse(this.data);		
		/**
		 * 升序排序
		 */
		function sortAsc(pre,after){
			var preObject = pre[i];
			var afterObject = after[i];
			if(!isNaN(preObject)&&!isNaN(afterObject)){
				//转成number类型
				preObject = preObject*1;
				afterObject = afterObject*1;
			}
			
			//比较逻辑
			if(preObject == "" || preObject == undefined){
				return 1;
			}
			
			if(afterObject == "" || afterObject == undefined){
				return -1;
			}
			if(preObject<afterObject){
				return -1;
			}
			if(preObject>afterObject){
				return 1;
			}
			return 0;
		}

		/**
		 * 降序排序
		 */
		function sortDesc(pre,after){
			var preObject = pre[i];
			var afterObject = after[i];
			if(!isNaN(preObject)&&!isNaN(afterObject)){
				//转成number类型
				preObject = preObject*1;
				afterObject = afterObject*1;
			}
			
			//比较逻辑
			if(preObject == "" || preObject == undefined){
				return 1;
			}
			
			if(afterObject == "" || afterObject == undefined){
				return -1;
			}
			if(preObject>afterObject){
				return -1;
			}
			if(preObject<afterObject){
				return 1;
			}
			return 0;
		}
	};
}


