## Zues Server API

### 用户登录
------
##### 请求地址
```javascript
/zues/api/user/login    POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
userId | 用户ID | 是
password | 密码 | 是
comId | 公司ID | 是
##### 结果示例
```javascript
{
    "data": {
        "userToken": "d7cad13e-359b-4a35-b4af-8276467f8cdf",
        "userId": "flyerjay",
        "comId": "01",
        "password": "1992124fei",
        "valid": 1,
        "userName": null,
        "registerTime": "1492570448769",
        "lastLoginTime": 1492611578204
    },
    "code": 200,
    "msg": "登录成功"
}
```
### 用户注册
------
##### 请求地址
```javascript
/zues/api/user/register    POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
userId | 用户ID | 是
password | 密码 | 是
comId | 公司ID | 是
userName | 用户昵称 | 否
##### 结果示例
```javascript
{
    "data": {
        "userId": "lee",
        "password": "1992124fei",
        "comId": "01",
        "registerTime": 1492611823443,
        "lastLoginTime": 1492611823443,
        "userToken": "36b50e82-83bd-40ed-b5e4-38f9b27e0f95",
        "valid": 0
    },
    "code": 200,
    "meg": "注册成功"
}
```
### 获取用户信息
------
##### 请求地址
```javascript
/zues/api/user    GET
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
userToken | 用户登录后返回的uuid | 是
### 验证账号是否可用
------
##### 请求地址
```javascript
/zues/api/user/validate    GET
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
userId | 用户ID | 是
### 获取公司列表
------
##### 请求地址
```javascript
/zues/api/company    GET
```
### 解析excel文件
------
##### 请求地址
```javascript
/zues/api/upload/excel    POST
```
### 获取供应商列表
------
##### 请求地址
```javascript
/zues/api/supplier/list   GET
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierName | 供应商名字 支持模糊匹配 | 否
address | 供应商地址 | 否
pageSize | 分页大小 默认为30 | 否
page | 当前分页 默认为0 | 否
### 新增供应商
------
##### 请求地址
```javascript
/zues/api/supplier/add   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierName | 供应商名字 | 是
address | 供应商地址 | 是
freight | 运费 | 否
benifit | 供应商优惠 | 否
### 供应商信息修改
------
##### 请求地址
```javascript
/zues/api/supplier/update   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierId | 供应商ID | 是
supplierName | 供应商名字 | 否
address | 供应商地址 | 否
freight | 运费 | 否
benifit | 供应商优惠 | 否
### 供应商信息修改
------
##### 删除供应商
```javascript
/zues/api/supplier/remove   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierId | 供应商ID 支持批量删除以','分隔，如：1,2,3 | 是