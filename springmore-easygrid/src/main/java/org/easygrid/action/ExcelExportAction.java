package org.easygrid.action;

import java.util.List;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.easygrid.excel.ExcelWriter;
import org.easygrid.grid.Grid;
import org.easygrid.util.GridJSONUtil;

/**
 * excel导出  配合 grid组件用
 * @author 唐延波
 * @date 2013-12-3
 */
@SuppressWarnings("serial")
@ParentPackage("struts-default")
@Namespace("/")
public class ExcelExportAction extends DownloadAction {

	private final Logger log = Logger.getLogger(this.getClass());
	
	private String header;

	private String data;

	private String title;

	private String fileName;
	
	private String girds;
	
	private String grid;
	
	/**
	 * 单表导出excel
	 * @author 唐延波
	 * @date 2013-12-3
	 */
	@Action("exportExcel")
	public void exportExcel() {
		try {			
			Grid gridObject = GridJSONUtil.transformJSONToGrid(grid);
			ExcelWriter excelWriter = ExcelWriter.getInstance(title, fileName, gridObject, response);
			excelWriter.exportExcel();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}
	
	/**
	 * 多表导出excel
	 * @author 唐延波
	 * @date 2013-12-3
	 */
	@Action("exportExcelMultipleTable")
	public void exportExcelMultipleTable() {
		try {			
			List<Grid> gridList = GridJSONUtil.transformJSONToGridList(girds);
			ExcelWriter excelWriter = ExcelWriter.getInstance(title, fileName, gridList, response);
			excelWriter.exportExcelMultipleGrid();
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}
	

	public String getHeader() {
		return header;
	}

	public void setHeader(String header) {
		this.header = header;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getGirds() {
		return girds;
	}

	public void setGirds(String girds) {
		this.girds = girds;
	}

	public String getGrid() {
		return grid;
	}

	public void setGrid(String grid) {
		this.grid = grid;
	}

	
	
}
