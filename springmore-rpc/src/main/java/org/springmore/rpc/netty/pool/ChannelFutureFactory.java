package org.springmore.rpc.netty.pool;

import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.PooledObjectFactory;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.springmore.rpc.netty.http.aysn.HttpClientHandler;

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
 * ChannelFutureFactory
 * @author 唐延波
 * @date 2015年7月18日
 */
public class ChannelFutureFactory implements PooledObjectFactory<ChannelFuture>{
	
	private HostAndPort hostAndPort;
	
	private Bootstrap bstrap;
	
	public ChannelFutureFactory(final String host, final int port){
		hostAndPort = new HostAndPort(host,port);
		init();
	}
	
	/**
	 * 初始化
	 * 
	 * @author 唐延波
	 * @throws Exception
	 * @date 2015-6-24
	 */
	private void init() {
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
	}

	/**
	 * 保持连接的活跃，类似于心跳功能
	 */
	@Override
	public void activateObject(PooledObject<ChannelFuture> pooledObject) throws Exception {
		//TODO
		//保持连接的活跃，类似于心跳功能
	}

	/**
	 * 真正关闭连接
	 */
	@Override
	public void destroyObject(PooledObject<ChannelFuture> pooledObject) throws Exception {
		ChannelFuture channel = pooledObject.getObject();
		channel.channel().close();
	}

	/**
	 * 创建新的连接
	 */
	@Override
	public PooledObject<ChannelFuture> makeObject() throws Exception {
		ChannelFuture future = bstrap.connect(hostAndPort.host(), hostAndPort.port()).sync();
		return new DefaultPooledObject<ChannelFuture>(future);
	}

	@Override
	public void passivateObject(PooledObject<ChannelFuture> pooledObject) throws Exception {
		//do nothing
	}

	/**
	 * 验证连接是否关闭
	 */
	@Override
	public boolean validateObject(PooledObject<ChannelFuture> pooledObject) {
		ChannelFuture channel = pooledObject.getObject();
		return channel.channel().isActive();
	}

}
