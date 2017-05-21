<template lang="html">
    <div class='order-wrap'>
    	  <el-table :data="specList" :load="loading">
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
    	     	<el-table-column prop="spec" label="订单号"></el-table-column>
    	     	<el-table-column prop="supplierName" label="下单时间"></el-table-column>
    	     	<el-table-column prop="supplierName" label="总吨位"></el-table-column>
    	     	<el-table-column prop="supplierName" label="总价"></el-table-column>
    	     	<el-table-column prop="supplierName" label="采购下浮总额"></el-table-column>
    	     	<el-table-column prop="supplierName" label="下单人"></el-table-column>
    	     	<el-table-column label="操作">
    	     		<template scope="scope">
    	     			<el-button size="small" @click="enterNum(scope.index, scope.row)">审核</el-button>
    	     		</template>
    	     	</el-table-column>
    	  </el-table>
        <el-dialog
            title="提示"
            :visible.sync="dlgReviewVisible"
            size="tiny"
            :before-close="handleClose">
            <span>是否确认审核</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="comfirmReview">确 定</el-button>
            </span>
        </el-dialog>


        <div class="block">
          <span class="demonstration">直接前往</span>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="specParams.page"
            :page-size="30"
            layout=" prev, pager, next, jumper"
            :total="1000">
          </el-pagination>
        </div>
    </div>

</template>

<script>

import{
    loadSpecList
}from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadSpecList
     },
     getters:{
        userInfo:({
        	common
        })=>common.userInfo,
        specList:({
        	manager
        })=>manager.specList
     }
  },
  data(){
      return{
      	 specParams: {
                    page: 1,
                    shenhe:"未审核",
                    comId: this.userInfo.comId
                },
          loading:true,
          dlgReviewVisible:false
      }
  },
  methods:{
     handleCurrentChange(val){
       this.specParams.page = val;
       
     },
     enterNum(index,row){
       this.dialogVisible = true;
     },
     comfirmReview(){
      this.dialogVisible = false;
      this.specParams.shenhe = "审核"
     },
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  },
  mounted: function() {
         this.loadSpecList(this.specParams)
  }
}
</script>

<style lang="css">
</style>
