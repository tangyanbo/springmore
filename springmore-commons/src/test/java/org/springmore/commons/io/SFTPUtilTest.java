package org.springmore.commons.io;


import java.io.File;

import org.junit.Test;

public class SFTPUtilTest {

	@Test
	public void 上传不设置保存文件名() {
		SFTPUtil sftp = new SFTPUtil();
		File local = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		sftp.setLocal(local);
		sftp.uploadFile();
	}

	@Test
	public void 上传并设置保存文件名() {
		SFTPUtil sftp = new SFTPUtil();
		File local = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		sftp.setLocal(local);
		sftp.setRemote("upload.txt");
		sftp.uploadFile();
	}
	
	@Test
	public void 上传并设置保存路径() {
		SFTPUtil sftp = new SFTPUtil();
		File local = new File("C:\\Users\\bypay\\Desktop\\CopyOnWriteArrayListDemo.java");
		sftp.setLocal(local);
		sftp.setRemote("upload.txt");
		sftp.setRemotePath("/home/test");
		sftp.uploadFile();
	}
	
	@Test
	public void 下载文件(){
		SFTPUtil sftp = new SFTPUtil();
		File local = new File("C:\\Users\\bypay\\Desktop\\download.java");
		sftp.setLocal(local);
		sftp.setRemote("upload.txt");
		sftp.setRemotePath("/home/test");
		sftp.download();
	}
}
