package org.springmore.rpc.mina.server;

import java.nio.ByteBuffer;
import java.util.Date;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;

/**
 * Handler
 * @author 唐延波
 * @date 2015-2-22
 *
 */
public class ByteHandler extends IoHandlerAdapter
{
	/**
	 * 有异常时执行方法
	 */
    @Override
    public void exceptionCaught( IoSession session, Throwable cause ) throws Exception
    {
        cause.printStackTrace();
    }

    /**
     * 接收消息时调用
     */
    @Override
    public void messageReceived( IoSession session, Object message ) throws Exception
    {
    	Class<? extends Object> class1 = message.getClass();
    	System.out.println(class1);
    	IoBuffer buf = (IoBuffer) message;
		ByteBuffer bf = buf.buf();
		byte[] data = new byte[bf.limit()];
		bf.get(data);
		
        //向输出流中写东西
        session.write(IoBuffer.wrap(data));
        System.out.println("Message written...");
    }

    @Override
    public void sessionIdle( IoSession session, IdleStatus status ) throws Exception
    {
        System.out.println( "IDLE " + session.getIdleCount( status ));
    }
}