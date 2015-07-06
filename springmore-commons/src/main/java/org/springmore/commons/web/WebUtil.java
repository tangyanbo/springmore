package org.springmore.commons.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;

import org.springmore.commons.exception.CommonsException;

/**
 * <pre>
 * WebUtil 
 * 1 提供发送Json字符串到前端的方法
 * 自动将对象或数组转换成Json格式的字符串，并提供对象属性过滤的功能
 * 2 提供发送错误信息到浏览器的方法，格式为json
 * </pre>
 * 
 * @author 唐延波
 * @date 2013-5-10
 * @date 最后更新时间 2013-11-21 更新者 唐延波
 */
public class WebUtil {

	/**
	 * 服务端500错误
	 */
	private final static Integer SERVER_ERROR = 500;
	
	

	/**
	 * 发送错误信息到客户端
	 * 
	 * @param errorMsg
	 *            错误信息
	 * @author 唐延波
	 */
	public static void sendErrorMsg(final String errorMsg,
			final HttpServletResponse response) {
		final Message message = new Message(errorMsg);
		response.setStatus(SERVER_ERROR);
		final JSONObject jsonMessage = JSONObject.fromObject(message);
		write(jsonMessage.toString(), response);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONObjectResponse(final Object object,
			final HttpServletResponse response) {
		sendJSONObjectResponse(object, null, response);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端
	 * 
	 * @param excludes
	 *            除对象部分属性
	 * @author 唐延波
	 */
	public static void sendJSONObjectResponse(final Object object,
			final String[] excludes, final HttpServletResponse response) {
		final JsonConfig jsonConfig = new JsonConfig();
		if (excludes != null) {
			jsonConfig.setExcludes(excludes);
		}
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
		final JSONObject jsonObject = JSONObject.fromObject(object, jsonConfig);
		sendResponse(jsonObject.toString(), response);
	}

	/**
	 * 将数组转化为Json格式并发送到客户端
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array,
			final HttpServletResponse response) {
		sendJSONArrayResponse(array, new String[] {}, response);
	}

	/**
	 * <pre>
	 * 将对象转化为Json格式并发送到客户端 
	 * 并提供去除对象部分属性的功能
	 * </pre>
	 * @param excludes
	 *            除对象部分属性
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array,
			final String[] excludes, final HttpServletResponse response) {
		sendJSONArrayResponse(array, excludes, null, response);
	}

	/**
	 * <pre>
	 * 将对象转化为Json格式并发送到客户端 
	 * 并提供去除对象部分属性的功能 提供分页功能
	 * </pre>
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array,
			final String[] excludes, final IPageInfo pageInfo,
			final HttpServletResponse response) {
		final JsonConfig config = new JsonConfig();
		config.setExcludes(excludes);
		sendJSONArrayResponse(array, config, pageInfo, response);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 并提JsonConfig
	 * 
	 * @author 唐延波
	 */
	@Deprecated
	public static void sendJSONArrayResponse(final Object array,
			final JsonConfig jsonConfig, final HttpServletResponse response) {
		sendJSONArrayResponse(array, jsonConfig, null);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 <br>
	 * 并提JsonConfig 支持分页查询
	 * 
	 * @author 唐延波
	 */
	@Deprecated
	public static void sendJSONArrayResponse(final Object array,
			final JsonConfig jsonConfig, final IPageInfo pageInfo,
			final HttpServletResponse response) {
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor("yyyy-MM-dd HH:mm:ss"));
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		final JSONArray jsonArray = JSONArray.fromObject(array, jsonConfig);
		if (pageInfo != null) {
			final JSONObject jsonObject = new JSONObject();
			jsonObject.put("total", pageInfo.getTotalCount());
			jsonObject.put("rows", jsonArray);
			sendResponse(jsonObject.toString(), response);
		} else {
			sendResponse(jsonArray.toString(), response);
		}
	}

	/**
	 * 发送字符串
	 * 
	 * @param text
	 * @param response
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public static void sendResponse(final String text,
			final HttpServletResponse response) {
		write(text, response);
	}
	
	/**
	 * 发送html
	 * @param html
	 * @param response
	 * @author 唐延波
	 * @date 2015年7月1日
	 */
	public static void sendHTMLResponse(final String html,
			final HttpServletResponse response) {
		write(html,"text/html",response);
	}
	
	/**
	 * 将字符串写到response writer流中
	 * 
	 * @author 唐延波
	 */
	private static void write(final String context,final String contentType,
			final HttpServletResponse response) {
		PrintWriter writer = null;
		try {
			response.setContentType(contentType);
			response.setCharacterEncoding("utf-8");
			writer = response.getWriter();
			writer.write(context);
		} catch (IOException e) {
			throw new CommonsException(e);
		} finally {
			if (writer != null) {
				writer.close();
			}
		}
	}

	/**
	 * 将字符串写到response writer流中
	 * 
	 * @author 唐延波
	 */
	private static void write(final String context,
			final HttpServletResponse response) {
		write(context,"text/plain",response);
	}

}
