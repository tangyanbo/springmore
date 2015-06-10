package org.springmore.commons.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import jxl.BooleanCell;
import jxl.Cell;
import jxl.CellType;
import jxl.DateCell;
import jxl.NumberCell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.VerticalAlignment;
import jxl.read.biff.BiffException;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

import org.springmore.commons.io.excel.ExcelColumn;
import org.springmore.commons.io.excel.ExcelException;
import org.springmore.commons.io.excel.ExcelModel;
import org.springmore.commons.io.excel.ExcelTemplateVO;


/**
 * ExcelUtil
 * @author 唐延波
 * @date 2015-6-9
 */
public class ExcelUtil {

	/**
	 * 输出Excel文件
	 * 
	 * @param data
	 * @param heads
	 * @param title
	 * @throws WriteException
	 * @throws IOException
	 * @deprecated
	 */
	public static void writeExcel(HttpServletResponse response,
			List<String[]> data, String[] heads, String title)
			throws WriteException, IOException {
		OutputStream os = response.getOutputStream();
		response.reset();// 清空输出流
		response.setHeader("Content-disposition", "attachment; filename="
				+ java.net.URLEncoder.encode(title, "utf-8") + ".xls");// 设定输出文件头
		response.setContentType("application/x-download");
		writeExcel(os, data, heads, title);
	}
	
	/**
	 * 输出Excel文件
	 * @param response
	 * @param data
	 * @param heads
	 * @param title
	 * @throws WriteException
	 * @throws IOException
	 */
	public static void writeExcel(HttpServletResponse response,
			List<List<String>> data, List<String> heads, String title)
			throws WriteException, IOException {
		List<String[]> dataList = new ArrayList<String[]>();
		String[] head = new String[]{};
		for(List<String> rowData : data){
			dataList.add(rowData.toArray(new String[]{}));
		}
		head = heads.toArray(new String[]{});
		writeExcel(response,dataList,head,title);
	}
	
	/**
	 * 设置response头信息， 并返回输出流
	 * 
	 * @author Rescue
	 * @date 2014-02-20
	 * @param response
	 * @param title
	 * @return
	 * @throws IOException
	 */
	public static OutputStream getOs(HttpServletResponse response, String title) throws IOException {
		OutputStream os = response.getOutputStream();
		response.reset();// 清空输出流
		response.setHeader("Content-disposition", "attachment; filename="
				+ java.net.URLEncoder.encode(title, "utf-8") + ".xls");// 设定输出文件头
		response.setContentType("application/x-download");
		return os;
	}
	
	/**
	 * 输出excel 多个sheet
	 * 
	 * @author Rescue
	 * @date 2014-02-20
	 * @param os
	 * @param data
	 * @param heads
	 * @param title
	 * @throws WriteException
	 * @throws IOException
	 */
	public static void writeExcel(HttpServletResponse response, List<ExcelTemplateVO> template, String title) throws WriteException, IOException {
		OutputStream os = getOs(response, title);
		WritableWorkbook wwb = Workbook.createWorkbook(os);
		
		int m = 0;
		for(ExcelTemplateVO vo : template) {
			String[] heads = vo.getHead();
			List<String[]> data = vo.getData();
			
			WritableSheet ws = wwb.createSheet(vo.getSheetName(), m);
			int columnNum = heads.length; // 列数
			ws.mergeCells(0, 0, columnNum - 1, 0);
			// 设置样式
			WritableCellFormat format = new WritableCellFormat();
			format.setAlignment(Alignment.CENTRE); // 水平居中对齐
			format.setVerticalAlignment(VerticalAlignment.CENTRE); // 竖直方向居中对齐
			format.setBorder(jxl.format.Border.ALL, jxl.format.BorderLineStyle.THIN);
			// 加入标题
			Label lbTitle = new Label(0, 0, vo.getSheetName(), format);
			ws.addCell(lbTitle);
			// 加入表头
			for (int i = 0; i < heads.length; i++) {
				ws.addCell(new Label(i, 1, heads[i], format));
			}
			// 加入列表数据
			for (int i = 0; i < data.size(); i++) {
				for (int j = 0; j < columnNum; j++) {
					ws.addCell(new Label(j, i + 2, data.get(i)[j], format));
				}
			}
			m++;
		}
		
		wwb.write();
		wwb.close();
		os.close();
	}

	/**
	 * 输出Excel文件
	 * 
	 * @param data
	 * @param heads
	 * @param title
	 * @throws WriteException
	 * @throws IOException
	 */
	public static void writeExcel(OutputStream os, List<String[]> data,
			String[] heads, String title) throws WriteException, IOException {
		WritableWorkbook wwb = Workbook.createWorkbook(os);
		WritableSheet ws = wwb.createSheet("Sheet 1", 0);
		int columnNum = heads.length; // 列数
		ws.mergeCells(0, 0, columnNum - 1, 0);
		// 设置样式
		WritableCellFormat format = new WritableCellFormat();
		format.setAlignment(Alignment.CENTRE); // 水平居中对齐
		format.setVerticalAlignment(VerticalAlignment.CENTRE); // 竖直方向居中对齐
		format.setBorder(jxl.format.Border.ALL, jxl.format.BorderLineStyle.THIN);
		// 加入标题
		Label lbTitle = new Label(0, 0, title, format);
		ws.addCell(lbTitle);
		// 加入表头
		for (int i = 0; i < heads.length; i++) {
			ws.addCell(new Label(i, 1, heads[i], format));
		}
		// 加入列表数据
		for (int i = 0; i < data.size(); i++) {
			for (int j = 0; j < columnNum; j++) {
				ws.addCell(new Label(j, i + 2, data.get(i)[j], format));
			}
		}
		wwb.write();
		wwb.close();
		os.close();
	}

	/**
	 * 将数据从excel文件中读取，封装到Map<String,List<Map<String,Object>>>
	 * 
	 * @author Rambo
	 * @param excelFile
	 *            excel文件
	 * @param titleExists
	 *            excel中是否包含标题
	 * @return Map<String,List<Map<String,Object>>> <br>
	 *         最外层的map存放的是每个工作簿和工作簿的内容 ，工作簿的名字作为key，内容将转换为List
	 */
	public static Map<String, List<Map<String, Object>>> parseExcel(
			File excelFile, boolean titleExists) throws BiffException,
			FileNotFoundException, IOException {
		return parseExcel(new FileInputStream(excelFile), titleExists);
	}

	/**
	 * 将数据从excel文件中读取，封装到Map<String,List<Map<String,Object>>>
	 * 
	 * @author Rambo
	 * @param excelInputStream
	 *            excel文件流
	 * @param titleExists
	 *            excel中是否包含标题
	 * @return Map<String,List<Map<String,Object>>> <br>
	 *         最外层的map存放的是每个工作簿和工作簿的内容 ，工作簿的名字作为key，内容将转换为List
	 */
	public static Map<String, List<Map<String, Object>>> parseExcel(
			InputStream excelInputStream, boolean titleExists)
			throws BiffException, IOException {
		Workbook workbook = Workbook.getWorkbook(excelInputStream);
		Sheet[] sheets = workbook.getSheets();
		Map<String, List<Map<String, Object>>> sheetMap = new LinkedHashMap<String, List<Map<String, Object>>>(
				sheets.length);
		for (Sheet sheet : sheets) {
			sheetMap.put(sheet.getName(),
					excelUtil._parseSheet(sheet, titleExists));
		}

		return sheetMap;
	}

	/**
	 * 将数据从excel文件中读取，封装到List<Map<String, Object>>中 注：此方法只转换第一个工作簿
	 * 
	 * @author Rambo
	 * @param excelFile
	 * @param titleExists
	 *            excel中是否包含标题
	 */
	public static List<Map<String, Object>> parseExcelSingleSheet(
			InputStream excelInputStream) throws BiffException,
			FileNotFoundException, IOException {

		return parseExcelSingleSheet(excelInputStream, false);
	}

	/**
	 * 将数据从excel文件中读取，封装到List<Map<String, Object>>中 注：此方法只转换第一个工作簿
	 * 
	 * @author Rambo
	 * @param excelInputStream
	 * @param titleExists
	 *            excel中是否包含标题
	 */
	public static List<Map<String, Object>> parseExcelSingleSheet(
			InputStream excelInputStream, boolean titleExists)
			throws BiffException, IOException {
		Workbook workbook = Workbook.getWorkbook(excelInputStream);
		Sheet sheet = workbook.getSheet(0);
		return excelUtil._parseSheet(sheet, titleExists);
	}

	public static <M> List<M> parseExcel(InputStream excelInputStream,
			Class<M> objectClass) throws Exception {
		Workbook workbook = Workbook.getWorkbook(excelInputStream);
		Sheet sheet = workbook.getSheet(0);
		Cell[] header = sheet.getRow(0);
		List<M> modelList = new ArrayList<M>();
		Map<String, ExcelModel> modelMap = getExcelModel(objectClass);
		for (int i = 1; i < sheet.getRows(); i++) // 表内容
		{
			M model = objectClass.newInstance();
			Cell[] columns = sheet.getRow(i);
			for (int j = 0; j < columns.length; j++) {
				Object key = excelUtil._getValue(header[j]);
				ExcelModel excelModel = modelMap.get(key);
				setModel(columns[j], excelModel, model);
			}

			modelList.add(model);
		}
		return modelList;
	}

	private static <M> void setModel(Cell value, ExcelModel excelModel, M model)
			throws Exception {
		Class<?> type = excelModel.getField().getType();
		if (type == String.class) {
			excelModel.getSetMethod().invoke(model, value.getContents());
		} else if (type == int.class || type == Integer.class) {
			int intValue;
			try {
				intValue = Integer.parseInt(value.getContents());
			} catch (Exception e) {
				throw new ExcelException(excelModel.getExcelHead() + "必须为整数");
			}
			excelModel.getSetMethod().invoke(model, intValue);
		} else if (type == long.class || type == Long.class) {
			long longValue;
			try {
				longValue = Long.parseLong(value.getContents());
			} catch (Exception e) {
				throw new ExcelException(excelModel.getExcelHead() + "必须为整数");
			}
			excelModel.getSetMethod().invoke(model, longValue);
		} else if (type == Date.class) {
			if (CellType.DATE == value.getType()) {
				DateCell date = (DateCell) value;
				excelModel.getSetMethod().invoke(model, date.getDate());
			} else {
				throw new ExcelException(excelModel.getExcelHead() + "必须为日期");
			}
		}

		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<M>> validateValue = validator.validateProperty(
				model, excelModel.getField().getName());
		for (ConstraintViolation<M> validation : validateValue) {
			throw new ExcelException(validation.getMessage());
		}

	}

	private static <M> Map<String, ExcelModel> getExcelModel(
			Class<M> objectClass) throws Exception {
		Map<String, ExcelModel> modelMap = new HashMap<String, ExcelModel>();
		Field[] fields = objectClass.getDeclaredFields();
		for (Field field : fields) {
			ExcelColumn excelColumn = field.getAnnotation(ExcelColumn.class);
			if (excelColumn != null) {
				String fieldName = field.getName();
				String firstLetter = String.valueOf(fieldName.charAt(0));
				firstLetter = firstLetter.toUpperCase();
				fieldName = firstLetter + fieldName.substring(1);
				Method set = objectClass.getDeclaredMethod("set" + fieldName,
						field.getType());
				ExcelModel excelModel = new ExcelModel();
				excelModel.setField(field);
				excelModel.setSetMethod(set);
				excelModel.setExcelHead(excelColumn.name());
				modelMap.put(excelColumn.name(), excelModel);
			}
		}
		return modelMap;
	}

	/**
	 * 获取单元格中的值，将他转换为java所对应的类型，数字默认转换为String
	 * 
	 * @author Rambo
	 * @param cell
	 *            excel的一个单元格
	 * @return
	 */
	private Object _getValue(Cell cell) {
		if (CellType.DATE == cell.getType()) {
			DateCell c = (DateCell) cell;
			return c.getDate();
		} else if (CellType.NUMBER.equals(cell.getType())) {
			NumberCell c = (NumberCell) cell;
			return c.getContents();
		} else if (CellType.BOOLEAN.equals(cell.getType())) {
			BooleanCell c = (BooleanCell) cell;
			return c.getValue();
		} else {
			return cell.getContents();
		}
	}

	/**
	 * 转换一个工作簿到List，每一行就是list里的一个Map对象，通过表头在map中取值<br>
	 * 如：<br>
	 * <table>
	 * <tr>
	 * <th>account</td>
	 * <th>name</th>
	 * <th>age</th>
	 * </tr>
	 * <tr>
	 * <td>admin</td>
	 * <th>管理员</td>
	 * <th>25</td>
	 * </tr>
	 * <tr>
	 * <td>zhangsan</td>
	 * <th>张三</td>
	 * <th>22</td>
	 * </tr>
	 * </table>
	 * <br>
	 * List size 2，表头不作为数据存放到list。<br>
	 * 第二行 Map<String,Object> map = list.get(1);<br>
	 * 张三 == map.get("name") ;
	 * 
	 * @author Rambo
	 * @param sheet
	 *            excel的一个工作薄
	 * @param titleExists
	 * @return
	 */
	private List<Map<String, Object>> _parseSheet(Sheet sheet,
			boolean titleExists) {
		int headerRow = titleExists ? 1 : 0;

		Cell[] header = sheet.getRow(headerRow);
		Object[] headerValues = new Object[header.length];

		for (int i = 0; i < header.length; i++) { // 表头
			headerValues[i] = _getValue(header[i]);
		}

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>(
				sheet.getRows() - headerRow);
		for (int i = headerRow + 1; i < sheet.getRows(); i++) // 表内容
		{
			Map<String, Object> dataMap = new HashMap<String, Object>(); // 一个Map存放execl的一行数据
			Cell[] columns = sheet.getRow(i);
			for (int j = 0; j < columns.length; j++) {
				if ("".equals(columns[j].getContents())) {// 如果某个单元格不为空，则设置非空标识
					continue;
				}
				Object key = headerValues[j];
				Object value = _getValue(columns[j]);
				dataMap.put(key.toString(), value);
			}
			if (!dataMap.isEmpty()) {
				list.add(dataMap);
			}
		}
		return list;
	}

	private final static ExcelUtil excelUtil = new ExcelUtil();
}
