## Zues Server API

### 用户登录

##### 请求地址
```javascript
/zues/api/user/login
```
##### 请求方式
```javascript
POST
```
##### 参数
字段 | 描述 | 是否必填
------|------------|-----
userId | 用户ID | 是
password | 密码 | 是
comId | 公司ID | 是
##### 结果
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