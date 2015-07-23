// Generated by CoffeeScript 1.8.0
(function() {
  var CACHE, SPECIAL_KEY, SPECIAL_VALUE, TYPE_FLOAT, TYPE_HASH_CODE, TYPE_INT, TYPE_JSON, TYPE_LINE_STRING, TYPE_ONE_TO_MANY, VALIDATION_KEY, VALIDATION_UNIQUE, bkdrhash, convertJson, fs, make_dynamic_json, readOneToMany, splitString, xls, xlsx,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  xls = require("xlsjs");

  fs = require("fs");

  xlsx = require("xlsx");

  VALIDATION_KEY = "key";

  VALIDATION_UNIQUE = "unique";

  TYPE_INT = "int";

  TYPE_FLOAT = "float";

  TYPE_ONE_TO_MANY = "oneToMany";

  TYPE_HASH_CODE = "hashcode";

  TYPE_JSON = "json";

  TYPE_LINE_STRING = 'linestr';

  SPECIAL_KEY = "special_key";

  SPECIAL_VALUE = "value";

  bkdrhash = function(str) {
    var hash, seed, v, _i, _len;
    seed = 31;
    hash = 0;
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      v = str[_i];
      hash = hash * seed + v.charCodeAt(0);
      hash = hash & 0x7fffffff;
    }
    return hash;
  };

  splitString = function(str, len) {
    var index, iret, v, _i, _len;
    iret = "";
    index = 0;
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      v = str[_i];
      if (index > 0 && index % len === 0) {
        if (v !== ',' && v !== '.' && v !== '?' && v !== '!' && v !== '，' && v !== '。' && v !== '？' && v !== '！') {
          if (index > 0 && index % len === 0) {
            iret += "\n";
          }
        } else {
          index--;
        }
      }
      index++;
      iret += v;
    }
    return iret;
  };

  convertJson = function(fileName, sheetName) {
    var err, fileArr, forginerKeyName, k, key, len, meta_data, newJson, nouse, obj, rawJson, read, sheet, targetStr, v, validation, validationTemp, workbook, _i, _len, _ref, _ref1, _ref2;
    fileArr = fileName.split(".");
    if (fileArr[fileArr.length - 1] === 'xlsx') {
      read = xlsx;
    } else {
      read = xls;
    }
    workbook = read.readFile(fileName);
    sheet = workbook.Sheets[sheetName];
    rawJson = read.utils.make_json(sheet);
    if (!rawJson) {
      return;
    }
    meta_data = rawJson[1];
    validation = rawJson[2];
    rawJson.splice(0, 3);
    validationTemp = {};
    newJson = {};
    for (_i = 0, _len = rawJson.length; _i < _len; _i++) {
      obj = rawJson[_i];
      delete obj['undefined'];
      key = 0;
      for (k in validation) {
        v = validation[k];
        if (!(v && v.length > 0)) {
          continue;
        }
        if (v === VALIDATION_KEY) {
          key = obj[k];
          break;
        }
      }
      for (k in meta_data) {
        v = meta_data[k];
        if (!(v && v.length > 0)) {
          continue;
        }
        if (v.indexOf(TYPE_LINE_STRING) > -1) {
          len = parseInt(v.split(",")[1]) || 20;
          obj[k] = splitString(obj[k], len);
        }
        if (v === TYPE_INT) {
          obj[k] = parseInt(obj[k]);
        }
        if (v === TYPE_FLOAT) {
          obj[k] = parseFloat(obj[k]);
        }
        if (v.indexOf(TYPE_ONE_TO_MANY) > -1) {
          _ref = v.split(","), nouse = _ref[0], fileName = _ref[1], sheetName = _ref[2], forginerKeyName = _ref[3];
          obj[k] = readOneToMany(fileName, sheetName, forginerKeyName, key);
        }
        if (v.indexOf(TYPE_HASH_CODE) > -1) {
          _ref1 = v.split(","), nouse = _ref1[0], targetStr = _ref1[1];
          obj[k] = bkdrhash(obj[targetStr]);
        }
        if (v === TYPE_JSON) {
          try {
            obj[k] = JSON.parse(obj[k]);
          } catch (_error) {
            err = _error;
            console.log("解析json失败，使用原始数据 : key " + k + "->value: " + obj[k] + " error:" + err);
            obj[k] = obj[k];
          }
        }
      }
      for (k in validation) {
        v = validation[k];
        if (v === VALIDATION_KEY || v === VALIDATION_UNIQUE) {
          validationTemp[k] || (validationTemp[k] = []);
          if (_ref2 = obj[k], __indexOf.call(validationTemp[k], _ref2) >= 0) {
            return console.error("唯一键冲突。dumplicate unique for filename: " + fileName + ",sheetName:" + sheetName + ",key:" + k + ",value:" + obj[k] + ",obj:" + (JSON.stringify(obj)));
          }
          validationTemp[k].push(obj[k]);
        }
      }
      if (key === obj[SPECIAL_KEY]) {
        newJson[key] = obj[SPECIAL_VALUE] != null ? obj[SPECIAL_VALUE] : "";
      } else {
        newJson[key] = obj;
      }
    }
    return newJson;
  };

  CACHE = {};

  readOneToMany = function(fileName, sheetName, forginerKeyName, forginerKeyValue) {
    var cacheKey, iret, jsonArray, k, obj;
    cacheKey = "" + fileName + ":" + sheetName;
    jsonArray = CACHE[cacheKey];
    if (!jsonArray) {
      jsonArray = convertJson(fileName, sheetName);
      CACHE[cacheKey] = jsonArray;
    }
    iret = [];
    for (k in jsonArray) {
      obj = jsonArray[k];
      if (obj && parseInt(obj[forginerKeyName]) === parseInt(forginerKeyValue)) {
        iret.push(obj);
      }
    }
    return iret;
  };

  make_dynamic_json = function(fileName, sheetName, outputJsonName) {
    var json;
    if (outputJsonName == null) {
      outputJsonName = sheetName + ".json";
    }
    json = convertJson(fileName, sheetName);
    if (!json) {
      return console.error("no json converted:fileName:" + fileName + ",sheetName:" + sheetName);
    }
    fs.writeFileSync(outputJsonName, JSON.stringify(json, null, 2));
    console.log("make_dynamic_json success:outputJson->:" + outputJsonName);
    return json;
  };

  module.exports = {
    make_dynamic_json: make_dynamic_json
  };

}).call(this);
