package org.springmore.commons.exception;

/**
 * CommonsException
 * @author 唐延波
 * @date 2015-6-9
 */
public class CommonsException extends RuntimeException {

	private static final long serialVersionUID = 699978142734398943L;

	public CommonsException() {
		super();
	}

	public CommonsException(String message, Throwable cause) {
		super(message, cause);
	}
	
	public CommonsException(Throwable cause) {
		super(cause);
	}

	public CommonsException(String message) {
		super(message);
	}
}
