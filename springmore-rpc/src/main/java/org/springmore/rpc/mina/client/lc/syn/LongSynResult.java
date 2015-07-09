package org.springmore.rpc.mina.client.lc.syn;

import org.springmore.rpc.mina.client.BaseResult;

/**
 * 同步结果类
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public class LongSynResult extends BaseResult{
	
	/**
	 * 获取返回信息
	 * 
	 * @return
	 * @author 唐延波
	 * @throws InterruptedException 
	 * @date 2015年6月25日
	 */
	@Override
	public <T> T get() throws InterruptedException {
		T message = sybGet();
		connectFactory.close(connection);
		return message;
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
		synSet(message);
	}

}
