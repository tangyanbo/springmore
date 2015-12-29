package org.springmore.commons.web;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springmore.commons.exception.CommonsException;

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
	/**
	 * 日期格式
	 */
	private String datePattern = DEFFAULT_DATE_FORMAT;
	
	/**
	 * 过滤字段
	 */
	private String[] excludes;
	
	private JsonConfig jsonConfig;

	/**
	 * 将对象转化成json字符串
	 * 将数组转化为json字符串
	 * 对象里面的数组也会被转换
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	public String toJSONString(Object bean){
		jsonConfig = getJsonConfig();
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
	 * @param jsonConfig
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private String objectToJson(Object bean){		
		JSONObject jsonMessage = JSONObject.fromObject(bean,jsonConfig);
		return jsonMessage.toString();
	}
	
	/**
	 * 数组，集合等转json
	 * @param bean
	 * @param jsonConfig
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	private String arrayToJson(Object bean){
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
		jsonConfig.setExcludes(excludes);
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor(datePattern));
		return jsonConfig;
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
	
	/**
	 * 日期格式
	 * @param datePattern
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	@Override
	public void setDatePattern(String datePattern) {
		this.datePattern = datePattern;
	}

	/**
	 * 过滤字段
	 * @param excludes
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	@Override
	public void setExcludes(String[] excludes) {
		this.excludes = excludes;
	}


	@Override
	public com.alibaba.fastjson.JSONObject toJSON(Object bean) {
		throw new CommonsException("此方法不支持");
	}


	@Override
	public com.alibaba.fastjson.JSONArray toJSONArray(Object bean) {
		throw new CommonsException("此方法不支持");
	}
	
}
