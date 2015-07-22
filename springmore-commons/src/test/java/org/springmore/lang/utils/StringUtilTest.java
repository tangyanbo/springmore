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
	
	@Test
	public void test(){
		String decodeUnicode = decodeUnicode("\u4e0a\u6d77");
		System.out.println(decodeUnicode);
	}
	
	public static String decodeUnicode(String theString) {
		 
        char aChar;
 
        int len = theString.length();
 
        StringBuffer outBuffer = new StringBuffer(len);
 
        for (int x = 0; x < len;) {
 
            aChar = theString.charAt(x++);
 
            if (aChar == '\\') {
 
                aChar = theString.charAt(x++);
 
                if (aChar == 'u') {
 
                    // Read the xxxx
 
                    int value = 0;
 
                    for (int i = 0; i < 4; i++) {
 
                        aChar = theString.charAt(x++);
 
                        switch (aChar) {
 
                        case '0':
 
                        case '1':
 
                        case '2':
 
                        case '3':
 
                        case '4':
 
                        case '5':
 
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            value = (value << 4) + aChar - '0';
                            break;
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                            value = (value << 4) + 10 + aChar - 'a';
                            break;
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                            value = (value << 4) + 10 + aChar - 'A';
                            break;
                        default:
                            throw new IllegalArgumentException(
                                    "Malformed   \\uxxxx   encoding.");
                        }
 
                    }
                    outBuffer.append((char) value);
                } else {
                    if (aChar == 't')
                        aChar = '\t';
                    else if (aChar == 'r')
                        aChar = '\r';
 
                    else if (aChar == 'n')
 
                        aChar = '\n';
 
                    else if (aChar == 'f')
 
                        aChar = '\f';
 
                    outBuffer.append(aChar);
 
                }
 
            } else
 
                outBuffer.append(aChar);
 
        }
 
        return outBuffer.toString();
 
    }

}
