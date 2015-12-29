package org.springmore.commons.testsuite.performance;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 性能测试工具类
 * 
 * @author 唐延波
 * @date 2015年7月22日
 */
public class PerformanceUtil {

	private int poolSize = 100;
	private long timeStart = 0;
	private long timeEnd = 0;
	private long processedRequestsStart = 0;
	private long processedRequestsEnd = 0;
	private BussinessHandler handler;

	public void execute() {
		try {
			ExecutorService pool = Executors.newCachedThreadPool();
			DefaultRunnable.setHandler(handler);
			DefaultRunnable runnable = new DefaultRunnable();
			for (int i = 0; i < poolSize; i++) {
				pool.execute(runnable);
			}

			while (true) {
				timeStart = System.currentTimeMillis();
				processedRequestsStart = DefaultRunnable.processedRequests.get();
				Thread.sleep(2000);
				processedRequestsEnd = DefaultRunnable.processedRequests.get();
				timeEnd = System.currentTimeMillis();
				// 阶段处理请求数
				double disCount = processedRequestsEnd - processedRequestsStart;
				// 阶段时间
				double disTime = timeEnd - timeStart;
				double perMs = disCount / disTime;
				long perS = (long) (perMs * 1000);
				System.out.println("每秒执行事务数:" + perS);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void setPoolSize(int poolSize) {
		this.poolSize = poolSize;
	}

	public void setHandler(BussinessHandler handler) {
		this.handler = handler;
	}

}
