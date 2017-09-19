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
                <el-date-picker v-model="searchDeParam.createTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchDemand">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="title clearfix">
            <span class="tit">需求列表：</span>
            <el-button style="margin:7px 0px 0px 10px;float:left;" type="warning" @click="demandUpload">需求上传</el-button>
            <el-button style="margin:7px 0px 0px 10px;float:left;" type="warning" @click="exportDemandList">导出需求</el-button>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="switchTab">
                <el-tab-pane name="0">
                    <span slot='label'>未报价需求<el-badge v-if="demand && demand.submit > 0" class="mark" :value="demand.submit" /></span>
                </el-tab-pane>
                <el-tab-pane name="1">
                    <span slot='label'>待反馈需求<el-badge v-if="demand && demand.price > 0" class="mark" :value="demand.price" /></span>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot='label'>未成交需求<el-badge v-if="demand && demand.unDeal > 0" class="mark" :value="demand.unDeal" /></span>
                </el-tab-pane>
                <el-tab-pane label="成交需求" name="3">
                    <span slot='label'>成交需求<el-badge v-if="demand && demand.deal > 0" class="mark" :value="demand.deal" /></span>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="tb-wrap">
            <el-table :data="demandInfo.row" stripe v-loading.body="loading" border :fit="true">
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
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="destination" width="100px">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.row)" type="warning">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="priceUser" label="采购">
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
                <el-table-column label="操作类型" align="center" v-if="activeName == 0" class-name="op-col">
                    <template scope="scope">
                        <el-button size="small" @click="changeDemand(scope.row)" type="warning" v-if="userInfo.userId == scope.row.userId" style="float:left">修改</el-button>
                        <el-button size="small" @click="removeDemand(scope.row)" type="danger" v-if="userInfo.userId == scope.row.userId" style="float:left">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchDeParam.page" layout=" prev, pager, next" :page-size="15" :total="demandInfo.totalCount">
            </el-pagination>
        </div>
        <el-dialog v-model="dlgDemandVisible" :close-on-click-modal="false" class="custom-dialog" custom-class="demand-dlg" @close="closeAdddlg">
            <div class="dialog-content">
                <div class="spec-wrap">
                    <el-table :data="demandParams.demandDetails" border style="width: 100%">
                        <el-table-column label="规格" prop='spec'></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量" prop='demandAmount'></el-table-column>
                        <el-table-column label="重量" prop='demandWeight'></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <el-button size="small" @click="deleteSpec(scope.$index)" type="warning">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="clearfix" style="margin-top:10px;">
                        <el-row :gutter='11'>
                            <el-col :span='7'>
                                <el-input v-model="specParams.spec" auto-complete="off" placeholder="例:50*50*3.0*6">
                                    <template slot="prepend">规格</template>
                                </el-input>
                            </el-col>
                            <el-col :span='4'>
                                <div class="select-control">
                                    <el-row>
                                        <el-col :span="10"><div class="select-prepend">类别</div></el-col>
                                        <el-col :span="14">
                                            <el-input v-model="specParams.type" placeholder="">
                                            </el-input>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-col>
                            <el-col :span='5'>
                                <el-input v-model="specParams.demandAmount" auto-complete="off">
                                    <template slot="prepend">数量</template>
                                    <template slot="append">支</template>
                                </el-input>
                            </el-col>
                            <el-col :span='5'>
                                <el-input v-model="specParams.demandWeight" auto-complete="off">
                                    <template slot="prepend">重量</template>
                                    <template slot="append">吨</template>
                                </el-input>
                            </el-col>
                            <el-col :span='3'>
                                <el-button type="warning" style="width:100%" @click="addSpec">添加规格</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="clearfix" style="margin-top: 16px;">
                    <el-row :gutter='8'>
                        <el-col :span='7'>
                            <el-input v-model="demandParams.destination" auto-complete="off">
                                <template slot="prepend">目的地</template>
                            </el-input>
                        </el-col>
                        <el-col :span='7'>
                            <el-input v-model="demandParams.customerName" auto-complete="off">
                                <template slot="prepend">客户</template>
                            </el-input>
                        </el-col>
                        <el-col :span='7'>
                            <el-input v-model="demandParams.customerPhone" auto-complete="off">
                                <template slot="prepend">电话</template>
                            </el-input>
                        </el-col>
                        <el-col :span='3'>
                            <el-button style="color:#97a8be" icon="edit" @click="editCostomer">管理</el-button>
                        </el-col>
                    </el-row>
                    <el-input placeholder="填写备注" v-model="demandParams.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off" class="dialog-item"></el-input>
                </div>
                <el-button type="info" @keyup.enter.native="submitDdemand" @click="submitDdemand" class="dialog-item float-right">提 交</el-button>
                <el-button type="warning" @click="dlgDemandVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
            v-model="customerListDlShow"
            size="tiny"
            @close="onCustomerClose" :close-on-click-modal="false">
            <div class="customer-content">
                <div style="margin-bottom:15px;">
                    <el-input placeholder="输入地址检索" v-model="customerQuery.customerName">
                        <template slot="append">
                            <el-button type="success" icon="search" @click="searchCustomer">搜索</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="customer-item" v-for="(item,index) in customerList.row" @click="selectCustomer(item)">
                    <div class="customer-name">{{item.customerName}}</div>
                    <div class="destination">{{item.destination}}<span class="customer-phone">{{item.customerPhone}}</span></div>
                    <aside>
                        <span class="delete" @click.stop="deleteCustomer(item.customerId)">删除</span>
                    </aside>
                </div>
                <div class="customer-page">
                    <el-pagination
                        @current-change="handlCustonerPage"
                        :current-page.sync="customerQuery.page"
                        layout=" prev, pager, next"
                        :page-size="5"
                        :total="customerList.totalCount"
                    >
                    </el-pagination>
                </div>
                <div class="add-customer customer-item"  @click="showNewCustomer">
                    <span><i class="iconfont icon-rectadd"></i>添加地址</span>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            v-model="customerAddDlShow"
            :close-on-click-modal="false"
            size="tiny"
            class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="customerParams.customerName" placeholder="必填">
                    <template slot="prepend">客户名称</template>
                </el-input>
                <el-input v-model="customerParams.customerPhone" class="dialog-item" placeholder="必填">
                    <template slot="prepend">客户电话</template>
                </el-input>
                <el-input v-model="customerParams.destination" class="dialog-item" placeholder="可不填">
                    <template slot="prepend">目&nbsp;的&nbsp;地</template>
                </el-input>
                <el-button type="info" class="dialog-item float-right" @click="submitCustomer">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="dlDemandView" size="tiny" :close-on-click-modal="false" class="custom-dialog" custom-class="detailview">
            <div class="dialog-content clearfix">
                <div class="spec-wrap">
                    <el-table :data="demandDetail" border style="width: 100%">
                        <el-table-column label="规格" prop='spec' width="120px"></el-table-column>
                        <el-table-column label="类型" prop='type'></el-table-column>
                        <el-table-column label="数量(支)" prop='demandAmount' width="120px"></el-table-column>
                        <el-table-column label="重量(吨)" prop='demandWeight' width="120px"></el-table-column>
                        <el-table-column label="报价" width="330px;" align="center" v-if="activeName > 0">
                            <template scope="scope">
                                <el-row>
                                    <el-col :span='12'>
                                        <el-input auto-complete="off" type="text" placeholder="出厂价" v-model="scope.row.factoryPrice" :readonly="true">
                                            <template slot="prepend">出厂价</template>
                                        </el-input>
                                    </el-col>
                                    <el-col :span='2'><span style="display:inline-block;margin:5px 0px 0px 6px">+</span></el-col>
                                    <el-col :span='10'>
                                        <el-input auto-complete="off" type="text" placeholder="运费" v-model="scope.row.freight" :readonly="true">
                                            <template slot="prepend">运费</template>
                                        </el-input>
                                    </el-col>    
                                </el-row>  
                            </template>    
                        </el-table-column>
                        <el-table-column label="备注" width="230px" align="center" v-if="activeName > 0">
                            <template scope="scope">
                                <el-input auto-complete="off" type="text" v-model="scope.row.comment" :readonly="true" style="width: 100%;float:left;margin: 5px 0px 5px;">
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
                                <el-input v-model="comment" auto-complete="off" :readonly="true" class="comtxt">
                                    <template slot="prepend">销售备注</template>
                                </el-input>
                            </el-col>
                            <el-col :span='12'>
                                <el-input v-model="priceComment" auto-complete="off" :readonly="true" class="comtxt">
                                    <template slot="prepend">采购备注</template>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <el-button style="float:right;margin-top:10px;" type="warning" @click="exportDemand">导出需求</el-button>
            </div>
        </el-dialog>
            
        <el-dialog title="" v-model="dlFeedback" :close-on-click-modal="false" size="tiny" class="custom-dialog">
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
    changeDemandList,
    removeDemandList,
    getCustomerList,
    newCustomer,
    removeCustomer
} from '../../vuex/action'

export default {
    vuex: {
        actions: {
            loadDemandList,
            addToDemandList,
            upDateDemandList,
            changeDemandList,
            demandDetailList,
            removeDemandList,
            getCustomerList,
            newCustomer,
            removeCustomer
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
                demandUser: '',
                createTime: '',
                customName: '',
                state: 0,
                page: 1,
            },
            comment: '',
            priceComment: '',
            destination: '',
            allweight: 0,
            dealStatusArray: [{ value: 3, key: '交易成功' }, { value: 2, key: '交易失败' }],
            dlgDemandVisible: false,
            dlDemandView: false,
            dlFeedback: false,
            loading: true,
            currentDemand: '',
            unit: 1,
            customerListDlShow: false,//客户列表弹出框
            customerQuery: {
                customerName: '',
            },
            submitstate: 0,
            customerList: [],
            customerAddDlShow: false,//客户电话框
            customerParams: {
                customerName: '',
                customerPhone: '',
                destination: '',
            }
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
        },
        viewDetail(row) {
            this.dlDemandView = true;
            this.currentDemand = row.demandNo;
            const param = {demandNo: row.demandNo};
            this.demandDetailList(param)
                .then(() => {
                    this.comment = row.comment;
                    this.priceComment = row.priceComment;
                    this.destination = row.destination;
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
        demandUpload() {
            this.dlgDemandVisible = true;
            this.submitstate = 0;
            this.demandParams.demandDetails = [];
            this.demandParams.destination = '';
            this.demandParams.customerName = '';
            this.demandParams.comment = '';
            this.demandParams.customerPhone = '';
        },
        changeDemand(row) {
            const param = {demandNo: row.demandNo};
            this.dlgDemandVisible = true;
            this.submitstate = 1;
            this.demandDetailList(param)
                .then(() => {
                    this.demandParams.demandDetails = this.demandDetail;
                    this.demandParams.demandNo = row.demandNo;
                    this.demandParams.destination = row.destination;
                    this.demandParams.customerName = row.customerName;
                    this.demandParams.customerPhone = row.customerPhone;
                    this.demandParams.comment = row.comment;
                })
        },
        dealFeedback(row) {
            this.dlFeedback = true;
            this.FeedbackParams.demandNo = row.demandNo;
        },
        submitFeedback() {
            this.$confirm('确认提交?','确认',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.upDateDemandList(this.FeedbackParams)
                    .then(() => {
                        this.dlFeedback = false;
                        this.FeedbackParams.demandNo = '';
                        this.FeedbackParams.state = '';
                        this.FeedbackParams.dealReason = '';
                        this.$message({
                            message: `反馈已提交`,
                            type: 'success'
                        })
                        this.loading = true;
                        this.searchDemand();
                    })
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
            if(!this.specParams.spec || !this.specParams.demandAmount || !this.specParams.type || !this.specParams.demandWeight) {
                this.$message({
                    message: `请填写规格明细`,
                    type: 'warning'
                });
                return;
            }
            var specObj = {
                spec: this.specParams.spec,
                demandAmount: this.specParams.demandAmount,
                type: this.specParams.type,
                demandWeight: this.specParams.demandWeight
            }
            this.demandParams.demandDetails.push(specObj);
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
                if(!this.submitstate) {
                    this.addToDemandList(this.demandParams)
                        .then(rs => {
                            this.demandParams.demandDetails = [];
                            this.demandParams.destination = '';
                            this.demandParams.customerName = '';
                            this.demandParams.comment = '';
                            this.demandParams.customerPhone = '';
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
                } else {
                    this.changeDemandList(this.demandParams)
                        .then(rs => {
                            this.demandParams.demandDetails = [];
                            this.demandParams.destination = '';
                            this.demandParams.customerName = '';
                            this.demandParams.comment = '';
                            this.demandParams.customerPhone = '';
                            this.$message({
                                message: `修改成功`,
                                type: 'success'
                            })
                            this.loadDemandList(this.searchDeParam)
                                .then(() => {
                                    this.loading = false;
                                });
                            this.dlgDemandVisible = false;
                        })
                }
                    
            });
        
        },
        searchDemand() {
            this.loading = true;
            this.searchDeParam.createTime = this.searchDeParam.createTime ? new Date(this.searchDeParam.createTime).formatDate('yyyy-MM-dd') : '';
            this.searchDeParam.state = this.activeName;
            this.loadDemandList(this.searchDeParam)
                .then(() => {
                    this.loading = false;
                });
        },
        removeDemand(row) {
            this.$confirm('确认删除?','确认',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                  demandNo: row.demandNo
                };
                this.removeDemandList(params).then(rs => {
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
            this.specParams.demandWeight = ((perimeter / 3.14 - land) * land * long * 0.02466 * demandcount / 1000).toFixed(2);
        },
        exportDemand(){
            window.open(`/zues/api/export/demandexport/${this.currentDemand}需求详情.xls?demandNo=${this.currentDemand}`);
        },
        exportDemandList(){
            var date = new Date().formatDate('yyyyMMdd');
            window.open(`/zues/api/export/demandlist/需求列表.xls`);
        },
        editCostomer(){
            this.customerListDlShow = true;
            this.flushCustomerList();
        },
        flushCustomerList(data={}){
            this.getCustomerList(data)
                .then(data=>{
                    this.customerList = data;
                })
        },
        onCustomerClose(){
            this.customerQuery.page = 1;
            this.customerQuery.customerName = "";
        },
        searchCustomer(){
            this.flushCustomerList(this.customerQuery);
        },
        handlCustonerPage(val){
            this.customerQuery.page = val;
            this.flushCustomerList(this.customerQuery);
        },
        selectCustomer(options){
            this.demandParams.customerName = options.customerName;
            this.demandParams.customerPhone = options.customerPhone;
            this.demandParams.destination = options.destination;
            this.customerListDlShow = false;
        },
        showNewCustomer(){
            this.customerAddDlShow = true;
        },
        submitCustomer(){
            this.newCustomer(this.customerParams)
                .then(data=>{
                    this.$message({
                        message: `新增成功`,
                        type: 'success'
                    });
                    this.customerAddDlShow = false;
                    this.flushCustomerList();
                })
        },
        deleteCustomer(customerId){
            this.removeCustomer({customerId});
        }
    },
    mounted: function () {
        this.loading = true;
        this.loadDemandList(this.searchDeParam).then(() => {
            this.loading = false;
        });
        var self = this;
        document.onkeyup = function(event) {
        event = event || window.event;
        if(event.keyCode === 13) {
            if(!self.dlgDemandVisible && !self.dlDemandView && !self.dlFeedback && !self.customerListDlShow && !self.customerAddDlShow) {
                self.searchDemand()
            }
        };
    };
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
        .detailview {
            width: auto;
        }
        .demand-dlg {
            width: 840px;
        }
    }

}
.customer-content{
    margin-left:20px;
    margin-right:20px;
    overflow:hidden;
    .customer-item{
        border:2px dashed #D3DCE6;
        margin-bottom:5px;
        padding:5px 10px;
        cursor:pointer;
        .customer-name{
            color:#F7BA2A;
            font-size:14px;
        }
        .customer-phone{
            color: #8492a6;
            font-size:12px;
            margin-left: 10px;
        }
        .destination{
            color: #444444;
            font-size:14px;
        }
        aside{
            font-size:12px;
            .set-default{
                color:#13CE66;
                margin-right:20px;
            }
            .delete{
                color:#FF4949
            }
            span:hover{
                text-decoration:underline;
            }
        }
        &:hover{
            border:2px dashed #F7BA2A;
        }
    }
    .add-customer{
        font-size:16px;
        .iconfont{
            font-size:18px;
            margin-right:5px;
        }
    }
    .customer-page{
        margin-bottom:5px;
        .el-pagination{
            padding:3px 0px;
            text-align:right;
            li.active{
                background-color: #f7ba2a;
                border-color: #f7ba2a;
                &:hover{
                    background-color: #f7ba2a;
                    border-color: #f7ba2a;
                    color:#fff;
                }
            }
            li:hover{
                color:#f7ba2a;
            }
        }
    }
}
.comtxt .el-input__inner {
    color: red
}
.op-col {
    width: 150px;
    .cell {
        padding-left: 5px;
        padding-right: 0px;
    }
}
</style>