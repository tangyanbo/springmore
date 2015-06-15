package org.springmore.lang.utils;



import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springmore.commons.lang.StringUtil;

public class StringUtilTest {

	/**
	 * IsEmpty
	 * @author 唐延波
	 * @date 2015-6-9
	 */
	@Test
	public void testIsEmpty() {
		Assert.assertTrue(StringUtil.isEmpty(""));
		Assert.assertTrue(StringUtil.isEmpty(null));
		Assert.assertTrue(StringUtil.isBlank(" "));
		Assert.assertTrue(StringUtil.isBlank(""));
		Assert.assertTrue(StringUtil.isBlank(null));
		StringUtils.isEmpty("");
		Assert.assertTrue(StringUtil.isNotEmpty(" "));
		
	}

	@Test
	public void testJoin() {
		String join = StringUtil.join("111", "211");
		System.out.println(join);
		
		String reverse = StringUtil.reverse("abc");
		
	}

}
