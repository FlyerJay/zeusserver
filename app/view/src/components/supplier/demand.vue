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
        <div class="title">定制货品列表</div> 
        <div class="tb-wrap">
          <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="createTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别">
                </el-table-column>
                <el-table-column prop="demandAmount" label="需求数量">
                </el-table-column>
                <el-table-column prop="demandWeight" label="需求吨位" width="">
                </el-table-column>
                <el-table-column prop="customerName" label="客户简称">
                </el-table-column>
                <el-table-column prop="timeConsume" label="工期">
                </el-table-column>
                <el-table-column prop="userId" label="业务员">
                </el-table-column>
                <el-table-column prop="factoryPrice" label="出厂价">
                </el-table-column>
                <el-table-column prop="freight" label="运费">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总成本"> 
                </el-table-column>
                <el-table-column prop="comment" label="备注" width='180px'> 
                </el-table-column>
                <el-table-column label="操作" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" :disabled="scope.row.dealStatus != 0" @click="updateDemand(scope.row)" type="warning" >报价</el-button>
                    </template>
                </el-table-column>
          </el-table>
        </div>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchDeParam.page"
            layout=" prev, pager, next"
            :page-size="15"
            :total="demandInfo.totalCount"
          >
          </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgDemandVisible" size="tiny">
            <el-form :model="demandParams" label-width="100px" label-position="left">
                <el-form-item label="工期：" :required="true">
                    <el-input style="width:85%" v-model="demanUpdateParams.timeConsume" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="出厂价：" :required="true">
                    <el-input style="width:85%" type="number" @input="computePrice" v-model="demanUpdateParams.factoryPrice" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="运费：" :required="true">
                    <el-input style="width:85%" type="number" @input="computePrice" v-model="demanUpdateParams.freight" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="总成本：" :required="true">
                    <el-input style="width:85%" type="number" :readonly="true" v-model="demanUpdateParams.totalPrice" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="warning" @click="submitUpdate">提 交</el-button>
                <el-button  type="warning" @click="dlgDemandVisible = false">取 消</el-button>
            </div>
       </el-dialog>
  </div>
</template>

<script>
    import {
      loadDemandPriceList,
      upDateDemandList
    } from '../../vuex/action'

    export default {
        vuex: {
            actions: {
                loadDemandPriceList,
                upDateDemandList
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
                demanUpdateParams: {
                    demandId:0,
                    freight:0,
                    factoryPrice:0,
                    totalPrice:0,
                    demandWeight:0,
                    timeConsume: 0
                },
                searchDeParam:{
                    spec: '',
                    searchTime: '',
                    page: 1,
                },
                dlgDemandVisible: false,
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
            updateDemand(row) {
                this.dlgDemandVisible = true;
                this.demanUpdateParams.demandId = row.demandId;
                this.demanUpdateParams.demandWeight = row.demandWeight;
            },
            submitUpdate() {
                this.upDateDemandList( this.demanUpdateParams )
                .then(()=>{
                    this.dlgDemandVisible = false;
                    this.$message({
                        message: `报价已提交`,
                        type: 'success'
                    })
                    this.loading = true;
                    this.loadDemandPriceList(this.params).then(()=>{
                        this.loading = false;
                    })
                })
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
            computePrice() {
                this.demanUpdateParams.totalPrice = (Number(this.demanUpdateParams.freight) + Number(this.demanUpdateParams.factoryPrice)) * Number(this.demanUpdateParams.demandWeight);
            },
            enterNum(index, row) {
                this.dlgDemandVisible = true;
                this.demandParams.demandListId = row.demandListId;
            },
            searchDemand(){
                this.loading = true;
                this.searchDeParam.searchTime = this.searchTime ? new Date(this.searchTime).formatDate('yyyy-MM-dd'):'';
                this.loadDemandPriceList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
            }
        },
        mounted: function() {
            this.loading = true;
            this.loadDemandPriceList(this.params).then(()=>{
                this.loading = false;
            })
        },
        computed: {
            demandAuth() {
                return Boolean(parseInt(this.userInfo.userRole.charAt(4)));
            }
        },
    }
</script>
<style lang="css">
  .title{
    margin: 20px 0px;
    font-size: 20px;
  }
</style>