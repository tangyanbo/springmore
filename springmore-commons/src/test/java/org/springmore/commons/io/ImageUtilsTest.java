package org.springmore.commons.io;

import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;

import org.junit.Test;

public class ImageUtilsTest {

	
	@Test
	public void 按比例缩放() throws IOException {
		File src = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a1.jpg");
		File dest = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a2.jpg");
		ImageUtils.scale(src, dest, 10, true);
	}

	/**
	 * 不按比例
	 * @author 唐延波
	 * @date 2015-6-12
	 * @throws IOException
	 */
	@Test
	public void 按宽度和高度缩放() throws IOException {
		File src = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a1.jpg");
		File dest = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a2.jpg");
		ImageUtils.scale(src, dest, 1000,1000,true);
	}

	@Test
	public void 按宽度压缩() {
		File src = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a.jpg");
		File dest = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a2.jpg");
		ImageUtils.scaleByWidth(src, dest, 1200);
	}

	@Test
	public void 图片切割() {
		File src = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a.jpg");
		File dest = new File("C:\\Users\\bypay\\Desktop\\智派平台入件资料\\a3.jpg");
		ImageUtils.cut(src, dest, 0, 0, 3000, 3000);
	}

	@Test
	public void testScaleByteArrayIntIntBoolean() {
		fail("Not yet implemented");
	}

	@Test
	public void testCut() {
		fail("Not yet implemented");
	}

	@Test
	public void testCut2() {
		fail("Not yet implemented");
	}

	@Test
	public void testCut3() {
		fail("Not yet implemented");
	}

	@Test
	public void testConvert() {
		fail("Not yet implemented");
	}

	@Test
	public void testGray() {
		fail("Not yet implemented");
	}

	@Test
	public void testPressText() {
		fail("Not yet implemented");
	}

	@Test
	public void testPressText2() {
		fail("Not yet implemented");
	}

	@Test
	public void testPressImage() {
		fail("Not yet implemented");
	}

}
