package org.springmore.rpc.netty.http.aysn;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.junit.Before;
import org.junit.Test;
import org.springmore.rpc.netty.pool.ChannelFuturePool;

public class NettyHttpTest {
	
	private NettyHttp http;
	
	@Before
	public void before(){
		GenericObjectPoolConfig config = new GenericObjectPoolConfig();
		ChannelFuturePool pool = new ChannelFuturePool(config,"localhost",8888);
		http = new NettyHttp(pool);
	}

	@Test
	public void testPost() throws InterruptedException {
		while(true){
			
			String post = http.post("http://localhost:8888/paydemo/noticeAccept", "are you ok?");
			System.out.println(post);
			Thread.sleep(100);
		}
		
	}

}
