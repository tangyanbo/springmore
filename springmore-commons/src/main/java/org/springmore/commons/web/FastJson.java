package org.springmore.commons.web;

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;

public class FastJson implements Jsonable {
	
	/**
	 * 日期格式
	 */
	private String datePattern = DEFFAULT_DATE_FORMAT;

	@Override
	public String toJSONString(Object bean) {
		JSON.DEFFAULT_DATE_FORMAT = datePattern;
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

}
