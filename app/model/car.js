/**
 * 货车实体类
 * 2017-07-27
 */
'use strict';

module.exports = app => {
     const { STRING, INTEGER, BIGINT} = app.Sequelize;
     return app.model.define('Car',{
        carId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"车辆主键（无实义）",
        },
        comId: {
            type: STRING(2),
            primaryKey: true,
            allowNull:false,
            comment:"公司编号",
        },
        linkName: {
            type: STRING(10),
            allowNull:true,
            comment:"联系人",
        },
        plate: {
            type: STRING(10),
            allowNull: false,
            default: '',
            comment: "车牌号码",
        },
        phone: {
            type: STRING(15),
            allowNull: true,
            default: 0,
            comment: "联系电话",
        }
     }, {
        freezeTabName:true,
        underscored:true,
		tableName:"car",
		timestamps:false,
        classMethods:{
            * add(options) {
                if(!options.plate) return {
                    code: -1,
                    msg: "请填写车牌号"
                }
                if(!options.phone) return {
                    code: -1,
                    msg: "请填写电话号码",
                }

                yield this.create(options);
                return {
                    code:200,
                    msg:"添加车辆成功"
                }
            },
            * remove(options) {
                if(!options.carId) return {
                    code:-1,
                    msg:"缺少车辆主键"
                }
                const result = yield this.destroy({
                    where:{
                        carId:{
                            $in:options.carId.split(','),
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
                const [$1,$2] = yield [app.model.query(`SELECT * FROM car WHERE
                plate LIKE :plate
                AND comId = :comId
                ORDER BY carId DESC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        start: !options.page ? 0 : (options.page - 1) * (options.pageSize?options.pageSize:5),
                        offset: options.pageSize ? options.pageSize:5,
                        plate: options.plate ? `%${options.plate}%` : `%%`,
                        comId: options.comId
                    }
                }),
                app.model.query(`SELECT count(1) as count FROM car WHERE
                plate LIKE :plate
                AND comId = :comId
                `,{
                    replacements:{
                        plate: options.plate ? `%${options.plate}%` : `%%`,
                        comId: options.comId
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
            }
        }
    })
}