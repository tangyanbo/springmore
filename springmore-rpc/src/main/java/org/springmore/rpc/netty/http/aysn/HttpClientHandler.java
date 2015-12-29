package org.springmore.rpc.netty.http.aysn;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.http.HttpContent;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.util.AttributeKey;

/**
 * HttpClientInboundHandler
 * @author 唐延波
 * @date 2015年7月17日
 */
public class HttpClientHandler extends ChannelHandlerAdapter {

    @SuppressWarnings("unchecked")
	@Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        if (msg instanceof HttpResponse){
            HttpResponse response = (HttpResponse) msg;
            //System.out.println("CONTENT_TYPE:" + response.headers().get(HttpHeaderNames.CONTENT_TYPE));
        }
        if(msg instanceof HttpContent){
            HttpContent content = (HttpContent)msg;
            ByteBuf buf = content.content();
            Result<String> result = (Result<String>)ctx.attr(AttributeKey.valueOf(Result.RESULT)).get();
            String contentString = buf.toString(io.netty.util.CharsetUtil.UTF_8);
            result.set(contentString);
            buf.release();
        }
    }
}