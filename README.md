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
##### 参数
`javascript
如果要带参数放在连接的?后面
`
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
### 删除供应商
------
##### 请求地址
```javascript
/zues/api/supplier/remove   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierId | 供应商ID 支持批量删除以','分隔，如：1,2,3 | 是
### 供应商库存查询
------
##### 请求地址
```javascript
/zues/api/inventory/list   GET
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierName | 供应商名字，支持模糊匹配 | 否
address | 供应商地址 | 否
pageSize | 分页大小，默认30 | 否
page | 当前页码，默认0 | 否
spec | 产品规格，支持模糊匹配 | 否
type | 产品类型 | 否
### 增加供应商库存记录
------
##### 请求地址
```javascript
/zues/api/inventory/add   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierId | 供应商ID,和供应商表关联 | 是
spec | 产品规格，如：2.5 * 2.5 * 0.8 | 是
type | 产品类型，如：镀锌带，方矩管 | 是
material | 产品材质，如：QC2311 | 否
inventoryAmount | 产品库存 | 否
perAmount | 单件支付 | 否
inventory | 库存重量 | 否
### 更新供应商库存记录
------
##### 请求地址
```javascript
/zues/api/inventory/update   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierInventoryId | 供应商库存ID,主键 | 是
supplierId | 供应商ID,和供应商表关联 | 否
spec | 产品规格，如：2.5 * 2.5 * 0.8 | 否
type | 产品类型，如：镀锌带，方矩管 | 否
material | 产品材质，如：QC2311 | 否
inventoryAmount | 产品库存 | 否
perAmount | 单件支付 | 否
inventory | 库存重量 | 否
### 删除供应商库存记录
------
##### 请求地址
```javascript
/zues/api/inventory/remove   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierInventoryId | 供应商库存ID,主键 | 是
### 供应商价格查询
------
##### 请求地址
```javascript
/zues/api/price/list   GET
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierName | 供应商名字，支持模糊匹配 | 否
address | 供应商地址 | 否
pageSize | 分页大小，默认30 | 否
page | 当前页码，默认0 | 否
spec | 产品规格，支持模糊匹配 | 否
type | 产品类型 | 否
### 增加供应商库存记录
------
##### 请求地址
```javascript
/zues/api/price/add   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierId | 供应商ID,和供应商表关联 | 是
spec | 产品规格，如：2.5 * 2.5 * 0.8 | 是
type | 产品类型，如：镀锌带，方矩管 | 是
material | 产品材质，如：QC2311 | 否
value | 产品单价 | 否
### 更新供应商库存记录
------
##### 请求地址
```javascript
/zues/api/price/update   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierValueId | 供应商价格ID,主键 | 是
supplierId | 供应商ID,和供应商表关联 | 否
spec | 产品规格，如：2.5 * 2.5 * 0.8 | 否
type | 产品类型，如：镀锌带，方矩管 | 否
material | 产品材质，如：QC2311 | 否
value | 产品单价 | 否
### 删除供应商库存记录
------
##### 请求地址
```javascript
/zues/api/price/remove   POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
supplierValueId | 供应商库存ID,主键 | 是


