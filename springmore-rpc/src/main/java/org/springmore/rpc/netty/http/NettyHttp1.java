package org.springmore.rpc.netty.http;

import java.net.URI;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.DefaultFullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpRequestEncoder;
import io.netty.handler.codec.http.HttpResponseDecoder;
import io.netty.handler.codec.http.HttpVersion;

/**
 * HttpClient
 * @author 唐延波
 * @date 2015年7月17日
 */
public class NettyHttp1 {
	
	public void connect(String host, int port) throws Exception {
		EventLoopGroup workerGroup = new NioEventLoopGroup();

		try {
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
			ChannelFuture f = b.connect(host, port).sync();
			

			//URI uri = new URI("http://127.0.0.1:8844");
			
			// 发送http请求
			for(int i=0;i<100;i++){
				
				DefaultFullHttpRequest request = createRequest(f,host);
				f.channel().write(request);
				f.channel().flush();
				Thread.sleep(100);
			}
			
			/*f.channel().flush();
			f.channel().closeFuture().sync();*/
		} finally {
			workerGroup.shutdownGracefully();
		}

	}
	
	private DefaultFullHttpRequest createRequest(ChannelFuture f,String host) throws Exception{
		URI uri = new URI("http://localhost:8888/paydemo/noticeAccept");
		
		String msg = "Are you ok?";
		DefaultFullHttpRequest request = new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.POST,
				uri.toASCIIString(), Unpooled.wrappedBuffer(msg.getBytes("UTF-8")));

		// 构建http请求
		request.headers().set(HttpHeaderNames.HOST, host);
		request.headers().set(HttpHeaderNames.CONNECTION, HttpHeaderNames.KEEP_ALIVE);
		request.headers().setInt(HttpHeaderNames.CONTENT_LENGTH, request.content().readableBytes());
		return request;
	}

	public static void main(String[] args) throws Exception {
		NettyHttp1 client = new NettyHttp1();
		client.connect("localhost", 8888);
	}
}