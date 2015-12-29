package org.easygrid.excel;

import java.util.List;

import org.easygrid.grid.Grid;
import org.easygrid.grid.GridHeaderColumn;
import org.easygrid.grid.GridHeaderRow;

import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.WritableCell;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;

/**
 * Grid创建器
 * 
 * @author 唐延波
 * @date 2014-1-15
 */
public class GridWriter implements GridConstants{

	private Grid grid;

	private WritableSheet sheet;

	private ExcelWriter excelWriter;

	
	private GridWriter(){
		
	}
	
	public static GridWriter getInstance(Grid grid,WritableSheet sheet,ExcelWriter excelWriter){
		GridWriter gridWriter = new GridWriter();
		gridWriter.setGrid(grid);
		gridWriter.setExcelWriter(excelWriter);
		gridWriter.setSheet(sheet);
		return gridWriter;
	}

	/**
	 * 写单个grid
	 * 
	 * @author 唐延波
	 * @throws Exception
	 * @date 2013-12-2
	 */
	public void writeGrid() throws Exception {
		this.insertHeader();
		this.insertRows();
	}

	

	/**
	 * 生成表头
	 * 
	 * @author 唐延波
	 */
	private void insertHeader() throws Exception {
		List<GridHeaderRow> rows = grid.getHeaderRows();
		for (int row = 0; row < rows.size(); row++) {
			int currentRowIndex = excelWriter.getHeaderOffset();
			sheet.setRowView(currentRowIndex, HEAD_ROW_HEIGHT);
			GridHeaderRow headerRow = rows.get(row);
			List<GridHeaderColumn> columns = headerRow.getColumns();
			for (int i = 0; i < columns.size(); i++) {
				GridHeaderColumn column = columns.get(i);
				if ("#rspan".equals(column.getName())
						|| "#cspan".equals(column.getName())) {
					continue;
				}
				if (column.getColspan() > 1) {
					sheet.mergeCells(i, currentRowIndex, i
							+ column.getColspan() - 1,
							currentRowIndex);
				}
				if (column.getRowspan() > 1) {
					sheet.mergeCells(i, currentRowIndex, i,
							currentRowIndex + column.getRowspan()
									- 1);
				}
				int width = column.getExcelWidth();
				sheet.setColumnView(i, width);
				WritableCellFormat headerFormat = getHeaderFormat();
				Label label = new Label(i, currentRowIndex,
						column.getName(), headerFormat);
				sheet.addCell(label);
			}
			excelWriter.addHeaderOffset();
		}
	}

	/**
	 * 获取表头样式
	 * 
	 * @author 唐延波
	 */
	private WritableCellFormat getHeaderFormat() throws Exception {
		WritableFont font = new WritableFont(WritableFont.ARIAL,
				HEAD_FONT_SIZE, WritableFont.BOLD);
		font.setColour(RGBColor.BLACK);
		WritableCellFormat f = new WritableCellFormat(font);
		f.setBackground(RGBColor.BLUE);
		f.setBorder(Border.ALL, BorderLineStyle.THIN, RGBColor.LIGHT_BLUE);
		f.setVerticalAlignment(VerticalAlignment.CENTRE);
		f.setAlignment(Alignment.CENTRE);
		return f;
	}

	/**
	 * 获取行样式
	 * 
	 * @author 唐延波
	 */
	private WritableCellFormat getRowFormat(Colour colour) throws Exception {
		WritableFont font = new WritableFont(WritableFont.ARIAL, ROW_FONT_SIZE,
				WritableFont.NO_BOLD);
		font.setColour(RGBColor.BLACK);
		WritableCellFormat f = new WritableCellFormat(font);
		f.setBackground(colour);
		f.setBorder(Border.ALL, BorderLineStyle.THIN, RGBColor.LIGHT_BLUE);
		f.setVerticalAlignment(VerticalAlignment.CENTRE);
		f.setAlignment(Alignment.LEFT);
		return f;
	}

	/**
	 * 生成数据单元格
	 * 
	 * @author 唐延波
	 */
	@SuppressWarnings("rawtypes")
	private void insertRows() throws Exception {
		List data = grid.getData();
		for (int row = 0; row < data.size(); row++) {
			int currentRowIndex = row + excelWriter.getHeaderOffset();
			List rowData = (List) data.get(row);
			sheet.setRowView(currentRowIndex, NORMAL_ROW_HEIGHT);
			WritableCellFormat rowFormat = null;
			if (row % 2 == 0) {
				rowFormat = this.getRowFormat(RGBColor.WHITE);
			} else {
				rowFormat = this.getRowFormat(RGBColor.BLUE2);
			}
			for (int col = 0; col < rowData.size(); col++) {
				WritableCell cell = null;
				String text = String.valueOf(rowData.get(col));
				if (rowData.get(col) instanceof java.lang.Number) {
					cell = new Number(col, currentRowIndex,
							Double.valueOf(text), rowFormat);
				} else {
					cell = new Label(col, currentRowIndex,
							text, rowFormat);
				}
				sheet.addCell(cell);
			}
		}
		excelWriter.addHeaderOffset(data.size());
	}


	public Grid getGrid() {
		return grid;
	}

	public void setGrid(Grid grid) {
		this.grid = grid;
	}

	public WritableSheet getSheet() {
		return sheet;
	}

	public void setSheet(WritableSheet sheet) {
		this.sheet = sheet;
	}

	public ExcelWriter getExcelWriter() {
		return excelWriter;
	}

	public void setExcelWriter(ExcelWriter excelWriter) {
		this.excelWriter = excelWriter;
	}
	
	

}
