package org.easygrid.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.easygrid.grid.Grid;
import org.easygrid.grid.GridHeaderColumn;
import org.easygrid.grid.GridHeaderRow;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Grid json 串处理Util类
 * @author 唐延波
 * @date 2014-1-16
 */
public class GridJSONUtil {

	/**
	 * 将json串转换成gird对象
	 * @author 唐延波
	 * @date 2014-1-16
	 */
	public static Grid transformJSONToGrid(String gridJsonStr){
		JSONObject gridJson = JSONObject.fromObject(gridJsonStr);
		Map<String,Class<?>> classMap = new HashMap<String,Class<?>>();
		classMap.put("headerRows", GridHeaderRow.class);
		classMap.put("columns", GridHeaderColumn.class);	
		Grid grid = (Grid) JSONObject.toBean(gridJson, Grid.class, classMap);
		return grid;
	}
	
	/**
	 * 将json串转换成gird对象
	 * @author 唐延波
	 * @date 2014-1-16
	 */
	@SuppressWarnings({ "deprecation", "unchecked" })
	public static List<Grid> transformJSONToGridList(String gridListJsonStr){
		JSONArray gridJsonArray = JSONArray.fromObject(gridListJsonStr);
		Map<String,Class<?>> classMap = new HashMap<String,Class<?>>();
		classMap.put("headerRows", GridHeaderRow.class);
		classMap.put("columns", GridHeaderColumn.class);			
		List<Grid> grids = JSONArray.toList(gridJsonArray, Grid.class,classMap);
		return grids;
	}
}
