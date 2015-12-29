package org.easygrid.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

@Results({
	@Result(name=DownloadAction.DOWNLAD,
			type="stream",
			params={
				"contentType","application/octet-stream"
				,"inputName","file"
				,"contentDisposition","attachment;filename=${fileFileName}"
	})
})
public class DownloadAction extends BaseAction {
	
	private static final long serialVersionUID = -456789876757657L;

	final static String DOWNLAD = "download";
	
	protected InputStream file;
	
	protected String fileName;
	
	protected String fileContentType;

	public InputStream getFile() {
		return file;
	}

	public String getFileFileName() {
		return fileName;
	}

	public String getFileContentType() {
		return fileContentType;
	}
	
	public void setFile(File file) throws FileNotFoundException{
		this.file = new FileInputStream(file);
	}
	
	public void setFileInputStream(InputStream file) {
		this.file = file;
	}

	
	/**
	 * struts upload auto call
	 * @author Rambo
	 * @param fileFileName
	 */
	public void setFileFileName(String fileFileName) {
		this.fileName = fileFileName;
	}
	/**
	 * 设置fileFileName的值<br>
	 * 调用URLEncoder编码后再设置
	 * @author Rambo
	 * @param fileName
	 */
	public void setFileName(String fileName){
		try {
			setFileFileName(java.net.URLEncoder.encode(fileName, "utf-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	public void setFileContentType(String fileContentType) {
		this.fileContentType = fileContentType;
	}
}
