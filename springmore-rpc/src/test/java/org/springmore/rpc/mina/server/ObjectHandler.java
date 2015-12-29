package org.springmore.rpc.mina.server;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;



public class ObjectHandler extends IoHandlerAdapter {
	

	@Override
	public void sessionCreated(IoSession session) {
		//session创建时回调
		System.out.println("Session Created!");
	}

	@Override
	public void sessionClosed(IoSession session) throws Exception {	
		//session关闭时回调
		System.out.println("Session Closed!");
	}

	@Override
	public void sessionOpened(IoSession session) throws Exception {
		//session打开时回调
		System.out.println("Session Opened!");
	}

	@Override
	public void sessionIdle(IoSession session, IdleStatus status) {
		//心跳
		System.out.println("sessionIdle");
	}

	@Override
	public void exceptionCaught(IoSession session, Throwable cause) {
		//异常时回调
		cause.printStackTrace();
		//关闭session
		session.close(true);
	}

	@Override
	public void messageReceived(IoSession session, Object message)
			throws Exception {
		System.out.println("服务端接收："+message);
		session.write(message);
	}
}
