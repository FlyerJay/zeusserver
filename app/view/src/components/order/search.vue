<template>
  <div class="order-wrap">
    <el-form :inline="true" :model="stockParams" class="demo-form-inline">
      <el-form-item label="规格">
        <el-input v-model="stockParams.spec" placeholder="规格"></el-input>
      </el-form-item>
      <el-form-item label="到岸目的地">
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
          <el-option value="镀锌">镀锌</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchStock" :loading="loading">厂家现货查询</el-button>
      </el-form-item>
    </el-form>
    <div class="sea-title">厂家现货价格/库存表:</div>
    <div class="tb-wrap">
      <el-table :data="stockInfo.row" stripe style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中">
        <el-table-column prop="spec" label="规格" width="">
        </el-table-column>
        <el-table-column prop="lastUpdateTime" label="最新更新时间" width="">
        </el-table-column>
        <el-table-column prop="type" label="类别" width="">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商">
        </el-table-column>
        <el-table-column prop="value" sortable label="出厂价(元/吨)">
        </el-table-column>
        <el-table-column prop="inventoryAmount" label="库存（件）">
        </el-table-column>
        <el-table-column prop="perWeight" label="单支重量(kg)" :formatter="perWeightFormatter">
        </el-table-column>
        <el-table-column prop="inventoryWeight" label="库存重量(吨)" :formatter="weightFormatter">
        </el-table-column>
        <el-table-column prop="freight" label="运费（元）">
        </el-table-column>
        <el-table-column prop="benifit" label="厂家政策优惠（元/吨）">
        </el-table-column>
        <el-table-column prop="benifit" sortable label="出厂单价（元）">
        </el-table-column>
        <el-table-column label="操作" align="center" property="id">
          <template scope="scope">
            <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning" v-if="scope.row.value">下单</el-button>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="stockParams.page"
            layout=" prev, pager, next"
            :page-size="30"
            :total="stockInfo.totalCount"
          >
          </el-pagination>
      </div>
      <el-dialog title="" v-model="dlgShopVisible" size="tiny">
        <el-form :model="cartParams" label-width="90px" label-position="left">
          <el-form-item label="需求数量：">
            <el-input style="width:90%" v-model="cartParams.chartAmount" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="confirmTocart">确 定</el-button>
          <el-button @click="dlgShopVisible = false">取 消</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script>
  import {
    loadStock, //现货查询
    addTocart, //加入购物车
    loadOrdAddress //读取到岸目的地址
  } from '../../vuex/action'
  
  export default {
    vuex: {
      actions: {
        loadStock,
        addTocart,
        loadOrdAddress
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
          supplierInventoryId: ''
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
        loading: true,
      }
    },
    methods: {
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
        const long = Number(row.long);
        const perimeter = 2 * height + 2 * width;
        const amount = Number(row.perAmount);
        const inventoryAmount = Number(row.inventoryAmount);
        return ((perimeter / 3.14 - land) * land * 6 * 0.02466 * amount * inventoryAmount / 1000).toFixed(2);
      },
      perWeightFormatter(row, column) {
        const specArr = row.spec.split('*');
        const height = Number(specArr[0]);
        const width = Number(specArr[1]);
        const land = Number(specArr[2]);
        const long = Number(row.long);
        const perimeter = 2 * height + 2 * width;
        const amount = Number(row.perAmount);
        const inventoryAmount = Number(row.inventoryAmount);
        return ((perimeter / 3.14 - land) * land * 6 * 0.02466).toFixed(2);
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
      handleCurrentChange(val) {
        this.stockParams.page = val;
        this.loading = true;
        this.loadStock(this.stockParams)
          .then(() => {
            this.loading = false;
        });
      }
    },
    mounted: function() {
      this.loadStock(this.stockParams)
        .then(() => {
          this.loading = false;
        });
      this.loadOrdAddress();
    }
  }
</script>

<style>
  .sea-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
</style>