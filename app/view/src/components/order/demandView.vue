<template>
    <div class="demand-wrap">
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
            <el-form-item label="销售：">
                <el-input v-model="searchDeParam.demandUser" placeholder="输入销售名称"></el-input>
            </el-form-item>
            <el-form-item label="客户名称：">
                <el-input v-model="searchDeParam.customName" placeholder="输入名称"></el-input>
            </el-form-item>
            <el-form-item label="提交日期：">
                <el-date-picker v-model="searchDeParam.createTime" type="date" placeholder="开始日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="-">
                <el-date-picker v-model="searchDeParam.endTime" type="date" placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchDemand">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column width='60px' label="#">
                    <template scope="scope">
                        {{scope.$index + (searchDeParam.page - 1) * 15 + 1}}
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="销售">
                </el-table-column>
                <el-table-column prop="customerName" label="客户名称">
                </el-table-column>
                <el-table-column prop="createTime" label="提交时间" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="priceTime" label="报价时间" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="feedbackTime" label="反馈时间" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="customerPhone" label="电话">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="destination">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="priceUser" label="采购"></el-table-column>
                <el-table-column prop="state" :formatter="statusFormatter" label="需求状态">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="dlDemandView" :close-on-click-modal="false" size="small" class="custom-dialog" custom-class="detailview">
            <div class="dialog-content">
                <div class="spec-wrap">
                    <el-table :data="demandDetail" border style="width: 100%">
                        <el-table-column label="规格" prop='spec' width="100px"></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量(支)" prop='demandAmount'></el-table-column>
                        <el-table-column label="重量(吨)" prop='demandWeight'></el-table-column>
                        <el-table-column label="业务报价" prop='feedbackPrice'></el-table-column>
                        <el-table-column label="出厂价" prop="factoryPrice"></el-table-column>
                        <el-table-column label="运费" prop="freight"></el-table-column>
                        <el-table-column label="备注" prop="comment"></el-table-column>
                    </el-table>
                    <div style="margin-top:15px;">
                        <el-row :gutter='10'>
                            <el-col :span='12'>
                                <el-input v-model="destination" auto-complete="off" :readonly="true">
                                    <template slot="prepend">目的地</template>
                                </el-input>
                            </el-col>
                            <el-col :span='12'>
                                <el-input v-model="allweight" auto-complete="off" :readonly="true">
                                    <template slot="prepend">总重量</template>
                                    <template slot="append">吨</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="margin-top:15px;">
                        <el-row :gutter='10'>
                            <el-col :span='12'>
                                <el-input v-model="comment" auto-complete="off" :readonly="true" class="comtxt">
                                    <template slot="prepend">销售备注</template>
                                </el-input>
                            </el-col>    
                            <el-col :span='12'>
                                <el-input v-model="priceComment" auto-complete="off" :readonly="activeName > 0" class="comtxt">
                                    <template slot="prepend">采购备注</template>
                                </el-input>
                            </el-col>
                        </el-row>    
                    </div>
                </div>    
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    loadDemandList,
    demandDetailList,
    loadDemandPriceList,
    upDateDemandList,
    priceHistoryGet
} from '../../vuex/action'

export default {
    vuex: {
        actions: {
            loadDemandList,
            demandDetailList,
            loadDemandPriceList,
            upDateDemandList,
            priceHistoryGet
        },
        getters: {
            userInfo: ({
                    common
                }) => common.userInfo,
            demandInfo: ({
                    order
                }) => order.demandInfo,
            demandDetail: ({
                    order
                }) => order.demandDetail,
            demand: ({
                    common
                }) => common.demand
        }
    },
    data() {
        return {
            activeName: '0',
            timeConsume: '',
            searchDeParam: {
                demandUser: '',
                createTime: '',
                endTime: '',
                customName: '',
                state: 0,
                page: 1,
            },
            dealStatusArray: [{ value: 1, key: '交易成功' }, { value: 2, key: '交易失败' }, { value: 0, key: '未成交' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            comment: '',
            priceComment: '',
            destination: '',
            allweight: 0,
            loading: true,
            updreason: '',
            demandcount: 0
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.searchDeParam.page = val;
            this.loading = true;
            this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
        },
        statusFormatter(row, column) {
            const status = {
                '0': '未报价需求',
                '1': '待反馈',
                '2': '已反馈',
                '3': '未成交',
                '4': '已成交'
            }
            return status[row.state];
        },
        viewDetail(row) {
            this.dlDemandView = true;
            const param = {demandNo: row.demandNo};
            this.demandDetailList(param)
                .then(() => {
                    this.updreason = row.dealReason;
                    this.destination = row.destination;
                    this.comment = row.comment;
                    this.priceComment = row.priceComment;
                    var w = 0;
                    this.demandDetail.map((v) => {
                        w =  w + Number(Number(v.demandWeight).toFixed(2));
                        if (v.factoryPrice == 0) {
                            v.factoryPrice = ''
                        }
                        if (v.freight == 0) {
                            v.freight = ''
                        }
                    })
                    this.allweight = w.toFixed(2)
                })
           
        },
        dateFormat(row, column) {
            if(!row[column.property]) {
                return '';
            } else {
                return new Date(parseInt(row[column.property])).formatDate('yyyy-MM-dd hh:mm')
            }
        },
        searchDemand() {
            this.loading = true;
            this.searchDeParam.createTime = this.searchDeParam.createTime ? new Date(this.searchDeParam.createTime).formatDate('yyyy-MM-dd') : '';
            this.searchDeParam.endTime = this.searchDeParam.endTime ? new Date(this.searchDeParam.endTime).formatDate('yyyy-MM-dd') : '';
            this.searchDeParam.state = this.activeName;
            this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
        }
    },
    mounted: function () {
        this.loading = true;
        this.loadDemandList(this.searchDeParam).then(() => {
            this.loading = false;
        })
    }
}
</script>
<style lang="less">
.demand-wrap {
    .despec-ul {
        li {
            margin-bottom: 10px;
        }
        span {
            display: inline-block;
            font-size: 20px;
            margin-right: 15px;
        }
    }
    .title {
        margin: 10px 0px;
        font-size: 20px;
        line-height: 51px;
        .tit {
            float: left;
        }
    }
    .sub-txt {
        font-size: 12px;
        color: #a09f9f;
        line-height: 0px;
        float: left;
        margin-top: 13px;
    }
    .el-form-item {
        margin-bottom: 0px;
    }
    .custom-dialog {
        .spec-wrap {
            border: 1px solid #eaeefb;
            padding: 15px;
            box-shadow: 1px 1px 1px 1px #e5e7ef;
        }

        .detailview {
            width: auto;
        }

    }
  


}
</style>