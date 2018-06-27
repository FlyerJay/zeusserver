<template>
    <div class="demand-wrap">
        <el-form :inline="true" :model="searchDeParam" class="demo-form-inline">
            <el-form-item label="销售：">
                <el-input v-model="searchDeParam.demandUser" placeholder="输入销售名称" style="width: 113px;"></el-input>
            </el-form-item>
            <el-form-item label="客户名称：">
                <el-input v-model="searchDeParam.customName" placeholder="输入名称" style="width: 113px;"></el-input>
            </el-form-item>
            <el-form-item label="规格：">
                <el-input v-model="searchDeParam.spec" placeholder="输入规格" style="width: 125px;"></el-input>
            </el-form-item>
            <el-form-item label="提交日期：">
                <el-date-picker v-model="searchDeParam.createTime" type="date" placeholder="开始日期" style="width: 140px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="-">
                <el-date-picker v-model="searchDeParam.endTime" type="date" placeholder="结束日期" style="width: 140px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchDemand">查询</el-button>
            </el-form-item>
            <slide ref="slide" :items="messageList"></slide>
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
                <el-tab-pane label="已反馈报价" name="2">
                    <span slot='label'>已反馈报价<el-badge v-if="demand && demand.priced > 0" class="mark" :value="demand.priced" /></span>
                </el-tab-pane>
                <el-tab-pane label="未成交需求" name="3">
                    <span slot='label'>未成交需求<el-badge v-if="demand && demand.unDeal > 0" class="mark" :value="demand.unDeal" /></span>
                </el-tab-pane>
                <el-tab-pane label="成交需求" name="4">
                    <span slot='label'>成交需求<el-badge v-if="demand && demand.deal > 0" class="mark" :value="demand.deal" /></span>
                </el-tab-pane>
            </el-tabs>
        </div>
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
                <el-table-column prop="priceTimeFragment" v-if="activeName > 0" label="报价时长" :formatter="pruceFormat">
                </el-table-column>
                <el-table-column prop="demandWeight" label="总重量(吨)">
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
        <el-dialog v-model="dlDemandView" :close-on-click-modal="false" size="tiny" class="custom-dialog" custom-class="detailview">
            <div class="dialog-content">
                <div class="spec-wrap">
                    <el-table :data="demandDetail" border style="width: 100%">
                        <el-table-column label="规格" prop='spec' width="100px"></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量" prop='demandAmount'></el-table-column>
                        <el-table-column label="重量(吨)" prop='demandWeight'></el-table-column>
                        <el-table-column label="报价" width="330px;">
                            <template scope="scope">
                                <el-row>
                                    <el-col :span='12'>
                                        <el-autocomplete class="inline-input" @select="handleSelect" :fetch-suggestions="queryFactoryPrice.bind(this,scope.row)" v-model="scope.row.factoryPrice" :readonly="activeName > 1">
                                            <template slot="prepend">出厂价</template>
                                        </el-autocomplete>
                                    </el-col>
                                    <el-col :span='2'><span style="display:inline-block;margin:5px 0px 0px 6px">+</span></el-col>
                                    <el-col :span='10'>
                                        <el-input auto-complete="off" type="text" v-model="scope.row.freight" :readonly="activeName > 1">
                                            <template slot="prepend">运费</template>
                                        </el-input>
                                    </el-col>    
                                </el-row>        
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="230px">
                            <template scope="scope">
                                <el-input auto-complete="off" type="text" v-model="scope.row.comment" :readonly="activeName > 1" style="width: 100%;float:left;margin: 5px 0px 5px">
                                </el-input>
                            </template>
                        </el-table-column>
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
                                <el-input v-model="customerName" auto-complete="off" :readonly="true">
                                    <template slot="prepend">客户名称</template>
                                </el-input>
                            </el-col>    
                            <el-col :span='12'>
                                <el-input v-model="customerPhone" auto-complete="off" :readonly="activeName > 0">
                                    <template slot="prepend">客户电话</template>
                                </el-input>
                            </el-col>
                        </el-row>    
                    </div>
                    <div style="margin-top:15px;">
                        <el-row :gutter='10'>
                            <el-col :span='12'>
                                <el-row>
                                    <el-col :span="5">
                                        <span class="comment-label">&nbsp;销售备注&nbsp;&nbsp;</span>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-input v-model="comment" auto-complete="off" type="textarea" :readonly="true" :rows="1" class="comtxt">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span='12'>
                                <el-row>
                                    <el-col :span="5">
                                        <span class="comment-label">&nbsp;采购备注&nbsp;&nbsp;</span>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-input v-model="priceComment" auto-complete="off" type="textarea" :readonly="activeName > 0" :rows="1" class="comtxt">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>    
                    </div>
                </div>
                <div class="button-group dialog-item float-right">
                    <el-button type="info" @click="submitPrice" class="float-right group-item" v-if="demandDetail.length && activeName < 2">提 交</el-button>
                    <el-button type="info" @click="savePriceList" class="float-right group-item" v-if="demandDetail.length && activeName < 2">保 存</el-button>
                </div>    
                <el-button type="warning" @click="dlDemandView = false" class="dialog-item float-right" v-if="demandDetail.length && activeName < 2">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="dlDemandView2" :close-on-click-modal="false" size="small" class="custom-dialog" custom-class="detailview">
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
                                <el-input v-model="customerName" auto-complete="off" :readonly="true">
                                    <template slot="prepend">客户名称</template>
                                </el-input>
                            </el-col>    
                            <el-col :span='12'>
                                <el-input v-model="customerPhone" auto-complete="off" :readonly="activeName > 0">
                                    <template slot="prepend">客户电话</template>
                                </el-input>
                            </el-col>
                        </el-row>    
                    </div>
                    <div style="margin-top:15px;">
                        <el-row :gutter='10'>
                            <el-col :span='12'>
                                <el-row>
                                    <el-col :span="6">
                                        <span class="comment-label">销售备注</span>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input v-model="comment" auto-complete="off" type="textarea" :readonly="true" :rows="1" class="comtxt">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span='12'>
                                <el-row>
                                    <el-col :span="6">
                                        <span class="comment-label">采购备注</span>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-input v-model="priceComment" auto-complete="off" type="textarea" :readonly="activeName > 0" :rows="1" class="comtxt">
                                        </el-input>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>    
                    </div>
                </div>    
                <el-button type="info" @click="submitPrice" class="dialog-item float-right" v-if="demandDetail.length && activeName < 1">提 交</el-button>
                <el-button type="warning" @click="dlDemandView2 = false" class="dialog-item float-right" v-if="demandDetail.length && activeName < 1">取 消</el-button>
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
    priceHistoryGet,
    getMessageList,
    saveDemand
} from '../../vuex/action'
import Slide from '../plugin/slide';

export default {
    vuex: {
        actions: {
            loadDemandList,
            demandDetailList,
            loadDemandPriceList,
            upDateDemandList,
            priceHistoryGet,
            getMessageList,
            saveDemand
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
                spec: '',
                state: 0,
                page: 1,
            },
            dealStatusArray: [{ value: 1, key: '交易成功' }, { value: 2, key: '交易失败' }, { value: 0, key: '未成交' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            dlDemandView2: false,
            comment: '',
            priceComment: '',
            customerName: '',
            customerPhone: '',
            destination: '',
            allweight: 0,
            loading: true,
            updreason: '',
            demandcount: 0,
            messageList: [],
        }
    },
    components:{
      Slide
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
            if(this.activeName > 1){
                this.dlDemandView2 = true;
            }else{
                this.dlDemandView = true;
            }
            const param = {demandNo: row.demandNo};
            this.demandDetailList(param)
                .then(() => {
                    this.updreason = row.dealReason;
                    this.destination = row.destination;
                    this.comment = row.comment;
                    this.priceComment = row.priceComment;
                    this.customerName = row.customerName;
                    this.customerPhone = row.customerPhone;
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
        switchTab() {
            this.searchDemand();
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
        },
        submitPrice() {
            this.$confirm('确认提交?', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((v) => {
                if (this.activeName < 2) {
                    var params = {
                        demandNo: this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                        demandPrices: this.demandDetail,
                        timeConsume: this.timeConsume,
                        priceComment: this.priceComment
                    }
                    this.loadDemandPriceList(params).then(rs => {
                        this.$message({
                            message: `报价成功`,
                            type: 'success'
                        });
                        this.timeConsume = '';
                        this.demandDetail.map(v => {
                            v.freight = '';
                            v.factoryPrice = '';
                        });
                        this.loadDemandList(this.searchDeParam);
                        this.dlDemandView = false;
                    })
                } else {
                    var upparams = {
                        state: this.activeName,
                        demandNo: this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                        dealReason: this.updreason,
                        timeConsume: this.timeConsume
                    }
                    this.upDateDemandList(upparams).then(rs => {
                        this.$message({
                            message: `报价成功`,
                            type: 'success'
                        });
                        this.timeConsume = '';
                        this.demandDetail.map(v => {
                            v.freight = '';
                            v.factoryPrice = '';
                        })
                        this.loadDemandList(this.searchDeParam);
                        this.dlDemandView = false;
                    })
                }
            })
        },
        savePriceList() {
            this.$confirm('确认保存?', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((v) => {
                if (this.activeName < 2) {
                    var params = {
                        demandNo: this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                        demandPrices: this.demandDetail,
                        timeConsume: this.timeConsume,
                        priceComment: this.priceComment
                    }
                    this.saveDemand(params).then(rs => {
                        this.$message({
                            message: `保存成功`,
                            type: 'success'
                        });
                        this.timeConsume = '';
                        this.demandDetail.map(v => {
                            v.freight = '';
                            v.factoryPrice = '';
                        });
                        this.loadDemandList(this.searchDeParam);
                        this.dlDemandView = false;
                    })
                } else {
                    var upparams = {
                        state: this.activeName,
                        demandNo: this.demandDetail[0] ? this.demandDetail[0].demandNo : '',
                        dealReason: this.updreason,
                        timeConsume: this.timeConsume
                    }
                    this.upDateDemandList(upparams).then(rs => {
                        this.$message({
                            message: `报价成功`,
                            type: 'success'
                        });
                        this.timeConsume = '';
                        this.demandDetail.map(v => {
                            v.freight = '';
                            v.factoryPrice = '';
                        })
                        this.loadDemandList(this.searchDeParam);
                        this.dlDemandView = false;
                    })
                }
            })

        },
        queryFactoryPrice(query,string,cb) {
            if(!string){
                this.priceHistoryGet({spec:query.spec,type:query.type})
                .then(data=>{
                    console.log(data);
                    cb(data);
                })
            }
            cb([]);
        },
        handleSelect() { 
        },
        pruceFormat(row, column) {
            if(row.priceTime)
                return Math.ceil((row.priceTime - row.createTime) / 1000 / 60 ) + "分钟";
            return "未报价"
        },
    },
    mounted: function () {
        this.loading = true;
        this.loadDemandList(this.searchDeParam).then(() => {
            this.loading = false;
        })
    },
    created() {
        this.getMessageList({messageType:2})
            .then( data =>{
                this.messageList = data.row;
            })
    },
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
    .button-group{
        width: 100%;
    }
    .group-item{
        width: 49%;
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