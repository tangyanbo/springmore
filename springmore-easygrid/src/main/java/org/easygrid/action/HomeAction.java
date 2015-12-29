package org.easygrid.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;

@ParentPackage("struts-default")
@Namespace("/")
public class HomeAction extends BaseAction {

	private static final long serialVersionUID = 6601259149735325112L;

	@Action(value = "home", results = { @Result(name = SUCCESS, location = "/WEB-INF/jsp/index.jsp") })
	public String home() {
		try {
			
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return SUCCESS;
	}
}
