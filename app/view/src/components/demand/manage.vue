<template>
    <div class="demand-wrap">
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
            <el-form-item label="用户ID：">
                <el-input v-model="searchDeParam.userId" placeholder="输入ID"></el-input>
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
            <el-button style="margin:7px 0px 0px 10px;float:left;" type="warning" @click="dlgDemandVisible = true">需求上传</el-button>
            <el-button style="margin:7px 0px 0px 10px;float:left;" type="warning" @click="exportDemandList">导出需求</el-button>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="switchTab">
                <el-tab-pane name="0">
                    <span slot='label'>未报价需求</span>
                </el-tab-pane>
                <el-tab-pane name="1">
                    <span slot='label'>待反馈需求<el-badge v-if="demand && demand.price > 0" class="mark" :value="demand.price" /></span>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot='label'>未成交需求</span>
                </el-tab-pane>
                <el-tab-pane label="成交需求" name="3">
                    <span slot='label'>成交需求</span>
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
                <!-- <el-table-column prop="comment" label="备注"> -->
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="destination">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="timeConsume" label="工期">
                </el-table-column>
                <el-table-column prop="demandWeight" label="总重量">
                </el-table-column> -->
                <el-table-column prop="state" :formatter="statusFormatter" label="采购">
                </el-table-column>
                <el-table-column prop="state" :formatter="statusFormatter" label="成交结果">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
                <el-table-column label="交易反馈" align="center" property="id" v-if="activeName == 1">
                    <template scope="scope">
                        <el-button size="small" @click="dealFeedback(scope.row)" type="warning">填写</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="activeName == 0">
                    <template scope="scope">
                        <el-button size="small" @click="removeDemand(scope.row)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchDeParam.page" layout=" prev, pager, next" :page-size="15" :total="demandInfo.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgDemandVisible" size="" class="custom-dialog" custom-class="demand-dlg" @close="closeAdddlg">
            <div class="dialog-content">
                <div class="spec-wrap">
                    <el-table :data="dearr" border style="width: 100%">
                        <el-table-column label="规格" prop='spec'></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量" prop='demandAmount'></el-table-column>
                        <el-table-column label="总重量" prop='demandWeight'></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <el-button size="small" @click="deleteSpec(scope.$index)" type="warning">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="clearfix" style="margin-top:10px;">
                        <el-row :gutter='10'>
                            <el-col :span='7'>
                                <el-input v-model="specParams.spec" auto-complete="off">
                                    <template slot="prepend">规格</template>
                                </el-input>
                            </el-col>
                            <el-col :span='6'>
                                <div class="select-control">
                                    <el-row>
                                        <el-col :span="7"><div class="select-prepend">类别</div></el-col>
                                        <el-col :span="17">
                                            <el-input v-model="specParams.type" placeholder="请填写">
                                            </el-input>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-col>
                            <el-col :span='4'>
                                <el-input v-model="specParams.demandAmount" auto-complete="off">
                                    <template slot="prepend">数量</template>
                                </el-input>
                            </el-col>
                            <el-col :span='4'>
                                <el-input v-model="specParams.demandWeight" auto-complete="off">
                                    <template slot="prepend">重量</template>
                                </el-input>
                            </el-col>
                            <el-col :span='3'>
                                <el-button type="warning" style="width:100%" @click="addSpec">添加规格</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- <span class="sub-txt">（重量默认按6m计算）</span> -->
                <div class="clearfix" style="margin-top: 16px;">
                    <el-row :gutter='8'>
                        <el-col :span='8'>
                            <el-input v-model="demandParams.destination" auto-complete="off">
                                <template slot="prepend">目的地</template>
                            </el-input>
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="demandParams.customerName" auto-complete="off">
                                <template slot="prepend">客户</template>
                            </el-input>
                        </el-col>
                        <el-col :span='8'>
                            <el-input v-model="demandParams.customerPhone" auto-complete="off">
                                <template slot="prepend">电话</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-input placeholder="填写备注" v-model="demandParams.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off" class="dialog-item"></el-input>
                </div>
                <el-button type="info" @keyup.enter.native="submitDdemand" @click="submitDdemand" class="dialog-item float-right">提 交</el-button>
                <el-button type="warning" @click="dlgDemandVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="dlDemandView" size="tiny" class="custom-dialog" custom-class="detailview">
            <div class="dialog-content">
                <el-table :data="demandDetail" border style="width: 100%">
                    <el-table-column label="规格" prop='spec'></el-table-column>
                    <el-table-column label="类型" prop='type'></el-table-column>
                    <el-table-column label="数量" prop='demandAmount'></el-table-column>
                    <el-table-column label="重量" prop='demandWeight'></el-table-column>
                    <el-table-column label="目的地" prop='destination'></el-table-column>
                    <el-table-column label="报价" width="310px;" v-if="activeName > 0">
                        <el-input auto-complete="off" type="text" v-model="factoryPrice" :disabled="true"  style="width: 49%;float:left;margin: 5px 5px 5px">
                        </el-input>
                    </el-table-column>
                    <el-table-column label="备注" width="150px" v-if="activeName > 0">
                        <el-input auto-complete="off" type="text" v-model="comment" :disabled="true" style="width: 100%;float:left;margin: 5px 0px 5px">
                        </el-input>
                    </el-table-column>
                </el-table>
                <el-button style="float:right;margin-top:10px;" type="warning" @click="exportDemand">导出需求</el-button>
            </div>
        </el-dialog>
            
        <el-dialog title="" v-model="dlFeedback" size="tiny" class="custom-dialog">
            <div class="dialog-content">
                <div class="select-control clearfix dialog-item">
                    <el-row :gutter="0">
                    <el-col :span="7"><div class="select-prepend">成交结果</div></el-col>
                    <el-col :span="17">
                        <el-select v-model="FeedbackParams.state" placeholder="请选择">
                            <el-option v-for="item in dealStatusArray" :key="item.key" :label="item.key" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    </el-row>
                </div>
                <el-input placeholder="请填写原因" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="FeedbackParams.dealReason" auto-complete="off" class="dialog-item" ></el-input>
                <el-button type="info" @click="submitFeedback" class="dialog-item float-right">提 交</el-button>
                <el-button type="warning" @click="dlFeedback = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    loadDemandList,
    addToDemandList,
    upDateDemandList,
    demandDetailList,
    removeDemandList
} from '../../vuex/action'

export default {
    vuex: {
        actions: {
            loadDemandList,
            addToDemandList,
            upDateDemandList,
            demandDetailList,
            removeDemandList
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
            specParams: {
                spec: '',
                type: '',
                demandAmount: '',
                demandWeight: ''
            },
            FeedbackParams: {
                demandNo: '',
                state: '',
                dealReason: '',
            },
            demandParams: {
                destination: '',
                customerName: '',
                customerPhone: '',
                type: '',
                comment: '',
                demandDetails: []
            },
            searchDeParam: {
                userId: '',
                createTime: '',
                customName: '',
                state: 0,
                page: 1,
            },
            dealStatusArray: [{ value: 3, key: '交易成功' }, { value: 2, key: '交易失败' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            dlFeedback: false,
            loading: true,
            dearr: [],
            currentDemand: '',
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
        deleteSpec(index) {
            this.dearr.splice(index, 1);
            this.demandParams.demandDetails.splice(index, 1);
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
        closeAdddlg() {
            this.specParams.spec = '';
            this.specParams.type = '';
            this.specParams.demandAmount = '';
            this.specParams.demandWeight = '';
            this.dearr = [];
        },
        viewDetail(row) {
            this.dlDemandView = true;
            this.currentDemand = row.demandNo;
            const param = {demandNo: row.demandNo};
            this.demandDetailList(param)
                .then(() => {
                })
        },
        dealFeedback(row) {
            this.dlFeedback = true;
            this.FeedbackParams.demandNo = row.demandNo;
        },
        submitFeedback() {
            const self = this;
            this.upDateDemandList(this.FeedbackParams)
                .then(() => {
                    self.dlFeedback = false;
                    self.$message({
                        message: `反馈已提交`,
                        type: 'success'
                    })
                    self.loading = true;
                    self.searchDemand();
                })
        },
        dateFormat(row, column) {
            if(!row[column.property]) {
                return '';
            } else {
                return new Date(parseInt(row[column.property])).formatDate('yyyy-MM-dd hh:mm')
            }
        },
        addSpec() {
            var self = this;
            if(!self.specParams.spec || !self.specParams.demandAmount || !self.specParams.type || !self.specParams.demandWeight) {
                this.$message({
                    message: `请填写规格明细`,
                    type: 'warning'
                });
                return;
            }
            var specObj = {
                spec: self.specParams.spec,
                demandAmount: self.specParams.demandAmount,
                type: self.specParams.type,
                demandWeight: self.specParams.demandWeight
            }
            self.demandParams.demandDetails.push(specObj);
            self.dearr.push(specObj);
            this.specParams.spec = '';
            this.specParams.type = '';
            this.specParams.demandAmount = '';
            this.specParams.demandWeight = '';
        },
        switchTab() {
            this.searchDemand();
        },
        submitDdemand() {
            if(!this.demandParams.demandDetails.length) {
                this.$message({
                    message: `请添加规格`,
                    type: 'warning'
                });
                return;
            }
            this.$confirm('确认提交?','确认',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.addToDemandList(this.demandParams)
                    .then(rs => {
                        this.$message({
                            message: `信息录入成功`,
                            type: 'success'
                        })
                        this.loadDemandList(this.searchDeParam)
                            .then(() => {
                                this.loading = false;
                            });
                        this.dlgDemandVisible = false;
                    })
            });
        
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
        removeDemand(row) {
            const self = this;
            this.$confirm('确认删除?','确认',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                  demandNo: row.demandNo
                };
                self.removeDemandList(params).then(rs => {
                    this.searchDemand();
                    this.$message({
                        message: `删除成功`,
                        type: 'success'
                    });
                });
            });
        },
        weightFormatter(spec, demandcount) {
            if (!spec) {
                return 0
            }
            const specArr = spec.split('*');
            const height = Number(specArr[0]);
            const width = Number(specArr[1]);
            const land = Number(specArr[2]);
            const long = Number(specArr[3]) ? Number(specArr[3]) : 6;
            const perimeter = 2 * height + 2 * width;
            this.specParams.demandWeight = ((perimeter / 3.14 - land) * land * 6 * 0.02466 * demandcount / 1000).toFixed(2);
        },
        exportDemand(){
            window.open(`/zues/api/export/demandexport/${this.currentDemand}需求详情.xls?demandNo=${this.currentDemand}`);
        },
        exportDemandList(){
            var date = new Date().formatDate('yyyyMMdd');
            window.open(`/zues/api/export/demandlist/需求列表${date}.xls`);
        }
    },
    mounted: function () {
        this.loading = true;
        this.loadDemandList(this.searchDeParam).then(() => {
            this.loading = false;
        })
    },
    watch: {
        ['specParams.demandAmount'](val) {
            this.weightFormatter(this.specParams.spec, Number(val))
        }
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
            .select-control{
                width:100%;
                float:left;
                margin:0;
            }
        }
        .detailview {
            width: 900px;
            .el-input-group {
                float: inherit;
                width: 100%;
            }
        }

    }
  


}
</style>