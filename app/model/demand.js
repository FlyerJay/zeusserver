/**
 * author:flyerjay
 * 2017-05-21
 * 定制化需求
 */
'use strict';

module.exports = app => {
    const { STRING, INTEGER, DOUBLE, BIGINT } = app.Sequelize;

    return app.model.define('Demand',{
        demandNo:{
            type: STRING(20),
            allowNull: false,
            primaryKey: true,
            comment: "需求编号",
        },
        comId: {
            type: STRING(2),
            comment:"公司编号(关联公司信息)"
        },
        demandWeight: {
            type: DOUBLE(11,2),
            comment:"需求吨位"
        },
        demandAmount: {
            type: INTEGER,
            comment:"需求数量"
        },
        userId: {
            type: STRING(20),
            comment: "业务员"
        },
        priceUser: {
            type: STRING(20),
            comment: "采购人"
        },
        totalFreight:{
            type:DOUBLE(10,2),
            comment:"总运费"
        },
        customerName:{
            type:STRING(20),
            comment:"客户名称"
        },
        customerPhone:{
            type:STRING(11),
            comment:"客户电话"
        },
        destination:{
            type:STRING(11),
            comment:"到岸目的地"
        },
        totalPrice:{
            type:DOUBLE(10,2),
            comment:"总成本"
        },
        dealReason:{
            type:STRING(100),
            comment:"状态说明"
        },
        timeConsume:{
            type:INTEGER(10),
            comment:"需求工时"
        },
        comment:{
            type:STRING(100),
            comment:"备注"
        },
        priceComment:{
            type: STRING(100),
            comment: "报价备注"
        },
        createTime:{
            type:BIGINT(15),
            comment:"创建时间"
        },
        priceTime: {
            type:BIGINT(15),
            comment:"报价时间"
        },
        feedbackTime: {
            type: BIGINT(15),
            comment: "反馈时间"
        },
        state: {
            type: INTEGER,
            allowNull: false,
            default: 0,
            comment: "需求状态"
        }
    },{
        freezeTabName:true,
        underscored:true,
		tableName:"demand",
		timestamps:false,
        classMethods:{
            * justConutDemand(options){
                var submit = yield this.count({
                    where: {
                        state: 0,
                        comId: options.comId,
                    }
                })
                const price = yield this.count({
                    where: {
                        state: 1,
                        comId: options.comId,
                    }
                })
                const priced = yield this.count({
                    where: {
                        state: 2,
                        comId: options.comId,
                    }
                })
                const unDeal = yield this.count({
                    where: {
                        state: 3,
                        comId: options.comId,
                    }
                })
                const deal = yield this.count({
                    where: {
                        state: 4,
                        comId: options.comId,
                    }
                })
                return {
                    demand:{
                        submit,price,priced,unDeal,deal
                    }
                }
            },
            * countDemand(options,num){
                var submit = yield this.count({
                    where: {
                        state: 0,
                        comId: options.comId,
                    }
                })
                const price = yield this.count({
                    where: {
                        state: 1,
                        comId: options.comId,
                    }
                })
                const unDeal = yield this.count({
                    where: {
                        state: 2,
                        comId: options.comId,
                    }
                })
                const deal = yield this.count({
                    where: {
                        state: 3,
                        comId: options.comId,
                    }
                })
                num ? submit += 1 : '';
                app.logger.info('socket.io信息：',app.io);
                return new Promise((res,rej)=>{
                    app.io.in(`${options.comId}`).emit('update',{demand:{
                        submit,price,unDeal,deal
                    }});
                    res(true);
                })
            },
            * submitUpdate(options) {
                if(!options.demandNo) return {
                    code: -1,
                    msg: "请选择要修改的记录",
                }
                if(!options.demandDetails) return {
                    code: -1,
                    msg: "请补充需求明细"
                }
                yield this.destroy({
                    where:{
                        demandNo:{
                            $in:options.demandNo.split(',')
                        }
                    }
                })
                yield app.model.DemandDetail.destroy({
                    where:{
                        demandNo:{
                            $in:options.demandNo.split(',')
                        }
                    }
                })
                var demandWeight = 0;
                options.demandDetails.forEach( v => {
                    demandWeight += (v.demandWeight - 0);
                });
                const randomNo = `D${options.comId}${new Date().getTime()}`;
                const isSuccess = yield app.model.transaction(async (t) => {
                    return await this.create(
                        Object.assign(options,{
                        state: 0,
                        demandNo: randomNo,
                        createTime: +new Date(),
                        demandWeight,
                        demandAmount: 0
                    }),{transaction:t}).then((res)=>{
                        var demandDetails = options.demandDetails;
                        return Promise.all(demandDetails.map((v)=>{
                            app.model.DemandDetail.create({
                                demandNo: randomNo,
                                spec: v.spec,
                                type:v.type,
                                demandAmount: v.demandAmount || '1支',
                                perAmount: Number(v.perAmount) || 100,
                                factoryPrice: Number(v.factoryPrice) || 0,
                                demandWeight: Number(v.demandWeight) || 0,
                                freight: Number(v.freight) || 0,
                            },{transaction:t})
                        }));
                    });
                }).then((res)=>{
                    return true;
                }).catch((err)=>{
                    return false
                })
                if(isSuccess){
                    return {
                        code:200,
                        msg:"提交成功"
                    }
                }else{
                    return {
                        code: -1,
                        msg: "提交失败",
                    }
                }
            },
            * add(options){
                if(!options.demandDetails) return {
                    code: -1,
                    msg: "请补充需求明细"
                }
                var demandWeight = 0;
                options.demandDetails.forEach( v => {
                    demandWeight += (v.demandWeight - 0);
                });
                const randomNo = `D${options.comId}${new Date().getTime()}`;
                const isSuccess = app.model.transaction(async (t)=>{
                    return await this.create(
                        Object.assign(options,{
                        state: 0,
                        demandNo: randomNo,
                        createTime: +new Date(),
                        demandWeight,
                        demandAmount: 0,
                    }),{transaction:t}).then((res)=>{
                        var demandDetails = options.demandDetails;
                        return Promise.all(demandDetails.map((v)=>{
                            app.model.DemandDetail.create({
                                demandNo: randomNo,
                                spec: v.spec,
                                type:v.type,
                                demandAmount:v.demandAmount || '1支',
                                perAmount: Number(v.perAmount) || 100,
                                factoryPrice: Number(v.factoryPrice) || 0,
                                demandWeight: Number(v.demandWeight) || 0,
                                freight: Number(v.freight) || 0,
                            },{transaction:t})
                        }));
                    });
                }).then((res)=>{
                    return true;
                }).catch((err)=>{
                    return false
                })
                if(isSuccess){
                    yield this.countDemand(options,1);
                    return {
                        code:200,
                        msg:"提交成功"
                    }
                }else{
                    return {
                        code: -1,
                        msg: "提交失败",
                    }
                }
            },
            * update(options){
                if(!options.demandNo) return {
                    code:-1,
                    msg:"缺少查询主键"
                }
                const result = yield this.findOne({
                    where:{
                        demandNo:{
                            $eq:options.demandNo
                        }
                    }
                })
                for(var arr in options){
                    if(arr == 'userId') continue;
                    result[arr] = options[arr];
                }
                result.feedbackTime = new Date().getTime();
                const data = yield result.save();
                yield this.countDemand(options);
                return {
                    code:200,
                    msg:"更新数据成功",
                    data,
                }
            },
            * remove(options){
                if(!options.demandNo) return {
                    code:-1,
                    msg:"缺少查询主键"
                }
                yield this.destroy({
                    where:{
                        demandNo:{
                            $in:options.demandNo.split(',')
                        }
                    }
                })
                yield app.model.DemandDetail.destroy({
                    where:{
                        demandNo:{
                            $in:options.demandNo.split(',')
                        }
                    }
                })
                return {
                    code:200,
                    msg:"删除成功"
                }
            },
            * priceList(options){
                const list = yield this.findAndCountAll({
                    offset: !options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                    limit: options.pageSize?options.pageSize:15,
                    order: 'priceTime DESC , createTime DESC',
                    where:{
                        comId:{
                            $eq:options.comId
                        },
                        createTime:{
                            $between:[options.searchTime?new Date(options.searchTime).getTime() - 2.88e7:0,options.searchTime?new Date(options.searchTime).getTime() + 5.86e7:99999999999999999]
                        },
                        userId:{
                            $eq:options.userId,
                        },
                        state: (function(){
                            return options.state ? {
                                $eq: options.state
                            } : '';
                        })()
                    }
                })
                return {
                    code:200,
                    msg:"查询数据成功",
                    data:{
                        totalCount:list.count,
                        row:list.rows,
                        page:options.page?options.page:1,
                        pageSize:options.pageSize?options.pageSize:15
                    }
                }
            },
            * detail(options){
                if(!options.demandNo) return {
                    code:-1,
                    msg:'缺少需求编号',
                }
                const res = yield app.model.DemandDetail.findAll({
                    where:{
                        demandNo:{
                            $eq:options.demandNo,
                        }
                    }
                })
                return {
                    code:200,
                    data:res || [],
                }
            },
            * price(options){
                if(!options.demandNo) return {
                    code: -1,
                    msg: '缺少需求编号'
                }
                if(!options.demandPrices || options.length <= 0) return {
                    code: -1,
                    msg: '缺少报价信息'
                } 
                if(options.imp == 2){
                    const isSuccess = yield app.model.transaction(async (t) => {
                        return Promise.all(options.demandPrices.map( v => {
                            app.model.DemandDetail.update({
                                feedbackPrice: v.feedbackPrice - 0 || 0,
                            },{
                                where:{
                                    demandDetailId:{
                                        $eq: v.demandDetailId
                                    }
                                },
                                transaction: t,
                            })
                        }))
                    }).then((res) => {
                        return true;
                    }).catch(err => {
                        return false;
                    })
                    if(isSuccess) {
                        yield app.model.query(`
                            UPDATE demand SET state = 2
                            WHERE demandNo = :demandNo
                        `,{
                            replacements:{
                                demandNo: options.demandNo,
                            }
                        })
                        yield this.countDemand(options);
                        return {
                            code: 200,
                            msg: '报价成功'
                        }
                    }
                    return {
                        code: -1,
                        msg: '报价出错'
                    }
                }
                const isSuccess = yield app.model.transaction(async (t) => {
                    return Promise.all(options.demandPrices.map( v => {
                        app.model.DemandDetail.update({
                            factoryPrice: v.factoryPrice || 0,
                            freight: v.freight || 0,
                            comment: v.comment,
                        },{
                            where:{
                                demandDetailId:{
                                    $eq: v.demandDetailId
                                }
                            },
                            transaction: t,
                        })
                    }))
                }).then((res) => {
                    return true;
                }).catch(err => {
                    return false;
                })
                if(isSuccess) {
                    yield app.model.query(`
                        UPDATE demand SET state = 1,priceTime = :priceTime,timeConsume = :timeConsume,
                        priceUser = :priceUser,priceComment = :priceComment
                        WHERE demandNo = :demandNo
                    `,{
                        replacements:{
                            priceTime: +new Date(),
                            demandNo: options.demandNo,
                            timeConsume: options.timeConsume || 0,
                            priceUser: options.userId,
                            priceComment: options.priceComment || '',
                        }
                    })
                    yield this.countDemand(options);
                    return {
                        code: 200,
                        msg: '报价成功'
                    }
                }
                return {
                    code: -1,
                    msg: '报价出错'
                }
            },
            * save(options) {
                if(!options.demandNo) return {
                    code: -1,
                    msg: '缺少需求编号'
                }
                if(!options.demandPrices || options.length <= 0) return {
                    code: -1,
                    msg: '缺少报价信息'
                } 
                const isSuccess = yield app.model.transaction(async (t) => {
                    return Promise.all(options.demandPrices.map( v => {
                        app.model.DemandDetail.update({
                            factoryPrice: v.factoryPrice || 0,
                            freight: v.freight || 0,
                            comment: v.comment,
                        },{
                            where:{
                                demandDetailId:{
                                    $eq: v.demandDetailId
                                }
                            },
                            transaction: t,
                        })
                    }))
                }).then((res) => {
                    return true;
                }).catch(err => {
                    return false;
                })
                if(isSuccess) {
                    yield app.model.query(`
                        UPDATE demand SET timeConsume = :timeConsume,priceComment = :priceComment
                        WHERE demandNo = :demandNo
                    `,{
                        replacements:{
                            priceTime: +new Date(),
                            demandNo: options.demandNo,
                            timeConsume: options.timeConsume || 0,
                            priceUser: options.userId,
                            priceComment: options.priceComment || '',
                        }
                    })
                    yield this.countDemand(options);
                    return {
                        code: 200,
                        msg: '报价成功'
                    }
                }
                return {
                    code: -1,
                    msg: '报价出错'
                }
            },
            * list(options){//定制化需求报价
                if(!options.comId) return {
                    code:-1,
                    msg:"缺少公司信息"
                }
                if(options.comId == '00') {
                    const list = yield this.findAndCountAll({
                        offset: !options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                        limit: options.pageSize?options.pageSize:15,
                        order: 'feedbackTime DESC , priceTime DESC , createTime ASC',
                        where:{
                            userId: {
                                $like: options.demandUser ? `%${options.demandUser}%` : '%%'
                            },
                            createTime:{
                                $between:[options.createTime?new Date(options.createTime).getTime() - 2.88e7:0,options.endTime?new Date(options.endTime).getTime() + 5.86e7:99999999999999999]
                            },
                            customerName:{
                                $like:options.customName ? `%${options.customName}%` : '%%'
                            }
                        }
                    })
                    return {
                        code:200,
                        msg:"查询数据成功",
                        data:{
                            totalCount:list.count,
                            row:list.rows,
                            page:options.page?options.page:1,
                            pageSize:options.pageSize?options.pageSize:15
                        }
                    }
                }else{
                    const [$1, $2] = yield [app.model.query(`SELECT d.* FROM demand d
                        INNER JOIN (SELECT dd.demandNo from  demand_detail dd
                        WHERE dd.spec LIKE :spec GROUP BY dd.demandNo) as ddd
                        ON ddd.demandNo = d.demandNo
                        WHERE d.comId = :comId 
                        AND d.userId LIKE :userId 
                        AND d.createTime BETWEEN :startTime AND :endTime 
                        AND (:demandNo <> '' OR (d.state = :state OR :state = '')) 
                        AND (d.demandNo = :demandNo OR :demandNo = '')
                        AND d.customerName LIKE :customerName 
                        ORDER BY feedbackTime DESC, priceTime DESC, createTime ASC LIMIT :start, :offset`, {
                        replacements: {
                            comId: options.comId,
                            demandNo: options.demandNo || '',
                            spec: options.spec ? `%${options.spec}%` : '%%',
                            userId: options.demandUser ? `%${options.demandUser}%` : '%%',
                            startTime: options.createTime ? new Date(options.createTime).getTime() - 2.88e7 : 0,
                            endTime: options.endTime ? new Date(options.endTime).getTime() + 5.86e7 : 99999999999999999,
                            state: options.state || '',
                            customerName:options.customName ? `%${options.customName}%` : '%%',
                            start:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                            offset:options.pageSize?options.pageSize:15,
                        }
                    }),
                    app.model.query(`SELECT count(1) as count FROM demand d 
                        INNER JOIN (SELECT dd.demandNo from demand_detail dd
                        WHERE dd.spec LIKE :spec GROUP BY dd.demandNo) as ddd
                        ON ddd.demandNo = d.demandNo
                        WHERE d.comId = :comId 
                        AND d.userId LIKE :userId 
                        AND d.createTime BETWEEN :startTime AND :endTime 
                        AND (:demandNo <> '' OR (d.state = :state OR :state = '')) 
                        AND (d.demandNo = :demandNo OR :demandNo = '')
                        AND d.customerName LIKE :customerName `, {
                        replacements: {
                            comId: options.comId,
                            demandNo: options.demandNo || '',
                            userId: options.demandUser ? `%${options.demandUser}%` : '%%',
                            spec: options.spec ? `%${options.spec}%` : '%%',
                            startTime: options.createTime ? new Date(options.createTime).getTime() - 2.88e7 : 0,
                            endTime: options.endTime ? new Date(options.endTime).getTime() + 5.86e7 : 99999999999999999,
                            state: options.state || '',
                            customerName:options.customName ? `%${options.customName}%` : '%%',
                        }
                    })];
                    if(!$1[0] || $1[0].length === 0) return {
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
                    result.pageSize = options.pageSize?options.pageSize:15;
                    return {
                        code:200,
                        msg:"查询成功",
                        data:result,
                    }
                }
            },
            * checkRepeate(options) { //检查重复需求
                var demandWeight = 0; 
                options.demandDetails.forEach( v => {
                    demandWeight += (v.demandWeight - 0);
                });
                var now = new Date();
                var today = now.getFullYear() + '-' + ((now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))) + '-' + (now.getDate() > 9 ? now.getDate() : ('0' + now.getDate()));
                const isExist = yield this.findOne({
                    where: {
                        demandWeight: {
                            $eq: demandWeight
                        },
                        createTime: {
                            $between: [new Date(today).getTime() - 5.47e8, new Date(today).getTime() + 5.86e7]
                        }
                    }
                })
                if(isExist) {
                    return {
                        code: -1,
                        msg: "有重复需求",
                        data: isExist
                    }
                }else{
                    return {
                        code: 200,
                        msg: "可以添加的需求"
                    }
                }
            },
            
            // 按日期获取销售数据
            * getSellerDataByDate (date) {
                const data = yield app.model.query(`SELECT u.userId, u.comId, d.state, SUM(d.demandWeight) as weight, count(d.state) as count FROM user_info u
                    INNER JOIN user_role ur
                            ON ur.crossAuth = 0
                           AND ur.demandAuth = 1
                           AND ur.userId = u.userId
                           AND ur.comId = u.comId
                    LEFT JOIN demand d
                           ON d.userId = u.userId
                          AND d.comId = u.comId
                          AND d.createTime > :dateStart
                          AND d.createTime < :dateEnd
                    GROUP BY u.comId, u.userId, d.state`, {
                        replacements: {
                            dateStart: new Date(`${date} 00:00:00`).getTime(),
                            dateEnd: new Date(`${date} 23:59:59`).getTime()
                        }
                    })
                return data[0]
            }
        }
    })
}