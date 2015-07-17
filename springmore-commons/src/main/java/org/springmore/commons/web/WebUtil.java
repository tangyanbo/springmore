package org.springmore.commons.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springmore.commons.exception.CommonsException;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import static org.springmore.commons.codec.Charsets.UTF_8;

/**
 * <pre>
 * WebUtil 
 * 1 提供发送Json字符串到前端的方法
 * 自动将对象或数组转换成Json格式的字符串，并提供对象属性过滤的功能
 * 2 提供发送错误信息到浏览器的方法，格式为json
 * </pre>
 * @version 1.0.2
 * @author 唐延波
 * @date 2013-5-10
 * @date 最后更新时间 2013-11-21 更新者 唐延波
 * @date 更新时间 2015-07-06
 * <pre>
 * 更新内容：将对象转成json的逻辑移到JsonUtil
 * 且默认是用fastjson实现
 * </pre>
 * 
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
		String msgJson = JsonUtil.toJSONString(message);
		write(msgJson, response);
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
		String jsonString = JsonUtil.toJSONString(object,excludes);
		sendResponse(jsonString, response);
	}

	/**
	 * 将对象转化为Json格式并发送到客户端 <br>
	 * 并提JsonConfig 支持分页查询
	 * 
	 * @author 唐延波
	 */
	public static void sendJSONArrayResponse(final Object object,final String[] excludes,
			final IPageInfo pageInfo,final HttpServletResponse response) {
		JSONArray jsonArray = JsonUtil.toJSONArray(object,excludes);
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
			response.setCharacterEncoding(UTF_8.name());
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
	
	/**
	 * 获取request流中的文本
	 * @param request
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月15日
	 */
	public static String getRequestContent(HttpServletRequest request) throws Exception{
		String content = "";
		InputStream inputStream = request.getInputStream();
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				inputStream,UTF_8));
		String tempStr = "";
		while ((tempStr = reader.readLine()) != null) {
			content += tempStr;
		}
		return content;
	}

}
