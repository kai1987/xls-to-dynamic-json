xls-to-dynamic-json
===================

convert xls to dynamic json.
```
将xls解析成json. 会将xlsjs生成的json 数组转成key在外的对象，并且会对第三行定义的类型进行处理，int值会转化
xls 结构如下：

第一行:json object key,  如果是special_key,value 会生成k-v结构的json,

第二行:描述

第三行:类型定义,现在支持以下类型:
  int
  string
  oneToMany:结构如下：oneToMany,关联的工作簿文件名,sheetName,在sheetName中的外键的名字
  hashcode: hashcode,目标字符串的列名. eg:hashcode,name. hashcode 使用的是bkdrhash算法
  json: 会尝试将字符串转成json, 如果转不成就用原来的字符串


第四行:验证用:key 表示是主键，unique 表示这一列要唯一
eg bookshop.xls
```
useage:
```
代码中调用：
xls-to-dynamic-json = require "xls-to-dynamic-json"
xls-to-dynamic-json.make_dynamic_json(fileName,sheetName,outputJsonName)


直接命令行调用:

x2j fileName,sheetName,outputJsonName

```

安装方法:

npm install xls-to-dynamic-json -g
