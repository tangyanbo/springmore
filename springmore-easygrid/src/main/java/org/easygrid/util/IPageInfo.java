package org.easygrid.util;

/**
 * 分页信息接口
 * @author 唐延波
 * @date 2013-11-22
 */
public interface IPageInfo {
	
	/**
	 * 默认每页显示最大数
	 */
	public static final int DEFAULT_PAGE_SIZE = 10;

	/**
	 * 获取记录总条数
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	long getTotalCount();

	/**
	 * 获取每页显示记录最大数
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	int getPageSize();

	/**
	 * 获取每页起始数据的位置
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	int getOffset();
	
	/**
	 * 设置记录总条数
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	void setTotalCount(long totalCount);

	/**
	 * 设置每页显示记录最大数
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	void setPageSize(int pageSize);
	
	/**
	 * 获取每页起始数据的位置
	 * @author 唐延波
	 * @date 2013-11-22
	 */
	void setOffset(int offset);

}