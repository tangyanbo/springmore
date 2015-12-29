package org.easygrid.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.easygrid.util.WebUtil;

@ParentPackage("struts-default")
@Namespace("/")
public class CommonGridAction extends BaseAction{

	private static final long serialVersionUID = -7283596500209033173L;

	@Action("loadData")
	public void loadData() {
		try {
			List<List<Object>> datas = new ArrayList<List<Object>>();
			for(int i=0;i<100;i++){
				List<Object> row = new ArrayList<Object>();
				row.add("行"+i+"列1");
				row.add("行"+i+"列2");
				row.add("行"+i+"列3");
				row.add(i);
				datas.add(row);
			}
			WebUtil.sendJSONArrayResponse(datas);	
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}
	
	
	@Action("loadGroupData")
	public void loadGroupData() {
		try {
			List<List<Object>> datas = new ArrayList<List<Object>>();
			for(int i=0;i<3;i++){
				for(int j=0;j<3;j++){
					for(int z=0;z<5;z++){
						List<Object> row = new ArrayList<Object>();
						row.add("一级"+i+"列1");
						row.add("二级"+j+"列2");
						row.add("组"+i+"列3");
						row.add(i);
						datas.add(row);
					}
					
				}				
			}
			WebUtil.sendJSONArrayResponse(datas);	
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}
	
	@Action("loadLargeData")
	public void loadLargeData() {
		try {
			List<List<String>> datas = new ArrayList<List<String>>();
			for(int i=0;i<10000;i++){
				List<String> row = new ArrayList<String>();
				row.add("行"+i+"列1");
				row.add("行"+i+"列2");
				row.add("行"+i+"列3");
				row.add("行"+i+"列4");
				datas.add(row);
			}
			WebUtil.sendJSONArrayResponse(datas);	
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
	}
}
