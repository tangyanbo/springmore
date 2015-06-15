package org.springmore.commons.io;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.junit.Test;

public class FileUtilTest {

	@Test
	public void test() throws IOException {
		File srcDir = new File("srcDir");
		File destDir = new File("destDir");
		FileUtil.copyDirectory(srcDir, destDir);
		
		File dir = new File("dir");
		FileUtil.forceMkdir(dir);
		
		File file = new File("file");
		List<String> readLines = FileUtil.readLines(file);
	}

}
