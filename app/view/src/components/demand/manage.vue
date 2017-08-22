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
            <el-button style="margin:7px 0px 0px 10px;float:left;" type="warning" @click="dlgDemandVisible = true" v-if="demandAuth">需求上传</el-button>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="switchTab">
                <el-tab-pane label="未报价需求" name="0"></el-tab-pane>
                <el-tab-pane label="待反馈需求" name="1"></el-tab-pane>
                <el-tab-pane label="未成交需求" name="2"></el-tab-pane>
                <el-tab-pane label="成交需求" name="3"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="tb-wrap">
            <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="userId" label="客户名称">
                </el-table-column>
                <el-table-column prop="userId" label="需求提交时间">
                </el-table-column>
                <el-table-column prop="userId" label="采购报价时间">
                </el-table-column>
                <el-table-column prop="userId" label="电话">
                </el-table-column>
                <el-table-column prop="userId" label="备注">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="工期">
                </el-table-column>
                <el-table-column prop="userId" label="总重量">
                </el-table-column>
                <el-table-column prop="dealStatus" :formatter="statusFormatter" label="成交结果">
                </el-table-column>
                <el-table-column prop="dealReason" label="原因">
                </el-table-column>
                <el-table-column label="交易反馈" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="dealFeedback(scope.row)" :disabled="scope.row.totalPrice == 0 || !scope.row.totalPrice" type="warning">填写</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchDeParam.page" layout=" prev, pager, next" :page-size="15" :total="demandInfo.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgDemandVisible" size="" class="custom-dialog" custom-class="demand-dlg">
            <div class="dialog-content">
                <ul>
                    <li v-for="item in dearr">{{item.spec}};{{item.type}};{{item.demandcount}};{{item.demandWeight}}</li>
                </ul>
                <div class="clearfix">
                    <el-input v-model="demandParams.spec" auto-complete="off">
                        <template slot="prepend">规格</template>
                    </el-input>
                    <div class="select-control clearfix dialog-item">
                        <el-row :gutter="0">
                        <el-col :span="5"><div class="select-prepend">类别</div></el-col>
                        <el-col :span="19">
                            <el-select v-model="demandParams.type" width="220px" placeholder="请选择">
                                <el-option v-for="item in typeArray" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-col>
                        </el-row>
                    </div>
                    <el-input v-model="demandParams.demandcount" auto-complete="off">
                        <template slot="prepend">数量</template>
                    </el-input>
                    <el-input v-model="demandParams.demandWeight" auto-complete="off">
                        <template slot="prepend">重量</template>
                    </el-input>
                </div>
                <el-button type="warning" @click="addSpec" style="margin-bottom: 10px;di">添加其他规格</el-button>
                <!-- <span class="sub-txt">（重量默认按6m计算）</span> -->
                <div class="clearfix">
                    <el-input v-model="demandParams.destination" auto-complete="off">
                        <template slot="prepend">目的地</template>
                    </el-input>
                    <el-input v-model="demandParams.customerName" auto-complete="off">
                        <template slot="prepend">客户</template>
                    </el-input>
                    <el-input v-model="demandParams.customerPhone" auto-complete="off">
                        <template slot="prepend">电话号码</template>
                    </el-input>
                    <el-input placeholder="填写备注" v-model="demandParams.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off" class="dialog-item"></el-input>
                </div>
                <el-button type="info" @click="submitDdemand" class="dialog-item float-right">提 交</el-button>
                <el-button type="warning" @click="dlgDemandVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="dlDemandView" size="tiny" class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="demandDatas.spec" :readonly="true" auto-complete="off">
                    <template slot="prepend">规格</template>
                </el-input>
                <el-input v-model="demandDatas.type" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">类别</template>
                </el-input>
                <el-input v-model="demandDatas.demandAmount" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">需求数量</template>
                </el-input>
                <el-input v-model="demandDatas.demandWeight" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">需求吨位</template>
                </el-input>
                <el-input v-model="demandDatas.destination" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">目的地</template>
                </el-input>
                <el-input v-model="demandDatas.customerName" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">客户</template>
                </el-input>
                <el-input v-model="demandDatas.customerPhone" :readonly="true" auto-complete="off" class="dialog-item">
                    <template slot="prepend">客户</template>
                </el-input>
                <el-input placeholder="备注" v-model="demandDatas.comment" :readonly="true" class="dialog-item" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
            </div>
        </el-dialog>
    
        <el-dialog title="" v-model="dlFeedback" size="tiny" class="custom-dialog">
            <div class="dialog-content">
                <div class="select-control clearfix dialog-item">
                    <el-row :gutter="0">
                    <el-col :span="7"><div class="select-prepend">成交结果</div></el-col>
                    <el-col :span="17">
                        <el-select v-model="FeedbackParams.dealStatus" placeholder="请选择">
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
    upDateDemandList
} from '../../vuex/action'

export default {
    vuex: {
        actions: {
            loadDemandList,
            addToDemandList,
            upDateDemandList
        },
        getters: {
            userInfo: ({
                    common
                }) => common.userInfo,
            demandInfo: ({
                    order
                }) => order.demandInfo
        }
    },
    data() {
        return {
            activeName: '0',
            demandParams: {
                spec: '',
                type: '',
                material: '',
                charAddress: '',
                charTel: '',
                demandListId: '',
                demandWeight: '',
                destination: '',
                customerName: '',
                customerPhone: '',
                timeConsume: 0,
                comment: '',
                demandAmount: 0,
                state: 0,
            },
            FeedbackParams: {
                demandId: '',
                dealStatus: 0,
                dealReason: '',
            },
            demandDatas: {
                spec: '',
                type: '',
                charAddress: '',
                demandWeight: '',
                destination: '',
                customerName: '',
                customerPhone: '',
                timeConsume: 0,
                comment: '',
            },
            searchDeParam: {
                userId: '',
                createTime: '',
                customName: '',
                state: 0,
                page: 1,
            },
            typeArray: ['黑管', '热镀锌', '镀锌带'],
            dealStatusArray: [{ value: 1, key: '交易成功' }, { value: 2, key: '交易失败' }, { value: 0, key: '未成交' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            dlFeedback: false,
            loading: true,
            demandcount: 0,
            dearr: []
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
                '1': '交易成功',
                '2': '交易失败'
            }
            return status[row.dealStatus];
        },
        viewDetail(row) {
            this.demandDatas = row;
            this.dlDemandView = true;
        },
        dealFeedback(row) {
            this.dlFeedback = true;
            this.FeedbackParams.demandId = row.demandId;
        },
        submitFeedback() {
            this.upDateDemandList(this.FeedbackParams)
                .then(() => {
                    this.dlFeedback = false;
                    this.$message({
                        message: `报价已提交`,
                        type: 'success'
                    })
                    this.loading = true;
                    this.loadDemandList(this.params).then(() => {
                        this.loading = false;
                    })
                })
        },
        enterNum(index, row) {
            this.dlgDemandVisible = true;
            this.demandParams.demandListId = row.demandListId;
        },
        addSpec() {
            var self = this;
            if(!self.demandParams.spec || !self.demandParams.demandcount || !self.demandParams.type || !self.demandParams.demandWeight) return
            var specObj = {
                spec: self.demandParams.spec,
                demandcount: self.demandParams.demandcount,
                type: self.demandParams.type,
                demandWeight: self.demandParams.demandWeight
            }
            self.dearr.push(specObj)
        },
        switchTab() {
            this.searchDemand();
        },
        submitDdemand() {
            this.demandParams.demandAmount = this.demandcount;
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
        searchDemand() {
            this.loading = true;
            this.searchDeParam.createTime = this.searchDeParam.createTime ? new Date(this.searchTime).formatDate('yyyy-MM-dd') : '';
            this.searchDeParam.state = this.activeName;
            this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
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
            const long = 6;
            const perimeter = 2 * height + 2 * width;
            this.demandParams.demandWeight = ((perimeter / 3.14 - land) * land * 6 * 0.02466 * demandcount / 1000).toFixed(2);
        }
    },
    mounted: function () {
        this.loading = true;
        this.loadDemandList(this.params).then(() => {
            this.loading = false;
        })
    },
    computed: {
        demandAuth() {
            return Boolean(parseInt(this.userInfo.userRole.charAt(4)));
        }
    },
    watch: {
        demandcount(val) {
            this.weightFormatter(this.demandParams.spec, Number(val))
        }
    }
}
</script>
<style lang="less">

.demand-wrap {

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

    .el-input-group {
        float: left;
        width: 18%;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .custom-dialog {
        .demand-dlg {
            width: 800px;
            .select-control {
                width: 200px;
                float: left;
                margin: 0px 10px 10px 0px;
                .el-input_inner {
                  padding-right: 0;
                }
            }
            .el-input__inner {
                width: 100px;
            }
        }
    }


}


</style>