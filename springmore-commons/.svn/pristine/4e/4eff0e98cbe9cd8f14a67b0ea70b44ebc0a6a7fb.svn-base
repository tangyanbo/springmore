package org.springmore.commons.lang;

import org.apache.commons.lang3.StringUtils;

/**
 * <pre>
 * StringUtil 继承了apache commons StringUtils的所有功能 
 * ThreadSafe
 * </pre>
 * @author 唐延波
 * @date 2015-6-8
 */
public class StringUtil extends StringUtils {

	/**
	 * <p>
	 * 检查一个字符集是否是""或者null 
	 * <pre>
	 * StringUtils.isEmpty(null) = true 
	 * StringUtils.isEmpty("") = true
	 * StringUtils.isEmpty(" ") = false 
	 * StringUtils.isEmpty("bob") = false
	 * StringUtils.isEmpty("  bob  ") = false
	 * </pre>	
	 * 如果cs是null 或者"" 则返回true 否则返回false
	 * </p>
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param cs
	 * @return <p>
	 * 如果cs是null 或者"" 则返回true 否则返回false
	 * </p>
	 */
	public static boolean isEmpty(final CharSequence cs) {
		return StringUtils.isEmpty(cs);
	}
	
	/**
     * <p>检查一个字符集不是空字符串且不是null.</p>
     *
     * <pre>
     * StringUtils.isNotEmpty(null)      = false
     * StringUtils.isNotEmpty("")        = false
     * StringUtils.isNotEmpty(" ")       = true
     * StringUtils.isNotEmpty("bob")     = true
     * StringUtils.isNotEmpty("  bob  ") = true
     * </pre>
     *
     * @param cs  the CharSequence to check, may be null
     * @return {@code true} if the CharSequence is not empty and not null    
     */
    public static boolean isNotEmpty(final CharSequence cs) {
    	return StringUtils.isNotEmpty(cs);
    }

	/**
     * <p>检查一个字符集是否是空白 (whitespace), 空字符串 ("") 或者 null.</p>
     * <pre>
     * StringUtils.isBlank(null)      = true
     * StringUtils.isBlank("")        = true
     * StringUtils.isBlank(" ")       = true
     * StringUtils.isBlank("    ")    = true
     * StringUtils.isBlank("bob")     = false
     * StringUtils.isBlank("  bob  ") = false
     * </pre>
     * @param cs  the CharSequence to check, may be null
     * @return {@code true} 字符串是空白 (whitespace), 空字符串 ("") 或者 null
     */
    public static boolean isBlank(final CharSequence cs) {
    	return StringUtils.isBlank(cs);
    }
	
}
