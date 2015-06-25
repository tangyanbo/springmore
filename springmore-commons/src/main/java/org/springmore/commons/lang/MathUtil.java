package org.springmore.commons.lang;  
  
import java.math.BigDecimal;  
  
/**
 * 
 * 字符串表达式运算
 * @author 唐延波
 * @date 2015-6-24
 */
public class MathUtil {  
  
    /**   
     * 两个字符类型的小数进行相加为a+b;   
     *    
     * @param a   
     * @param b   
     * @return   
     */    
    private static String addBigDecimal(String a, String b) {     
        double a1 = Double.parseDouble(a);     
        double b1 = Double.parseDouble(b);     
        BigDecimal a2 = BigDecimal.valueOf(a1);     
        BigDecimal b2 = BigDecimal.valueOf(b1);     
        BigDecimal c2 = a2.add(b2);     
        String c1 = c2 + "";     
        return c1;     
    }    
    /**   
     * 两个字符类型的小数进行相减为a-b;   
     *    
     * @param a   
     * @param b   
     * @return   
     */    
    private static String reduceBigDecimal(String a, String b) {     
        double a1 = Double.parseDouble(a);     
        double b1 = Double.parseDouble(b);     
        BigDecimal a2 = BigDecimal.valueOf(a1);     
        BigDecimal b2 = BigDecimal.valueOf(b1);     
        BigDecimal c2 = a2.subtract(b2);     
        String c1 = c2 + "";     
        return c1;     
    }    
    /**   
     * 两个字符类型的数相乘 a*b=c；   
     *    
     * @param a   
     * @param b   
     * @return   
     */    
    private static String multipliedString(String a, String b) {     
        double a1 = Double.parseDouble(a);     
        double b1 = Double.parseDouble(b);     
        BigDecimal a2 = BigDecimal.valueOf(a1);     
        BigDecimal b2 = BigDecimal.valueOf(b1);     
        BigDecimal c2 = a2.multiply(b2);     
        String c1 = c2 + "";     
        return c1;     
    }    
    /**   
     * 两个字符类型的数相除 a/b=c；   
     *    
     * @param a   
     * @param b   
     * @return   
     */    
    private static String divideString(String a, String b) {     
        double a1 = Double.parseDouble(a);     
        double b1 = Double.parseDouble(b);     
        BigDecimal a2 = BigDecimal.valueOf(a1);     
        BigDecimal b2 = BigDecimal.valueOf(b1);     
        BigDecimal c2 = a2.divide(b2,a2.scale());     
        String c1 = c2 + "";     
        return c1;     
    }    
  
    /**
     * 运算
     * 
     * @author 唐延波
     * @date 2015-6-24
     * @param s
     * @return
     */
    public static String evaluate(String s) {  
        String r = "";  
        int p = 0;  
        for (int i = 0; i < s.length(); i++) {  
            if (s.charAt(i) == '+' || s.charAt(i) == '-' || s.charAt(i) == '*'  
                    || s.charAt(i) == '/') {  
                p++;  
            }  
        }  
        String k[] = new String[2 * p + 1];  
        int k1 = 0;  
        int first = 0;  
        for (int i = 0; i < s.length(); i++) {  
            if (s.charAt(i) == '+' || s.charAt(i) == '-' || s.charAt(i) == '*'  
                    || s.charAt(i) == '/') {  
                k[k1] = s.substring(first, i);  
                k1++;  
                k[k1] = "" + s.charAt(i);  
                k1++;  
                first = i + 1;  
            }  
        }  
        k[k1] = s.substring(first, s.length());  
        int kp = p;  
        while (kp > 0) {  
            for (int i = 0; i < k.length; i++) {  
                if (k[i].equals("*") || k[i].equals("/")) {  
                    int l;  
                    for (l = i - 1; l > -1; l--) {  
                        if (!(k[l].equals("p")))  
                            break;  
                    }  
                    int q;  
                    for (q = i + 1; q < k.length; q++) {  
                        if (!(k[l].equals("p")))  
                            break;  
                    }  
                    if (k[i].equals("*")) {  
                        k[i] = ""+ multipliedString(k[l],k[q]);  
                        k[l] = "p";  
                        k[q] = "p";  
                        kp--;  
                    } else {  
                        k[i] = ""+divideString(k[l],k[q]);  
                        k[l] = "p";  
                        k[q] = "p";  
                        kp--;  
                    }  
                    break;  
                }  
            }  
            for (int i = 0; i < 2 * p + 1; i++) {  
                if (k[i].equals("+") || k[i].equals("-")) {  
                    int l;  
                    for (l = i - 1; l > -1; l--) {  
                        if (!(k[l].equals("p")))  
                            break;  
                    }  
                    int q;  
                    for (q = i + 1; q < k.length; q++) {  
                        if (!(k[q].equals("p")))  
                            break;  
                    }  
                    if (k[i].equals("+")) {  
                        k[i] = ""+addBigDecimal(k[l],k[q]);  
                        k[l] = "p";  
                        k[q] = "p";  
                        kp--;  
                    } else {  
                        k[i] = ""+reduceBigDecimal(k[l],k[q]);  
                        k[l] = "p";  
                        k[q] = "p";  
                        kp--;  
                    }  
                    break;  
                }  
            }  
            for (int i = 0; i < k.length; i++) {  
                if (!(k[i].equals("p"))) {  
                    r = k[i];  
                    break;  
                }  
            }  
        }  
        return r;  
    }  
  
    public static void sizeyunsuan(String s) {  
        while (true) {  
            int first = 0;  
            int last = 0;  
            for (int i = 0; i < s.length(); i++) {  
                if (s.charAt(i) == '(')  
                    first = i;  
                if (s.charAt(i) == ')') {  
                    last = i;  
                    break;  
                }  
            }  
            if (last == 0) {  
                System.out.println(evaluate(s));  
                return;  
            } else {  
                String s1 = s.substring(0, first);  
                String s2 = s.substring(first + 1, last);  
                String s3 = s.substring(last + 1, s.length());  
                s = s1 + evaluate(s2) + s3;  
            }  
        }  
    }  
  
    public static void main(String[] args) {  
       // String s = "1.4+2*32/(3-2.1)";
        String s = "2048*2048";
        String evaluate = evaluate(s);  
        System.out.println(evaluate);
    }  
  
}   