package org.springmore.rpc.netty.http.aysn;

import java.util.concurrent.CountDownLatch;

/**
 * BaseResult
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public abstract class BaseResult<T> implements Result<T>{

	/**
	 * 信息
	 */
	protected T message;

	/**
	 * 是否接收完成
	 */
	protected boolean done;

	
	private CountDownLatch latch = new CountDownLatch(1);
	
	/**
	 * 同步获取返回信息
	 * 
	 * @author 唐延波
	 * @throws InterruptedException 
	 * @date 2015年6月25日
	 */
	protected T sybGet() throws InterruptedException {
		// 等待消息返回
		// 必须要在同步的情况下执行
		if (!done) {
			latch.await();
		}
		return message;
	}

	
	
	/**
	 * 同步设置消息
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	protected void synSet(T message) {
		this.message = message;
		this.done = true;
		latch.countDown();
	}

	@Override
	public abstract T get() throws InterruptedException;



	@Override
	public abstract void set(T message);


}
