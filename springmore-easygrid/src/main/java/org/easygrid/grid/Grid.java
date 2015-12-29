package org.easygrid.grid;

import java.util.ArrayList;
import java.util.List;

/**
 * 表格组件
 * 
 * @author 唐延波
 * @date 2013-12-1
 */
public class Grid {

	/**
	 * 表头行
	 */
	private List<GridHeaderRow> headerRows = new ArrayList<GridHeaderRow>();

	/**
	 * 数据行
	 */
	private List data = new ArrayList();

	public List getData() {
		return data;
	}

	public void setData(List data) {
		this.data = data;
	}

	public List<GridHeaderRow> getHeaderRows() {
		return headerRows;
	}

	public void setHeaderRows(List<GridHeaderRow> headerRows) {
		this.headerRows = headerRows;
	}

}
