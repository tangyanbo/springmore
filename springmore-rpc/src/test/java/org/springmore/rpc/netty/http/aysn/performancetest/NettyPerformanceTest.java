package org.springmore.rpc.netty.http.aysn.performancetest;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.junit.Before;
import org.junit.Test;
import org.springmore.commons.testsuite.performance.BussinessHandler;
import org.springmore.commons.testsuite.performance.PerformanceUtil;
import org.springmore.rpc.netty.http.aysn.NettyHttp;
import org.springmore.rpc.netty.pool.ChannelFuturePool;

/**
 * NettyPerformanceTest
 * @author 唐延波
 * @date 2015年7月22日
 */
public class NettyPerformanceTest {

	private NettyHttp http;
	
	@Before
	public void before(){
		GenericObjectPoolConfig config = new GenericObjectPoolConfig();
		config.setMaxTotal(10);
		/*config.setMinIdle(20);
		config.setMaxIdle(20);*/
		ChannelFuturePool pool = new ChannelFuturePool(config,"192.168.1.246",8888);
		http = new NettyHttp(pool);
	}
	
	@Test
	public void testNettyHttp(){
		PerformanceUtil  pu = new PerformanceUtil();
		pu.setPoolSize(20);
		pu.setHandler(new BussinessHandler() {
			
			@Override
			public void doBussiness() {
				String post = http.post("http://192.168.1.246:8888/", "are you ok?");
			}
		});
		pu.execute();
	}
	
	
	
}
