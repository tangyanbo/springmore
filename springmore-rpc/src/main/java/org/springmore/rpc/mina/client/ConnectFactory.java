package org.springmore.rpc.mina.client;

import org.apache.mina.core.future.ConnectFuture;
import org.apache.mina.filter.codec.ProtocolCodecFactory;
import org.springframework.beans.factory.InitializingBean;

/**
 * 连接工厂接口
 * @author bypay
 *
 */
public interface ConnectFactory extends InitializingBean{
	
	int DEFUALT_CONNECT_TIMEOUT_MILLIS = 20000;

	int DEFUALT_READ_BUFFER_SIZE = 2048;
	
	
	
	/**
	 * 关闭连接
	 * @param connection
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	void close(ConnectFuture connection) throws InterruptedException;
	
	/**
	 * 获得连接
	 * @return
	 * @throws InterruptedException
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	ConnectFuture getConnection() throws InterruptedException;
	
	/**
	 * 关闭工厂并释放资源
	 * 
	 * @author 唐延波
	 * @date 2015年6月25日
	 */
	void shutdown();
	
	void afterPropertiesSet() throws Exception;
	
	void setHost(String host);
	
	void setPort(int port);
	
	void setConnectTimeoutMillis(long connectTimeoutMillis);
	
	void setProtocolCodecFactory(ProtocolCodecFactory protocolCodecFactory);
	
	void setReadBufferSize(String readBufferSize);
	
	/**
	 * 创建工厂
	 * 
	 * @author 唐延波
	 * @date 2015年7月9日
	 */
	void build();
}
