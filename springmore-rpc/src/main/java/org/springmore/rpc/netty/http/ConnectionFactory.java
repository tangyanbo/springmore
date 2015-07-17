package org.springmore.rpc.netty.http;

import java.net.URI;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpRequestEncoder;
import io.netty.handler.codec.http.HttpResponseDecoder;

/**
 * ConnectionFactory
 * 
 * @author 唐延波
 * @date 2015年7月17日
 */
public class ConnectionFactory {

	/**
	 * 连接池默认初始化连接数量
	 */
	private final static int DEFAULT_POOL_SIZE = 10;

	/**
	 * 线程池大小
	 */
	private int poolSize = DEFAULT_POOL_SIZE;

	private URI uri;

	private ConnectionFactory() {

	}

	/**
	 * 获取工厂实例,此处为单例
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

		return null;
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
		Bootstrap b = new Bootstrap();
		b.group(workerGroup);
		b.channel(NioSocketChannel.class);
		b.option(ChannelOption.SO_KEEPALIVE, true);
		b.handler(new ChannelInitializer<SocketChannel>() {
			@Override
			public void initChannel(SocketChannel ch) throws Exception {
				// 客户端接收到的是httpResponse响应，所以要使用HttpResponseDecoder进行解码
				ch.pipeline().addLast(new HttpResponseDecoder());
				// 客户端发送的是httprequest，所以要使用HttpRequestEncoder进行编码
				ch.pipeline().addLast(new HttpRequestEncoder());
				ch.pipeline().addLast(new HttpClientHandler());
			}
		});

		// Start the client.
		ChannelFuture future = b.connect(uri.getHost(), uri.getPort()).sync();
		initConnection(poolSize);
	}

	private void initConnection(int size) {

	}

	public void setPoolSize(int poolSize) {
		this.poolSize = poolSize;
	}

	public void setUri(URI uri) {
		this.uri = uri;
	}

}
