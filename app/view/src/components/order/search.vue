<template>
  <div class="order-wrap">
    <el-form :inline="true" :model="stockParams" class="demo-form-inline">
      <el-form-item label="规格">
        <el-input v-model="stockParams.spec" placeholder="规格"></el-input>
      </el-form-item>
      <el-form-item label="到岸目的地">
        <el-input :value="this.userInfo.comId | companyFilter" :readonly="true" placeholder="目的地"></el-input>
      </el-form-item>
      <el-form-item label="供应商所在地">
        <el-select v-model="stockParams.address" placeholder="请选择">
          <el-option value="">全部</el-option>
          <el-option :label="item.address" :value="item.address" v-for="(item,index) in ordAddress" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="stockParams.type">
          <el-option value="">全部</el-option>
          <el-option value="黑管">黑管</el-option>
          <el-option value="镀锌带">镀锌带</el-option>
          <el-option value="热镀锌">热镀锌</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchStock" :loading="loading" @v-on:keyup.enter="searchStock" class="search-bt">厂家现货查询</el-button>
      </el-form-item>
    </el-form>
    <div class="sea-title">
        厂家现货价格/库存表:
        <el-button type="success" @click="dlgTbheadVisible = true" style="float:right" size="small"><i class="iconfont icon-custom">&nbsp;</i>自定义表头</el-button>
        <!--<span class="warn-txt"><span class="red-mark">标记表示库存超期</span><span class="yellow-mark">标记表示虚拟库存</span></span>-->
    </div>
    <div class="tb-wrap">
      <el-table :data="stockInfo.row" :row-class-name="tableRowClassName" stripe style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
        <el-table-column prop="spec" label="规格" width="140px" v-if="checkedTBhead.indexOf('规格') > -1">
        </el-table-column>
        <el-table-column prop="long" label="长度" width="70px" v-if="checkedTBhead.indexOf('长度') > -1">
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="更新时间" width="110px" v-if="checkedTBhead.indexOf('更新时间') > -1">
        </el-table-column>
        <el-table-column prop="type" label="类别" width="80px" v-if="checkedTBhead.indexOf('类别') > -1">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商"  v-if="checkedTBhead.indexOf('供应商') > -1">
        </el-table-column>
        <el-table-column label="到岸单价" sortable width="120px" v-if="checkedTBhead.indexOf('到岸单价') > -1">
          <template scope="scope">
            <span class="value">{{scope.row.purePrice + scope.row.freight}}</span>
            <i class="iconfont icon-down" v-if="scope.row.priceAdjust < 0 && scope.row.purePrice" style="color:#13CE66;font-size:18p;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.priceAdjust)}}</span></i>
            <i class="iconfont icon-up" v-if="scope.row.priceAdjust > 0 && scope.row.purePrice" style="color:#FF4949;font-size:18px;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.priceAdjust)}}</span></i>
          </template>
        </el-table-column>
        <el-table-column prop="purePrice" label="开单价" sortable width="110px" v-if="checkedTBhead.indexOf('开单价') > -1">
          <template scope="scope">
            <span class="value">{{scope.row.purePrice}}</span>
            <i class="iconfont icon-down" v-if="scope.row.priceAdjust < 0 && scope.row.purePrice" style="color:#13CE66;font-size:18p;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.priceAdjust)}}</span></i>
            <i class="iconfont icon-up" v-if="scope.row.priceAdjust > 0 && scope.row.purePrice" style="color:#FF4949;font-size:18px;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.priceAdjust)}}</span></i>
          </template>
        </el-table-column>
        <el-table-column prop="inventoryAmount" class-name="inventory" width="70px" label="库存" v-if="checkedTBhead.indexOf('库存') > -1">
        </el-table-column>
        <el-table-column prop="perAmount" label="包装" width="70px" v-if="checkedTBhead.indexOf('包装') > -1"></el-table-column>
        <el-table-column prop="perWeight" label="单支重量" width="100px" :formatter="perWeightFormatter" v-if="checkedTBhead.indexOf('单支重量') > -1">
        </el-table-column>
        <el-table-column prop="inventoryWeight" label="库存重量" width="100px"  :formatter="weightFormatter" v-if="checkedTBhead.indexOf('库存重量') > -1">
        </el-table-column>
        <el-table-column prop="freight" label="运费" width="70px" v-if="checkedTBhead.indexOf('运费') > -1">
        </el-table-column>
        <el-table-column prop="value" sortable label="出厂价" width="110px" v-if="checkedTBhead.indexOf('出厂价') > -1">
          <template scope="scope">
            <span class="value">{{scope.row.value}}</span>
            <i class="iconfont icon-down" v-if="scope.row.adjustValue < 0" style="color:#13CE66;font-size:18px;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.adjustValue)}}</span></i>
            <i class="iconfont icon-up" v-if="scope.row.adjustValue > 0" style="color:#FF4949;font-size:18px;text-decoration:none"><span style="font-size:8px;">{{Math.abs(scope.row.adjustValue)}}</span></i>
          </template>
        </el-table-column>
        <el-table-column prop="benifit" label="厂家优惠" v-if="checkedTBhead.indexOf('厂家优惠') > -1" width="100px">
          <template scope="scope">
            <span>{{scope.row.benifit}}</span>
            <i class="iconfont icon-down" v-if="scope.row.benifitAdjust > 0 && scope.row.purePrice" style="color:#13CE66;font-size:18p;text-decoration:none"><span style="font-size:8px;bottom:5px">{{Math.abs(scope.row.benifitAdjust)}}</span></i>
            <i class="iconfont icon-up" v-if="scope.row.benifitAdjust < 0 && scope.row.purePrice" style="color:#FF4949;font-size:18px;text-decoration:none"><span style="font-size:8px;bottom:5px">{{Math.abs(scope.row.benifitAdjust)}}</span></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" property="id" width="180px" v-if="checkedTBhead.indexOf('操作') > -1" >
          <template scope="scope">
            <el-button size="small" @click="enterNum(scope.index, scope.row)" type="success" :disabled="!scope.row.value">下单</el-button>
            <el-button size="small" @click="markNum(scope.index, scope.row)" type="warning" v-if="scope.row.mark">清除</el-button>
            <el-button size="small" @click="markNum(scope.index, scope.row)" type="info" v-else>标记
              <i class="iconfont icon-mark" :style="{'color':scope.row.markType == 1 ? '#ed3f14' : '#ff9900'}" @click.stop="scope.row.markType == 1 ? scope.row.markType = 2 : scope.row.markType = 1"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="stockParams.page" layout=" prev, pager, next" :page-size="15" :total="stockInfo.totalCount">
      </el-pagination>
    </div>
    <el-dialog title="" v-model="dlgShopVisible" size="tiny" class="custom-dialog">
      <div class="dialog-content">
        <el-input v-model="cartParams.chartAmount" type="number" placeholder="必填" auto-complete="off">
          <template slot="prepend">数量</template>
        </el-input>
        <el-input class="dialog-item" placeholder="填写备注" v-model="cartParams.comment" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
        <el-button type="info" class="dialog-item float-right" @click="confirmTocart">确 定</el-button>
        <el-button type="warning" @click="dlgShopVisible = false" class="dialog-item float-right">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" v-model="dlgTbheadVisible" size="tiny">
      <div class="tbhead-wrap">
      <el-checkbox-group v-model="checkedTBhead">
        <el-checkbox v-for="head in TBheads" :label="head" :key="head">{{head}}</el-checkbox>
      </el-checkbox-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  loadStock, //现货查询
  addTocart, //加入购物车
  loadOrdAddress, //读取到岸目的地址
  updateStock,
} from '../../vuex/action'

export default {
  vuex: {
    actions: {
      loadStock,
      addTocart,
      loadOrdAddress,
      updateStock
    },
    getters: {
      userInfo: ({
          common
        }) => common.userInfo,
      stockInfo: ({
          order
        }) => order.stockInfo,
      ordAddress: ({
          order
        }) => order.ordAddress
    }
  },
  data() {
    return {
      cartParams: {
        userId: this.userInfo.userId,
        comId: this.userInfo.comId,
        chartAmount: '',
        supplierInventoryId: '',
        comment: '',
      },
      stockParams: {
        spec: '',
        material: '',
        type: '',
        address: '',
        page: 1,
        comId: this.userInfo.comId
      },
      dlgShopVisible: false,
      dlgTbheadVisible: false,
      loading: true,
      checkedTBhead: [],
      TBheads: ['规格',	'长度',	'更新时间',	'类别',	'供应商',	'出厂价','单支重量','库存重量','库存',	'包装',	'运费',	'厂家优惠',	'到岸单价','开单价',	'操作']
    }
  },
  methods: {
    filterTag(value, row) {
      return row.tag === value;
    },
    searchStock() {
      this.loading = true;
      this.loadStock(this.stockParams)
        .then(() => {
          this.loading = false;
        });
    },
    weightFormatter(row, column) {
      const specArr = row.spec.split('*');
      const height = Number(specArr[0]);
      const width = Number(specArr[1]);
      const land = Number(specArr[2]);
      const long = Number(row.long) ? Number(row.long) : 6;
      const perimeter = 2 * height + 2 * width;
      const amount = Number(row.perAmount);
      const inventoryAmount = Number(row.inventoryAmount);
      return ((perimeter / 3.14 - land) * land * long * 0.02466 * amount * inventoryAmount / 1000).toFixed(2);
    },
    perWeightFormatter(row, column) {
      const specArr = row.spec.split('*');
      const height = Number(specArr[0]);
      const width = Number(specArr[1]);
      const land = Number(specArr[2]);
      const long = Number(row.long) ? Number(row.long) : 6;
      const perimeter = 2 * height + 2 * width;
      const amount = Number(row.perAmount);
      const inventoryAmount = Number(row.inventoryAmount);
      return ((perimeter / 3.14 - land) * land * long * 0.02466).toFixed(2);
    },
    tableRowClassName(row, index) {
      var classString = [];
      if (row.inventoryTime < new Date().formatDate('yyyyMMdd')) {
        classString.push('expired-inventory');
      }
      if (row.valueTime < new Date().formatDate('yyyyMMdd')) {
        classString.push('expired-value');
      }
      if (row.mark) {
        if (row.mark == 2) {
          classString.push('warning-inventory');
        } else {
          classString.push('error-inventory')
        }
      }

      return classString.join(' ');
    },
    confirmTocart() {
      this.addTocart(this.cartParams)
        .then(rs => {
          this.$message({
            message: `成功添加到购物车`,
            type: 'success'
          });
          this.dlgShopVisible = false;
        });
    },
    enterNum(index, row) {
      this.dlgShopVisible = true;
      this.cartParams.supplierInventoryId = row.supplierInventoryId;
    },
    markNum(index, row) {
      var params = {};
      params.supplierInventoryId = row.supplierInventoryId;
      if (row.mark) {
        params.mark = '';
        this.updateStock(params)
          .then(data => {
            row.mark = '';
            this.$message({
              message: `清楚标记成功`,
              type: 'success'
            });
          })
      } else {
        params.mark = 1;
        if (row.markType == 2) {
          params.mark = 2;
        }
        let markup = row.markType;
        this.updateStock(params)
          .then(data => {
            row.mark = markup;
            this.$message({
              message: `标记成功`,
              type: 'success'
            });
          })
      }
    },
    handleCurrentChange(val) {
      this.stockParams.page = val;
      this.loading = true;
      this.loadStock(this.stockParams)
        .then(() => {
          this.loading = false;
        });
    }
  },
  filters: {
    companyFilter(val) {
      const company = {
        '01': '南京奎鑫',
        '02': '武汉奎鑫',
        '03': '西安奎鑫',
        '04': '长春奎鑫',
        '05': '沈阳奎鑫',
        '06': '山东奎鑫',
        '07': '南昌奎鑫',
      }
      return company[val];
    }
  },
  watch: {
    checkedTBhead(val) {
      window.localStorage.setItem('tbhead', this.checkedTBhead)
    }
  },
  mounted: function () {
    var headarr = window.localStorage.getItem('tbhead');
    if(!headarr) {
      this.checkedTBhead = ['规格', '长度',	'更新时间',	'类别',	'供应商',	'出厂价',	'库存',	'包装',	'运费',	'厂家优惠',	'开单价',	'操作']
    } else {
      this.checkedTBhead = headarr.split(',');
    }
    this.loadStock(this.stockParams)
      .then(() => {
        this.loading = false;
      });
    this.loadOrdAddress();
    var  self = this;
    document.onkeyup = function(event) {
      event = event || window.event;
      if(event.keyCode === 13) {
        if(!self.dlgShopVisible && !self.dlgTbheadVisible) {
          self.searchStock()
        }
      };
    };
  }
}

</script>
  
<style lang="less">
  button {
    .iconfont {
      font-size: 12px;
      margin-left: 5px;
      &:hover {
        text-shadow: 1px 1px 5px #888;
      }
    }
  }
  .sea-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .red-mark,.yellow-mark{
    position:relative;
    padding-left:10px;
    margin-right:5px;
  }
  .red-mark:before{
    content:'';
    display:block;
    width:8px;
    background-color:#FF4949;
    position:absolute;
    top: 1px;
    bottom: 1px;
    left:0;
  }
  .yellow-mark:before{
    content:'';
    display:block;
    width:8px;
    background-color:#F7BA2A;
    position:absolute;
    top: 1px;
    bottom: 1px;
    left:0;
  }
  tr.expired-value td .value{
    color:#ed3f14;
    text-decoration:underline;
    font-weight:bold;
  }
  tr.expired-inventory td.inventory{
    color:#ed3f14;
    text-decoration:underline;
    font-weight:bold;
  }
  tr.warning-inventory td:not(:last-child) {
    color:#ff9900;
    .iconfont{
      text-decoration:none;
      &:before{
        text-decoration:none;
      }
    }
  }
  tr.error-inventory td:not(:last-child) {
    color:#ed3f14;
    .iconfont{
      text-decoration:none;
      &:before{
        text-decoration:none;
      }
    }
  }
  .tbhead-wrap {
    .el-checkbox-group {
      &:after {
        content:"";
        display: table;
        clear: both;
      }
      label.el-checkbox {
        float: left;
        width: 96px;
        margin: 0 48px 8px;
      }
    }
  }

</style>