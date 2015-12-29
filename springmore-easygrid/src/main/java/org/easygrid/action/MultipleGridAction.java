package org.easygrid.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.easygrid.grid.Grid;
import org.easygrid.grid.GridHeaderColumn;
import org.easygrid.grid.GridHeaderRow;
import org.easygrid.util.WebUtil;

/**
 * grid测试
 * 
 * @author 唐延波
 * @date 2013-12-2
 */
@ParentPackage("struts-default")
@Namespace("/")
public class MultipleGridAction extends BaseAction {

	private static final long serialVersionUID = -4755435892143297389L;

	@Action(value = "toMultipleGrid", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/multipleGrid/multipleGrid.jsp") })
	public String toMultipleGrid() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}

	@Action("getMultipleGridData")
	public void getMultipleGridData() {
		try {

			Grid grid1 = getGrid();
			Grid grid2 = getGrid();

			List<Grid> grids = new ArrayList<Grid>();
			grids.add(grid1);
			grids.add(grid2);

			WebUtil.sendJSONArrayResponse(grids);

		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}

	private Grid getGrid() {
		Grid grid1 = new Grid();
		GridHeaderRow headRow1 = getGridHeaderRow();
		grid1.getHeaderRows().add(headRow1);
		grid1.setData(getGridData());
		return grid1;
	}

	private List getGridData() {
		List data = new ArrayList();
		for (int i = 0; i <= 20; i++) {
			data.add(getRow());
		}

		return data;
	}

	private List<String> getRow() {
		List<String> row = new ArrayList<String>();
		row.add("1");
		row.add("2");
		row.add("3");
		return row;
	}

	private GridHeaderRow getGridHeaderRow() {
		GridHeaderRow headRow1 = new GridHeaderRow();
		GridHeaderColumn col1 = new GridHeaderColumn();
		col1.setName("列1");
		col1.setWidth(100);

		GridHeaderColumn col2 = new GridHeaderColumn();
		col2.setName("列2");
		// col2.setWidth(100);

		GridHeaderColumn col3 = new GridHeaderColumn();
		col3.setName("列3");
		// col3.setWidth(100);

		headRow1.addColumn(col1);
		headRow1.addColumn(col2);
		headRow1.addColumn(col3);

		return headRow1;
	}

}
