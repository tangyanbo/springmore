package org.springmore.rpc.mina.client;

/**
 * Message
 * 
 * @author 唐延波
 * @date 2015年6月26日
 */
public class MessageWrapper implements java.io.Serializable{

	private long id;

	private Object message;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@SuppressWarnings("unchecked")
	public <T> T getMessage() {
		return (T) message;
	}

	public void setMessage(Object message) {
		this.message = message;
	}

}
