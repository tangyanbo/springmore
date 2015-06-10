package org.springmore.commons.security;

import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * MD5加密
 * 依赖与DigestUtils完成md5加密功能
 * @author 唐延波
 * @date 2015-6-9
 */
public class Md5Util {
    
	/**
	 * md5加密小写
	 * 默认是utf-8格式
	 * 返回hex String
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param source
	 * @return
	 */
    public static String md5Hex(String data){
    	return DigestUtils.md5Hex(data);
    }
    
    
    /**
     * 加密字节并返回hex字符串
     * @author 唐延波
     * @date 2015-6-9
     * @param byteData
     * @return
     */
    public static String md5Hex(byte[] byteData){
    	return DigestUtils.md5Hex(byteData);
    }
    
    /**
     * 加密资源流并返回hex String
     * @author 唐延波
     * @date 2015-6-9
     * @param data
     * @return
     * @throws IOException
     */
    public static String md5Hex(InputStream data) throws IOException{
    	return DigestUtils.md5Hex(data);
    }
    
    /**
     * 加密并返回字节
     * @author 唐延波
     * @date 2015-6-9
     * @param byteData
     * @return
     */
    public static byte[] md5(byte[] byteData){
    	return DigestUtils.md5(byteData);
    }
    
    /**
     * 加密并返回字节
     * @author 唐延波
     * @date 2015-6-9
     * @param data
     * @return
     */
    public static byte[] md5(String data){
    	return DigestUtils.md5(data);
    }
    
    /**
     * 加密并返回字节
     * @author 唐延波
     * @date 2015-6-9
     * @param data
     * @return
     */
    public static byte[] md5(InputStream data) throws IOException{
    	return DigestUtils.md5(data);
    }
    
}
