package org.springmore.commons.web;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;

/**
 * 基于net.sf.json-lib实现
 * @author 唐延波
 * @date 2015年7月6日
 */
public class JsonLib implements Jsonable{
	
	private static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd HH:mm:ss";
	/**
	 * 日期格式
	 */
	private String datePattern = DEFAULT_DATE_PATTERN;

	/**
	 * 将对象转化成json字符串
	 * 将数组转化为json字符串
	 * 对象里面的数组也会被转换
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public String toJson(Object bean){
		if(bean.getClass().isArray()
				|| bean instanceof Collection){
			return arrayToJson(bean);
		}else{
			return objectToJson(bean);
		}
	}
	
	/**
	 * 对象转json
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private String objectToJson(Object bean){
		JsonConfig jsonConfig = getJsonConfig();
		JSONObject jsonMessage = JSONObject.fromObject(bean,jsonConfig);
		return jsonMessage.toString();
	}
	
	/**
	 * 数组，集合等转json
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private String arrayToJson(Object bean){
		JsonConfig jsonConfig = getJsonConfig();
		JSONArray jsonArray = JSONArray.fromObject(bean, jsonConfig);
		return jsonArray.toString();		
	}
	
	
	/**
	 * getJsonConfig
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private JsonConfig getJsonConfig(){
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor(datePattern));
		return jsonConfig;
	}

	public String getDatePattern() {
		return datePattern;
	}

	/**
	 * 日期格式
	 * @param datePattern
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public void setDatePattern(String datePattern) {
		this.datePattern = datePattern;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> T toBean(String json, Class<T> beanClass) {
		JSONObject fromObject = JSONObject.fromObject(json);
		T result = (T) JSONObject.toBean(fromObject, beanClass);
		return result;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> toList(String json, Class<T> beanClass) {
		JSONArray jsonArray = JSONArray.fromObject(json);
		List<T> list = (List<T>) JSONArray.toList(jsonArray, beanClass, getJsonConfig());
		return list;
	}
	
	
}
