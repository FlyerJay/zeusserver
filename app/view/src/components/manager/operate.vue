<template lang="html">
    <div class='order-wrap'>
	     <el-table :data="operateList" :load="loading">
	     	<el-table-column prop="recordId" label="序号"></el-table-column>
	     	<el-table-column prop="createTime" label="时间"></el-table-column>
	     	<el-table-column prop="userId" label="用户ID"></el-table-column>
	     	<el-table-column prop="type" label="修改记录"></el-table-column>
	     	<el-table-column prop="detail" label="操作明细"></el-table-column>
	     </el-table>
    </div>
</template>

<script>

import{
    loadOperateList
}from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadOperateList
     },
     getters:{
        userInfo:({
        	common
        })=>common.userInfo,
        operateList:({
        	manager
        })=>manager.operateList
     }
  },
  data(){
      return{
      	 operateParams: {
                    id:'',
                    comId: this.userInfo.comId
                },
      	 loading:true
      }
  },
   mounted: function() {
       this.loadOperateList({
        comId: this.userInfo.comId
      });
  }
  }

</script>

<style lang="css">
</style>
