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
            type: INTEGER,
            comment:"需求吨位"
        },
        demandAmount: {
            type: INTEGER,
            comment:"需求数量"
        },
        userId: {
            type: STRING(20),
            comment:"业务员"
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
        createTime:{
            type:BIGINT(15),
            comment:"创建时间"
        },
        priceTime: {
            type:BIGINT(15),
            comment:"报价时间"
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
                return {
                    demand:{
                        submit,price,unDeal,deal
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
                return new Promise((res,rej)=>{
                    app.io.in(`${options.comId}`).emit('update',{demand:{
                        submit,price,unDeal,deal
                    }});
                    res(true);
                })
            },
            * add(options){
                if(!options.demandDetails) return {
                    code: -1,
                    msg: "请补充需求明细"
                }
                const randomNo = `D${options.comId}${new Date().getTime()}`;
                const isSuccess = app.model.transaction(async (t)=>{
                    return await this.create(
                        Object.assign(options,{
                        state: 0,
                        demandNo: randomNo,
                        createTime: +new Date()
                    }),{transaction:t}).then((res)=>{
                        var demandDetails = options.demandDetails;
                        return Promise.all(demandDetails.map((v)=>{
                            app.model.DemandDetail.create({
                                demandNo: randomNo,
                                spec: v.spec,
                                type:v.type,
                                demandAmount:Number(v.demandAmount) || 0,
                                perAmount: Number(v.perAmount) || 100,
                                factoryPrice:Number(v.factoryPrice) || 0,
                                demandWeight:Number(v.demandWeight) || 0,
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
                return {
                    code:200,
                    msg:"删除成功"
                }
            },
            * priceList(options){
                const list = yield this.findAndCountAll({
                    offset:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                    limit:options.pageSize?options.pageSize:15,
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
                const isSuccess = yield app.model.transaction(async (t) => {
                    return Promise.all(options.demandPrices.map( v => {
                        app.model.DemandDetail.update({
                            factoryPrice: v.factoryPrice || 0,
                            freight: v.freight || 0
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
                        UPDATE demand SET state = 1,priceTime = :priceTime,timeConsume = :timeConsume
                        WHERE demandNo = :demandNo
                    `,{
                        replacements:{
                            priceTime: +new Date(),
                            demandNo: options.demandNo,
                            timeConsume: options.timeConsume || 0,
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
                const list = yield this.findAndCountAll({
                    offset:!options.page?0:(options.page - 1)*(options.pageSize?options.pageSize:15),
                    limit:options.pageSize?options.pageSize:15,
                    where:{
                        comId:{
                            $eq:options.comId
                        },
                        createTime:{
                            $between:[options.searchTime?new Date(options.searchTime).getTime() - 2.88e7:0,options.searchTime?new Date(options.searchTime).getTime() + 5.86e7:99999999999999999]
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
            }
        }
    })
}