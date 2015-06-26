package org.springmore.rpc.mina.client;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.core.session.IoSession;
import org.springmore.rpc.mina.client.lc.asyn.AsynResult;

/**
 * MinaTemplate
 * @author 唐延波
 * @date 2015-6-24
 */
public class MinaTemplate {

	/**
	 * conncet factory
	 */
	private ConnectFactory connectFactory;
	
	/**
	 * 同步传输对象
	 * @param message
	 * @return
	 * @author 唐延波
	 * @throws InterruptedException 
	 * @date 2015-6-24
	 */
	@SuppressWarnings("unchecked")
	public <T> T sengObject(T message) throws InterruptedException{
		//获取tcp连接
		ConnectFuture connection = connectFactory.getConnection();
		Result result = ResultUtil.getResult(connectFactory, connection);
		IoSession session = connection.getSession();		
		//发送信息
		if(result instanceof AsynResult){
			ConcurrentHashMap<Long, Result> resultMap = (ConcurrentHashMap<Long, Result>)
					session.getAttribute(Result.RESULT_MAP);
			AtomicLong counter = (AtomicLong) session.getAttribute(Result.COUNTER);
			long count = counter.incrementAndGet();
			if(count>1000000){
				counter.set(0);
			}
			resultMap.put(count, (Result)result);
			MessageWrapper wrapper = new MessageWrapper();
			wrapper.setMessage(message);
			wrapper.setId(count);
			session.write(wrapper);			
		}else{
			session.setAttribute(Result.RESULT, result);
			if(message instanceof byte[]){
				byte[] msg = ( byte[])message;
				session.write(IoBuffer.wrap(msg));
			}else{
				session.write(message);
			}
		}						
		//同步阻塞获取响应
		T returnMsg = result.get();
		//此处并不是真正关闭连接，而是将连接放回连接池
		connectFactory.close(connection);
		return returnMsg;
	}
	
	public void setConnectFactory(ConnectFactory connectFactory) {
		this.connectFactory = connectFactory;
	}
	
}
