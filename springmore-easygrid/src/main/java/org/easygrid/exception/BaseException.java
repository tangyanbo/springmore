package org.easygrid.exception;

/**
 * BaseException
 * @author 唐延波
 * @date 2015年8月11日
 */
public class BaseException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public BaseException(Throwable root) {
		super(root);
	}

	public BaseException(String string, Throwable root) {
		super(string, root);
	}

	public BaseException(String s) {
		super(s);
	}
}
