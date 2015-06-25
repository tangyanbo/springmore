package org.springmore.rpc.mina.client.syn;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class MinaClientTest {

	MinaTemplate minaTemplate;
	
	@Before
	public void before() {
		String[] xmls = new String[] { "classpath:applicationContext.xml"};
		ApplicationContext context = new ClassPathXmlApplicationContext(xmls);
		minaTemplate = context.getBean(MinaTemplate.class);
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
		
		String s = minaTemplate.sengObject("xxx\nxx");
		System.out.println(s);

	}
	
	@Test
	public void 发送字节() throws InterruptedException {
		
		byte[] s = minaTemplate.sengObject("fff".getBytes());
		System.out.println(new String(s));
		System.out.println(s);

	}

}
