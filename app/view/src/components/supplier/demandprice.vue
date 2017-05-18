<template>
    <div> 
        <el-form :inline="true" :model="searchDePriParam" class="demo-form-inline">
          <el-form-item label="规格：">
             <el-input v-model="searchDePriParam.spec" placeholder="输入规格"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
              <el-input v-model="searchDePriParam.date" placeholder="时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="searchDePrice">查询</el-button>
          </el-form-item>
       </el-form> 
        <div class="title">定制需求报价表</div> 
        <div class="tb-wrap">
          <el-table :data="supList" stripe style="width: 100%" :loading="loading">
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column prop="type" label="材质" width="">
                </el-table-column>
                <el-table-column prop="type" label="需求吨位" width="">
                </el-table-column>
                <el-table-column prop="type" label="客户简称" width="">
                </el-table-column>
                <el-table-column prop="comId" label="业务员" width="">
                </el-table-column>
                <el-table-column label="出厂价" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning" >采购填写</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="运费" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning" >采购填写</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="benifit" label="总成本">
                </el-table-column>
          </el-table>
        </div>
         <el-dialog title="" v-model="dlgDePriVisible">
            <el-form :model="dePriParams">
                <el-form-item label="规格：">
                   <el-input v-model="dePriParams.charSpec" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：">
                   <el-input v-model="dePriParams.charType" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="数量：">
                   <el-input v-model="dePriParams.charAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：">
                   <el-input v-model="dePriParams.charAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：">
                   <el-input v-model="dePriParams.charCustomer" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：">
                   <el-input v-model="dePriParams.charTel" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgDemandVisible = false" type="warning">取 消</el-button>
                <el-button  @click="" type="warning">提 交</el-button>
            </div>
       </el-dialog>
  </div>
</template>

<script>
    import {
    loadSupList
  } from '../../vuex/action'

    export default {
        vuex: {
          actions: {
            loadSupList,
          },
          getters: {
            supList: ({
              supplier
            }) => supplier.supList,
            userInfo: ({
              common
            }) => common.userInfo
          }
        },
        data() {
            return {
                params: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                },
                dePriParams:{
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    charSpec:'',
                    charType:'',
                    charAmount:'',
                    charAddress:'',
                    charCustomer:'',
                    charTel:'',
                    demandListId:''
                },
                searchDePriParam:{
                    spec:'',
                    date:'',
                    comId:this.userInfo.comId

                },
                dlgDePriVisible:false,
                loading:true
            }
        },
        methods: {
         dateFormat(row, column) {
           return new Date(parseInt(row.lastUpdateTime)).formatDate('yyyy-MM-dd hh:mm')
           },
         enterNum(index, row) {
                this.dlgDePriVisible = true;
                this.dePriParams.dePriListId = row.dePriListId;
           },
         searchDePrice() {
                this.loading = true;
                this.loadSupList(this.searchDePriParam)
                  .then(rs => {
                    this.loading = false;
                  })
           }
        },
         mounted: function() {
           
            this.loadSupList({
                comId: this.userInfo.comId
            })
        }
    }
</script>
<style lang="css">
  .title{
    margin: 20px 0px;
    font-size:24px;
  }
</style>