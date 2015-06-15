package org.springmore.commons.web;

import java.text.SimpleDateFormat;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

/**
 * DateJsonValueProcessor
 * 将对象转换为json的时候
 * 处理日期格式
 * @author 唐延波
 * @date 2015-6-10
 */
public class DateJsonValueProcessor implements JsonValueProcessor{

	@Override
	public Object processArrayValue(Object arg0, JsonConfig arg1) {
		return null;
	}

	@Override
	public Object processObjectValue(String arg0, Object obj, JsonConfig arg2) {
		SimpleDateFormat dateFmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (obj == null) {
			return "";
		} else {
			return dateFmt.format(obj);
		}
	}

}
