package org.springmore.commons.xml;

import static org.junit.Assert.fail;

import javax.xml.bind.JAXBException;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import org.junit.Test;
import org.springmore.commons.io.XMLUtil;

public class XMLUtilTest {
	
	@XmlRootElement
	@XmlAccessorType(XmlAccessType.FIELD)
	static class User{
		String name = "xx";
		String id = "1";
		public String toString(){
			System.out.println("name:"+name);
			System.out.println("id:"+id);
			return null;
					
		}
	}

	@Test
	public void testXmlToObj() throws JAXBException {
		String xml = "<user>" +
				"<id>1</id>" +
				"<name>22</name>" +
				"</user>";
		User xmlToObj = XMLUtil.XmlToObj(xml, User.class);
		xmlToObj.toString();
		//System.out.println(xmlToObj);
	}

	
	@Test
	public void testObjToXmlObject() {
		fail("Not yet implemented");
	}

	@Test
	public void testObjToXmlObjectClassArray() {
		fail("Not yet implemented");
	}

	@Test
	public void testObjToXmlObjectBooleanClassArray() {
		fail("Not yet implemented");
	}

}
