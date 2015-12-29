package org.springmore.rpc.netty.http.aysn;

import static org.springmore.commons.codec.Charsets.UTF_8;

import java.net.URI;
import org.springmore.rpc.netty.exception.NettyHttpException;
import org.springmore.rpc.netty.pool.ChannelFuturePool;

import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.handler.codec.http.DefaultFullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.util.AttributeKey;

/**
 * NettyHttp
 * 
 * @author 唐延波
 * @date 2015年7月17日
 */
public class NettyHttp {
			
	private ChannelFuturePool channelFuturePool;
	
	private AttributeKey<Object> resultKey = AttributeKey.newInstance(Result.RESULT);
	
	public NettyHttp(ChannelFuturePool channelFuturePool){
		this.channelFuturePool = channelFuturePool;
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
			Result<String> result = new AsynResult<String>();			
			ChannelFuture channelFuture = channelFuturePool.getResource();
			DefaultFullHttpRequest request = createRequest(channelFuture,url,content);
			Channel channel = channelFuture.channel();
			channel.attr(resultKey).set(result);			
			channel.writeAndFlush(request);			
			String resultContent = result.get();
			channelFuturePool.returnResource(channelFuture);
			return resultContent;
		} catch (Exception e) {
			throw new NettyHttpException(e);
		}
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
	
	public void destory(){
		channelFuturePool.destroy();
	}
}
