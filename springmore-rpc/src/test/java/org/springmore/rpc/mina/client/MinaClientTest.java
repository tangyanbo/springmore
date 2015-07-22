package org.springmore.rpc.mina.client;

import java.io.UnsupportedEncodingException;
import java.lang.Character.UnicodeBlock;
import java.net.URLDecoder;
import java.net.URLEncoder;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springmore.rpc.mina.client.lc.syn.LongConnectFactory;
import org.springmore.rpc.mina.client.sc.ShortConnectFactory;
import org.springmore.rpc.mina.codec.NewTextLineCodecFactory;
import org.springmore.rpc.mina.server.User;


public class MinaClientTest {

	MinaTemplate minaTemplate;
	
	
	public void before() {
		String[] xmls = new String[] { "classpath:applicationContext.xml"};
		ApplicationContext context = new ClassPathXmlApplicationContext(xmls);
		minaTemplate = context.getBean(MinaTemplate.class);
	}
	
	//@Before
	public void initShortConnectionFactory() {
		minaTemplate = new MinaTemplate();
		ShortConnectFactory factory = new ShortConnectFactory();
		factory.setHost("localhost");
		factory.setPort(18886);
		factory.setProtocolCodecFactory(new NewTextLineCodecFactory());
		minaTemplate.setConnectFactory(factory);
	}
	
	//@Before
	public void 长连接同步工厂() {
		minaTemplate = new MinaTemplate();
		LongConnectFactory factory = new LongConnectFactory();
		factory.setHost("localhost");
		factory.setPort(18886);
		factory.setProtocolCodecFactory(new NewTextLineCodecFactory());
		factory.build();
		minaTemplate.setConnectFactory(factory);
	}

	@Test
	public void 发送对象() throws InterruptedException {
		User user = new User();
		user.setUserId(10);
		User user2 = minaTemplate.sengObject(user);
		System.out.println(user2.getUserId());

	}
	
	@Test
	public void 发送字符串() throws InterruptedException {
		
		String s = minaTemplate.sengObject("xxx");
		System.out.println(s);

	}
	
	@Test
	public void 发送字节() throws InterruptedException {
		
		byte[] s = minaTemplate.sengObject("fff".getBytes());
		System.out.println(new String(s));
		System.out.println(s);

	}
	
	@Test
	public void test() throws UnsupportedEncodingException{
		String str= "\\u4e0a\\u6d77";
		String s = URLEncoder.encode("上海");
		System.out.println(s);
		String newStr = URLDecoder.decode(str,"UTF-8");
		
		System.out.println(newStr);
	}

}
