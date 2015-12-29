package org.springmore.rpc.mina.server;

import java.io.IOException;
import java.net.InetSocketAddress;

import org.apache.mina.core.service.IoAcceptor;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;



/**
 * 最简单的Mina Server
 * @author 唐延波
 * @date 2015-2-22
 *
 */
public class ByteServer {

	private static final int PORT = 18886;
	
	private static final String HOST = "localhost";

	public static void main(String[] args) throws IOException {
		// 接收者
		IoAcceptor acceptor = new NioSocketAcceptor();
		//设置读缓冲,传输的内容必须小于此缓冲
		acceptor.getSessionConfig().setReadBufferSize(2048);
		

		//设置Handler
		acceptor.setHandler(new ByteHandler());

		// 绑定端口,启动服务，并开始处理远程客户端请求
		acceptor.bind(new InetSocketAddress(HOST,PORT));
		System.out.println("服务端启动成功");
	}

}
