package org.easygrid.excel;


import jxl.format.Colour;
import jxl.write.WritableWorkbook;

public class RGBColor extends Colour{

	protected RGBColor(int val, String s, int r, int g, int b) {
		super(val, s, r, g, b);
	}
	
	public static void initialize(WritableWorkbook wwb){
		wwb.setColourRGB(RGBColor.BLUE, 0xD1,0xE5,0xFE);
		wwb.setColourRGB(RGBColor.LIGHT_BLUE, 0xA4,0xBE,0xD4);	
		wwb.setColourRGB(RGBColor.BLUE2, 0xE3,0xEF,0xFF);
	}
	

	
}