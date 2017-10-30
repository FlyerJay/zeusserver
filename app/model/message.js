/**
 * 消息实体类
 * 2017-10-29
 */
'use strict';

var Util = require("../utils");

module.exports = app => {
     const { STRING, INTEGER, BIGINT} = app.Sequelize;
     return app.model.define('Message',{
        messageId: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull:false,
            comment:"消息主键（无实义）",
        },
        comId: {
            type: STRING(2),
            allowNull: false,
            comment: "消息所属公司"
        },
        createTime: {
            type: STRING(20),
            primaryKey: true,
            allowNull:false,
            comment:"消息创建时间",
        },
        messageType: {
            type: STRING(2),
            allowNull:true,
            comment:"消息类型",
        },
        message: {
            type: STRING(100),
            allowNull: false,
            default: '',
            comment: "消息内容",
        },
     }, {
        freezeTabName:true,
        underscored:true,
		tableName:"message",
		timestamps:false,
        classMethods:{
            * add(options) {
                if(!options.message) return {
                    code: -1,
                    msg: "缺少消息内容"
                }
                if(!options.messageType) return {
                    code: -1,
                    msg: "缺少消息所属类别"
                }
                yield this.create(options);
                return {
                    code:200,
                    msg:"消息添加成功"
                }
            },
            * list(options) {
                console.log(Util.getCurrentDate("-"));
                const [$1,$2] = yield [app.model.query(`SELECT * FROM message WHERE
                messageType = :messageType
                AND comId = :comId
                AND createTime BETWEEN :startTime AND :endTime
                ORDER BY messageId DESC
                LIMIT :start,:offset
                `,{
                    replacements:{
                        start: !options.page ? 0 : (options.page - 1) * (options.pageSize?options.pageSize:10),
                        offset: options.pageSize ? options.pageSize:10,
                        messageType: options.messageType,
                        comId: options.comId,
                        startTime: options.startTime || new Date(Util.getCurrentDate("-")).getTime() - 8 * 60 * 60 * 1000 + '',
                        endTime: options.endTime || new Date(Util.getCurrentDate("-")).getTime() + 16 * 60 * 60 * 1000 + ''
                    }
                }),
                app.model.query(`SELECT count(1) as count FROM message WHERE
                messageType = :messageType
                AND comId = :comId
                AND createTime BETWEEN :startTime AND :endTime
                `,{
                    replacements:{
                        comId: options.comId,
                        messageType: options.messageType,
                        startTime: options.startTime || new Date(Util.getCurrentDate("-")).getTime() - 8 * 60 * 60 * 1000 + '',
                        endTime: options.endTime || new Date(Util.getCurrentDate("-")).getTime() + 16 * 60 * 60 * 1000 + ''
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
                result.pageSize = options.pageSize?options.pageSize:10;
                return {
                    code:200,
                    data:result,
                    msg:"查询成功"
                }
            }
        }
    })
}