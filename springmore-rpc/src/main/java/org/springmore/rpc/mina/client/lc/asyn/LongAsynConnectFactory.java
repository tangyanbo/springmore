package org.springmore.rpc.mina.client.lc.asyn;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.core.service.IoConnector;
import org.apache.mina.core.session.IoSession;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.nio.NioSocketConnector;
import org.springmore.commons.lang.MathUtil;
import org.springmore.rpc.mina.client.ConnectFactory;
import org.springmore.rpc.mina.client.Result;


/**
 * 长连接Factory.
 * 通过spring初始化
 * @author 唐延波
 * @date 2014-8-26
 */
public class LongAsynConnectFactory implements ConnectFactory{
	
	/**
	 * 连接池
	 */
	private final List<ConnectFuture> connectionPool = new ArrayList<ConnectFuture>();
	

	/**
	 * 连接池默认初始化连接数量
	 */
	private final static int DEFAULT_POOL_SIZE = 10;
	
	private IoConnector connector;
	
	/**
	 * 线程池大小
	 */
	private int poolSize = DEFAULT_POOL_SIZE;
	
	private String host;
	
	private int port;
	
	private int readBufferSize = 2048;
	
	/**
	 * 连接超时时间
	 */
	private long connectTimeoutMillis;
	
	private AtomicInteger counter = new AtomicInteger();
	
	/**
	 * 编码解码工厂
	 */
	private ProtocolCodecFactory protocolCodecFactory;
	
	private LongAsynConnectFactory(){
		
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
		LongAsynClientHandler clientHandler = new LongAsynClientHandler();
		
		connector.setHandler(clientHandler);
		initConnection(poolSize);
	}
	
	/**
	 * 初始化连接
	 * @param size
	 * @author 唐延波
	 * @date 2015-6-24
	 */
	private void initConnection(int size) {
		for (int i = 0; i < size; i++) {
			// 连接服务端
			ConnectFuture connection = connector.connect(new InetSocketAddress(
					host, port));
			// 等待建立连接
			connection.awaitUninterruptibly();
			IoSession session = connection.getSession();
			//放入counter				
			session.setAttribute(Result.COUNTER, new AtomicLong());
			//放入map
			ConcurrentHashMap<Long, Result> resultMap = new ConcurrentHashMap<Long, Result>(100,0.75f,16);
			session.setAttribute(Result.RESULT_MAP, resultMap);
			connectionPool.add(connection);
		}
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
		int count = counter.incrementAndGet();
		if(count>1000000){
			counter.set(0);
		}
		int index = count%connectionPool.size();
		ConnectFuture connection = connectionPool.get(index);
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
		//connection.getSession().getCloseFuture().awaitUninterruptibly();
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

	public void setPoolSize(int poolSize) {
		this.poolSize = poolSize;
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
