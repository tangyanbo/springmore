* FileUtil 继承了apache commons FileUtils的所有功能
* copy file
```java
File srcDir = new File("srcDir");
File destDir = new File("destDir");
FileUtil.copyDirectory(srcDir, destDir);
```
