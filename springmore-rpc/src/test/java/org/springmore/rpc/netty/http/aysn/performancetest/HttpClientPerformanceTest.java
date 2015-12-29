package org.springmore.rpc.netty.http.aysn.performancetest;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.junit.Before;
import org.junit.Test;
import org.springmore.commons.testsuite.performance.BussinessHandler;
import org.springmore.commons.testsuite.performance.PerformanceUtil;
import org.springmore.commons.web.HttpClientUtil;
import org.springmore.rpc.netty.http.aysn.NettyHttp;
import org.springmore.rpc.netty.pool.ChannelFuturePool;

/**
 * NettyPerformanceTest
 * @author 唐延波
 * @date 2015年7月22日
 */
public class HttpClientPerformanceTest {

	
	
	@Test
	public void test(){
		PerformanceUtil  pu = new PerformanceUtil();
		pu.setPoolSize(100);
		pu.setHandler(new BussinessHandler() {
			
			@Override
			public void doBussiness(){
				HttpClientUtil http = new HttpClientUtil();
				try {
					http.post("http://www.baidu.com", "aa");
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
		pu.execute();
	}
	
	
	
}
