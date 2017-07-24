/**
 * 地址管理实体类
 * 2017-07-19
 */
'use strict';

module.exports = app => {
     const { STRING, INTEGER, BIGINT} = app.Sequelize;
     return app.model.define('Address',{
        addressId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"地址主键（无实意）",
        },
        comId: {
            type: STRING(2),
            primaryKey: true,
            allowNull:false,
            comment:"公司编号",
        },
        addressType: {
            type: INTEGER(1),
            allowNull: false,
            default: 1,
            comment: "地址类型（1:收货地址，2:发货地址）",
        },
        isDefault: {
            type: INTEGER(1),
            allowNull: true,
            default: 0,
            comment: "是否为默认地址(1:默认，0:非默认)",
        },
        addressName: {
            type: STRING(20),
            allowNull: false,
            comment:"地址名称（可以是公司名，也可以是随便起的名字，方便区分，展示用）"
        },
        address: {
            type: STRING(50),
            allowNull: false,
            comment:"准确地址"
        },
        phone: {
            type: STRING(30),
            allowNull: true,
            comment: "联系电话，字符串类型，方便输入各种备注"
        },
        fax: {
            type: STRING(30),
            allowNull: true,
            comment: "传真",
        },
        linkName: {
            type: STRING(10),
            allowNull: true,
            comment: "联系人名称",
        },
        email: {
            type: STRING(30),
            allowNull: true,
            comment: "邮件"
        },
        finance: {
            type: STRING(30),
            allowNull: true,
            comment: "财务"
        }
     }, {
        freezeTabName:true,
        underscored:true,
		tableName:"address",
		timestamps:false,
        classMethods:{
            * add(options) {
                if(!options.addressType) return {
                    code: -1,
                    msg: "请填写地址类型"
                }
                if(!options.addressName) return {
                    code: -1,
                    msg: "请填写地址名称"
                }
                if(!options.address) return {
                    code: -1,
                    msg: "请填写详细地址",
                }

                yield this.create(options);
                return {
                    code:200,
                    msg:"添加地址成功"
                }
            },
            * remove(options) {
                if(!options.addressId) return {
                    code:-1,
                    msg:"缺少运费主键:freightId"
                }
                const result = yield this.destroy({
                    where:{
                        addressId:{
                            $in:options.addressId.split(','),
                        }
                    }
                })
                if(result) return {
                    code:200,
                    msg:'删除成功'
                }
                return {
                    code:-1,
                    msg:'删除失败'
                };
            },
            * list(options) {
                const [$1,$2] = yield [app.model.query(`SELECT * FROM address WHERE
                comId = :comId
                AND (addressType = :addressType OR :addressType = '')
                ORDER BY isDefault DESC, addressId ASC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        comId: options.comId || '',
                        addressType: options.addressType || '',
                        start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:5),
                        offset:options.pageSize?options.pageSize:5,
                    }
                }),
                app.model.query(`SELECT count(1) as count FROM address WHERE
                comId = :comId
                AND (addressType = :addressType OR :addressType = '')
                `,{
                    replacements:{
                        comId: options.comId || '',
                        addressType: options.addressType || ''
                    }
                })]
                if(!$1[0] || $1[0].length ===0) return {
                    code:200,
                    msg:"数据为空",
                    data:{
                        count:0,
                        row:[]
                    }
                }
                let result= {};
                result.row = $1[0];
                result.totalCount = $2[0][0].count;
                result.page = options.page?options.page:0;
                result.pageSize = options.pageSize?options.pageSize:5;
                return {
                    code:200,
                    data:result,
                    msg:"查询成功"
                }
            },
            * setDefault(options) {
                if(!options.addressId) return {
                    code: -1,
                    msg: "请选择地址"
                }
                if(!options.addressType) return {
                    code: -1,
                    msg: "请选择地址类型"
                }
                yield app.model.query(`UPDATE address SET isDefault = 0 WHERE addressType = :addressType`,{
                    replacements:{
                        addressType:options.addressType
                    }
                })
                const result = yield app.model.query(`UPDATE address SET isDefault = 1 WHERE addressId = :addressId`,{
                    replacements:{
                        addressId:options.addressId
                    }
                })
                if(result) return {
                    code: 200,
                    msg: "设置默认地址成功"
                }
                return {
                    code: -1,
                    msg: "设置默认地址失败"
                }
            },
            * defaultAddress(options) {
                if(!options.addressType) return {
                    code: -1,
                    msg: "缺少地址类型"
                }
                const result = yield app.model.query(`SELECT * FROM address WHERE 
                addressType = :addressType
                AND comId = :comId
                ORDER BY isDefault DESC, addressId ASC
                LIMIT 0,1
                `,{
                    replacements:{
                        comId: options.comId || '',
                        addressType: options.addressType || '',
                    }
                })

                return {
                    code: 200,
                    data: result[0],
                    msg: "查询成功",
                }
            }
        }
    })
}