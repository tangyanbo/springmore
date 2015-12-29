package org.easygrid.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

import jxl.write.WritableWorkbook;

/**
 * 资源（文件流）
 * 
 * @author 唐延波
 * @date 2013-11-29
 */
public class ResourceUtil {

	/**
	 * @author Rambo
	 * @param name
	 *            classpath
	 * @return
	 */
	public static InputStream getResourceAsStream(String name) {
		return Thread.currentThread().getContextClassLoader()
				.getResourceAsStream(name);
	}

	/**
	 * @author Rambo
	 * @param name
	 *            classpath
	 * @return
	 */
	public static URL getResource(String name) {
		return Thread.currentThread().getContextClassLoader().getResource(name);
	}

	/**
	 * 关闭输出流
	 * 
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
	 * 
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
	
	public static void close(WritableWorkbook... outputStreams) {
		for (WritableWorkbook wwb : outputStreams) {
			if (wwb != null) {
				try {
					wwb.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
