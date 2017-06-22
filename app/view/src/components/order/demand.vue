<template>
    <div>
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
            <el-form-item label="规格：">
                <el-input v-model="searchDeParam.spec" placeholder="输入规格"></el-input>
            </el-form-item>
            <el-form-item label="时间：">
                <el-date-picker v-model="searchTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchDemand">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 15px 0;" type="warning" @click="dlgDemandVisible = true" v-if="demandAuth">定制需求录入</el-button>
        <div class="title">定制货品列表</div>
        <div class="tb-wrap">
            <el-table :data="demandInfo.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="createTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="factoryPrice" label="出厂价">
                </el-table-column>
                <el-table-column prop="freight" label="运费">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总成本">
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
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchDeParam.page" layout=" prev, pager, next" :page-size="30" :total="demandInfo.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgDemandVisible" size="tiny">
            <el-form :model="demandParams" label-width="100px" label-position="left">
                <el-form-item label="规格：" :required="true">
                    <el-input style="width:85%" v-model="demandParams.spec" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：" :required="true">
                    <el-select v-model="demandParams.type" placeholder="请选择">
                        <el-option v-for="item in typeArray" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="需求数量(支)：" :required="true">
                    <el-input style="width:85%" v-model="demandcount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="需求吨位：" :required="true">
                    <el-input style="width:85%" v-model="demandParams.demandWeight" auto-complete="off"></el-input>
                    <span class="sub-txt">（重量默认按6m计算）</span>
                </el-form-item>
                <el-form-item label="目的地：" :required="true">
                    <el-input style="width:85%" v-model="demandParams.destination" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：" :required="true">
                    <el-input style="width:85%" v-model="demandParams.customerName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：" :required="true">
                    <el-input style="width:85%" v-model="demandParams.customerPhone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" :required="true">
                    <el-input style="width:85%" v-model="demandParams.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submitDdemand">提 交</el-button>
                <el-button type="warning" @click="dlgDemandVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" v-model="dlDemandView" size="tiny">
            <el-form :model="demandDatas" label-width="80px" label-position="left">
                <el-form-item label="规格：">
                    <el-input style="width:85%" v-model="demandDatas.spec" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：">
                    <el-input style="width:85%" v-model="demandDatas.type" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="需求吨位：">
                    <el-input style="width:85%" v-model="demandDatas.demandWeight" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：">
                    <el-input style="width:85%" v-model="demandDatas.destination" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：">
                    <el-input style="width:85%" v-model="demandDatas.customerName" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：">
                    <el-input style="width:85%" v-model="demandDatas.customerPhone" :readonly="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" :required="true">
                    <el-input style="width:85%" v-model="demandDatas.comment" :readonly="true" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    
        <el-dialog title="" v-model="dlFeedback" size="tiny">
            <el-form :model="demandDatas" label-width="115px" label-position="left">
                <el-form-item label="成交结果：">
                    <el-select v-model="FeedbackParams.dealStatus" placeholder="请选择">
                        <el-option v-for="item in dealStatusArray" :key="item.key" :label="item.key" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原因：">
                    <el-input style="width:85%" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="FeedbackParams.dealReason" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submitFeedback">提 交</el-button>
                <el-button type="warning" @click="dlFeedback = false">取 消</el-button>
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
                spec: '',
                searchTime: '',
                page: 1,
            },
            typeArray: ['黑管', '镀锌', '镀锌带'],
            dealStatusArray: [{ value: 1, key: '交易成功' }, { value: 2, key: '交易失败' }, { value: 0, key: '未成交' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            dlFeedback: false,
            loading: true,
            searchTime: '',
            demandcount: 0
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
        submitDdemand() {
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
            this.searchDeParam.searchTime = this.searchTime ? new Date(this.searchTime).formatDate('yyyy-MM-dd') : '';
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
<style lang="less" scoped>
.title {
    margin: 20px 0px;
    font-size: 20px;
}
.sub-txt {
    font-size: 12px;
    color: #a09f9f;
    line-height: 0px;
    float: left;
    margin-top: 13px;
}
</style>