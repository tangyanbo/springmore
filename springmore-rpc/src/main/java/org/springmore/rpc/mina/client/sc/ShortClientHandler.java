package org.springmore.rpc.mina.client.sc;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springmore.rpc.mina.client.Result;

/**
 * 适用于ShortConnectFactory
 * @author 唐延波
 * @date 2015年6月26日
 */
public class ShortClientHandler extends IoHandlerAdapter {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Override
	public void sessionCreated(IoSession session) {
		log.info("sessionCreated: session 创建成功!");
	}

	@Override
	public void sessionClosed(IoSession session) throws Exception {
		log.info("sessionClosed: 一个连接关闭!");
		session.close(true);
	}

	@Override
	public void sessionOpened(IoSession session) throws Exception {
		log.info("sessionOpened: session 开启成功!");
	}

	@Override
	public void sessionIdle(IoSession session, IdleStatus status) {
		System.out.println("sessionIdle: sessionIdle");
	}

	@Override
	public void exceptionCaught(IoSession session, Throwable cause) {
		log.info("exceptionCaught:");
		cause.printStackTrace();
		session.close(true);
	}

	@Override
	public void messageReceived(IoSession session, Object message)
			throws Exception {
		Result result = (Result)session.getAttribute(Result.SESSION_KEY);
		session.close(true);
		result.set(message);
	}

	
}
