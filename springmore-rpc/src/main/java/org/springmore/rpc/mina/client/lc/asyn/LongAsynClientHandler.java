package org.springmore.rpc.mina.client.lc.asyn;

import java.util.concurrent.ConcurrentHashMap;

import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springmore.rpc.mina.client.MessageWrapper;
import org.springmore.rpc.mina.client.Result;

/**
 * LongAsynClientHandler
 * @author 唐延波
 * @date 2015年6月26日
 */
public class LongAsynClientHandler extends IoHandlerAdapter {
	
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

	@SuppressWarnings("unchecked")
	@Override
	public void messageReceived(IoSession session, Object message)
			throws Exception {
		MessageWrapper messageWrapper = (MessageWrapper)message;
		ConcurrentHashMap<Long, AsynResult> resultMap = (ConcurrentHashMap<Long, AsynResult>)
				session.getAttribute(Result.RESULT_MAP);
		AsynResult result = resultMap.remove(messageWrapper.getId());
		result.set(messageWrapper.getMessage());
	}

	
}
