<template lang="html">
    <div class='order-wrap'>
    	  <el-table :data="spec.row" v-loading.body="loading" element-loading-text="拼命加载中">
            <el-table-column type="expand">
              <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="商品名称">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="所属店铺">
                    <span>{{ props.row.shop }}</span>
                  </el-form-item>
                  <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="店铺 ID">
                    <span>{{ props.row.shopId }}</span>
                  </el-form-item>
                  <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                  </el-form-item>
                  <el-form-item label="店铺地址">
                    <span>{{ props.row.address }}</span>
                  </el-form-item>
                  <el-form-item label="商品描述">
                    <span>{{ props.row.desc }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
    	     	<el-table-column prop="orderNo" label="订单号"></el-table-column>
    	     	<el-table-column prop="createTime" label="下单时间"></el-table-column>
    	     	<el-table-column prop="orderWeight" label="总吨位"></el-table-column>
    	     	<el-table-column prop="orderPrice" label="总价"></el-table-column>
    	     	<el-table-column prop="orderAdjust" label="采购下浮总额"></el-table-column>
    	     	<el-table-column prop="userId" label="下单人"></el-table-column>
    	     	<el-table-column label="操作">
    	     		<template scope="scope">
    	     			<el-button size="small" @click="review(scope.index, scope.row)" type="warning">审核</el-button>
    	     		</template>
    	     	</el-table-column>
    	  </el-table>


        <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="specParams.page"
            :page-size="2"
            layout=" prev, pager, next"
            :total="spec.totalCount">
          </el-pagination>
        </div>
    </div>

</template>

<script>

import{
    loadSpecList,
    reviewSpec
} from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadSpecList,
       reviewSpec
     },
     getters:{
        userInfo:({
        	common
        })=>common.userInfo,
        spec:({
        	manager
        })=>manager.spec
     }
  },
  data(){
      return{
          specParams: {
              page: 1,
              shenhe: "未审核"
          },
          reviewParams: {
             orderNo: '',
             operator: '',
             comId: ''
          },
          loading: true
      }
  },
  methods:{
    handleCurrentChange(val){
      this.specParams.page = val;
      this.loading = true;
      this.loadSpecList(this.specParams)
      .then(rs => {
        this.loading = false;
      });
    },
    review(index,row){
      this.reviewParams.orderNo = row.orderNo;
      this.reviewParams.operator = row.userId;
      this.reviewParams.comId = this.userInfo.comId;
      this.$confirm('是否确认审核？')
      .then(rs => {
        this.reviewSpec(this.reviewParams)
        .then(rs => {
            this.$message({
              message: `审核成功`,
              type: 'success'
            });
            this.loading = true;
            this.loadSpecList(this.specParams)
            .then(rs => {
              this.loading = false;
            });
        });
      });
    }
  },
  mounted: function() {
    this.loadSpecList(this.specParams)
    .then(rs => {
      this.loading = false;
    });
  }
}
</script>

<style lang="css">
</style>
