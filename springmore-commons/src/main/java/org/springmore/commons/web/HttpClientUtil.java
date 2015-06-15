package org.springmore.commons.web;

import java.io.IOException;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * HttpClientUtil
 * 
 * @author 唐延波
 * @date 2015-6-10
 */
public class HttpClientUtil {

	private static final String UTF_8 = "utf-8";
	
	/**
	 * 连接超时时间
	 * 20s
	 */
	private static final int CONNECT_TIMEOUT = 20000;
	
	/**
	 * 请求超时时间
	 * 20s
	 */
	private static final int CONNECT_REQUEST_TIMEOUT = 20000;
	
	/**
	 * socket超时时间
	 * 20s
	 */
	private static final int SOCKET_TIMEOUT = 20000;
	
	/**
	 * 获取HttpClient
	 * @return
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	private static CloseableHttpClient getHttpClient() {
		RequestConfig requestConfig = RequestConfig.custom()
				.setConnectTimeout(CONNECT_TIMEOUT)
				.setConnectionRequestTimeout(CONNECT_REQUEST_TIMEOUT)
				.setSocketTimeout(SOCKET_TIMEOUT).build();
		CloseableHttpClient httpclient = HttpClients.custom()
				.setDefaultRequestConfig(requestConfig).build();
		return httpclient;
	}

	/**
	 * http get请求 默认编码为utf-8
	 * 
	 * @param url
	 * @param encoding
	 *            编码
	 * @return
	 * @author 唐延波
	 * @throws IOException
	 * @throws ClientProtocolException
	 * @date 2015-6-10
	 */
	public static String doGet(String url, String encoding) throws Exception {
		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;
		try {
			httpclient = getHttpClient();
			HttpGet httpget = new HttpGet(url);
			response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			String result = EntityUtils.toString(entity, encoding);
			return result;
		} finally {
			response.close();
			httpclient.close();
		}
	}

	/**
	 * http get请求
	 * 
	 * @param url
	 * @return
	 * @throws ClientProtocolException
	 * @throws IOException
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public static String doGet(String url) throws Exception {
		return doGet(url, UTF_8);
	}

	/**
	 * post 请求
	  * <pre>
	 * List <NameValuePair> nvps = new ArrayList <NameValuePair>();
     * nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
     * HttpClientUtil.doPost("http://localhost:8888/login/login!login.ac",nvps,"utf-8");
	 * </pre>
	 * @param url
	 * @param nvps
	 * @param encoding
	 * @return
	 * @throws ClientProtocolException
	 * @throws IOException
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public static String doPost(String url, List<NameValuePair> nvps,
			String encoding) throws Exception {
		CloseableHttpClient httpclient = null;
		CloseableHttpResponse response = null;
		try {
			httpclient = getHttpClient();
			HttpPost httpPost = new HttpPost(url);
			httpPost.setEntity(new UrlEncodedFormEntity(nvps,encoding));
	        response = httpclient.execute(httpPost);
	        HttpEntity entity = response.getEntity();
			String result = EntityUtils.toString(entity, encoding);
			return result;
		} finally {
			response.close();
			httpclient.close();
		}
	}

	/**
	 * post 请求
	 * <pre>
	 * List <NameValuePair> nvps = new ArrayList <NameValuePair>();
     * nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
     * HttpClientUtil.doPost("http://localhost:8888/login/login!login.ac",nvps);
	 * </pre>
	 * @param url
	 * @param nvp
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public static String doPost(String url, List<NameValuePair> nvp)
			throws Exception {
		return doPost(url,nvp,UTF_8);
	}
	
	
	
}
