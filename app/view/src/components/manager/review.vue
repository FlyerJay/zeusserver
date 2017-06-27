<template lang="html">
    <div class='order-wrap'>
        <el-form :inline="true" :model="orderParams" class="demo-form-inline">
          <el-form-item label="订单号:">
              <el-input v-model="orderParams.orderNo" placeholder="支持模糊搜索"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="warning" @click="searchOrder" :loading="loading">查询</el-button>
          </el-form-item>
        </el-form>
    	  <el-table :data="verify.row" v-loading.body="loading" element-loading-text="拼命加载中" border>
    	     	<el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
    	     	<el-table-column prop="createTime" label="下单时间" :formatter="dateFormat" width="180"></el-table-column>
    	     	<el-table-column prop="orderWeight" label="总吨位"></el-table-column>
    	     	<el-table-column prop="orderPrice" label="总价"></el-table-column>
    	     	<el-table-column prop="orderAdjust" label="采购下浮总额"></el-table-column>
    	     	<el-table-column prop="userId" label="下单人"></el-table-column>
    	     	<el-table-column label="操作">
    	     		<template scope="scope">
                <el-button size="small" @click="viewDetail(scope.index, scope.row)" type="info">查看</el-button>
    	     			<el-button size="small" @click="review(scope.index, scope.row)" type="warning">审核</el-button>
    	     		</template>
    	     	</el-table-column>
    	  </el-table>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="verifyParams.page"
            :page-size="30"
            layout=" prev, pager, next"
            :total="verify.totalCount">
          </el-pagination>
        </div>
        <el-dialog
        v-model="detailDialogShow"
        size="small">
          <el-table :data="orderDetail" stripe style="width: 100%" v-loading.body="detailLoading" border>
              <el-table-column prop="spec" label="规格"/>
              <el-table-column prop="type" label="类型"/>
              <el-table-column prop="supplierName" label="供应商"/>
              <el-table-column prop="orderAmount" label="数量"/>
              <el-table-column prop="unitPrice" label="单价"/>
              <el-table-column prop="Weight" label="重量"/>
              <el-table-column prop="orderDcrease" label="下浮"/>
          </el-table>
        </el-dialog>
    </div>

</template>

<script>

import{
    loadVerifylist,
    reviewVerify,
    loadOrderDetail,
    loadOrderList
} from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadVerifylist,
       reviewVerify,
       loadOrderDetail,
       loadOrderList
     },
     getters:{
        userInfo:({
        	common
        })=>common.userInfo,
        verify:({
        	manager
        })=>manager.verify,
        orderDetail: ({
          order
        }) => order.orderDetail
     }
  },
  data(){
      return{
          verifyParams: {
            page: 1,
            shenhe: "未审核"
          },
          reviewParams: {
            orderNo: '',
            operator: '',
            comId: ''
          },
          orderParams: {
            orderNo:'',
            comId: this.userInfo.comId,
            page:1
          },
          loading: true,
          detailDialogShow: false,
          detailLoading: true
      }
  },
  methods:{
    handleCurrentChange(val){
      this.verifyParams.page = val;
      this.loading = true;
      this.loadSpecList(this.verifyParams)
      .then(rs => {
        this.loading = false;
      });
    },
    review(index,row){
      this.reviewParams.orderNo = row.orderNo;
      this.reviewParams.operator = row.userId;
      this.reviewParams.comId = this.userInfo.comId;
      this.$confirm('是否确认审核？')
      .then(() => {
        this.reviewVerify(this.reviewParams)
        .then(() => {
            this.$message({
              message: `审核成功`,
              type: 'success'
            });
            this.loading = true;
            this.loadVerifylist(this.verifyParams)
            .then(() => {
              this.loading = false;
            });
        }).catch(()=>{
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    viewDetail(index,row) {
      this.detailDialogShow = true;
      this.detailLoading = true;
      this.loadOrderDetail({orderNo:row.orderNo}).then(()=>{
          this.detailLoading = false;
      });
    },
    dateFormat(row, column) {
      return new Date(parseInt(row.createTime)).formatDate('yyyy-MM-dd hh:mm:ss')
    },
    searchOrder() {
      this.loading = true;
      this.loadVerifylist(this.orderParams).then(()=>{
          this.loading = false;
      });
    }
  },
  mounted: function() {
    this.loadVerifylist(this.verifyParams)
    .then(rs => {
      this.loading = false;
    });
  }
}
</script>
