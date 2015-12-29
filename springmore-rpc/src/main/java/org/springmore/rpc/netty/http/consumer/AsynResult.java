package org.springmore.rpc.netty.http.consumer;


/**
 * 异步result
 * @author 唐延波
 * @date 2015年6月26日
 */
public class AsynResult extends BaseResult{	

	@Override
	public <T> T get() throws InterruptedException {
		T message = sybGet();
		return message;
	}

	@Override
	public void set(Object message) {
		synSet(message);
	}

	
}
