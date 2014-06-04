xls-to-dynamic-json
===================

convert xls to dynamic json.
```
将xls解析成json. 会将xlsjs生成的json 数组转成key在外的对象，并且会对第三行定义的类型进行处理，int值会转化
xls 结构如下：
第一行:json object key 
第二行:描述
第三行:类型定义:oneToMany的结构如下：oneToMany,关联的工作簿文件名,sheetName,在sheetName中的外键的名字
第四行:验证用:key 表示是主键，unique 表示这一列要唯一
eg bookshop.xls
```
useage:
```
xls-to-dynamic-json = require "xls-to-dynamic-json"
xls-to-dynamic-json.make_dynamic_json(fileName,sheetName,outputJsonName)
```
