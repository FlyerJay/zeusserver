<template lang="html">
    <div class='order-wrap'>
	     <el-table :data="specList" :load="loading">
	     	<el-table-column prop="spec" label="订单号"></el-table-column>
	     	<el-table-column prop="supplierName" label="下单时间"></el-table-column>
	     	<el-table-column prop="supplierName" label="总吨位"></el-table-column>
	     	<el-table-column prop="supplierName" label="总价"></el-table-column>
	     	<el-table-column prop="supplierName" label="采购下浮总额"></el-table-column>
	     	<el-table-column prop="supplierName" label="下单人"></el-table-column>
	     	<el-table-column label="操作">
	     		<template scope="scope">
	     			<el-button>审核</el-button>
	     		</template>
	     	</el-table-column>
	     </el-table>
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
                    id: '',
                    comId: this.userInfo.comId
                },
      	 loading:true
      }
  },
  methods:{
     
  },
  mounted: function() {
         this.loadSpecList(this.specParams)
  }
}
</script>

<style lang="css">
</style>
