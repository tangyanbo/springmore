/**
 * 数据div创建器
 * 作者 唐延波
 * version 1.9
 * v1.9 更新时间 2014-01-15
 */
DataGrid.prototype.LargeDataDivCreator = function(dataGrid) {
	
	this.data = dataGrid.data;
	
	this.scrollWidth = dataGrid.scrollWidth;
	
	this.dataRowHeight = dataGrid.dataRowHeight;
	
	/**
	 * 内容view
	 */
	this.rowsView;
	
	/**
	 * 滚动Div
	 */
	this.scrollDiv;
	
	/**
	 * 滚动条的高度
	 */
	this.scrollTop = 0;
	
	/**
	 * 是否可以滚动
	 */
	this.rowViewScrollable = true;
	
	this.scrollDivScrollable = true;
	
	/**
	 * 创建大数据量div
	 */
	this.create = function(){
		var dataPanel = this._createDataPanel();
		var rowsView = this._createRowsView();
		var scrollDiv = this._createScrollDiv();
		dataPanel.append(rowsView);
		dataPanel.append(scrollDiv);
		return dataPanel;
	};
	
	this._createDataPanel = function(){
		var dataPanel = $("<div class='easygrid-data-panel'></div>");
		var height = dataGrid.getDataPanelHeight();
		var width = dataGrid.getHeaderDivWidth();
		dataPanel.css("height",height + "px");
		dataPanel.css("width",width + "px");
		return dataPanel;
	};
	
	this._createRowsView = function(){
		var rowsView = $("<div class='easygrid-rows-view'></div>");
		var contentDiv = this._createContentDiv();
		rowsView.append(contentDiv);
		this.rowsView = rowsView;
		//注册滚动事件
		var outer = this;
		rowsView.scroll(function(){;
			outer._reloadRowsView($(this));	
			outer._scrollScrollDiv();	
		});
		return rowsView;
	};
	
	this._reloadRowsView = function(div){		
		this.scrollTop = div.scrollTop();		
		var contentDiv = this._createContentDiv();
		this.rowsView.empty();
		this.rowsView.append(contentDiv);
	};
	
	this._scrollRowsView = function(){
		this.rowsView.scrollTop(this.scrollTop);
	};
	
	/**
	 * 滚动ScrollDiv
	 */
	this._scrollScrollDiv = function(){	
		this.scrollDiv.scrollTop(this.scrollTop);
	};
	
	
	/**
	 * 滚动条框架Div
	 * @returns
	 */
	this._createScrollDiv = function(){
		var scrollDiv = $("<div class='easygrid-scroll'></div>");
		var scrollContentDiv = this._createScrollContentDiv();
		scrollDiv.append(scrollContentDiv);
		//注册滚动事件
		var outer = this;
		scrollDiv.scroll(function(e){	
			outer._reloadRowsView($(this));			
			outer._scrollRowsView();
		});
		this.scrollDiv = scrollDiv;
		return scrollDiv;
	};
	
	
	
	/**
	 * 滚动条内容Div
	 * @returns
	 */
	this._createScrollContentDiv = function(){
		var height = this.data.length * this.dataRowHeight;
		var scrollContentDiv = $("<div class='easygrid-scroll-content'></div>");
		scrollContentDiv.css("height",height);
		return scrollContentDiv;
	};
	
	
	this._createContentDiv = function() {
		var width = dataGrid.getHeaderDivWidth() - this.scrollWidth;
		var contentDiv = $("<div class='dataContent' style='width: " + width
				+ "px;'></div>");
		var data = this._getDisplayData();
		this._createContentTable(data);
		contentDiv.append(dataGrid.table);
		return contentDiv;
	};

	/**
	 * 创建数据table
	 */
	this._createContentTable = function(data) {
		this._createTableElement();
		this._createTopTr();
		this._createContentTr(data);
		this._createBottomTr();		
	};
	
	this._createTableElement = function(){
		dataGrid._createTableElement();
	};
	
	/**
	 * 获取表格顶部tr
	 * @returns
	 */
	this._getTopTr = function(){
		var tr = $("<tr class='easygrid-virtualscroll-top'></tr>");
		var td = $("<td></td>");
		td.css("height",this._getTopTrHeight());
		tr.append(td);
		return tr;
	};
	
	
	
	
	/**
	 * 创建表格顶部tr
	 * @returns
	 */
	this._createTopTr = function(){
		var topTr = this._getTopTr();
		dataGrid.table.append(topTr);
	};
	
	/**
	 * 创建表格内容Tr
	 */
	this._createContentTr = function(data){
		for ( var i = 0; i < data.length; i++) {
			var row = data[i];
			var tr = dataGrid._createTR(i, row);
			dataGrid.table.append(tr);
		}
	};
	
	/**
	 * 获取表格底部TR
	 */
	this._getBottomTr = function(){
		var tr = $("<tr class='easygrid-virtualscroll-bottom'></tr>");
		var td = $("<td></td>");
		td.css("height",this._getBottomTrHeight());
		tr.append(td);
		return tr;
	};
	
	/**
	 * 创建表格底部TR
	 */
	this._createBottomTr = function(){
		var bottomTr = this._getBottomTr();
		dataGrid.table.append(bottomTr);
	};

	this._getDisplayData = function() {
		var start = this._getStart();
		var end = this._getEnd();
		return this.data.slice(start, end);
	};
	
	/**
	 * 获取数据起始位置
	 */
	this._getStart = function(){
		return this.scrollTop / this.dataRowHeight;		
	};
	
	/**
	 * 获取数据结束位置
	 */
	this._getEnd = function(){
		return this._getDisplayDataSize() + this._getStart();
	};
	
	/**
	 * 获取table底部的高度
	 * @returns {Number}
	 */
	this._getBottomTrHeight = function(){
		var dataPanelHeight = dataGrid.getDataPanelHeight();
		return this._getTotalHeight() - dataPanelHeight - this._getTopTrHeight();
	};
	
	/**
	 * 获取整个tableContent的高度
	 */
	this._getTotalHeight = function(){
		return this.data.length * this.dataRowHeight;
	};
	
	/**
	 * 获取顶部Tr的高度
	 * 默认是0,随着scrollTop变化而变化
	 * @returns {Number}
	 */
	this._getTopTrHeight = function(){
		return this.scrollTop;
	};

	/**
	 * 获取需要显示的数据条数
	 * @returns {Number}
	 */
	this._getDisplayDataSize = function() {
		return dataGrid.getDataPanelHeight() / this.dataRowHeight;
	};
	
	
};