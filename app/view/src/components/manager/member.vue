<template lang="html">
    <div class="order-wrap">
        <el-form :inline="true" :model="memberParams" class="demo-form-inline">
            <el-form-item label="用户ID:">
                <el-input v-model="memberParams.userId" placeholder="支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="请选择公司:">
              <el-select v-model="memberParams.comId" placeholder="活动区域">
	            <el-option value="南京奎鑫">南京奎鑫</el-option>
	            <el-option value='武汉奎鑫'>武汉奎鑫</el-option>
	            <el-option value='西安奎鑫'>西安奎鑫</el-option>
	            <el-option value='长春奎鑫'>长春奎鑫</el-option>
	            <el-option value='沈阳奎鑫'>沈阳奎鑫</el-option>
	            <el-option value='山东奎鑫'>山东奎鑫</el-option>
	            <el-option value='南昌奎鑫'>南昌奎鑫</el-option>
	          </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchSup">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
             <el-table :data="userRoleInfo.rows" stripe style="width: 100%" :load="loading">
                <el-table-column prop="userId" label="用户ID" width="">
                </el-table-column>
                <el-table-column label="供应商现货查询" align="center" property="userId">
                    <template scope="scope">
                        <i class="el-icon-check"></i>
                    </template>
               </el-table-column>
                <el-table-column prop="userId" label="购物车页面" width="">
                    <template scope="scope">
                        <i class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="demandAuth" label="供应商目录及运费">
                    <template scope="scope" >
                        <i v-if ="demandAuth(scope.index, scope.row)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                    </template>
                </el-table-column>
                 <el-table-column prop="valueAuth" label="供应商价格表">
                     <template scope="scope" >
                        <i v-if ="valueAuth(scope.index, scope.row)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
                </el-table-column>
                <el-table-column prop="inventoryAuth" label="供应商库存表">
                      <template scope="scope" >
                        <i v-if ="inventoryAuth(scope.index, scope.row)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
                </el-table-column>
                <el-table-column prop="orderAuth" label="采购下单审核">
                     <template scope="scope" >
                        <i v-if ="orderAuth(scope.index, scope.row)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
                </el-table-column>
                <el-table-column label="操作" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="changeAuthority(scope.index, scope.row)" type="warning">修改权限</el-button>
                    </template>
               </el-table-column>
            </el-table>
       </div>
       <div class="block">
          <span class="demonstration">直接前往</span>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="memberParams.page"
            :page-size="30"
            layout=" prev, pager, next, jumper"
            :total="userRoleInfo.totalCount">
          </el-pagination>
        </div>
    </div>
</template>

<script>

import{
    loadmemberList
}from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadmemberList
     },
     getters:{
        userInfo:({
        	common
        })=>common.userInfo,
        userRoleInfo:({
        	manager
        })=>manager.userRoleInfo
     }
  },
  data(){
      return{
      	 memberParams: {
                    userId: '',
                    comId:'',
                    page:1,
                    comId: this.userInfo.comId
                },
      	 loading:true
      }
  },
  methods:{
    changeAuthority(index, row){
    	console.log(row);
    },
    handleCurrentChange(val){
      this.memberParams.page = val;
    },
    searchSup(){//查找成员
     
      this.loading = true;
        this.loadmemberList(this.memberParams)
        .then(() => {
          this.loading =  false;
       });
    },
    demandAuth(index,row){
       if(row.demandAuth){
          return true;
        }else{
          return false;
        }
   },
   valueAuth(index,row){
       if(row.valueAuth){
          return true;
        }else{
          return false;
        }
   },
     inventoryAuth(index,row){
       if(row.inventoryAuth){
          return true;
        }else{
          return false;
        }
   },
     orderAuth(index,row){
       if(row.orderAuth){
          return true;
        }else{
          return false;
        }
   }
   },
    mounted: function() {
      this.loadmemberList(this.memberParams)
      }
}
</script>

<style lang="css">
</style>
