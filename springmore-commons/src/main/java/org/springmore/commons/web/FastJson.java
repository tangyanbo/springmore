package org.springmore.commons.web;

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;

/**
 * 基于fastJson封装
 * https://github.com/alibaba/fastjson/
 * @author 唐延波
 * @date 2015年7月6日
 */
public class FastJson implements Jsonable {
	
	/**
	 * 日期格式
	 */
	private String datePattern = DEFFAULT_DATE_FORMAT;
	
	/**
	 * 过滤字段
	 */
	private String[] excludes;

	@Override
	public String toJSONString(Object bean) {
		JSON.DEFFAULT_DATE_FORMAT = datePattern;
		if(excludes != null){
			ExcludesPropertyPreFilter filter = new ExcludesPropertyPreFilter(bean.getClass(), excludes);
			return JSON.toJSONString(bean,filter,SerializerFeature.WriteDateUseDateFormat);
		}		
		return JSON.toJSONString(bean,SerializerFeature.WriteDateUseDateFormat);
	}

	@Override
	public <T> T toBean(String json, Class<T> beanClass) {
		return JSON.parseObject(json,beanClass);
	}

	@Override
	public <T> List<T> toList(String json, Class<T> beanClass) {
		return JSON.parseArray(json, beanClass);
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

	@Override
	public void setExcludes(String[] excludes) {
		this.excludes = excludes;
	}

	@Override
	public JSONObject toJSON(Object bean) {
		return (JSONObject) JSON.toJSON(bean);
	}

	@Override
	public JSONArray toJSONArray(Object bean) {
		return (JSONArray) JSON.toJSON(bean);
	}

	

}
