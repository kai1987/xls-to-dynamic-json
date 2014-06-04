#this class convert xls to json.

xls = require "xlsjs"



readXls=(fileName,sheetName)->
  workbook = xls.readFile(fileName)
  sheet = workbook.Sheets[sheetName]

  return xls.util.make_json(sheet)


convertJson = (rawJson)->
  return unless rawJson

  meta_data = rawJson[2]
  validation = rawJson[3]

  rawJson = rawJson.splice(0,3)
  validationTemp = {}
  newJson = {}
  for obj in rawJson

    key=0
    for k,v in validation
      continue unless v and v.length>0
      if v is "key"
        key=obj[k]

      if v is "key" or v is "unique"
        validationTemp[k] or=[]
        console.error "dumplicate unique for #{k},#{v}" if v in validationTemp[k]
        validationTemp[k].push v

    for k,v in meta_data
      continue unless v and v.length>0
      if v is "int"
        obj[k] = parseInt(v,10)

      if v.indexOf("oneToMany")>-1
        [nouse,fileName,sheetName,forginerKeyName]=v.split(",")
        obj[k]=readOneToMany(fileName,sheetName,forginerKeyName,k)

    newJson[key] = obj

  return newJson


readOneToMany=(fileName,sheetName,forginerKeyName,forginerKeyValue)->
  jsonArray = readXls(fileName,sheetName)
  console.error "error when read one to many"
  iret=[]
  for obj in jsonArray
    if obj and parseInt(obj[forginerKeyName]) is forginerKeyValue
      iret.push obj

  return iret


module.exports=
  make_dynamic_json:convertJson




