/**
 * author:flyerjay
 * 2017-04-20
 * 供应商价格实体类
 */


module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  return app.model.define('SupplierValue', {
    supplierValueId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '价格表主键'
    },
    supplierId: {
      type: INTEGER,
      allowNull: false,
      comment: '供应商编号'
    },
    spec: {
      type: STRING(16),
      allowNull: false,
      comment: '规格'
    },
    lastUpdateTime: {
      type: INTEGER,
      allowNull: false,
      comment: '最近更新时间'
    },
    type: {
      type: STRING(10),
      comment: '类别'
    },
    value: {
      type: INTEGER,
      comment: '出厂价'
    },
    material: {
      type: STRING(10),
      comment: '材质'
    },
    adjustValue: {
      type: INTEGER,
      default: 0,
      comment: '调整价'
    }
  }, {
    freezeTabName: true,
    underscored: true,
    tableName: 'supplier_value',
    timestamps: false,
    classMethods: {
      associate() {
        app.model.SupplierValue.belongsTo(app.model.Supplier, { foreignKey: 'supplierId', targetKey: 'supplierId' });
      },
      * getList(options) {
        if (!options.comId) {
          return {
            code: -1,
            msg: '缺少公司信息'
          };
        }
        if (options.comId === '00') {
          options.comId = options.tempComId || '01';
        }
        const [$1, $2] = yield [app.model.query(`SELECT sv.supplierValueId,sv.supplierId,sv.spec,sv.type,sv.value,sv.material,sv.lastUpdateTime,
                s.supplierName,s.address,sr.benifit
                FROM (select * from (select * from (select * from supplier_value order by lastUpdateTime desc limit 0,100000000) sv group by supplierId,type,spec) sv) sv
                INNER JOIN supplier s ON
                s.supplierName LIKE :supplierName
                AND s.isDelete = 'N'
                AND (s.address = :address OR :address = '')
                INNER JOIN supplier_relate sr ON
                sr.supplierId = s.supplierId
                AND sr.supplierId = sv.supplierId
                AND sr.comId = :comId
                AND sr.isValide = 1
                WHERE sv.spec LIKE :spec
                AND (sv.type = :type OR :type = '')
                ORDER BY sv.lastUpdateTime DESC,sv.supplierId,sv.type,sv.spec
                LIMIT :start,:offset`, {
                  replacements: {
                    address: options.address ? options.address : '',
                    comId: options.comId,
                    supplierName: options.supplierName ? `%${options.supplierName}%` : '%%',
                    spec: options.spec ? `%${options.spec}%` : '%%',
                    type: options.type ? options.type : '',
                    start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 15),
                    offset: options.pageSize ? options.pageSize : 15
                  }
                }),
          app.model.query(`SELECT count(1) as count
                FROM (select * from (select * from (select * from supplier_value order by lastUpdateTime desc limit 0,100000000) sv group by supplierId,type,spec) sv) sv
                INNER JOIN supplier s ON
                s.supplierName LIKE :supplierName
                AND s.isDelete = 'N'
                AND (s.address = :address OR :address = '')
                INNER JOIN supplier_relate sr ON
                sr.supplierId = s.supplierId
                AND sr.supplierId = sv.supplierId
                AND sr.comId = :comId
                AND sr.isValide = 1
                WHERE sv.spec LIKE :spec
                AND (sv.type = :type OR :type = '')`, {
                  replacements: {
                    address: options.address ? options.address : '',
                    comId: options.comId,
                    supplierName: options.supplierName ? `%${options.supplierName}%` : '%%',
                    spec: options.spec ? `%${options.spec}%` : '%%',
                    type: options.type ? options.type : '',
                    start: !options.page ? 0 : (options.page - 1) * (options.pageSize ? options.pageSize : 15),
                    offset: options.pageSize ? options.pageSize : 15
                  }
                })];
        if (!$1[0] || $1[0].length === 0) {
          return {
            code: 200,
            msg: '数据为空',
            data: {
              count: 0,
              row: []
            }
          };
        }
        const result = {};
        result.row = $1[0];
        result.totalCount = $2[0][0].count;
        result.page = options.page ? options.page : 0;
        result.pageSize = options.pageSize ? options.pageSize : 15;
        return {
          code: 200,
          msg: '查询成功',
          data: result
        };
      },
      * addValue(options) {
        if (!options.supplierId) {
          return {
            code: -1,
            msg: '请选择供应商'
          };
        }
        options.comId = '00';
        if (!options.spec) {
          return {
            code: -1,
            msg: '规格不能为空'
          };
        }
        if (!options.type) {
          return {
            code: -1,
            msg: '货物类别不能为空'
          };
        }
        if (!options.comId) {
          return {
            code: -1,
            msg: '缺少公司信息'
          };
        }
        options.value = Number(options.value);
        const time = String(new Date().getFullYear()) + String((new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + String(new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate());
        const result = yield this.create(Object.assign(options, { lastUpdateTime: Number(time) }));
        return {
          code: 200,
          msg: '添加数据成功',
          data: result
        };
      },
      * updateValue(options) {
        if (!options.supplierValueId) {
          return {
            code: -1,
            msg: '缺少必要参数'
          };
        }
        options.comId = '00';
        if (!options.value) {
          return {
            code: -1,
            msg: '没有修改的价格'
          };
        }
        options.value = Number(options.value);
        const result = yield this.update(options, {
          where: {
            supplierValueId: {
              $eq: options.supplierValueId
            }
          }
        });
        if (!result) {
          return {
            code: -1,
            msg: '更新出错'
          };
        }
        if (result === 0) {
          return {
            code: -1,
            msg: '没有任何更新'
          };
        }
        return {
          code: 200,
          msg: '更新数据成功'
        };
      },
      * adjustValue(options) {
        if (!options.comId) {
          return {
            code: -1,
            msg: '缺少公司信息'
          };
        }
        if (!options.lastUpdateTime) {
          return {
            code: -1,
            msg: '缺少时间'
          };
        }
        if (!options.adjust) {
          return {
            code: -1,
            msg: '缺少调整价格'
          };
        }
        options.adjust = Number(options.adjust);
        yield app.model.query(`update supplier_value sv,supplier s set sv.value = sv.value + ${options.adjust},sv.adjustValue = ${options.adjust} where
            sv.lastUpdateTime = :lastUpdateTime
            AND sv.spec LIKE :spec
            AND (sv.type = :type OR :type = '')
            AND s.supplierName LIKE :supplierName
            AND s.supplierId = sv.supplierId
            AND (s.address = :address OR :address = '')
        `, {
          replacements: {
            comId: options.comId,
            lastUpdateTime: options.lastUpdateTime,
            spec: options.spec ? `%${options.spec}%` : '%%',
            type: options.type ? options.type : '',
            address: options.address ? options.address : '',
            supplierName: options.supplierName ? `%${options.supplierName}%` : '%%'
          }
        });
        return {
          code: 200,
          msg: '批量修改成功'
        };
      },
      * deleteValue(options) {
        if (!options.supplierId) {
          return {
            code: -1,
            msg: '缺少必要参数'
          };
        }
        const result = yield this.destroy({
          where: {
            supplierInventoryId: {
              $eq: options.supplierValueId
            }
          }
        });

        if (!result) {
          return {
            code: -1,
            msg: '删除错误'
          };
        }
        if (result === 0) {
          return {
            code: -1,
            msg: '受影响数据为0'
          };
        }
        return {
          code: 200,
          msg: '删除数据成功'
        };
      },
      * history(options) {
        if (!options.type) {
          return {
            code: -1,
            msg: '请选择要类型'
          };
        }
        if (!options.supplierId) {
          return {
            code: -1,
            msg: '请选择供应商'
          };
        }
        if (!options.spec) {
          return {
            code: -1,
            msg: '请输入具体规格'
          };
        }
        const res = yield app.model.query(`SELECT sv.spec,sv.value,sv.lastUpdateTime as time,s.supplierName FROM supplier_value sv 
                INNER JOIN supplier s 
                ON s.supplierId = sv.supplierId
                AND s.comId = :comId
                WHERE sv.supplierId = :supplierId
                AND sv.type = :type 
                AND sv.spec LIKE :spec
                GROUP BY sv.spec,sv.lastUpdateTime ORDER BY sv.lastupdateTime asc`
                , {
                  replacements: {
                    comId: options.comId,
                    type: options.type,
                    supplierId: options.supplierId,
                    spec: `%${options.spec}%`
                  }
                });
        return {
          code: 200,
          data: res[0]
        };
      },
      * dailyPrice(options) {
        const res1 = yield app.model.query(`
          select s.supplierName,s.supplierId,sv.spec,sv.type,(sv.value - ifnull(sr.benifit, 0) + ifnull(f.freight, 0)) as value from supplier_value sv
          INNER JOIN supplier s
              on s.isDelete = 'N'
              and s.supplierId = sv.supplierId
          LEFT JOIN supplier_relate sr
              on s.supplierId = sr.supplierId
              and sr.supplierId = sv.supplierId
              and sr.comId = :comId
              and sr.isValide = 1
          LEFT JOIN freight f
              on sr.comId = f.comId
              and f.address = s.address
          where sv.spec in ('30*30*2.40', '40*40*2.50', '80*80*3.00', '100*100*3.00', '120*120*3.50', '150*150*4.50', '200*200*5.50', '200*300*5.50')
              and sv.type = '黑管'
        `, {
          replacements: {
            comId: options.comId,
          }
        });
        const res2 = yield app.model.query(`
          select s.supplierName,s.supplierId,sv.spec,sv.type,(sv.value - ifnull(sr.benifit, 0) + ifnull(f.freight, 0)) as value from supplier_value sv
          INNER JOIN supplier s
              on s.isDelete = 'N'
              and s.supplierId = sv.supplierId
          LEFT JOIN supplier_relate sr
              on s.supplierId = sr.supplierId
              and sr.supplierId = sv.supplierId
              and sr.comId = :comId
              and sr.isValide = 1
          LEFT JOIN freight f
              on sr.comId = f.comId
              and f.address = s.address
          where sv.spec in ('20*40*2.50', '40*40*3.50', '60*60*3.75', '40*80*3.50', '50*100*3.75', '100*100*3.75')
              and sv.type = '热镀锌'
        `, {
          replacements: {
            comId: options.comId,
          }
        });
        return {
          code: 200,
          data: [res1[0], res2[0]]
        };
      }
    }
  });
};
