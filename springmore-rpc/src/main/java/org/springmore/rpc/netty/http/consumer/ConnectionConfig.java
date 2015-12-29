package org.springmore.rpc.netty.http.consumer;

/**
 * ConnectionConfig
 * @author Administrator
 *
 */
public class ConnectionConfig {

	/**
	 * 连接池默认初始化连接数量
	 */
	private final static int DEFAULT_POOL_SIZE = 10;

	/**
	 * 线程池大小
	 */
	public int poolSize = DEFAULT_POOL_SIZE;

	public String host;
	
	public int port;
	
	
}
