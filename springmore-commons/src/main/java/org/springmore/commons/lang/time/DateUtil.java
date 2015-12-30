package org.springmore.commons.lang.time;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;

/**
 * <pre>
 * DateUtil 继承了apache commons DateUtils的所有功能
 * 并提供了一些常用的日期功能
 * </pre>
 * @author 唐延波
 * @date 2015-6-9
 */
public class DateUtil extends DateUtils{
	
	public final static String yyyyMMddHHmmss = "yyyyMMddHHmmss";
	
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
    	return getDateString(new Date(),pattern);
    }
    
    public static String getDateString(Date date,final String pattern){
    	return format(date,pattern);
    }
    
    /**
     * 获得今天的开始时间
     * yyyy-MM-dd 00:00:00
     * @return
     * @author 唐延波
     * @date 2015年8月4日
     */
	public static Date getDayStartTime() {
		return getDayStartTime(new Date());
	}

	/**
	 * 获得给定日期的的开始时间
	 * yyyy-MM-dd 00:00:00
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Date getDayStartTime(Date date) {
		if (date == null) {
			date = new Date();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}
	

	/**
	 * 获得一个周的开始时间
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Date getWeekStartTime(Date date) {
		if (date == null) {
			date = new Date();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_WEEK, 1);
		return calendar.getTime();
	}

	/**
	 * 获得一个周的结束时间
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Date getWeekEndTime(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(getWeekStartTime(date));
		calendar.add(Calendar.WEEK_OF_MONTH, +1);
		calendar.add(Calendar.MILLISECOND, -1);
		return calendar.getTime();
	}

	/**
	 * 获得一个月的开始时间
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Date getMonthStartTime(Date date) {
		if (date == null) {
			date = new Date();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		return calendar.getTime();
	}

	/**
	 * 获得一个月的结束时间
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Date getMonthEndTime(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(getMonthStartTime(date));
		calendar.add(Calendar.MONTH, +1);
		calendar.add(Calendar.MILLISECOND, -1);
		return calendar.getTime();
	}

	/**
	 * 获取一个没有日期的时间
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static Time getTimeNoDate(Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		if (date == null) {
			date = new Date();
		}
		return Time.valueOf(sdf.format(date));
	}

	/**
	 * 获得最近6年
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static List<Date> getAdjacentYears() {
		return getAroundYears(new Date(), 6);
	}

	/**
	 * 获得邻近的几年
	 * @param year
	 * @param count
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static List<Date> getAroundYears(Date year, int count) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(year);
		List<Date> years = new ArrayList<Date>(count);
		calendar.add(Calendar.YEAR, -(count / 2));
		int i = 0;
		do {
			years.add(calendar.getTime());
			calendar.add(Calendar.YEAR, 1);
		} while (++i < count);
		return years;
	}

	/**
	 * 自然周次
	 * @param date
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static List<Date> getWeeks(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int maxWeek = calendar.getMaximum(Calendar.WEEK_OF_YEAR);
		List<Date> weeks = new ArrayList<Date>(maxWeek);
		calendar.set(Calendar.DAY_OF_YEAR, 1);
		for (int i = 0; i < maxWeek; i++) {
			weeks.add(calendar.getTime());
			calendar.add(Calendar.WEEK_OF_YEAR, +1);
			if (i == 0) {
				calendar.set(Calendar.DAY_OF_WEEK, 1);
			}
		}
		return weeks;
	}

	/**
	 * 根据开始和结束日期查询周次日期集合
	 * @param startDate
	 * @param endDate
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static List<Date> getWeeks(Date startDate, Date endDate) {
		if (endDate == null || startDate == null) {
			return getWeeks(new Date());
		}
		Calendar sCalendar = Calendar.getInstance();
		sCalendar.setTime(startDate);
		Calendar eCalendar = Calendar.getInstance();
		eCalendar.setTime(endDate);
		int maxWeek = computeWeek(startDate, endDate);
		List<Date> weeks = new ArrayList<Date>();
		int i = 1;
		while (sCalendar.before(eCalendar)) {
			if (sCalendar.get(Calendar.YEAR) == eCalendar.get(Calendar.YEAR)
					&& sCalendar.get(Calendar.MONTH) == eCalendar.get(Calendar.MONTH)
					&& sCalendar.get(Calendar.DAY_OF_WEEK_IN_MONTH) == eCalendar.get(Calendar.DAY_OF_WEEK_IN_MONTH)) {
				break;
			} else {
				sCalendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
				if (i != maxWeek - 1) {
					if (i == maxWeek) {
						sCalendar.add(Calendar.DAY_OF_YEAR, 7);
						weeks.add(sCalendar.getTime());
					} else {
						weeks.add(sCalendar.getTime());
						sCalendar.add(Calendar.DAY_OF_YEAR, 7);
					}
				} else {
					weeks.add(sCalendar.getTime());
				}
			}
			i++;
		}
		return weeks;
	}

	/**
	 * 根据开始和结束时间计算周次
	 * @param sdate
	 * @param edate
	 * @return
	 * @author 唐延波
	 * @date 2015年8月4日
	 */
	public static int computeWeek(Date sdate, Date edate) {
		int wks = 0;
		Calendar sCalendar = Calendar.getInstance();
		sCalendar.setTime(sdate);
		Calendar eCalendar = Calendar.getInstance();
		eCalendar.setTime(edate);
		while (sCalendar.before(eCalendar)) {
			if (sCalendar.get(Calendar.YEAR) == eCalendar.get(Calendar.YEAR)
					&& sCalendar.get(Calendar.MONTH) == eCalendar.get(Calendar.MONTH)
					&& sCalendar.get(Calendar.DAY_OF_WEEK_IN_MONTH) == eCalendar.get(Calendar.DAY_OF_WEEK_IN_MONTH)) {
				break;
			} else {
				sCalendar.add(Calendar.DAY_OF_YEAR, 7);
				wks += 1;
			}
		}
		return wks + 1;
	}

	/**
	 * 获得给定时间的前一天
	 * @author 唐延波
	 * @date 2015年7月25日
	 * @param date
	 * @return
	 */
	public static Date getPreDay(Date date) {
		return getPreDay(date,1);
	}
	
	/**
	 * 获得给定时间的前n天
	 * @author 唐延波
	 * @date 2015年7月25日
	 * @param date
	 * @return
	 */
	public static Date getPreDay(Date date,int n) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, -n);
		return calendar.getTime();
	}

	/**
	 * 获取给定时间后n天
	 * @author 唐延波
	 * @date 2015年7月25日
	 * @return
	 */
	public static Date getAfterDay(Date date,int n) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, n);
		return calendar.getTime();
	}
	
	/**
	 * 获取给定时间后1天
	 * @author 唐延波
	 * @date 2015年7月25日
	 * @return
	 */
	public static Date getAfterDay(Date date){
		return getAfterDay(date,1);
	}
}
