package org.springmore.commons.io;

import java.io.File;
import java.io.IOException;
import java.net.SocketException;
import java.util.Properties;

import org.apache.commons.net.ftp.FTPSClient;
import org.junit.Test;

public class FTPUtilTest {
	
	

	@Test
	public void 上传并设置保存文件名() throws Exception {
		FTPUtil ftpUtil = new FTPUtil();		
		File file = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		ftpUtil.setRemote("upload.txt");
		ftpUtil.setLocal(file);
		ftpUtil.upload();
	}


	@Test
	public void 上传不设置保存文件名() throws Exception {
		FTPUtil ftpUtil = new FTPUtil();
		File file = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		ftpUtil.setLocal(file);
		ftpUtil.upload();
	}
	
	@Test
	public void 上传并设置保存路径() throws Exception {
		FTPUtil ftpUtil = new FTPUtil();
		File file = new File("C:\\Users\\Administrator\\Desktop\\唐延波51.doc");
		ftpUtil.setRemote("upload.doc");
		ftpUtil.setRemotePath("/user/");
		ftpUtil.setLocal(file);
		ftpUtil.upload();
	}
	
	
	@Test
	public void 下载文件() throws Exception {
		FTPUtil ftpUtil = new FTPUtil();
		File file = new File("C:\\Users\\Administrator\\Desktop\\dowload.doc");
		ftpUtil.setRemote("upload.doc");
		ftpUtil.setRemotePath("/user/");
		ftpUtil.setLocal(file);
		ftpUtil.download();
	}
	
	@Test
	public void 自定义连接信息() throws Exception {
		FTPUtil ftpUtil = new FTPUtil("ftpConfig.properties");
		File file = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		ftpUtil.setRemote("upload.txt");
		ftpUtil.setLocal(file);
		ftpUtil.upload();
	}
	
	@Test
	public void 自定义连接信息2() throws Exception {
		Properties properties = PropertiesUtil.getProperties("ftpConfig.properties");
		FTPUtil ftpUtil = new FTPUtil(properties);
		File file = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		ftpUtil.setRemote("upload.txt");
		ftpUtil.setLocal(file);
		ftpUtil.upload();
	}
	
	
}
