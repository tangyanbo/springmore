package org.springmore.rpc.mina.client.sc;

import org.apache.mina.core.session.IoSession;
import org.springmore.rpc.mina.client.BaseResult;
import org.springmore.rpc.mina.client.Result;

/**
 * 同步结果类
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public class ShortResult extends BaseResult{
	
	/**
	 * 获取返回信息
	 * 
	 * @return
	 * @author 唐延波
	 * @throws InterruptedException 
	 * @date 2015年6月25日
	 */
	@SuppressWarnings("unchecked")
	@Override
	public <T> T get() throws InterruptedException {
		connectFactory.close(connection);
		return (T) message;
	}

	/**
	 * 设置消息
	 * 
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	@Override
	public void set(Object message) {
		this.message = message;
	}
}
