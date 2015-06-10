package org.springmore.commons.io;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

/**
 * XMLUtil
 * 封装dom4j和Jaxb
 * @author 唐延波
 * @date 2015-6-9
 */
public class XMLUtil {

	/**
	 * 获取Document 基于dom4j
	 * 
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param xmlIs
	 * @return
	 * @throws DocumentException
	 */
	public static Document getDocument(InputStream xmlIs)
			throws DocumentException {
		SAXReader reader = new SAXReader();
		Document document = reader.read(xmlIs);
		return document;
	}

	/**
	 * 获取Document 基于dom4j
	 * 
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param xml
	 * @return
	 * @throws DocumentException
	 */
	public static Document getDocument(String xml) throws DocumentException {
		SAXReader reader = new SAXReader();
		Document document = reader.read(ResourceUtil.getResourceAsStream(xml));
		return document;
	}

	/**
	 * 获取Document 基于dom4j
	 * 
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param xml
	 * @return
	 * @throws DocumentException
	 */
	public static Document getDocument(File file) throws DocumentException {
		SAXReader reader = new SAXReader();
		Document document = reader.read(file);
		return document;
	}

	/**
	 * 获取属性值
	 * 
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param enumerationName
	 * @param element
	 * @return
	 */
	public static String getAttrValue(String enumerationName, Element element) {
		Attribute attr = element.attribute(enumerationName);
		return attr.getValue();
	}

	/**
	 * 将xml转换成对象
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param reader
	 * @param ObjectClazz
	 * @return
	 * @throws JAXBException
	 */
	@SuppressWarnings("unchecked")
	public static <Bean> Bean XmlToObj(Reader reader, Class<Bean> ObjectClazz)
			throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(ObjectClazz);
		Unmarshaller um = context.createUnmarshaller();		
		return (Bean) um.unmarshal(reader);
	}

	/**
	 * 将xml转换成对象
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param in
	 * @param ObjectClazz
	 * @return
	 * @throws JAXBException
	 */
	@SuppressWarnings("unchecked")
	public static <Bean> Bean XmlToObj(InputStream in, Class<Bean> ObjectClazz)
			throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(ObjectClazz);
		Unmarshaller um = context.createUnmarshaller();
		return (Bean) um.unmarshal(in);
	}

	/**
	 * 将xml转换成对象
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param f
	 * @param ObjectClazz
	 * @return
	 * @throws JAXBException
	 */
	@SuppressWarnings("unchecked")
	public static <Bean> Bean XmlToObj(File f, Class<Bean> ObjectClazz)
			throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(ObjectClazz);
		Unmarshaller um = context.createUnmarshaller();		
		return (Bean) um.unmarshal(f);
	}	


	/**
	 * 将xml转换成对象
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param node
	 * @param ObjectClazz
	 * @return
	 * @throws JAXBException
	 */
	@SuppressWarnings("unchecked")
	public static <Bean> Bean XmlToObj(org.w3c.dom.Node node, Class<Bean> ObjectClazz)
			throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(ObjectClazz);
		Unmarshaller um = context.createUnmarshaller();
		return (Bean) um.unmarshal(node);
	}
	

	/**
	 * 将xml转换成对象
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param xml
	 * @param ObjectClazz
	 * @return
	 * @throws JAXBException
	 */
	@SuppressWarnings("unchecked")
	public static <Bean> Bean XmlToObj(String xml, Class<Bean> ObjectClazz)
			throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(ObjectClazz);
		Unmarshaller um = context.createUnmarshaller();
		StringReader reader = new StringReader(xml);
		Object unmarshal = um.unmarshal(reader);
		//注意要关闭资源
		reader.close();
		return (Bean) unmarshal;
	}
	
	
	/**
	 * 将对象转换成xml
	 * 返回的xml串不被格式化
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param object
	 * @return
	 * @throws JAXBException
	 * @throws IOException 
	 */
	public static String ObjToXml(Object object) throws JAXBException, IOException {
		return ObjToXml(object,object.getClass());
	}

	/**
	 * 将对象转换成xml
	 * 返回的xml串不被格式化
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param object
	 * @param classesToBeBound
	 * @return
	 * @throws JAXBException
	 * @throws IOException 
	 */
	@SuppressWarnings("rawtypes")
	public static String ObjToXml(Object object, Class... classesToBeBound)
			throws JAXBException, IOException {
		return ObjToXml(object,false,classesToBeBound);
	}

	

	/**
	 * 将对象转换成xml
	 * @author 唐延波
	 * @date 2015-6-9
	 * @param object
	 * @param isXmlFormat
	 * @param classesToBeBound
	 * @return
	 * @throws JAXBException
	 * @throws IOException 
	 */
	@SuppressWarnings("rawtypes")
	public static String ObjToXml(Object object, boolean isXmlFormat,
			Class... classesToBeBound) throws JAXBException, IOException {
		JAXBContext context = JAXBContext.newInstance(classesToBeBound);
		Marshaller m = context.createMarshaller();
		m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, isXmlFormat);
		m.setSchema(null);
		StringWriter sw = new StringWriter();
		m.marshal(object, sw);
		String result = sw.toString();
		sw.close();
		return result;
	}
}
