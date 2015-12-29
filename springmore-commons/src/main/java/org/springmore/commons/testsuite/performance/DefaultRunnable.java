package org.springmore.commons.testsuite.performance;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;


/**
 * DefaultRunnable
 * 
 * @author 唐延波
 * @date 2015年7月22日
 */
public class DefaultRunnable implements Runnable {

	/**
	 * 已处理请求数
	 */
	public static AtomicLong processedRequests = new AtomicLong();

	/**
	 * 总请求数
	 */
	public static AtomicLong requests = new AtomicLong();

	public static AtomicLong remove = new AtomicLong();

	public static AtomicLong totalTime = new AtomicLong();
	
	private static BussinessHandler handler; 

	@Override
	public void run() {
		while(true){
			try {
				Thread.sleep(10);
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}
			//do business
			requests.incrementAndGet();
			handler.doBussiness();
			processedRequests.incrementAndGet();
		}
	}

	public static void setHandler(BussinessHandler handler) {
		DefaultRunnable.handler = handler;
	}

	
}
