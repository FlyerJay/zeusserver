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
            <el-button type="warning" @click="">查询</el-button>
          </el-form-item>
       </el-form>
        <el-button style="margin:0px 0px 15px 0;" type="warning" @click="dlgDemandVisible = true">定制需求录入</el-button>
        <div class="title">定制货品列表</div> 
        <div class="tb-wrap">
          <el-table :data="demandList" stripe style="width: 100%" :load="loading">
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="createTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" @click="" type="warning" >点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="timeConsume" label="工期">
                </el-table-column>
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="factoryPrice" label="出厂价">
                </el-table-column>
                <el-table-column prop="freight" label="运费">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总成本"> 
                </el-table-column>
                <el-table-column prop="dealStatus" label="成交接口">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
          </el-table>
        </div>
         <el-dialog title="" v-model="dlgDemandVisible">
            <el-form :model="demandParams">
                <el-form-item label="规格：">
                   <el-input v-model="demandParams.spec" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：">
                   <el-input v-model="demandParams.type" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="数量：">
                   <el-input v-model="demandParams.Amount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：">
                   <el-input v-model="demandParams.Address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：">
                   <el-input v-model="demandParams.userId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：">
                   <el-input v-model="demandParams.charTel" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="warning" @click="dlgDemandVisible = false">取 消</el-button>
                <el-button  type="warning" @click="submitDdemand">提 交</el-button>
            </div>
       </el-dialog>
  </div>
</template>

<script>
    import {
      loadDemandList,
      addToDemandList
    } from '../../vuex/action'

    export default {
        vuex: {
            actions: {
                loadDemandList,
                addToDemandList
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                demandList: ({
                    manager
                }) => manager.demandList
            }
        },
        data() {
            return {
                params: {
                   // userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                },
                demandParams:{
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    spec:'',
                    type:'',
                    material:'',
                    charAddress:'',
                    charTel:'',
                    demandListId:''
                },
                searchDePriParam:{
                    spec:'',
                    date:'',
                    comId:this.userInfo.comId

                },
                dlgDemandVisible:false,
                loading:true
            }
        },
        methods: {
         dateFormat(row, column) {
           return new Date(parseInt(row.lastUpdateTime)).formatDate('yyyy-MM-dd hh:mm')
         },
         enterNum(index, row) {
                this.dlgDemandVisible = true;
                this.demandParams.demandListId = row.demandListId;
         },
         submitDdemand(){
            this.addToDemandList(this.demandParams)
            .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            })
            this.loadDemandList(this.params);
            this.dlgDemandVisible = false;
            
           })
        }
       },
         mounted: function() {
            this.loadDemandList(this.params)
        }
    }
</script>
<style lang="css">
  .title{
    margin: 20px 0px;
    font-size:24px;
  }
</style>