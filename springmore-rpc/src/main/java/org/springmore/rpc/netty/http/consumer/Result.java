package org.springmore.rpc.netty.http.consumer;


/**
 * 结果集接口
 * 
 * @author 唐延波
 * @date 2015年6月26日
 */
public interface Result {

	public static final String RESULT = "result";

	public static final String RESULT_MAP = "resultMap";
	
	public static final String COUNTER = "counter";
	
	/**
	 * 获取消息
	 * @return
	 * @throws InterruptedException
	 * @author 唐延波
	 * @date 2015年6月26日
	 */
	<T> T get() throws InterruptedException;
	
	/**
	 * 存放消息
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月26日
	 */
	void set(Object message);
	
	
}
