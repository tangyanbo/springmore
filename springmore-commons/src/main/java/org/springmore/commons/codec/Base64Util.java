package org.springmore.commons.codec;

import java.io.UnsupportedEncodingException;

/**
 * Base64工具类
 * 继承了apache commons Base64的所有功能
 * @author 唐延波
 * @date 2015-6-9
 */
public class Base64Util extends org.apache.commons.codec.binary.Base64{

	public static String decodeBase64String(String base64String) throws UnsupportedEncodingException{
		byte[] decodeBase64 = decodeBase64(base64String);
		return new String(decodeBase64,"UTF-8");
	}
	
}
