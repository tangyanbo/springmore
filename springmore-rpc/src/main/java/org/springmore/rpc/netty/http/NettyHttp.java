package org.springmore.rpc.netty.http;

import static org.springmore.commons.codec.Charsets.UTF_8;

import java.net.URI;

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
	
	private ChannelFuture channelFuture;
	
	private int poolSize;
	
	private String url;
	
	public NettyHttp(){
		init();
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
			DefaultFullHttpRequest request = createRequest(channelFuture,url,content);
			channelFuture.channel().writeAndFlush(request);			
		} catch (Exception e) {
			e.printStackTrace();
			throw new NettyHttpException(e);
		}
		return null;
	}
	
	/**
	 * init
	 * 
	 * @author 唐延波
	 * @date 2015年7月17日
	 */
	private void init(){
		
		channelFuture = ConnectionFactory.custom().setPoolSize(poolSize);
				create().getChannelFuture();
	}

	/**
	 * createRequest
	 * 
	 * @param future
	 * @param url
	 * @param content
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
		// 构建http请求
		request.headers().set(HttpHeaderNames.HOST, host);
		request.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderValues.KEEP_ALIVE);
		request.headers().setInt(HttpHeaderNames.CONTENT_LENGTH, request.content().readableBytes());
		return request;
	}
}
