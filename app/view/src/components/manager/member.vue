<template lang="html">
    <div class="order-wrap">
        <el-form :inline="true" :model="memberParams" class="demo-form-inline">
            <el-form-item label="用户ID:">
                <el-input v-model="memberParams.userId" placeholder="支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="请选择公司:">
              <el-select v-model="memberParams.comId" placeholder="全部">
	            <el-option value="">全部</el-option>
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
                <el-button type="warning" @click="searchSup" :loading="loading">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
             <el-table :data="userRoleInfo.row" stripe style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中">
                <el-table-column prop="userId" label="用户ID" width="">
                </el-table-column>
                <el-table-column label="下单权限" align="center" prop="orderAuth">
                      <template scope="scope" align="center">
                        <i v-if ="Boolean(scope.row.orderAuth)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
               </el-table-column>
                <el-table-column prop="demandAuth" label="供应商目录及运费">
                    <template scope="scope" align="center" >
                        <i v-if ="Boolean(scope.row.demandAuth)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                    </template>
                </el-table-column>
                 <el-table-column prop="valueAuth" label="供应商价格表">
                     <template scope="scope" >
                        <i v-if ="Boolean(scope.row.valueAuth)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
                </el-table-column>
                <el-table-column prop="inventoryAuth" label="供应商库存表">
                      <template scope="scope" >
                        <i v-if ="Boolean(scope.row.inventoryAuth)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                     </template>
                </el-table-column>
                 <el-table-column prop="demandAuth" label="定制需求权限">
                    <template scope="scope" align="center" >
                        <i v-if ="Boolean(scope.row.demandAuth)"  class="el-icon-check"></i>
                        <i v-else class="el-icon-close"></i>
                    </template>
                </el-table-column>
                <el-table-column prop=" adminAuth" label="采购下单审核">
                     <template scope="scope" >
                        <i v-if ="Boolean(scope.row.adminAuth)"  class="el-icon-check"></i>
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
       <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="memberParams.page"
            :page-size="30"
            layout=" prev, pager, next"
            :total="userRoleInfo.totalCount">
          </el-pagination>
        </div>


        <!--修改权限弹框-->
        <el-dialog title="修改权限" v-model="dlgChangeAuthVisible" size="tiny">
              <el-form v-model="authParams">
                  <el-form-item label="下单权限:">
                      <el-checkbox  v-model="authParams.orderAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
                  <!--<el-form-item label="供应商目录及运费:">
                      <el-checkbox  v-model="authParams.demandAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>-->
                  <el-form-item label="供应商价格表：">
                      <el-checkbox  v-model="authParams.valueAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
                  <el-form-item label="供应商库存表：">
                      <el-checkbox  v-model="authParams.inventoryAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
                  <el-form-item label="定制需求权限：">
                      <el-checkbox  v-model="authParams.demandAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
                  <el-form-item label="采购下单审核：">
                      <el-checkbox  v-model="authParams.adminAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
              </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="warning" @click="confireChangeAuth" :loading="updateload">确 定</el-button>
              <el-button @click="dlgChangeAuthVisible = false">取 消</el-button>
            </div>
      </el-dialog>
    </div>
</template>

<script>

import{
    loadmemberList,
    updateuserRole
}from '../../vuex/action'

export default {
  vuex:{
     actions:{
       loadmemberList,
       updateuserRole
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
            page:1,
            comId: ''
        },
        authParams:{
          orderAuth:'',
          valueAuth:'',
          inventoryAuth:'',
          demandAuth:'',
          adminAuth:'',
          userId:'',
          comId: this.userInfo.comId,
          operator:''
        },
      	 loading: true,
         updateload: false,  
         dlgChangeAuthVisible: false
      }
  },
  methods:{
    changeAuthority(index, row){//修改权限弹窗
        this.dlgChangeAuthVisible = true;
        this.authParams.userId = row.userId;
        this.authParams.orderAuth = Boolean(row.orderAuth);
        this.authParams.valueAuth = Boolean(row.valueAuth);
        this.authParams.inventoryAuth = Boolean(row.inventoryAuth);
        this.authParams.demandAuth = Boolean(row.demandAuth);
        this.authParams.adminAuth = Boolean(row.adminAuth);
    },
    handleCurrentChange(val){
      this.memberParams.page = val;
    },
    searchSup(){//查找成员
        this.loading = true;
        this.memberParams.page = 1;
        this.loadmemberList(this.memberParams)
        .then(() => {
          this.loading = false;
       });
    },
    confireChangeAuth(){
        let upateParam = {};
        upateParam.operator = this.userInfo.userId;
        upateParam.orderAuth = Number(this.authParams.orderAuth);
        upateParam.valueAuth = Number(this.authParams.valueAuth);
        upateParam.inventoryAuth = Number(this.authParams.inventoryAuth);
        upateParam.demandAuth = Number(this.authParams.demandAuth);
        upateParam.adminAuth = Number(this.authParams.adminAuth);
        this.updateload = true;
        this.updateuserRole(upateParam)
        .then(rs => {
            this.$message({
                message: `权限修改成功`,
                type: 'success'
            });
            this.updateload = false;
            this.dlgChangeAuthVisible = false;
            this.loading = true;
            this.loadmemberList(this.memberParams)
            .then(rs => {
                this.loading = false;
            });
        });
    },
  },
    mounted: function() {
        this.loadmemberList(this.memberParams)
        .then(rs => {
            this.loading = false;
        })
    }
}
</script>

<style lang="css">
</style>
