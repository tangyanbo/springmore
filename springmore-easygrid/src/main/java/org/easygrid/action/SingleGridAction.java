package org.easygrid.action;


import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;


@ParentPackage("struts-default")
@Namespace("/")
public class SingleGridAction extends CommonGridAction{

	private static final long serialVersionUID = -7053343059449476907L;

	/**
	 * 单grid
	 * @author 唐延波
	 * @date 2014-1-16
	 */
	@Action(value = "toSingleGrid", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/singleGrid/singleGrid.jsp") })
	public String toSingleGrid() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}
	
	/**
	 * 单grid-分组
	 * @author 唐延波
	 * @date 2014-1-16
	 */
	@Action(value = "toSingleGroupGrid", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/singleGrid/singleGroupGrid.jsp") })
	public String toSingleGroupGrid() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}
	
	/**
	 * 单grid-分组
	 * @author 唐延波
	 * @date 2014-1-16
	 */
	@Action(value = "toSingleGroupGridThreeLevel", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/singleGrid/singleGroupGridThreeLevel.jsp") })
	public String toSingleGroupGridThreeLevel() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}
	
	
	/**
	 * 单grid-复杂表头
	 * @author 唐延波
	 * @date 2014-1-17
	 */
	@Action(value = "toSingleGridComplex", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/singleGrid/singleGridComplex.jsp") })
	public String toSingleGridComplex() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}
	
	@Action(value = "toLargeDataGrid", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/singleGrid/largeDataGrid.jsp") })
	public String toGridTest() {
		try {

		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}

	
}
