package org.springmore.commons.lang.time;

import java.text.ParseException;
import java.util.Date;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;

/**
 * <pre>
 * DateUtil 继承了apache commons DateUtils的所有功能
 * </pre>
 * @author 唐延波
 * @date 2015-6-9
 */
public class DateUtil extends DateUtils{
	
	/**
	 * <pre>
	 * 将一个字符串格式的日期，根据指定的日期格式
	 * 将期转换为Date类型的日期对象.
	 * Note:这里需要强制指定日期格式，目的是要提高代码的运行效率
	 * parsePatterns常用格式
	 * yyyyMMddHHmmss -> 20150609134055 
	 * yyMMdd -> 150609
	 * 其中HH表示24小时制 ,hh则表示12小时制，月份为大写M,分钟为小写m
	 * yyyy-MM-dd HH:mm:ss -> 2015-06-09 13:40:55
	 * yyyy-MM-dd -> 2015-06-09
	 * yy-MM-dd -> 15-06-09
	 * yyyy/MM/dd -> 2015/06/09
	 * yyyy/MM/dd -> 2015/06/09
	 * 
	 * </pre>
     * <p>Parses a string representing a date by trying a variety of different parsers.</p>
     * 
     * <p>The parse will try each parse pattern in turn.
     * A parse is only deemed successful if it parses the whole of the input string.
     * If no parse patterns match, a ParseException is thrown.</p>
     * The parser will be lenient toward the parsed date.
     * 
     * @param str  the date to parse, not null
     * @param parsePatterns  the date format patterns to use, see SimpleDateFormat, not null
     * @return the parsed date
     * @throws IllegalArgumentException if the date string or pattern array is null
     * @throws ParseException if none of the date patterns were suitable (or there were none)
     */
	public static Date parseDate(final String str, final String... parsePatterns) throws ParseException {
        return DateUtils.parseDate(str, parsePatterns);
    }
	
	
	 /**
     * <pre>
	 * 将日期转换成制定格式的字符串
	 * 
	 * parsePatterns常用格式
	 * yyyyMMddHHmmss -> 20150609134055 
	 * yyMMdd -> 150609
	 * 其中HH表示24小时制 ,hh则表示12小时制，月份为大写M,分钟为小写m
	 * yyyy-MM-dd HH:mm:ss -> 2015-06-09 13:40:55
	 * yyyy-MM-dd -> 2015-06-09
	 * yy-MM-dd -> 15-06-09
	 * yyyy/MM/dd -> 2015/06/09
	 * yyyy/MM/dd -> 2015/06/09
	 * 
	 * </pre>
     * @param date  the date to format, not null
     * @param pattern  the pattern to use to format the date, not null
     * @return the formatted date
     */
    public static String format(final Date date, final String pattern) {
        return DateFormatUtils.format(date, pattern);
    }
    
    /**
     *
     * <pre>
	 * 将日期转换成制定格式的字符串
	 * 
	 * parsePatterns常用格式
	 * yyyyMMddHHmmss -> 20150609134055 
	 * yyMMdd -> 150609
	 * 其中HH表示24小时制 ,hh则表示12小时制，月份为大写M,分钟为小写m
	 * yyyy-MM-dd HH:mm:ss -> 2015-06-09 13:40:55
	 * yyyy-MM-dd -> 2015-06-09
	 * yy-MM-dd -> 15-06-09
	 * yyyy/MM/dd -> 2015/06/09
	 * yyyy/MM/dd -> 2015/06/09
	 * 
	 * </pre>
     * @author 唐延波
     * @date 2015年7月24日
     * @param pattern
     * @return
     */
    public static String getDateString(final String pattern){
    	return DateUtil.format(new Date(),pattern);
    }
}
