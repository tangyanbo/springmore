package org.springmore.commons.web;

import java.util.List;

/**
 * JsonUtil
 * 
 * @author 唐延波
 * @date 2015年7月6日
 */
public class JsonUtil {
	
	public static String DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	private static Jsonable jsonlib = new FastJson();
	

	/**
	 * 将对象转化成json字符串 将数组转化为json字符串 对象里面的数组也会被转换
	 * 
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public static String toJSONString(Object bean) {
		jsonlib.setDatePattern(DEFFAULT_DATE_FORMAT);
		return jsonlib.toJSONString(bean);
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
		jsonlib.setDatePattern(DEFFAULT_DATE_FORMAT);
		return jsonlib.toBean(json, beanClass);
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
		jsonlib.setDatePattern(DEFFAULT_DATE_FORMAT);
		return jsonlib.toList(json, beanClass);
	}

	public static void setJsonlib(Jsonable jsonlib) {
		JsonUtil.jsonlib = jsonlib;
	}

}
