package org.easygrid.grid;

/**
 * grid表头的一个列
 * @author 唐延波
 * @date 2013-12-1
 */
public class GridHeaderColumn {

	/**
	 * 表头列名称
	 */
	private String name;

	/**
	 * 表头列宽度
	 */
	private int width;

	/**
	 * 表头列所跨的列数
	 */
	private int colspan = 1;
	
	private static final int scale = 8;

	/**
	 * 表头列所跨的行数
	 */
	private int rowspan;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getWidth() {
		return width;
	}
	
	public int getExcelWidth(){
		return width / (scale * colspan);
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getColspan() {
		return colspan;
	}

	public void setColspan(int colspan) {
		this.colspan = colspan;
	}

	public int getRowspan() {
		return rowspan;
	}

	public void setRowspan(int rowspan) {
		this.rowspan = rowspan;
	}

}
