# zuesAPI

>/zues/api/user/login (用户登录) POST
*   @param { String } userId (用户Id 主键)
*   @param { String } password
*   @param { String } comId 公司Id

>/zues/api/user/register (用户注册) POST
*   @param { String } userId 
*   @param { String } password
*   @param { String } userName (可选)
*   @param { String } comId 公司Id

>/zues/api/user (获取用户信息) GET
*   @param { String } userToken

>/zues/api/user/validate (验证账号是否可用) GET
*   @param { String } userId

>/zues/api/company (获取公司列表) GET

>/zues/api/upload/excel (解析excel文件) POST
*   @param { File } any

>/zues/api/supplier/list (获取供应商列表) GET
*   @param { String } supplierName (供应商名字 可选 模糊匹配)
*   @param { String } address (供应商地址 可选)
*   @param { String } pageSize (可选 默认30)
*   @param { String } page (可选 默认0)

>/zues/api/supplier/add (新增供应商) POST
*   @param { String } supplierName (供应商名字)
*   @param { String } address (供应商地址)
*   @param { String } freight (可选 运费)
*   @param { String } benifit (可选 优惠价格)

>/zues/api/supplier/update (新增供应商) POST
*   @param { String } supplierId (供应商主键)
*   @param { String } supplierName (可选 供应商名字)
*   @param { String } address (可选 供应商地址)
*   @param { String } freight (可选 运费)
*   @param { String } benifit (可选 优惠价格)

>/zues/api/supplier/remove (新增供应商) POST
*   @param { String } supplierId (供应商主键 支持批量删除以','分隔)