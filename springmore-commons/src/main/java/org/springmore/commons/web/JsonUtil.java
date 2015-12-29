package org.springmore.commons.web;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * JsonUtil
 * 
 * @author 唐延波
 * @date 2015年7月6日
 */
public class JsonUtil {

	public static final String FAST_JSON = "fast_json";

	public static final String JSON_LIB = "json_lib";

	public static String DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	public static String DEFAULT_JSON = FAST_JSON;

	/**
	 * getJsonable
	 * 
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private static Jsonable getJsonable() {
		Jsonable jsonable = null;
		if (DEFAULT_JSON.equals(FAST_JSON)) {
			jsonable = new FastJson();
		} else if (DEFAULT_JSON.equals(JSON_LIB)) {
			jsonable = new JsonLib();
		}
		jsonable.setDatePattern(DEFFAULT_DATE_FORMAT);
		return jsonable;
	}

	/**
	 * <pre>
	 * 将对象转化成json字符串 
	 * 将数组转化为json字符串 
	 * 对象里面的数组也会被转换
	 * </pre>
	 * 
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static String toJSONString(Object bean) {
		return getJsonable().toJSONString(bean);
	}

	/**
	 * <pre>
	 * 将对象转化成json字符串 
	 * 将数组转化为json字符串 
	 * 对象里面的数组也会被转换
	 * </pre>
	 * 
	 * @param bean
	 * @param excludes
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static String toJSONString(Object bean, String... excludes) {
		Jsonable jsonable = getJsonable();
		jsonable.setExcludes(excludes);
		return jsonable.toJSONString(bean);
	}

	/**
	 * 将java bean转化为JSONObject
	 * @param bean
	 * @param excludes
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static JSONObject toJSON(Object bean,String... excludes){
		Jsonable jsonable = getJsonable();
		jsonable.setExcludes(excludes);
		return jsonable.toJSON(bean);
	}

	/**
	 * 将java bean转化为JSONObject
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static JSONObject toJSON(Object bean){
		return JsonUtil.toJSON(bean, new String[]{});
	}
	
	/**
	 * 将数组或者集合转化为JSONArray
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static JSONArray toJSONArray(Object bean,String... excludes){
		return JsonUtil.toJSONArray(bean, excludes);
	}
	
	/**
	 * 将数组或者集合转化为JSONArray
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static JSONArray toJSONArray(Object bean){
		return JsonUtil.toJSONArray(bean, new String[]{});
	}

	/**
	 * json转对象
	 * 
	 * @param json
	 * @param beanClass
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static <T> T toBean(String json, Class<T> beanClass) {
		return getJsonable().toBean(json, beanClass);
	}

	/**
	 * json转list
	 * 
	 * @param json
	 * @param beanClass
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static <T> List<T> toList(String json, Class<T> beanClass) {
		return getJsonable().toList(json, beanClass);
	}

}
