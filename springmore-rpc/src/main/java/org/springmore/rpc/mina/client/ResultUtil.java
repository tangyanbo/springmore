package org.springmore.rpc.mina.client;

import org.apache.mina.core.future.ConnectFuture;
import org.springmore.rpc.mina.client.lc.asyn.AsynResult;
import org.springmore.rpc.mina.client.lc.syn.LongConnectFactory;
import org.springmore.rpc.mina.client.lc.syn.LongSynResult;
import org.springmore.rpc.mina.client.sc.ShortConnectFactory;
import org.springmore.rpc.mina.client.sc.ShortResult;

/**
 * result util
 * @author 唐延波
 * @date 2015年6月26日
 */
public class ResultUtil {

	/**
	 * get Result
	 * @param connectFactory
	 * @param connection
	 * @return
	 * @author 唐延波
	 * @date 2015年6月26日
	 */
	public static Result getResult(ConnectFactory connectFactory,ConnectFuture connection){
		Result result = null;
		if (connectFactory instanceof LongConnectFactory) {
			result = new LongSynResult();			
		}else if(connectFactory instanceof ShortConnectFactory){
			result = new ShortResult();
		}else{
			result = new AsynResult();
		}
		if(result != null){
			result.setConnectFactory(connectFactory);
			result.setConnection(connection);
		}
		return result;
	}
}
