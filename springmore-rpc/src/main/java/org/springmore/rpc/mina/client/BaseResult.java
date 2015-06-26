package org.springmore.rpc.mina.client;

import java.nio.ByteBuffer;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.core.session.IoSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springmore.rpc.mina.client.ConnectFactory;
import org.springmore.rpc.mina.client.Result;

/**
 * BaseResult
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public abstract class BaseResult implements Result{	

	protected ConnectFactory connectFactory;

	protected ConnectFuture connection;

	/**
	 * 信息
	 */
	protected Object message;

	/**
	 * 是否接收完成
	 */
	protected boolean done;

	private Logger log = LoggerFactory.getLogger(this.getClass());

	

	/**
	 * 同步获取返回信息
	 * 
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	@SuppressWarnings("unchecked")
	protected synchronized <T> T sybGet() {
		// 等待消息返回
		// 必须要在同步的情况下执行
		if (!done) {
			try {
				wait();
			} catch (InterruptedException e) {
				log.error(e.getMessage(), e);
			}
		}
		T result = null;
		if (message instanceof IoBuffer) {
			IoBuffer buf = (IoBuffer) message;
			ByteBuffer bf = buf.buf();
			byte[] data = new byte[bf.limit()];
			bf.get(data);
			result = (T) data;
		} else {
			result = (T) message;
		}
		return result;
	}

	
	
	/**
	 * 同步设置消息
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	protected synchronized void synSet(Object message) {
		this.message = message;
		this.done = true;
		notify();
	}	

	@Override
	public void setConnectFactory(ConnectFactory connectFactory) {
		this.connectFactory = connectFactory;
	}

	@Override
	public void setConnection(ConnectFuture connection) {
		this.connection = connection;
	}

	@Override
	public ConnectFactory getConnectFactory() {
		return connectFactory;
	}



	@Override
	public abstract <T> T get() throws InterruptedException;



	@Override
	public abstract void set(Object message);


}
