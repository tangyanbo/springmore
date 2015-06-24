package org.springmore.commons.web;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.junit.Test;

public class HttpClientUtilTest {

	@Test
	public void testDoGetStringString() throws Exception {
		String doGet = HttpClientUtil.get("http://localhost:8888/login/");
		String doGet2 = HttpClientUtil.get("http://localhost:8888/login/",HttpClientUtil.UTF_8);
		System.out.println(doGet);
	}

	@Test
	public void testDoPost() throws Exception {
		 List <NameValuePair> nvps = new ArrayList <NameValuePair>();
         nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
		String doGet = HttpClientUtil.post("http://localhost:8888/login/login!login.ac",nvps);
		System.out.println(doGet);
	}

	@Test
	public void testSSL() throws Exception {
		String doGet = HttpClientUtil.getSSL("https://www.baidu.com", "utf-8");
		List <NameValuePair> nvps = new ArrayList <NameValuePair>();
        nvps.add(new BasicNameValuePair("user.userName", "哈哈"));
		String post = HttpClientUtil.postSSL("https://www.baidu.com", nvps,"utf-8");
		System.out.println(post);
	}
	
	@Test
	public void getFile() throws Exception{
		HttpClientUtil.getFile("http://localhost:8888/login/login!login.ac");
		HttpClientUtil.postFile("http://localhost:8888/login/login!login.ac", "fileName", new File("d:/test.txt"));
	}
}
