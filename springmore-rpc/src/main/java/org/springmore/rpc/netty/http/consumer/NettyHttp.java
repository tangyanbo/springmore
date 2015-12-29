package org.springmore.rpc.netty.http.consumer;

import static org.springmore.commons.codec.Charsets.UTF_8;

import java.net.URI;

import org.springmore.rpc.netty.exception.NettyHttpException;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.handler.codec.http.DefaultFullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpVersion;

/**
 * NettyHttp
 * 
 * @author 唐延波
 * @date 2015年7月17日
 */
public class NettyHttp {
		
	private ConnectionConfig connConfig;
	
	private ConnectionFactory factory;
	
	private NettyHttp(){
		
	}
	
	/**
	 * 获取NettyHttp实例
	 * 
	 * @return
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	public static NettyHttp custom() {
		NettyHttp nettyHttp = new NettyHttp();
		return nettyHttp;
	}
	
	/**
	 * 完成初始化
	 * @return
	 */
	public NettyHttp build() {
		try {
			factory = ConnectionFactory.custom()
					.setConnConfig(connConfig).build();	
		} catch (Exception e) {
			throw new NettyHttpException(e);
		}
		return this;
	}
	
	/**
	 * 连接配置
	 * @param connConfig
	 * @return
	 */
	public NettyHttp setConnConfig(ConnectionConfig connConfig) {
		this.connConfig = connConfig;
		return this;
	}

	/**
	 * post提交 默认utf-8编码
	 * 
	 * @param url
	 * @param content
	 * @return
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	public String post(String url, String content) {
		try {
			Result result = new AsynResult();
			ChannelFuture channelFuture = factory.getChannelFuture();
			DefaultFullHttpRequest request = createRequest(channelFuture,url,content);
			channelFuture.channel().writeAndFlush(request);
		} catch (Exception e) {
			throw new NettyHttpException(e);
		}
		return null;
	}
	
	
	/**
	 * 构建http请求
	 * 
	 * @param future
	 * @param url
	 * @param content 内容
	 * @return
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	private DefaultFullHttpRequest createRequest(ChannelFuture future, String url, String content) throws Exception {
		URI uri = new URI(url);
		String host = uri.getHost();
		DefaultFullHttpRequest request = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.POST,
				uri.toASCIIString(), Unpooled.wrappedBuffer(content.getBytes(UTF_8)));
		request.headers().set(HttpHeaderNames.HOST, host);
		request.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
		request.headers().setInt(HttpHeaderNames.CONTENT_LENGTH, request.content().readableBytes());
		return request;
	}
}
