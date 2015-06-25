package org.springmore.rpc.mina.client;

import java.nio.ByteBuffer;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.future.ConnectFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springmore.rpc.mina.client.lc.syn.LongConnectFactory;
import org.springmore.rpc.mina.client.sc.ShortConnectFactory;

/**
 * 结果类
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public class Result<T> {

	public static final String SESSION_KEY = "result";

	private ConnectFactory connectFactory;

	private ConnectFuture connection;

	/**
	 * 信息
	 */
	private T message;

	/**
	 * 是否接收完成
	 */
	private boolean done;

	private Logger log = LoggerFactory.getLogger(this.getClass());

	/**
	 * 获取返回信息
	 * 
	 * @return
	 * @author 唐延波
	 * @throws InterruptedException 
	 * @date 2015年6月25日
	 */
	
	public T get() throws InterruptedException {
		if (connectFactory instanceof LongConnectFactory) {
			T message = sybGet();
			connectFactory.close(connection);
			return message;
		}else if(connectFactory instanceof ShortConnectFactory){
			connectFactory.close(connection);
			return message;
		}
		return null;
	}

	/**
	 * 同步获取返回信息
	 * 
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	@SuppressWarnings("unchecked")
	private synchronized T sybGet() {
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
			result = message;
		}
		return result;
	}

	/**
	 * 设置消息
	 * 
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	public void set(T message) {
		if (connectFactory instanceof LongConnectFactory) {
			synSet(message);
		}else if(connectFactory instanceof ShortConnectFactory){
			this.message = message;
		}
	}
	
	/**
	 * 同步设置消息
	 * @param message
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	private synchronized void synSet(T message) {
		this.message = message;
		this.done = true;
		notify();
	}	

	public void setConnectFactory(ConnectFactory connectFactory) {
		this.connectFactory = connectFactory;
	}

	public void setConnection(ConnectFuture connection) {
		this.connection = connection;
	}

}
