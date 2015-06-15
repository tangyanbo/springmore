package org.springmore.lang.time;

import static org.junit.Assert.fail;

import java.text.ParseException;
import java.util.Date;

import org.junit.Test;
import org.springmore.commons.lang.time.DateUtil;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.math.NumberUtils;
public class DateUtilTest {

	@Test
	public void testParseDate() throws ParseException {
		Date parseDate1 = DateUtil.parseDate("20150609134055", "yyyyMMddHHmmss");
		String date = DateUtil.format(parseDate1, "yyyyMMddHHmmss");
		System.out.println(date);
		System.out.println(parseDate1);
		
		String date2 = DateUtil.format(new Date(), "yyMMdd");
		System.out.println(date2);
		
	}

	@Test
	public void testAddYears() {
		
	}

}
