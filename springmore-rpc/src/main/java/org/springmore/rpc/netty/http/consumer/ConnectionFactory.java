package org.springmore.rpc.netty.http.consumer;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.springmore.rpc.mina.client.Result;
import org.springmore.rpc.netty.exception.NettyHttpException;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpRequestEncoder;
import io.netty.handler.codec.http.HttpResponseDecoder;
import io.netty.util.AttributeKey;

/**
 * ConnectionFactory
 * 
 * @author 唐延波
 * @date 2015年7月17日
 */
public class ConnectionFactory {

	private ConnectionConfig connConfig;
	
	private Bootstrap bstrap;
	
	/**
	 * 连接池
	 */
	private final List<ChannelFuture> connectionPool = new ArrayList<ChannelFuture>();
	
	/**
	 * 访问计数器
	 */
	private AtomicInteger counter = new AtomicInteger();

	private ConnectionFactory() {

	}

	/**
	 * 获取工厂实例
	 * 
	 * @return
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	public static ConnectionFactory custom() {
		ConnectionFactory connectionFactory = new ConnectionFactory();
		return connectionFactory;
	}

	public ConnectionFactory build() {
		try {
			this.init();
		} catch (Exception e) {
			throw new NettyHttpException(e);
		}
		return this;
	}

	/**
	 * getChannelFuture
	 * 
	 * @return
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	public ChannelFuture getChannelFuture() {
		int count = counter.incrementAndGet();
		if(count>1000000){
			counter.set(0);
		}
		int index = count%connectionPool.size();
		ChannelFuture connection = connectionPool.get(index);
		return connection;
	}

	/**
	 * 初始化
	 * 
	 * @author 唐延波
	 * @throws Exception
	 * @date 2015-6-24
	 */
	private void init() throws Exception {
		EventLoopGroup workerGroup = new NioEventLoopGroup();
		bstrap = new Bootstrap();
		bstrap.group(workerGroup);
		bstrap.channel(NioSocketChannel.class);
		bstrap.option(ChannelOption.SO_KEEPALIVE, true);
		bstrap.handler(new ChannelInitializer<SocketChannel>() {
			@Override
			public void initChannel(SocketChannel ch) throws Exception {
				// 客户端接收到的是httpResponse响应，所以要使用HttpResponseDecoder进行解码
				ch.pipeline().addLast(new HttpResponseDecoder());
				// 客户端发送的是httprequest，所以要使用HttpRequestEncoder进行编码
				ch.pipeline().addLast(new HttpRequestEncoder());
				ch.pipeline().addLast(new HttpClientHandler());
			}
		});
		initConnPool();
	}

	/**
	 * 初始化连接池
	 * @throws Exception
	 */
	private void initConnPool() throws Exception {
		for (int i = 0; i < connConfig.poolSize; i++) {
			ChannelFuture future = bstrap.connect(connConfig.host, connConfig.port).sync();
			Channel channel = future.channel();
			// 计数器
			channel.attr(AttributeKey.newInstance(Result.COUNTER)).set(new AtomicLong());
			// result map
			ConcurrentHashMap<Long, Result> resultMap = new ConcurrentHashMap<Long, Result>(100, 0.75f, 16);
			channel.attr(AttributeKey.newInstance(Result.RESULT_MAP)).set(resultMap);
			connectionPool.add(future);
		}
	}

	public ConnectionFactory setConnConfig(ConnectionConfig connConfig) {
		this.connConfig = connConfig;
		return this;
	}

	
}
