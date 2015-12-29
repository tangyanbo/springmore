package org.easygrid.util;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.util.CycleDetectionStrategy;

import org.apache.struts2.ServletActionContext;

/**
 * WebUtil <br/>
 * 1 提供发送Json字符串到前端的方法<br/>
 * 自动将对象或数组转换成Json格式的字符串，并提供对象属性过滤的功能 <br/>
 * 2 提供发送错误信息到浏览器的方法，格式为json <br/>
 * 
 * @author 唐延波
 * @date 2013-5-10
 * @date 最后更新时间 2013-11-21 更新者 唐延波
 */
public class WebUtil {

	/**
	 * 发送错误信息到客户端
	 * 
	 * @param errorMsg
	 *            错误信息
	 * @author 唐延波
	 */
	public static void sendErrorMsg(final String errorMsg) {
		final HttpServletResponse response = ServletActionContext.getResponse();
		final Message message = new Message(errorMsg);
		response.setStatus(UtilConstants.SERVER_ERROR);
		final JSONObject jsonMessage = JSONObject.fromObject(message);
		write(jsonMessage.toString(), response);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONObjectResponse(final Object object) {
		sendJSONObjectResponse(object, null);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端
	 * 
	 * @param excludes
	 *            除对象部分属性
	 * @author 唐延波
	 */
	public static void sendJSONObjectResponse(final Object object,
			final String[] excludes) {
		final JsonConfig jsonConfig = new JsonConfig();
		if (excludes != null) {
			jsonConfig.setExcludes(excludes);
		}
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor());
		final JSONObject jsonObject = JSONObject.fromObject(object, jsonConfig);
		sendResponse(jsonObject.toString());
	}

	/**
	 * 将数组转化为Json格式并发送到客户端
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array) {
		sendJSONArrayResponse(array, new String[] {});
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 并提供去除对象部分属性的功能
	 * 
	 * @param excludes
	 *            除对象部分属性
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array,
			final String[] excludes) {
		sendJSONArrayResponse(array, excludes, null);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 并提供去除对象部分属性的功能 提供分页功能
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object array,
			final String[] excludes, final IPageInfo pageInfo) {
		final JsonConfig config = new JsonConfig();
		config.setExcludes(excludes);
		sendJSONArrayResponse(array, config, pageInfo);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 并提JsonConfig
	 * 
	 * @author 唐延波
	 */
	@Deprecated
	public static void sendJSONArrayResponse(final Object array,
			final JsonConfig jsonConfig) {
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
			final JsonConfig jsonConfig, final IPageInfo pageInfo) {
		jsonConfig.registerJsonValueProcessor(Date.class,
				new DateJsonValueProcessor());
		jsonConfig.setCycleDetectionStrategy(CycleDetectionStrategy.LENIENT);
		final JSONArray jsonArray = JSONArray.fromObject(array, jsonConfig);
		if (pageInfo != null) {
			final JSONObject jsonObject = new JSONObject();
			jsonObject.put("total", pageInfo.getTotalCount());
			jsonObject.put("rows", jsonArray);
			sendResponse(jsonObject.toString());
		} else {
			sendResponse(jsonArray.toString());
		}
	}

	/**
	 * 发送字符串
	 * 
	 * @author 唐延波
	 */
	public static void sendResponse(final String text) {
		HttpServletResponse response = ServletActionContext.getResponse();
		write(text, response);
	}

	/**
	 * 将字符串写到response writer流中
	 * 
	 * @author 唐延波
	 */
	private static void write(final String context,
			final HttpServletResponse response) {
		PrintWriter writer = null;
		try {
			response.setContentType("text/plain");
			response.setCharacterEncoding("utf-8");
			writer = response.getWriter();
			writer.write(context);
		} catch (IOException e) {

		} finally {
			if (writer != null) {
				writer.close();
			}
		}
	}

	public static HttpServletResponse getResponse() {
		return ServletActionContext.getResponse();
	}

	public static HttpServletRequest getRequest() {
		return ServletActionContext.getRequest();
	}

}
