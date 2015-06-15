package org.springmore.commons.io;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import org.apache.commons.io.IOUtils;

/**
 * 资源工具类，io等
 * 继承IOUtils所有功能
 * @author 唐延波
 * @date 2013-11-29
 */
public class ResourceUtil extends IOUtils{

	/**
	 * 根据给定的classpath相对路径
	 * 将资源读取到InputStream
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param name classpath相对路径
	 * @return
	 */
	public static InputStream getResourceAsStream(String name) {
		return Thread.currentThread().getContextClassLoader()
				.getResourceAsStream(name);
	}

	/**
	 * 根据给定的classpath相对路径
	 * 将资源读取到URL
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param name classpath相对路径
	 * @return
	 */
	public static URL getResource(String name) {
		return Thread.currentThread().getContextClassLoader().getResource(name);
	}

	/**
	 * 关闭输出流
	 * @author 唐延波
	 * @date 2013-11-29
	 */
	public static void close(OutputStream... outputStreams) {
		for (OutputStream outputStream : outputStreams) {
			if (outputStream != null) {
				try {
					outputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	
	/**
	 * 关闭输入流
	 * @author 唐延波
	 * @date 2013-11-29
	 */
	public static void close(InputStream... inputStreams) {
		for (InputStream inputStream : inputStreams) {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	
}
