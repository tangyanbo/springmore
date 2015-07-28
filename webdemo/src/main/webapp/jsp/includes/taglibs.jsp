<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page import="java.net.URLEncoder"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName();
	if(request.getServerPort()!=80){
		basePath+=":"+request.getServerPort();
	}
	basePath+=path;
	pageContext.setAttribute("basePath", basePath);
	pageContext.setAttribute("service", URLEncoder.encode(basePath,"iso-8859-1"));
%>
