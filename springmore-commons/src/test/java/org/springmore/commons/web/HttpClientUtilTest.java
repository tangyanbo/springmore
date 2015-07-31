package org.springmore.commons.web;

import static org.springmore.commons.codec.Charsets.UTF_8;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.junit.Test;

public class HttpClientUtilTest {

	@Test
	public void testDoGetStringString() throws Exception {
		HttpClientUtil httpUtil = new HttpClientUtil();
		String doGet = httpUtil.get("http://localhost:8888/login/");
		String doGet2 = httpUtil.get("http://localhost:8888/login/",UTF_8.name());
		System.out.println(doGet);
	}

	@Test
	public void testDoPost() throws Exception {
		HttpClientUtil httpUtil = new HttpClientUtil();
		 List <NameValuePair> nvps = new ArrayList <NameValuePair>();
         nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
		String doGet = httpUtil.post("http://localhost:8888/login/login!login.ac",nvps);
		System.out.println(doGet);
	}

	@Test
	public void testSSL() throws Exception {
		HttpClientUtil httpUtil = new HttpClientUtil();
		String doGet = httpUtil.getSSL("https://www.baidu.com", "utf-8");
		List <NameValuePair> nvps = new ArrayList <NameValuePair>();
        nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
		String post = httpUtil.postSSL("https://www.baidu.com", nvps,"utf-8");
		System.out.println(post);
	}
	
	@Test
	public void getFile() throws Exception{
		HttpClientUtil httpUtil = new HttpClientUtil();
		httpUtil.getFile("http://localhost:8888/login/login!login.ac");
		httpUtil.postFile("http://localhost:8888/login/login!login.ac", "fileName", new File("d:/test.txt"));
	}
	
	@Test
	public void postString() throws Exception{
		HttpClientUtil httpUtil = new HttpClientUtil();
		httpUtil.post("http://localhost:8888/paydemo/noticeAccept", "哈哈");
	}
	

}
