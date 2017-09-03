<template>
    <div class="demand-wrap">
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
            <el-form-item label="销售：">
                <el-input v-model="searchDeParam.userId" placeholder="销售"></el-input>
            </el-form-item>
            <el-form-item label="客户名称：">
                <el-input v-model="searchDeParam.customName" placeholder="输入名称"></el-input>
            </el-form-item>
            <el-form-item label="提交日期：">
                <el-date-picker v-model="searchDeParam.createTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchDemand">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="title clearfix">
            <span class="tit">需求列表：</span>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="switchTab">
                <el-tab-pane label="未报价需求" name="0">
                    <span slot='label'>未报价需求<el-badge v-if="demand && demand.submit > 0" class="mark" :value="demand.submit" /></span>
                </el-tab-pane>
                <el-tab-pane label="待反馈需求" name="1">
                    <span slot='label'>待反馈需求<el-badge v-if="demand && demand.price > 0" class="mark" :value="demand.price" /></span>
                </el-tab-pane>
                <el-tab-pane label="未成交需求" name="2">
                    <span slot='label'>未成交需求<el-badge v-if="demand && demand.unDeal > 0" class="mark" :value="demand.unDeal" /></span>
                </el-tab-pane>
                <el-tab-pane label="成交需求" name="3">
                    <span slot='label'>成交需求<el-badge v-if="demand && demand.deal > 0" class="mark" :value="demand.deal" /></span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="tb-wrap">
            <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="userId" label="销售">
                </el-table-column>
                <el-table-column prop="customerName" label="客户名称">
                </el-table-column>
                <el-table-column prop="createTime" label="提交时间" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="priceTime" label="报价时间" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="customerPhone" label="电话">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="destination">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="priceUser" label="采购"></el-table-column>
                <el-table-column prop="state" :formatter="statusFormatter" label="成交结果">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchDeParam.page" layout=" prev, pager, next" :page-size="15" :total="demandInfo.totalCount">
            </el-pagination>
        </div>
        <el-dialog v-model="dlDemandView" size="tiny" class="custom-dialog" custom-class="detailview">
            <div class="dialog-content">
                <div class="spec-wrap">
                    <el-table :data="demandDetail" border style="width: 100%">
                        <el-table-column label="规格" prop='spec' width="100px"></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量" prop='demandAmount'></el-table-column>
                        <el-table-column label="重量" prop='demandWeight'></el-table-column>
                        <el-table-column label="报价" width="200px;">
                            <template scope="scope" label="报价">
                                <el-input auto-complete="off" type="text" v-model="scope.row.factoryPrice" :disabled="activeName > 1" style="width: 100%;float:left;margin: 5px 0px 5px">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="150px">
                            <template scope="scope">
                                <el-input auto-complete="off" type="text" v-model="scope.row.comment" :disabled="activeName > 1" style="width: 100%;float:left;margin: 5px 0px 5px">
                                </el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top:15px;">
                        <el-row :gutter='10'>
                            <el-col :span='12'>
                                <el-input v-model="destination" auto-complete="off" :disabled="true">
                                    <template slot="prepend">目的地</template>
                                </el-input>
                            </el-col>
                            <el-col :span='12'>
                                <el-input v-model="allweight" auto-complete="off" :disabled="true">
                                    <template slot="prepend">总重量</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="margin-top:15px;">
                        <el-row>
                            <el-col :span='24'>
                                <el-input v-model="comment" auto-complete="off" :disabled="true">
                                    <template slot="prepend">备注</template>
                                </el-input>
                            </el-col>    
                        </el-row>    
                    </div>
                </div>    
                <el-button type="info" @click="submitPrice" class="dialog-item float-right" v-if="demandDetail.length && activeName < 2">提 交</el-button>
                <el-button type="warning" @click="dlDemandView = false" class="dialog-item float-right" v-if="demandDetail.length && activeName < 2">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import {
    loadDemandList,
    demandDetailList,
    loadDemandPriceList,
    upDateDemandList
} from '../../vuex/action'

export default {
    vuex: {
        actions: {
            loadDemandList,
            demandDetailList,
            loadDemandPriceList,
            upDateDemandList
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
                userId: '',
                createTime: '',
                customName: '',
                state: 0,
                page: 1,
            },
            dealStatusArray: [{ value: 1, key: '交易成功' }, { value: 2, key: '交易失败' }, { value: 0, key: '未成交' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            comment: '',
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
                '2': '未成交',
                '3': '已成交'
            }
            return status[row.state];
        },
        viewDetail(row) {
            this.dlDemandView = true;
            const param = {demandNo: row.demandNo};
            const self = this;
            this.demandDetailList(param)
                .then(() => {
                    self.updreason = row.dealReason;
                    self.destination = row.destination;
                    self.comment = row.comment;
                    var w = 0;
                    self.demandDetail.map((v) => {
                        w =  w + Number(v.demandWeight);
                    })
                    self.allweight = w
                })
           
        },
        dateFormat(row, column) {
            if(!row[column.property]) {
                return '';
            } else {
                return new Date(parseInt(row[column.property])).formatDate('yyyy-MM-dd hh:mm')
            }
        },
        switchTab() {
            this.searchDemand();
        },
        searchDemand() {
            this.loading = true;
            this.searchDeParam.createTime = this.searchDeParam.createTime ? new Date(this.searchTime).formatDate('yyyy-MM-dd') : '';
            this.searchDeParam.state = this.activeName;
            this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
        },
        submitPrice() {
            const self = this;
            if (this.activeName < 2) {
                var params = {
                    demandNo:this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                    demandPrices:this.demandDetail,
                    timeConsume: this.timeConsume
                }
                this.loadDemandPriceList(params).then(rs => {
                    self.$message({
                        message: `报价成功`,
                        type: 'success'
                    });
                    self.loadDemandList(self.searchDeParam);
                    self.dlDemandView =false;
                })
            } else {
                var upparams = {
                   state: this.activeName,
                   demandNo:this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                   dealReason: this.updreason,
                   timeConsume: this.timeConsume
                }
                this.upDateDemandList(upparams).then(rs => {
                    self.$message({
                        message: `报价成功`,
                        type: 'success'
                    });
                    self.loadDemandList(self.searchDeParam);
                    self.dlDemandView =false;
                })
            }
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
        .demand-dlg {
            width: 840px;
        }

        .detailview {
            width: 965px;
            .el-input-group {
                float: inherit;
                width: 100%;
            }
        }

    }
  


}
</style>