<template>
  <div class="order-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="规格">
        <el-input v-model="stockParams.spec" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="到岸目的地">
        <el-select v-model="stockParams.region" placeholder="活动区域">
          <el-option label="南京" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="材质">
        <el-select v-model="stockParams.material" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="stockParams.type" placeholder="活动区域">
          <el-option label="矩管" value="矩管"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchStock">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-wrap">
      <el-table :data="stockList" stripe style="width: 100%">
        <el-table-column prop="spec" label="规格" width="">
        </el-table-column>
        <el-table-column prop="date" label="最新更新时间" width="">
        </el-table-column>
        <el-table-column prop="type" label="类别" width="">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商">
        </el-table-column>
        <el-table-column prop="inventoryAmount" label="出厂价(元/吨)">
        </el-table-column>
        <el-table-column prop="inventoryWeight" label="库存（支）">
        </el-table-column>
        <el-table-column prop="freight" label="运费（元）">
        </el-table-column>
        <el-table-column prop="benifit" label="厂家政策优惠（元/吨）">
        </el-table-column>
        <el-table-column prop="perAmount" label="出厂单价（元）">
        </el-table-column>
        <el-table-column label="操作" align="center" property="id">
          <template scope="scope">
              <el-button size="small" @click="enterNum(scope.index, scope.row)" type="primary">下单</el-button>
</template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="" v-model="dlgShopVisible">
      <el-form :model="cartParams">
        <el-form-item label="需求数量：">
          <el-input v-model="cartParams.charAmount" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dlgSupVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTocart">确 定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
  import {
    loadStock,
    addTocart
  } from '../../vuex/action'
  
  export default {
    vuex: {
      actions: {
        loadStock,
        addTocart
      },
      getters: {
        userInfo: ({
          common
        }) => common.userInfo,
        stockList: ({
          order
        }) => order.stockList
      }
    },
    data() {
      return {
        cartParams: {
          userId: this.userInfo.userId,
          comId: this.userInfo.comId,
          charAmount: '',
          supplierInventoryId: ''
        },
        stockParams: {
          spec: '',
          material: '',
          type: '',
          region: '',
          comId: this.userInfo.comId
        },
        dlgShopVisible: false
      }
    },
    methods: {
      searchStock() {
        this.loadStock(this.stockParams)
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
      }
    },
    mounted: function() {
      this.loadStock(this.stockParams)
    }
  }
</script>

<style media="less">
  .tb-wrap {
    padding: 20px;
    border: 1px solid #d3dce6;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    overflow: hidden;
  }
</style>
