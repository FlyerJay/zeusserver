<template>
    <div> 
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
          <el-form-item label="规格：">
             <el-input v-model="searchDeParam.spec" placeholder="输入规格"></el-input>
          </el-form-item>
          <el-form-item label="时间：">
            <el-date-picker
                v-model="searchTime"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="searchDemand">查询</el-button>
          </el-form-item>
       </el-form>
        <el-button style="margin:0px 0px 15px 0;" type="warning" @click="dlgDemandVisible = true" v-if="demandAuth">定制需求录入</el-button>
        <div class="title">定制货品列表</div> 
        <div class="tb-wrap">
          <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading">
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="createTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning" >点击查看</el-button>
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
                <el-table-column prop="dealStatus" :formatter="statusFormatter" label="成交接口">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
          </el-table>
        </div>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchDeParam.page"
            layout=" prev, pager, next"
            :page-size="30"
            :total="demandInfo.totalCount"
          >
          </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgDemandVisible" size="tiny">
            <el-form :model="demandParams" label-width="80px" label-position="left">
                <el-form-item label="规格：" :required="true">
                    <el-input v-model="demandParams.spec" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：" :required="true">
                    <el-select v-model="demandParams.type" placeholder="请选择">
                        <el-option
                        v-for="item in typeArray"
                        :key="item"
                        :label="item"
                        :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="需求吨位：" :required="true">
                    <el-input v-model="demandParams.demandWeight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：" :required="true">
                    <el-input v-model="demandParams.destination" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：" :required="true">
                    <el-input v-model="demandParams.customerName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：" :required="true">
                    <el-input v-model="demandParams.customerPhone" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="warning" @click="dlgDemandVisible = false">取 消</el-button>
                <el-button  type="warning" @click="submitDdemand">提 交</el-button>
            </div>
       </el-dialog>
       <el-dialog title="" v-model="dlDemandView" size="tiny">
            <el-form :model="demandDatas" label-width="80px" label-position="left">
                <el-form-item label="规格：">
                   <el-input v-model="demandDatas.spec" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：">
                   <el-input v-model="demandDatas.type" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="需求吨位：">
                   <el-input v-model="demandDatas.demandWeight" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：">
                   <el-input v-model="demandDatas.destination" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：">
                   <el-input v-model="demandDatas.customerName" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：">
                   <el-input v-model="demandDatas.customerPhone" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
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
                demandInfo:({
                    order
                }) => order.demandInfo
            }
        },
        data() {
            return {
                demandParams:{
                    spec:'',
                    type:'',
                    material:'',
                    charAddress:'',
                    charTel:'',
                    demandListId:'',
                    demandWeight:'',
                    destination:'',
                    customerName:'',
                    customerPhone:'',
                },
                demandDatas: {
                    spec:'',
                    type:'',
                    charAddress:'',
                    demandWeight:'',
                    destination:'',
                    customerName:'',
                    customerPhone:'',
                },
                searchDeParam:{
                    spec: '',
                    searchTime: '',
                    page: 1,
                },
                typeArray:['黑管','镀锌','镀锌带'],
                dlgDemandVisible: false,
                dlDemandView: false,
                loading: true,
                searchTime: ''
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.searchDeParam.page = val;
                this.loading = true;
                this.loadStock(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
            },
            dateFormat(row, column) {
                return new Date(parseInt(row.createTime)).formatDate('yyyy-MM-dd hh:mm')
            },
            statusFormatter(row, column) {
                const status = {
                    '0': '未成交',
                    '1': '已成交',
                    '2': '成交失败' 
                }
                return status[row.dealStatus];
            },
            viewDetail(row) {
                this.demandDatas = row;
                this.dlDemandView = true;
            },
            pickerOptions(){

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
                    this.loadDemandList(this.searchDeParam);
                    this.dlgDemandVisible = false;
                })
            },
            searchDemand(){
                this.loading = true;
                this.searchDeParam.searchTime = this.searchTime ? new Date(this.searchTime).formatDate('yyyy-MM-dd'):'';
                this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function() {
            this.loading = true;
            this.loadDemandList(this.params).then(()=>{
                this.loading = false;
            })
        },
        computed: {
            demandAuth() {
                return Boolean(parseInt(this.userInfo.userRole.charAt(4)));
            }
        }
    }
</script>
<style lang="css">
  .title{
    margin: 20px 0px;
    font-size: 20px;
  }
</style>