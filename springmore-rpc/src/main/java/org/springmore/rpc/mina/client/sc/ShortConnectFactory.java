package org.springmore.rpc.mina.client.sc;

import java.net.InetSocketAddress;
import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.core.service.IoConnector;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.nio.NioSocketConnector;
import org.springmore.commons.lang.MathUtil;
import org.springmore.rpc.mina.client.ConnectFactory;


/**
 * 短连接Factory.
 * 通过spring初始化
 * @author 唐延波
 * @date 2014-8-26
 */
public class ShortConnectFactory implements ConnectFactory{
		
	private IoConnector connector;
	
	private String host;
	
	private int port;
	
	private int readBufferSize = 2048;
	
	/**
	 * 连接超时时间
	 */
	private long connectTimeoutMillis;
	
	/**
	 * 编码解码工厂
	 */
	private ProtocolCodecFactory protocolCodecFactory;
	
	private ShortConnectFactory(){
		
	}
	
			
	/**
	 * 初始化
	 * 
	 * @author 唐延波
	 * @date 2015-6-24
	 */
	private void init() {
		// 设置连接参数
		connector = new NioSocketConnector();
		connector.setConnectTimeoutMillis(connectTimeoutMillis);
		connector.getFilterChain().addLast("logger", new LoggingFilter());
		//设置读缓冲,传输的内容必须小于此缓冲
		connector.getSessionConfig().setReadBufferSize(readBufferSize);
		
		if(protocolCodecFactory != null){
			connector.getFilterChain().addLast("codec",
					new ProtocolCodecFilter(protocolCodecFactory));
		}		
		ShortClientHandler clientHandler = new ShortClientHandler();		
		connector.setHandler(clientHandler);
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		init();
	}
		

	/**
	 * 获取连接
	 * 
	 * @author 唐延波
	 * @date 2015-1-15
	 * @param result
	 * @return
	 * @throws InterruptedException 
	 */
	@Override
	public ConnectFuture getConnection() throws InterruptedException {
		// 连接服务端
		ConnectFuture connection = connector.connect(new InetSocketAddress(host, port));
		// 等待建立连接
		connection.awaitUninterruptibly();
		return connection;
	}
	
	
	
	/**
	 * 关闭连接
	 * @param connection
	 * @throws InterruptedException
	 * @author 唐延波
	 * @date 2015-6-24
	 */
	@Override
	public void close(ConnectFuture connection) throws InterruptedException{
		connection.getSession().getCloseFuture().awaitUninterruptibly();
	}
	
	/**
	 * 关闭资源connector
	 * 
	 * @author 唐延波
	 * @date 2015-6-24
	 */
	@Override
	public void shutdown(){
		connector.dispose();
	}

	@Override
	public void setHost(String host) {
		this.host = host;
	}

	@Override
	public void setPort(int port) {
		this.port = port;
	}

	@Override
	public void setConnectTimeoutMillis(long connectTimeoutMillis) {
		this.connectTimeoutMillis = connectTimeoutMillis;
	}

	@Override
	public void setProtocolCodecFactory(ProtocolCodecFactory protocolCodecFactory) {
		this.protocolCodecFactory = protocolCodecFactory;
	}

	@Override
	public void setReadBufferSize(String readBufferSize) {
		this.readBufferSize = new Double(MathUtil.evaluate(readBufferSize)).intValue();
	}
	
	
}
