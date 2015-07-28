/**
 * 基于datagrid的Excel导出扩展方法
 * 
 * @author Say
 * @date 2014-08-11
 * @version 1.02
 * @date 2014-08-15<br>
 *       更新内容：<br>
 *       1. 修复了datagrid有固定列导出Excel错误！
 *       2. 已知bug：竖向合并的超过2行，下载出来的数据就会错位。
 * @date 2014-10-28<br>
 *       更新内容：<br>
 *       1. 添加了单元格边框！
 * 
 */
(function($) {
	/**
	 * 基于Excel可以导出xml实现。
	 */
	$.fn.excelExport = function(setting) {
		var defaultSetting = {
			datagridIds : [],
			sheetName : "Sheet1",
			rowHeight : 20,
			titleLineHeigth : 20,
			headFontSize : 12,        //int     表头字体大小，默认值：12
			bodyFontSize : 11,        //int     内容字体大小，默认值：11
			fontFamily : "宋体",       //String  内容字体，默认值：宋体  
			columnWidth : 100,        //int     单元格的宽度，默认值：100     
			headStyleId : "tHead",         //String  表头样式id，默认值：无  (插件中已有样式id：Default、tBody、tHead)
			bodyStyleId : "tBody"         //String  内容样式id，默认值：无  (插件中已有样式id：Default、tBody、tHead)
			/*style : '<Style ss:ID="tHead"><Alignment ss:Horizontal="Center"/></Style>'*/  //String   自定义Excel显示样式，默认值：无
			/*title:""*/                  //String  表标题，默认值：datagrid的title，如果没有则不显示		
		};
		//获取一个tr中td的个数
		var getTrTdNum = function(tr){
			var _length = 0;
			$.each($("td:not(:hidden)", tr), function(i, td){
				var $td = $(td), $colspan = $td.attr("colspan");
				if($colspan != undefined){
					_length = _length + parseInt($colspan);
				}else{
					_length++;
				}
			});
			return _length;
		};
		//创建一个Excel工作空间
		var createWorksheet = function(param){
			var xmlStr = '<?xml version="1.0" encoding="utf-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Created>2006-09-16T00:00:00Z</Created><LastSaved>2014-08-09T02:37:53Z</LastSaved><Version>15.00</Version></DocumentProperties><OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office"><AllowPNG /><RemovePersonalInformation /></OfficeDocumentSettings><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowHeight>8010</WindowHeight><WindowWidth>14805</WindowWidth><WindowTopX>240</WindowTopX><WindowTopY>105</WindowTopY><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom" ss:WrapText="1"/><Borders /><Font ss:FontName="'+(param.fontFamily === undefined ? "宋体" : param.fontFamily)+'" x:CharSet="134" ss:Size="11" ss:Color="#000000" /><Interior /><NumberFormat /><Protection /></Style><Style ss:ID="tBody"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" /></Borders><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Font ss:FontName="'+(param.fontFamily === undefined ? "宋体" : param.fontFamily)+'" x:CharSet="134" ss:Size="'+(param.bodyFontSize === undefined ? 11 : param.bodyFontSize)+'" ss:Color="#000000"/></Style><Style ss:ID="tHead"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" /></Borders><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Font ss:FontName="'+(param.fontFamily === undefined ? "宋体" : param.fontFamily)+'" x:CharSet="134" ss:Size="'+(param.headFontSize === undefined ? 12 : param.headFontSize)+'" ss:Color="#000000" ss:Bold="1" /><Interior ss:Color="#C0C0C0" ss:Pattern="Solid" /></Style><Style ss:ID="tTitle"><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" /><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" /></Borders><Font ss:FontName="'+(param.fontFamily === undefined ? "宋体" : param.fontFamily)+'" x:CharSet="134" ss:Size="'+(param.headFontSize === undefined?"13":param.headFontSize)+'" ss:Color="#000000" ss:Bold="1" /></Style>'+(param.style === undefined ? "" : param.style)+'</Styles>';
			xmlStr += '<Worksheet ss:Name="'+(param.sheetName === undefined ? "Sheet1" : param.sheetName)+'"><Table ss:DefaultColumnWidth="'+(param.columnWidth === undefined ? 100 : param.columnWidth)+'" ss:DefaultRowHeight="'+(param.rowHeight === undefined ? 20 : param.rowHeight)+'">';//Excel头
			return xmlStr;
		};
		//获取datagrid的title，如果没有setting和datagrid中都没有title则不显示。
		var getTitle = function(jq, param, maxNum){
			var title = (jq.datagrid("options").title === null ? undefined : jq.datagrid("options").title);
			if(param.title !== undefined){
				title = param.title;
			}
			return (title === undefined ? "" : '<Row ss:Height="'+(param.titleLineHeigth === undefined ? 20 : param.titleLineHeigth)+'"><Cell ss:StyleID="tTitle" ss:MergeAcross="'+(maxNum - 1)+'"><Data ss:Type="String">'+title+'</Data></Cell></Row>');
		};
		
		var getFixedColumns = function(arrys, trs, styleId, ftdMaxNum){
			var _arr = [];
			$.each(trs, function(i, tr){
				var _tds = $("td:not(:hidden)", tr), temp = _arr, index = 0, str = "";
				_arr = [];
				for ( var int = 0; int < ftdMaxNum; int++) {
					if($(temp).index(int) !== -1){
						str += '<Cell ss:StyleID="'+styleId+'"><Data ss:Type="String" ss:Index="'+(int+1)+'"> </Data></Cell>';
					}else{
						var $td = $(_tds[index]), $rowspan = $td.attr("rowspan"), $colspan = $td.attr("colspan");
						if($rowspan != undefined){
							_arr.push(int);
						}
						if(_tds[index] != undefined){
							if($td.css("display") !== "none"){
								var _tempTextStr = $.trim($td.clone().children().remove().text());
								str += '<Cell ss:StyleID="'+styleId+'"'+($rowspan === undefined ? "" : " ss:MergeDown='"+(parseInt($rowspan) - 1)+"'")+($colspan === undefined ? "" : " ss:MergeAcross='"+(parseInt($colspan) - 1)+"'")+
								'><Data ss:Type="String" ss:Index="'+(int+1)+'">'+_tempTextStr+'</Data></Cell>';
							}
							index++;
						}
					}
				}
				arrys.push(str);
			});
		};
		
		//将datagrid中的数据转换成Excel中的单元格数据
		var eachNodes = function(trs, styleId, maxRowNum, param){
			var xmlStr = "", _arr = [];
			$.each(trs, function(i, tr){
				var _tds = $("td:not(:hidden)", tr), temp = _arr, index = 0;
				xmlStr += '<Row>';
				if(param.heads !== undefined){
					if(param.heads[i]===undefined){
						for ( var intj = 0; intj < param.ftdMaxNum; intj++) {
							//xmlStr += '<Cell ss:StyleID="'+styleId+'"><Data ss:Type="String" ss:Index="'+(intj+1)+'"> </Data></Cell>';
						}
					}else{
						xmlStr += param.heads[i];
					}
				}
				
				_arr = [];
				for ( var int = 0; int < maxRowNum; int++) {
					if($(temp).index(int) !== -1){
						//xmlStr += '<Cell ss:StyleID="'+styleId+'"><Data ss:Type="String" ss:Index="'+(int+1+(param.ftdMaxNum === undefined ? 0 : param.ftdMaxNum))+'"> </Data></Cell>';
					}else{
						var $td = $(_tds[index]), $rowspan = $td.attr("rowspan"), $colspan = $td.attr("colspan");
						if($rowspan != undefined){
							_arr.push(int);
						}
						if(_tds[index] != undefined){
							if($td.css("display") !== "none"){
								var _tempTextStr = $.trim($td.clone().children().remove().text());
								xmlStr += '<Cell ss:StyleID="'+styleId+'"'+($rowspan === undefined ? "" : " ss:MergeDown='"+(parseInt($rowspan) - 1)+"'")+($colspan === undefined ? " ss:Index=\""+(int+1+(param.ftdMaxNum === undefined ? 0 : param.ftdMaxNum))+"\"" : " ss:MergeAcross=\""+(parseInt($colspan) - 1)+"\"")+
								'><Data ss:Type="String" ss:Index="'+(int+1+(param.ftdMaxNum === undefined ? 0 : param.ftdMaxNum))+'">'+_tempTextStr+'</Data></Cell>';
							}/*else{
								xmlStr += '<Cell ss:StyleID="'+styleId+'"><Data ss:Type="String" ss:Index="'+(int+1)+'"> </Data></Cell>';//隐藏的单元格
							}*/
							index++;
						}
					}
				}
				xmlStr += '</Row>';
			});
			return xmlStr;
		};
		//获取datagrid标题数据
		var getHead = function(trs, param, maxRowNum, heads){
			param.heads = heads;
			return eachNodes(trs, (param.headStyleId === undefined ? "tHead" : param.headStyleId), maxRowNum, param);
		};
		//获取datagrid内容数据
		var getBody = function(trs, param, maxRowNum, bodys){
			param.heads = bodys;
			return eachNodes(trs, (param.bodyStyleId === undefined ? "tBody" : param.bodyStyleId), maxRowNum, param);
		};
		//创建Excel结尾部分
		var creatWorkFooter = function(){
			return '</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><Selected /><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet></Workbook>';//Excel末尾
		};
		
		var getMaxNum = function(tds, index){
			if(tds){
				$.each(tds, function(i, td){
					var t = $(td);
					index = index + (t.attr("colspan") === undefined ? 1 : parseInt(t.attr("colspan")));
				});
			}
			return index;
		};
		defaultSetting = jQuery.extend(defaultSetting, setting);
		var xmlStr = createWorksheet(defaultSetting);
		$.each(defaultSetting.datagridIds, function(i, datagridId){
			var jq = $("#" + datagridId);
			if(jq.length === 0){
				return false;
			}
			var panel = $(jq).datagrid("getPanel"),
			tableHead = $("div.datagrid-view2 table.datagrid-htable", panel), 
			tableBody = $("div.datagrid-view2 table.datagrid-btable", panel), 
			ctableHead = $("div.datagrid-view1 table.datagrid-htable", panel), 
			ctableBody = $("div.datagrid-view1 table.datagrid-btable", panel),
			frozenFirstColumnsTds = $("div.datagrid-view1 table.datagrid-htable tr:eq(0) td:not(:hidden)", panel), 
			firstColumnsTds = $("div.datagrid-view2 table.datagrid-htable tr:eq(0) td:not(:hidden)", panel), maxNum = 0;//内容
			maxNum = getMaxNum(frozenFirstColumnsTds, maxNum);
			maxNum = getMaxNum(firstColumnsTds, maxNum);
			maxRowNum = getTrTdNum($("tr.datagrid-header-row", tableHead).eq(0));
			ftdMaxNum = getTrTdNum($("tr.datagrid-header-row", ctableHead).eq(0));
			var heads = [];
			getFixedColumns(heads, $("tr.datagrid-header-row", ctableHead), (defaultSetting.headStyleId === undefined ? "tHead" : defaultSetting.headStyleId), ftdMaxNum);
			var bodys = [];
			getFixedColumns(bodys, $("tr.datagrid-row", ctableBody), (defaultSetting.bodyStyleId === undefined ? "tBody" : defaultSetting.bodyStyleId), ftdMaxNum);
			defaultSetting.ftdMaxNum = ftdMaxNum;
			xmlStr += getTitle(jq, defaultSetting, maxNum) + getHead($("tr.datagrid-header-row", tableHead), defaultSetting, maxNum, heads) + getBody($("tr.datagrid-row", tableBody), defaultSetting, maxNum, bodys) + '<Row>';
			//非最后一个datagrid添加一行间隔行
			if((defaultSetting.datagridIds.length - 1) !== i){
				for ( var int = 0; int < maxNum; int++) {
					xmlStr += '<Cell ss:StyleID="'+defaultSetting.bodyStyleId+'"><Data ss:Type="String" ss:Index="'+(int+1)+'"> </Data></Cell>';
				}
			}
			xmlStr += '</Row>';
		});
		if (window.console) {
			console.log("Excel xml代码：" + xmlStr + creatWorkFooter());
		}
		return xmlStr + creatWorkFooter();
	};
})(jQuery);