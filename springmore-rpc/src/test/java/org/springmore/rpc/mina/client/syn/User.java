package org.springmore.rpc.mina.client.syn;

public class User implements java.io.Serializable{
	
	private long userId;
	
	public User(){}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}
	
	
}
