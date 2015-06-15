package org.springmore.commons.io.excel;

import java.util.List;
import java.util.Map;

/**
 * ExcelTemplateVO
 * @author 唐延波
 * @date 2015-6-9
 */
public class ExcelTemplateVO {
	
	/**
	 * sheet的名字
	 */
	private String sheetName;
	
	/**
	 * sheet的头部
	 */
	private String[] head;
	/**
	 * Excel写的数据，list元素是一个sheet中的一行数据 (多个sheet就是List<TemplateVO>)
	 */
	private List<String[]> data;
	/**
	 * Excel解析的数据，list中的元素是一行数据，map中的元素是一个sheet中的一行的列数据
	 */
	private List<Map<String, Object>> sheet;
	
	public ExcelTemplateVO() {
		
	}
	
	public ExcelTemplateVO(String sheetName, String[] head, List<String[]> data) {
		this.sheetName = sheetName;
		this.head = head;
		this.data = data;
	}

	public List<String[]> getData() {
		return data;
	}

	public void setData(List<String[]> data) {
		this.data = data;
	}

	public String getSheetName() {
		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;
	}

	public String[] getHead() {
		return head;
	}

	public void setHead(String[] head) {
		this.head = head;
	}

	public List<Map<String, Object>> getSheet() {
		return sheet;
	}

	public void setSheet(List<Map<String, Object>> sheet) {
		this.sheet = sheet;
	}
}
