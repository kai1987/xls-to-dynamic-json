#this class convert xls to json.
#need xlsjs
xls = require "xlsjs"
fs = require "fs"

xlsx = require "xlsx"

VALIDATION_KEY="key"
VALIDATION_UNIQUE="unique"

TYPE_INT="int"
TYPE_ONE_TO_MANY="oneToMany"
TYPE_HASH_CODE="hashcode"


bkdrhash=(str)->
  seed=31
  hash=0
  for v in str
    hash = hash*seed + v.charCodeAt(0)
    hash = hash&0x7fffffff

  return hash




#将xls解析成json. 会将xlsjs生成的json 数组转成key在外的对象，并且会对第三行定义的类型进行处理，int值会转化
#xls 结构如下：
#第一行:json object key
#第二行:描述
#第三行:类型定义:oneToMany的结构如下：oneToMany,关联的工作簿文件名,sheetName,在sheetName中的外键的名字
#第四行:验证用:key 表示是主键，unique 表示这一列要唯一
#eg bookshop.xls
convertJson = (fileName,sheetName)->
  fileArr = fileName.split(".")
  if fileArr[fileArr.length-1] is 'xlsx'
    read=xlsx
  else
    read = xls
  workbook = read.readFile(fileName)
  sheet = workbook.Sheets[sheetName]

  rawJson = read.utils.make_json(sheet)
  return unless rawJson

  meta_data = rawJson[1]
  validation = rawJson[2]
  rawJson.splice(0,3)
  validationTemp = {}
  newJson = {}
  for obj in rawJson

    key=0

    for k,v of meta_data
      continue unless v and v.length>0
      if v is TYPE_INT
        obj[k] = parseInt(obj[k],10)

      if v.indexOf(TYPE_ONE_TO_MANY)>-1
        [nouse,fileName,sheetName,forginerKeyName]=v.split(",")
        obj[k]=readOneToMany(fileName,sheetName,forginerKeyName,key)

      if v.indexOf(TYPE_HASH_CODE)>-1
        [nouse,targetStr]=v.split(",")
        obj[k] = bkdrhash obj[targetStr]

    for k,v of validation
      continue unless v and v.length>0
      if v is VALIDATION_KEY
        key=obj[k]

      if v is VALIDATION_KEY or v is VALIDATION_UNIQUE
        validationTemp[k] or=[]
        return console.error "dumplicate unique for filename: #{fileName},sheetName:#{sheetName},key:#{k},value:#{obj[k]},obj:#{JSON.stringify(obj)}" if obj[k] in validationTemp[k]
        validationTemp[k].push obj[k]
    newJson[key] = obj

  return newJson


CACHE={}
readOneToMany=(fileName,sheetName,forginerKeyName,forginerKeyValue)->
  #oneTOMany 可能会读很多次，这里缓存一下生成好的对象
  cacheKey = "#{fileName}:#{sheetName}"
  jsonArray = CACHE[cacheKey]
  unless jsonArray
    jsonArray = convertJson(fileName,sheetName)
    CACHE[cacheKey]=jsonArray
  iret=[]
  for k,obj of jsonArray
    if obj and parseInt(obj[forginerKeyName]) is parseInt(forginerKeyValue)
      iret.push obj

  return iret

make_dynamic_json=(fileName,sheetName,outputJsonName=sheetName+".json")->
  json = convertJson(fileName,sheetName)
  return console.error "no json converted:fileName:#{fileName},sheetName:#{sheetName}" unless json
  fs.writeFileSync(outputJsonName,JSON.stringify(json,null,2))
  console.log "make_dynamic_json success:outputJson->:#{outputJsonName}"
  return json


module.exports=
  make_dynamic_json:make_dynamic_json




