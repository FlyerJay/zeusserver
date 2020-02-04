/**
 * @author flyerjay
 * 供应商中间表
 * @date 2017-10-16
 */

 'use strict';

 module.exports = (app) => {
   const { STRING, INTEGER } = app.Sequelize;
   return app.model.define('SupplierRelate', {
     supplierId: {
       type: INTEGER,
       allowNull: false,
       comment: '与供应商表作关联用',
       primaryKey: true
     },
     comId: {
       type: STRING(2),
       primaryKey: true,
       allowNull: false,
       comment: '与公司进行关联'
     },
     isValide: {
       type: INTEGER,
       allowNull: false,
       comment: '是否启用'
     },
     benifitAdjust: {
       type: INTEGER,
       allowNull: true,
       comment: '政策浮动影响'
     },
     benifit: {
       type: INTEGER,
       allowNull: true,
       comment: '厂家优惠'
     },
     valueTime: {
       type: STRING(20),
       comment: '价格表更新时间'
     },
     inventoryTime: {
       type: STRING(20),
       comment: '库存表更新时间'
     }
   }, {
     freezeTabName: true,
     tableName: 'supplier_relate',
     underscored: true,
     timestamps: false,
     classMethods: {
       * openRelate(option) {
         if (!option.comId) return {
           code: -1,
           msg: '缺少公司信息'
         };
         if (!option.supplierId) return {
           code: -1,
           msg: '缺少供应商信息'
         };
         var res = yield this.findOne({
           where: {
             supplierId: {
               $eq: option.supplierId
             },
             comId: {
               $eq: option.comId
             }
           }
         });
         if (res) {
           yield res.update({isValide: 1});
         } else {
           yield this.create(Object.assign(option, {isValide: 1}));
         }
         return {
           code: 200,
           msg: '开启成功'
         };
       },
       * closeRelate(option) {
         yield app.model.query('UPDATE supplier_relate sr SET sr.isValide = 0 WHERE supplierId = :supplierId AND comId = :comId', {
           replacements: {
             supplierId: option.supplierId,
             comId: option.comId
           }
         });
         return {
           code: 200,
           msg: '关闭成功'
         };
       },
       * updates(options) {
         var result = yield this.findOne({
           where: {
             supplierId: {
               $eq: options.supplierId
             }
           }
         });
         if (!result) return {
           code: -1,
           msg: '修改的记录不存在'
         };
         var lastBenifit = result.dataValues.benifit;
         for (var props in options) {
           if (props === 'benifit') {
             yield app.model.query('UPDATE supplier_relate SET benifit = :benifit,benifitAdjust = :benifitAdjust WHERE supplierId = :supplierId AND comId = :comId', {
               replacements: {
                 supplierId: options.supplierId,
                 benifit: options.benifit - 0,
                 benifitAdjust: options.benifit - lastBenifit,
                 comId: options.comId
               }
             });
           } else if (props !== 'row' && props !== 'userId' && props !== 'role' && props !== 'comId' && props !== 'tempComId') {
             yield app.model.query(`UPDATE supplier SET ${props} = :value WHERE supplierId = :supplierId`, {
               replacements: {
                 supplierId: options.supplierId,
                 value: options[props] + ''
               }
             });
           }

         }
         if (options.benifit) {
           var supplierName = yield app.model.query('SELECT supplierName from supplier where supplierId = :supplierId', {
             replacements: {
               supplierId: options.supplierId
             }
           });
           yield app.model.query('INSERT INTO message (messageType, comId, createTime, message) values(\'1\',:comId,:createTime,:message)', {
             replacements: {
               comId: options.comId,
               createTime: new Date().getTime(),
               message: `${supplierName[0][0].supplierName}政策下浮更新为${options.benifit}`
             }
           });
         }
         return {
           code: 200,
           msg: '修改成功'
         };
       }
     }
   });
 };