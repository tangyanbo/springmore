package org.springmore.rpc.mina.client.lc.asyn;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.mina.core.session.IoSession;
import org.springmore.rpc.mina.client.BaseResult;
import org.springmore.rpc.mina.client.Result;

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
