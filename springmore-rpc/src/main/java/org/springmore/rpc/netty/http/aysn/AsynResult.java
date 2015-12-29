package org.springmore.rpc.netty.http.aysn;


/**
 * 异步result
 * @author 唐延波
 * @date 2015年6月26日
 */
public class AsynResult<T> extends BaseResult<T>{	

	@Override
	public T get() throws InterruptedException {
		T message = sybGet();
		return message;
	}

	@Override
	public void set(T message) {
		synSet(message);
	}
	
}
