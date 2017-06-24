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
                <el-button type="warning" @click="searchUser" :loading="loading">查询</el-button>
                <el-button type="info" @click="dlgAddUserVisible = true">添加用户</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
             <el-table :data="userRoleInfo.row" stripe style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
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
                        <i v-if ="Boolean(scope.row.supplierAuth)"  class="el-icon-check"></i>
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
                <el-table-column label="操作" align="center" property="id" v-if="adminAuthority">
                    <template scope="scope">
                        <el-button size="small" @click="changeAuthority(scope.index, scope.row)" type="warning">修改权限</el-button>
                        <el-button size="small" @click="allocRole(scope.index, scope.row)" type="warning">快速设置</el-button>
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
                  <el-form-item label="供应商目录及运费:">
                      <el-checkbox  v-model="authParams.supplierAuth" auto-complete="off"></el-checkbox>
                  </el-form-item>
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
        <el-dialog title="分配角色" v-model="dlgAllocationRole" size="tiny">
              <el-form>
                <el-select v-model="roleValue" placeholder="角色权限">
                    <el-option v-for="item in roleArray" :key="item.value" :label="item.key" :value="item.value"></el-option>
                </el-select>
                <div class="explain-contianer">
                    <div class="explain" v-if="roleValue == 0">自定义角色请使用权限分配功能</div>
                    <div class="explain" v-if="roleValue == 1">销售拥有基础功能权限+定制化需求权限</div>
                    <div class="explain" v-if="roleValue == 2">采购拥有除管理员以外的全部权限</div>
                    <div class="explain" v-if="roleValue == 3">超级管理员拥有系统全部权限</div>
                </div>
              </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="warning" @click="configAllocRole" :loading="updateload">确 定</el-button>
              <el-button @click="dlgAllocationRole = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--添加新用户弹窗-->
        <el-dialog title="" v-model="dlgAddUserVisible" size="tiny">
            <el-form :model="newUserParams" label-width="100px" label-position="left">
                <el-form-item label="用户ID：" :required="true">
                    <el-input style="width:85%" v-model="newUserParams.registerId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码：" :required="true">
                    <el-input style="width:85%" v-model="newUserParams.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司：" :required="true">
                    <el-select v-model="newUserParams.comId" placeholder="请选择">
                        <el-option value="南京奎鑫">南京奎鑫</el-option>
                        <el-option value='武汉奎鑫'>武汉奎鑫</el-option>
                        <el-option value='西安奎鑫'>西安奎鑫</el-option>
                        <el-option value='长春奎鑫'>长春奎鑫</el-option>
                        <el-option value='沈阳奎鑫'>沈阳奎鑫</el-option>
                        <el-option value='山东奎鑫'>山东奎鑫</el-option>
                        <el-option value='南昌奎鑫'>南昌奎鑫</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="warning" @click="addUser">提 交</el-button>
                <el-button  type="warning" @click="dlgAddUserVisible = false">取 消</el-button>
            </div>
       </el-dialog>


    </div>
</template>

<script>

import{
    loadmemberList,
    updateuserRole,
    addNewUser
}from '../../vuex/action'

export default {
    vuex:{
        actions:{
            loadmemberList,
            updateuserRole,
            addNewUser
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
            authParams: {
                orderAuth:'',
                valueAuth:'',
                inventoryAuth:'',
                demandAuth:'',
                adminAuth:'',
                userId:'',
                comId: this.userInfo.comId,
                operator:'',
                supplierAuth:''
            },
            newUserParams: {
                registerId: '',
                comId: '',
                password: ''
            },
            loading: true,
            updateload: false,  
            dlgChangeAuthVisible: false,
            dlgAddUserVisible: false,
            dlgAllocationRole: false,
            roleValue: 0,
            roleArray:[{ value: 0, key: '自定义角色' },{ value: 1, key: '销售' },{ value: 2, key: '采购' },{ value: 3, key: '超级管理员' }],
            roleStrArray:{
                '000010':1,
                '111110':2,
                '111111':3
            },
            allocParams: {
                orderAuth:'',
                valueAuth:'',
                inventoryAuth:'',
                demandAuth:'',
                adminAuth:'',
                userId:'',
                comId: this.userInfo.comId,
                operator:'',
                supplierAuth:''
            }
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
            this.authParams.supplierAuth = Boolean(row.supplierAuth);
        },
        allocRole(index,row){
            this.dlgAllocationRole = true;
            const auth = `${row.orderAuth}${row.supplierAuth}${row.valueAuth}${row.inventoryAuth}${row.demandAuth}${row.adminAuth}`;
            this.roleStrArray[auth] ? this.roleValue = this.roleStrArray[auth] : this.roleValue = 0;
            this.allocParams.operator = row.userId;
        },
        configAllocRole(){
            switch(this.roleValue){
                case 1:
                    this.allocParams.orderAuth = 0;
                    this.allocParams.supplierAuth = 0;
                    this.allocParams.valueAuth = 0;
                    this.allocParams.inventoryAuth = 0;
                    this.allocParams.demandAuth = 1;
                    this.allocParams.adminAuth = 0;
                    break;
                case 2:
                    this.allocParams.orderAuth = 1;
                    this.allocParams.supplierAuth = 1;
                    this.allocParams.valueAuth = 1;
                    this.allocParams.inventoryAuth = 1;
                    this.allocParams.demandAuth = 1;
                    this.allocParams.adminAuth = 0;
                    break;
                case 3:
                    this.allocParams.orderAuth = 1;
                    this.allocParams.supplierAuth = 1;
                    this.allocParams.valueAuth = 1;
                    this.allocParams.inventoryAuth = 1;
                    this.allocParams.demandAuth = 1;
                    this.allocParams.adminAuth = 1;
                    break;
            }
            this.updateload = true;
            this.updateuserRole(this.allocParams)
            .then(rs => {
                this.$message({
                    message: `角色分配成功`,
                    type: 'success'
                });
                this.updateload = false;
                this.dlgAllocationRole = false;
                this.loading = true;
                this.loadmemberList(this.memberParams)
                .then(rs => {
                    this.loading = false;
                });
            });
        },
        handleCurrentChange(val){
            this.memberParams.page = val;
        },
        searchUser() {//查找成员
            this.loading = true;
            this.memberParams.page = 1;
            this.loadmemberList(this.memberParams)
            .then(() => {
                this.loading = false;
            });
        },
        addUser() {
            this.addNewUser(this.newUserParams)
            .then(rs=>{
                this.dlgAddUserVisible = false;  
                this.loading = true;  
                this.loadmemberList(this.memberParams)
                .then(rs => {
                    this.loading = false;
                }).catch(rs=> {})
            }).catch(rs=> {})
        },
        confireChangeAuth(){
            let upateParam = {};
            upateParam.operator = this.authParams.userId;
            upateParam.orderAuth = Number(this.authParams.orderAuth);
            upateParam.valueAuth = Number(this.authParams.valueAuth);
            upateParam.inventoryAuth = Number(this.authParams.inventoryAuth);
            upateParam.demandAuth = Number(this.authParams.demandAuth);
            upateParam.adminAuth = Number(this.authParams.adminAuth);
            upateParam.supplierAuth = Number(this.authParams.supplierAuth);
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
    },
    computed: {
        adminAuthority() {
            return Boolean(parseInt(this.userInfo.userRole.charAt(0)));
        }
    }
}
</script>

<style lang="css" scoped>
    .explain{
        line-height:2em;
        margin-top:10px;
    }
</style>
