package org.springmore.rpc.mina.server;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.charset.Charset;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.Executors;
import org.apache.mina.core.service.IoAcceptor;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.serialization.ObjectSerializationCodecFactory;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.filter.executor.ExecutorFilter;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;


public class MinaServer {

	private IoAcceptor acceptor ;
	
	public MinaServer() {
		acceptor = new NioSocketAcceptor();
		//设置日志过滤器
		acceptor.getFilterChain().addLast("logger", new LoggingFilter());
		//设置编码器
		acceptor.getFilterChain().addLast("codec", new ProtocolCodecFilter(new ObjectSerializationCodecFactory()));
		
		
		acceptor.getFilterChain().addLast("threadPool",new ExecutorFilter(Executors.newCachedThreadPool()));
		//设置读缓冲
        acceptor.getSessionConfig().setReadBufferSize(2048*2048);
        //设置心跳频率
        acceptor.getSessionConfig().setIdleTime( IdleStatus.BOTH_IDLE, 30);
		//设置Handler
		acceptor.setHandler(new ObjectHandler());
		try {
			Set<SocketAddress> addresses = new HashSet<SocketAddress>();
			//此处的host地址需注意，需要填写主机对外的ip地址或域名，不可用localhost
			//服务器测试地址：192.168.1.226 18886
			addresses.add(new InetSocketAddress("localhost", 18886));
			acceptor.bind(addresses);
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
		System.out.println("--------------------------------------------------");
		System.out.println("Server Started");
		System.out.println("--------------------------------------------------");
	}
	
	public static void main(String[] args) {
		MinaServer server = new MinaServer();
		
	}
}
