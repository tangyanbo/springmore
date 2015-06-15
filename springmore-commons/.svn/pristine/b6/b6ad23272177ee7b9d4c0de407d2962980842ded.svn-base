package org.springmore.commons.io;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.SocketException;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * ftp工具类
 * 
 * @author 唐延波
 * @date 2015-6-10
 */
public class FTPUtil {

	/**
	 * 日志 .
	 */
	private Logger logger = LoggerFactory.getLogger(this.getClass());

	/**
	 * ftpClient .
	 */
	private FTPClient ftpClient;

	private FTPUtil() {

	}

	public static FTPUtil newInstance() {
		return new FTPUtil();
	}

	/**
	 * 连接ftp服务器
	 * @param host 主机ip或域名
	 * @param port 端口
	 * @param username 登录用户名
	 * @param password 登录密码
	 * @throws Exception
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public void connect(String host, int port, String username, String password) throws Exception {
		ftpClient = new FTPClient();
		ftpClient.connect(host, port);
		ftpClient.login(username, password);
		ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
		int reply = ftpClient.getReplyCode();
		if (!FTPReply.isPositiveCompletion(reply)) {
			ftpClient.disconnect();
		}
	}

	/**
	 * 上传文件
	 * @param fileName 上传文件的绝对路径
	 * @throws IOException
	 * @author 唐延波
	 * @date 2015-6-10
	 */
	public void upload(String fileName) throws IOException {
		File file = new File(fileName);
		if (file.exists()) {
			FileInputStream fis;
			fis = new FileInputStream(file);
			ftpClient.storeFile(file.getName(), fis);
			fis.close();
		} else {
			logger.info("文件" + fileName + "不存在,请确认 ...");
		}
	}
	
	public void close() throws IOException{
		ftpClient.disconnect();
	}

	// public static void main(String[] args) throws Exception{
	// FtpUtil t = new FtpUtil();
	// String fileName = "F:/bypay/200402090000001_20140925_3010_001.req";
	// String path = "/home/unionpayGZ/download/20140923/";
	// t.upload(fileName, path);
	// }

}
