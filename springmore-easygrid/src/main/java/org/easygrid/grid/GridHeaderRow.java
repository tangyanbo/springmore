package org.easygrid.grid;

import java.util.ArrayList;
import java.util.List;

/**
 * 表头列的一行
 * @author 唐延波
 * @date 2013-12-1
 */
public class GridHeaderRow {

	/**
	 * 行里面的列
	 */
	private List<GridHeaderColumn> columns = new ArrayList<GridHeaderColumn>();

	public List<GridHeaderColumn> getColumns() {
		return columns;
	}

	public void setColumns(List<GridHeaderColumn> columns) {
		this.columns = columns;
	}
	
	public void addColumn(GridHeaderColumn column){
		columns.add(column);
	}
}
