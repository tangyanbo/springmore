package org.springmore.rpc.netty.exception;

/**
 * NettyHttpException
 * 
 * @author 唐延波
 * @date 2015年7月17日
 */
public class NettyHttpException extends RuntimeException {

	private static final long serialVersionUID = -7965209318068367983L;

	public NettyHttpException() {
		super();
	}

	public NettyHttpException(String message, Throwable cause) {
		super(message, cause);
	}

	public NettyHttpException(Throwable cause) {
		super(cause);
	}

	public NettyHttpException(String message) {
		super(message);
	}
}
