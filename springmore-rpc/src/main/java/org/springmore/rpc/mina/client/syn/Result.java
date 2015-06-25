package org.springmore.rpc.mina.client.syn;

import java.nio.ByteBuffer;

import org.apache.mina.core.buffer.IoBuffer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 结果类
 * 
 * @author 唐延波
 * @date 2015-1-13
 * 
 */
public class Result {

	public static final String SESSION_KEY = "result";
	/**
	 * 信息
	 */
	private Object message;

	/**
	 * 是否接收完成
	 */
	private boolean done;

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@SuppressWarnings("unchecked")
	public synchronized <T> T synGet() {
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
		if(message instanceof IoBuffer){
			IoBuffer buf = (IoBuffer) message;
			ByteBuffer bf = buf.buf();
			byte[] data = new byte[bf.limit()];
			bf.get(data);
			result = (T)data;
		}else{
			result = (T)message;
		}
		return result;
	}

	public synchronized void synSet(Object message) {
		this.message = message;
		this.done = true;
		notify();
	}

	public Object getMessage() {
		return message;
	}

	public void setMessage(Object message) {
		this.message = message;
	}

	
}
