
/**
 * 数据表格对象
 * 作者 唐延波
 * version 1.9
 * 创建时间 2013-10-16
 * v1.7 2013-12-24
 * v1.9 更新时间 2014-01-15
 */
function DataGrid(gridObject){
	
	/**数据*/
	this.data = null;
	
	/**分组后的数据*/
	this.groupData = {};
	
	/**数据表格*/
	this.table = null;
	
	/**数据div*/
	this.dataDiv = null;
	
	/**
	 * 列选项信息-宽度
	 * [20,30]
	 */
	this.colSettings = [];
	
	/**img 路径*/
	this.imagePath = "easygrid/imgs/";
	
	this.headerDiv = null;
	
	this.gridObject = gridObject;
	
	/**数据行td的高度*/
	this.dataRowHeight = 28;
	
	/**滚动div的宽度*/
	this.scrollWidth = 18;
	
	/**
	 * 获取数据面板的高度
	 */
	this.getDataPanelHeight = function(){
		var height = this.gridObject.container.height()-this.headerDiv.height();
		return height;
	};
	
	/**
	 * 获取表头的宽度
	 */
	this.getHeaderDivWidth = function(){
		return this.headerDiv.find("table:first").width();
	};
	
	/**
	 * 创建数据div
	 */
	this.createDataDiv = function(){
		this.dataDiv = this._createDataDiv();		
		this._createTable();
		this.dataDiv.append(this.table);
		return this.dataDiv;
	};
	
	/**
	 * 创建大数据量div
	 */
	this.createLargeDataDiv = function(){
		var creator = new this.LargeDataDivCreator(this);
		this.dataDiv = creator.create();
		return this.dataDiv;
	};
	
		
	
	this._createDataDiv = function(){
		var dataDiv = $("<div class='objbox' style='width: "+this.headerDiv.find("table:first").width()+"px; overflow-y: auto;'></div>");
		var height = this.getDataPanelHeight();
		dataDiv.css("height",height);
		return dataDiv;
	};
	
	
	
	/**
	 * 创建数据table
	 */
	this._createTable = function(){
		this._createTableElement();
		for ( var i = 0; i < this.data.length; i++) {
			var row = this.data[i];
			var tr = this._createTR(i,row);			
			this.table.append(tr);
		}
	};
	
	/**
	 * 创建table元素
	 */
	this._createTableElement = function(){
		this.table = $("<table class='obj row20px' style='width:"+this.headerDiv.find("table:first").width()+"px' cellpadding='0' cellspacing='0' border='0'></table>");
	};
	
	/**
	 * 创建 group tr
	 * 此方法适用于group
	 */
	this._createTRs = function(group,topGroupName){
		var rows = group.children;
		if(rows){
			for(var i=0;i<rows.length;i++){
				var tr = this._createTR(i+1,rows[i],group.name,topGroupName);
				this.table.append(tr);
			}
		}	
	};
	
	/**
	 * 创建tr
	 */
	this._createTR = function(i,row,groupName,topGroupName){
		var tr = $("<tr></tr>");
		if(topGroupName){
			tr.attr("groupName",topGroupName+"-"+groupName);
		}else{
			tr.attr("groupName",groupName);
		}
		
		if(i%2 == 0){
			tr.addClass("ev_dhx_skyblue");
		}else{
			tr.addClass("odd_dhx_skyblue");
		}
		
		tr.click(function(){
			tr.siblings().removeClass("rowselected");
			tr.addClass("rowselected");
		});		
		this._createTD(row,tr,groupName,topGroupName);
		return tr;
	};
	
	/**
	 * 创建td
	 * rowData 每行的数据
	 * tr 行
	 */
	this._createTD = function(rowData,tr,groupName,topGroupName){
		for ( var i = 0; i < rowData.length; i++) {
			var td = $("<td align='left' valign='middle'></td>");
			var div = $("<div></div>");
			
			if(topGroupName&&i==0){
				div.addClass("level2");
				div.css("width",this.colSettings[i]-40);
			}else if(groupName&&i==0){
				div.addClass("level1");
				div.css("width",this.colSettings[i]-30);
			}else{
				div.addClass("level0");
				div.css("width",this.colSettings[i]-10);
			}
			div.append(rowData[i]);
			div.attr("title",rowData[i]);
			if(!this.gridObject.isLargeData){
				div.tooltip();
			}			
			if(i==(rowData.length-1)){
				//最后一列，需要加上滚动条的宽度
				td.attr("width",(this.colSettings[i]+this.colSettings[i+1]));
			}else{
				//非最后一列
				td.attr("width",this.colSettings[i]);
			}
			
			
			td.append(div);
			tr.append(td);
		}
	};
	
	
	this._createGroupTR = function(group,groupname,child){
		var tr = $("<tr></tr>");
		var cols = group.cols;
		for(var i=0;i<cols.length;i++){
			var td = $("<td class='group_row'></td>");
			if(i==0){
				var span = $("<span></span>");
				var img = $("<img src='"+this.imagePath+"minus.gif' style='margin-bottom:-4px'/>");
				span.append(img);
				if(child){
					span.addClass("group_row_child");
				}
				td.append(span);
			}
			
			td.append(cols[i]);			
			tr.append(td);			
		}
		
		
		if(groupname){
			tr.attr("id",groupname+"-"+group.name);
			tr.attr("groupname",groupname);
		}else{
			tr.attr("id",group.name);
		}	
		
		var outer = this;
		//注册事件
		tr.click(function(){
			var currentGroupName = $(this).attr("id");
			if($(this).hasClass("hidden")){
				//展开				
				$("tr[groupname^='"+currentGroupName+"']",this.table).show();
				$(this).removeClass("hidden");
				$(this).find("img").attr("src",outer.imagePath+"minus.gif");
			}else{
				//折叠
				$("tr[groupname^='"+currentGroupName+"']",this.table).hide();
				$(this).addClass("hidden");
				$(this).find("img").attr("src",outer.imagePath+"plus.gif");
				
			}			
			
		});		
		this.table.append(tr);
	};
	
	/**
	* 创建空的数据div
	*/
	this.createEmptyDataDiv = function(container){
		this.dataDiv = this._createDataDiv();
		this._createTableElement();
		this.dataDiv.append(this.table);
		container.append(this.dataDiv);		
	};
	
	/**
	 * 分组
	 */
	this.group = function(container){
		this.createEmptyDataDiv(container);
		for(var key in this.groupData){
			var group = this.groupData[key];
			this._createGroupTR(group);			
			//group
			var childGroups = group.group;
			if(childGroups){
				for(var key in childGroups){
					var childGroup = childGroups[key];
					this._createGroupTR(childGroup,group.name,true);
					this._createTRs(childGroup,group.name);
				}
				
			}else{
				this._createTRs(group);
			}					
		}
	};
};