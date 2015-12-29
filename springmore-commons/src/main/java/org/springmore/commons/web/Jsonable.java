package org.springmore.commons.web;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * json接口
 * @author 唐延波
 * @date 2015年7月6日
 */
public interface Jsonable {
	
	String DEFFAULT_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
	
	
	/**
	 * 将对象转化成json字符串
	 * 将数组转化为json字符串
	 * 对象里面的数组也会被转换
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	String toJSONString(Object bean);

	/**
	 * 将java bean转化为JSONObject
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	JSONObject toJSON(Object bean);	
	
	/**
	 * 将数组或者集合转化为JSONArray
	 * @param bean
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	JSONArray toJSONArray(Object bean);
	
	/**
	 * json转对象
	 * @param json
	 * @param beanClass
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	<T> T toBean(String json,Class<T> beanClass);
	
	/**
	 * json转list
	 * @param json
	 * @param beanClass
	 * @return
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	<T> List<T> toList(String json,Class<T> beanClass);
	
	/**
	 * 日期格式
	 * @param datePattern
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	void setDatePattern(String datePattern);
	
	/**
	 * 过滤字段
	 * @param excludes
	 * @author 唐延波
	 * @date 2015年7月6日
	 */
	void setExcludes(String[] excludes);
}
