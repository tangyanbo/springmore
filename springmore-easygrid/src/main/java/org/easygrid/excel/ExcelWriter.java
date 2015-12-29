package org.easygrid.excel;

import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.easygrid.exception.BaseException;
import org.easygrid.grid.Grid;
import org.easygrid.util.ResourceUtil;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

/**
 * 报表导出组件
 * 
 * @author 唐延波 2013-9-12
 */
public class ExcelWriter implements GridConstants {

	private int headerOffset = 0;

	private WritableWorkbook wwb;

	private String title;

	private String fileName;

	private Grid grid;

	private List<Grid> grids;

	private HttpServletResponse response;

	private ExcelWriter() {

	}

	public static ExcelWriter getInstance(String fileName,
			Grid grid, HttpServletResponse response) {
		return getInstance(null,fileName,grid,response);
	}

	public static ExcelWriter getInstance(String title, String fileName,
			Grid grid, HttpServletResponse response) {
		ExcelWriter excelWriter = new ExcelWriter();
		excelWriter.setTitle(title);
		excelWriter.setFileName(fileName);
		excelWriter.setGrid(grid);
		excelWriter.setResponse(response);
		return excelWriter;
	}
	
	public static ExcelWriter getInstance(String fileName,
			List<Grid> grids, HttpServletResponse response) {
		return getInstance(null,fileName,grids,response);
	}

	public static ExcelWriter getInstance(String title, String fileName,
			List<Grid> grids, HttpServletResponse response) {
		ExcelWriter excelWriter = new ExcelWriter();
		excelWriter.setTitle(title);
		excelWriter.setFileName(fileName);
		excelWriter.setGrids(grids);
		excelWriter.setResponse(response);
		return excelWriter;
	}

	/**
	 * 单个grid的excel导出
	 * 
	 * @author 唐延波
	 * @date 2013-12-2
	 */
	public void exportExcel() {
		try {
			setResponse();
			writeExcel();
		} catch (Exception e) {
			throw new BaseException(e);
		}

	}

	/**
	 * 多个grid的excel导出
	 * 
	 * @author 唐延波
	 * @date 2013-12-2
	 */
	public void exportExcelMultipleGrid() {
		try {
			OutputStream os = response.getOutputStream();
			setResponse();
			writeExcel(grids, os);
		} catch (Exception e) {
			throw new BaseException(e);
		}

	}

	/**
	 * 写Excel
	 * 
	 * @author 唐延波
	 * @date 2013-12-2
	 */
	private void writeExcel() {
		OutputStream os = null;
		try {
			os = response.getOutputStream();
			wwb = Workbook.createWorkbook(os);
			RGBColor.initialize(wwb);
			WritableSheet sheet = wwb.createSheet("Sheet 1", 0);
			this.insertTitle(sheet);
			GridWriter gridWriter = GridWriter.getInstance(grid, sheet, this);
			gridWriter.writeGrid();
			wwb.write();
		} catch (Exception e) {
			throw new BaseException(e);
		} finally {
			ResourceUtil.close(wwb);
			ResourceUtil.close(os);
		}
	}

	/**
	 * 写Excel 多表
	 * 
	 * @author 唐延波
	 * @date 2013-12-2
	 */
	private void writeExcel(List<Grid> grids, OutputStream os) {
		try {
			wwb = Workbook.createWorkbook(os);
			RGBColor.initialize(wwb);
			WritableSheet sheet = wwb.createSheet("Sheet 1", 0);
			this.insertTitle(sheet);
			for (Grid grid : grids) {
				GridWriter gridWriter = GridWriter.getInstance(grid, sheet,
						this);
				gridWriter.writeGrid();
				insertBlankRow(sheet);
			}
			wwb.write();
		} catch (Exception e) {
			throw new BaseException(e);
		} finally {
			ResourceUtil.close(wwb);
			ResourceUtil.close(os);
		}
	}
	
	/**
	 * 插入空白行
	 * 
	 * @author 唐延波
	 * @throws WriteException
	 * @throws RowsExceededException
	 * @date 2013-12-2
	 */
	private void insertBlankRow(WritableSheet sheet) throws RowsExceededException, WriteException {
		int blankRow = getHeaderOffset();
		sheet.setRowView(blankRow, BLANK_ROW_HEIGHT);
		sheet.mergeCells(0, blankRow, getHeadColumns()-1, blankRow);
		addHeaderOffset();
	}

	/**
	 * 获取标题样式
	 * 
	 * @author 唐延波
	 */
	private WritableCellFormat getTitleFormat() throws Exception {
		WritableFont font = new WritableFont(WritableFont.ARIAL,
				TITLE_FONT_SIZE, WritableFont.NO_BOLD);
		font.setColour(RGBColor.BLACK);
		WritableCellFormat f = new WritableCellFormat(font);
		f.setBackground(RGBColor.WHITE);
		f.setBorder(Border.ALL, BorderLineStyle.THIN, RGBColor.LIGHT_BLUE);
		f.setVerticalAlignment(VerticalAlignment.CENTRE);
		f.setAlignment(Alignment.LEFT);
		return f;
	}

	/**
	 * 生成标题
	 * 
	 * @author 唐延波
	 */

	private void insertTitle(WritableSheet sheet) throws Exception {
		if (title == null) {
			return;
		}
		sheet.setRowView(0, TITLE_ROW_HEIGHT);
		WritableCellFormat titleFormat = getTitleFormat();
		int cols = this.getHeadColumns();
		sheet.mergeCells(0, 0, cols - 1, 0);
		Label lbTitle = new Label(0, 0, title, titleFormat);
		sheet.addCell(lbTitle);
		this.addHeaderOffset();
	}

	public int getHeadColumns() {
		if (grid != null) {
			return grid.getHeaderRows().get(0).getColumns().size();
		} else {
			return grids.get(0).getHeaderRows().get(0).getColumns().size();
		}
	}

	/**
	 * 设置response
	 * 
	 * @author 唐延波
	 */
	private void setResponse() throws Exception {
		if (fileName == null || fileName.isEmpty() || fileName.equals("null")) {
			fileName = "grid";
		}
		// 清空输出流
		response.reset();
		// 设定输出文件头
		response.setHeader("Content-disposition", "attachment; filename="
				+ java.net.URLEncoder.encode(fileName, "utf-8") + ".xls");
		response.setContentType("application/x-download");
	}

	/**
	 * headerOffset自增1
	 * 
	 * @author 唐延波
	 * @date 2014-1-15
	 */
	public void addHeaderOffset() {
		this.headerOffset++;
	}

	/**
	 * headerOffset自增n
	 * 
	 * @author 唐延波
	 * @date 2014-1-15
	 */
	public void addHeaderOffset(int n) {
		this.headerOffset = this.headerOffset + n;
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

	public Grid getGrid() {
		return grid;
	}

	public void setGrid(Grid grid) {
		this.grid = grid;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}

	public int getHeaderOffset() {
		return headerOffset;
	}

	public List<Grid> getGrids() {
		return grids;
	}

	public void setGrids(List<Grid> grids) {
		this.grids = grids;
	}

	
}
