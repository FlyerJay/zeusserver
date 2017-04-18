# zuesAPI

>/zues/api/user/login (用户登录) POST
*   @param { String } userId (用户Id 主键)
*   @param { String } password

>/zues/api/user/register (用户注册) POST
*   @param { String } userId 
*   @param { String } password
*   @param { String } userName (可选)

>/zues/api/user (获取用户信息) GET
*   @param { String } userToken

>/zues/api/user/validate (验证账号是否可用) GET
*   @param { String } userId

>/zues/api/upload/excel (解析excel文件) POST
*   @param { File } any