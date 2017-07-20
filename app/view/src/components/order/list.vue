<template>
    <div class="order-wrap">
        <el-form :inline="true" :model="orderParams" class="demo-form-inline">
            <el-form-item label="订单号:">
                <el-input v-model="orderParams.orderNo" placeholder="支持模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchOrder" :loading="loading">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="exportOrder" :loading="loading">导出Excel</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="orderList.row" stripe style="width: 100%" v-loading.body="loading" border>
                <el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
                <el-table-column prop="createTime" :formatter="dateFormat" label="下单时间" width="180"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" :formatter="nameFormat"></el-table-column>
                <el-table-column prop="orderWeight" label="总吨位"></el-table-column>
                <el-table-column prop="orderPrice" label="总价"></el-table-column>
                <el-table-column prop="orderAdjust" label="下浮总额"></el-table-column>
                <el-table-column prop="userId" label="下单人"></el-table-column>
                <el-table-column prop="validate" :formatter="statusFormatter" width="80" label="状态"></el-table-column>
                <el-table-column label="操作" align="left" width="200px" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.index, scope.row)" type="info">查看</el-button>
                        <el-button :disabled="scope.row.validate == 0" size="small" @click="confirmPrintInfo(scope.index, scope.row)" type="success">打印</el-button>
                        <el-button :disabled="scope.row.validate == 1" size="small" @click="enterNum(scope.index, scope.row)" type="danger">删除</el-button>
                    </template>
               </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="orderParams.page"
                layout=" prev, pager, next"
                :page-size="15"
                :total="orderList.totalCount"
            >
            </el-pagination>
        </div>
        <el-dialog
            v-model="detailDialogShow"
            size="small">
            <el-table :data="orderDetail" stripe style="width: 100%" v-loading.body="detailLoading" border>
                <el-table-column prop="spec" label="规格"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="supplierName" label="供应商"></el-table-column>
                <el-table-column prop="orderAmount" label="数量(件)"></el-table-column>
                <el-table-column prop="unitPrice" label="单价"></el-table-column>
                <el-table-column prop="Weight" label="重量"></el-table-column>
                <el-table-column prop="orderDcrease" label="下浮"></el-table-column>
                <el-table-column prop="dcreaseUnit" :formatter="unitFormatter" label="下浮单价"></el-table-column>
                <el-table-column prop="comment" label="备注"></el-table-column>
            </el-table>
            <el-button type="warning" style="margin:5px 0px 10px 0px;;float:right;" @click="exportOrderDetail" :loading="loading">导出Excel</el-button>
        </el-dialog>

        <el-dialog
            v-model="printDlConfirmShow"
            size="tiny">
            <div class="dialog-content">
                <el-input v-model="confirmParams.CAddress.addressName" :readonly="true" class="dialog-item">
                    <template slot="prepend">我方地址</template>
                    <el-button slot="append" style="box-sizing:border-box!import" @click="managerAddress(1)" type="success" icon="edit">管理</el-button>
                </el-input>
                <el-input v-model="confirmParams.BAddress.addressName" :readonly="true" class="dialog-item">
                    <template slot="prepend">敌方地址</template>
                    <el-button slot="append" style="box-sizing:border-box!import" @click="managerAddress(2)" type="success" icon="edit">管理</el-button>
                </el-input>
                <div class="car-list dialog-item clearfix">
                    <div class="car-item" v-for="(item,index) in confirmParams.carList">
                        <span>{{item.plate}}</span>
                        <span class="close"><i class="iconfont icon-close" @click="deleteCar(index)"></i></span>
                    </div>
                </div>
                <div class="dialog-item add-car" @click="carAddShow">
                    <span><i class="iconfont icon-rectadd"></i>添加货车</span>
                </div>
                <el-button type="warning" style="margin:5px 0px 10px 0px;;float:right;" @click="orderPrint" :loading="printLoading">信息无误&nbsp;&nbsp;去打印</el-button>
            </div>
        </el-dialog>

        <el-dialog
            v-model="addressListDlShow"
            size="tiny"
            @close="onAddressClose">
            <div class="address-content">
                <div class="address-item" v-for="(item,index) in addressList.row" @click="selectAddress(item)">
                    <div class="address-name">{{item.addressName}}</div>
                    <div class="address"><span class="default-address" v-if="item.isDefault == 1">[默认地址]</span><i class="iconfont icon-location"></i>{{item.address}}</div>
                    <aside>
                        <span v-if="item.isDefault == 0" class="set-default" @click="setDefaultAddress(item.addressId)">设置默认</span>
                        <span class="delete" @click.stop="deleteAddress(item.addressId)">删除地址</span>
                    </aside>
                </div>
                <div class="address-page">
                    <el-pagination
                        @current-change="handleAddressPage"
                        :current-page.sync="addressQuery.page"
                        layout=" prev, pager, next"
                        :page-size="5"
                        :total="addressList.totalCount"
                    >
                    </el-pagination>
                </div>
                <div class="add-address address-item"  @click="showNewAddress">
                    <span><i class="iconfont icon-rectadd"></i>添加地址</span>
                </div>
            </div>
        </el-dialog>
        <el-dialog
            v-model="addressAddDlShow"
            size="tiny"
            class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="addressParams.addressName" placeholder="必填，可以是公司名称，收件人名称">
                    <template slot="prepend">地址名称</template>
                </el-input>
                <el-input v-model="addressParams.address" class="dialog-item" placeholder="必填，如果没有可以和地址名称一样">
                    <template slot="prepend">详细地址</template>
                </el-input>
                <el-input v-model="addressParams.linkName" class="dialog-item">
                    <template slot="prepend">联系人</template>
                </el-input>
                <el-input v-model="addressParams.phone" class="dialog-item">
                    <template slot="prepend">电话号码</template>
                </el-input>
                <el-input v-model="addressParams.fax" class="dialog-item">
                    <template slot="prepend">传真号码</template>
                </el-input>
                <el-input v-model="addressParams.email" class="dialog-item">
                    <template slot="prepend">电子邮箱</template>
                </el-input>
                <el-input v-model="addressParams.finance" class="dialog-item">
                    <template slot="prepend">财务电话</template>
                </el-input>
                <el-button type="info" class="dialog-item float-right" @click="submitAddress">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            v-model="carAddDlShow"
            size="tiny"
            class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="carParams.plate" placeholder="必填">
                    <template slot="prepend">车牌号码</template>
                </el-input>
                <el-input v-model="carParams.phone" class="dialog-item" placeholder="必填">
                    <template slot="prepend">电话号码</template>
                </el-input>
                <el-button type="info" class="dialog-item float-right" @click="submitCar">确定</el-button>
            </div>
        </el-dialog>

        <printpage ref="printpage">
            <div class="print-content" style="position:relative;height:100%;">
                <div class="title" style="text-align:center;font-size:24px;letter-spacing:30px">南京奎鑫物资有限公司</div>
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #888;border-left:1px solid #888;margin-top:20px;font-size:12px;">
                    <tr>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">收件单位：{{confirmParams.BAddress.addressName}}</td>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">发件单位：{{confirmParams.CAddress.addressName}}</td>
                    </tr>
                    <tr>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">收件人：{{confirmParams.BAddress.linkName}}</td>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">日期：{{new Date() | dateFilter}}</td>
                    </tr>
                    <tr>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">传真号码：{{confirmParams.BAddress.fax}}</td>
                        <td style="padding:5px 10px;border-right:1px solid #888;border-bottom:1px solid #888">总页数：1/1</td>
                    </tr>
                </table>
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #dfe6ec;border-left:1px solid #dfe6ec;margin-top:20px;" v-if="confirmParams.carList.length > 0">
                    <caption style="text-align:left;margin-bottom:5px;font-size:14px;color:#888">兹：我公司委托下列车号来贵厂装货， 请予以发货！</caption>
                    <thead>
                        <tr>
                            <th style="width:50%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">车号</th>
                            <th style="width:50%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">手机</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in confirmParams.carList">
                            <td style="width:50%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.plate}}</td>
                            <td style="width:50%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.phone}}</td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #dfe6ec;border-left:1px solid #dfe6ec;margin-top:20px;">
                    <caption style="text-align:left;margin-bottom:5px;font-size:12px;color:#888">规格如下：</caption>
                    <thead>
                        <tr>
                            <th style="width:20%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">序号</th>
                            <th style="width:30%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">规格</th>
                            <th style="width:20%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">数量（件）</th>
                            <th style="width:30%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in printParams.specs">
                            <td style="width:20%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{index+1}}</td>
                            <td style="width:30%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.spec}}</td>
                            <td style="width:20%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.orderAmount}}</td>
                            <td style="width:30%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.comment}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="comment-container" style="margin-top:20px;font-family:'楷书'">
                    <div class="comment" style="text-align:center">烦请提醒驾驶员盖好雨布，谢谢！</div>
                    <div class="comment" style="text-align:center">请提醒驾驶员盖好雨布！谢谢</div>
                    <div class="date" style="text-align:right">{{new Date() | dateFilter}}</div>
                </div>
                <div class="footer" style="position:absolute;bottom:0;width:100%;font-size:14px;color:#ccc">
                    <hr>
                    <div class="address" style="display:inline-block;width:99%" v-if="confirmParams.CAddress && confirmParams.CAddress.address">地址：{{confirmParams.CAddress.address}}</div>
                    <div class="phone" style="display:inline-block;width:49%" v-if="confirmParams.CAddress && confirmParams.CAddress.phone">电话：{{confirmParams.CAddress.phone}}</div>
                    <div class="fax" style="display:inline-block;width:49%" v-if="confirmParams.CAddress && confirmParams.CAddress.fax">传真：{{confirmParams.CAddress.fax}}</div>
                    <div class="email" style="display:inline-block;width:49%" v-if="confirmParams.CAddress && confirmParams.CAddress.email">邮箱：{{confirmParams.CAddress.email}}</div>
                    <div class="finance" style="display:inline-block;width:49%" v-if="confirmParams.CAddress && confirmParams.CAddress.finance">财务：{{confirmParams.CAddress.finance}}</div>
                </div>
            </div>
        </printpage>
     </div>
</template>
<style lang="less">
    .print-content{
        display:none;//打印时只读取内联样式，这个设置只是让页面忽略不展示打印页面
    }
    .dialog-content{
        margin-left:20px;
        margin-right:20px;
        overflow:hidden;
        .dialog-item{
            margin-top:20px;
            &.float-right{
                float:right;
            }
            &.el-button{
                width:100%;
            }
            &.add-car{
                font-size:16px;
                line-height:2em;
                border:2px dashed #D3DCE6;
                padding:0px 10px;
                margin-bottom:10px;
                cursor:pointer;
                .iconfont{
                    font-size:18px;
                    position:relative;
                    top:1px;
                    margin-right:5px;
                }
                &:hover{
                    border:2px dashed #F7BA2A;
                }
            }
            &.car-list{
                .car-item{
                    float:left;
                    padding:5px 15px;
                    background-color:#F9FAFC;
                    border-radius:5px;
                    color:#1D8CE0;
                    position:relative;
                    border:1px solid #58B7FF;
                    margin-right:10px;
                    margin-bottom:10px;
                    .iconfont{
                        font-size:14px;
                        cursor:pointer;
                        font-weight:bold;
                        position:absolute;
                        background-color:#58B7FF;
                        border-radius:20px;
                        padding:2px;
                        color:#FFFFFF;
                        right:0;
                        top:0;
                        transform:translate3d(30%,-30%,0);
                    }
                }
            }
        }
    }
    .custom-dialog .el-dialog{
        width:26%;
    }
    .address-content{
        margin-left:20px;
        margin-right:20px;
        overflow:hidden;
        .address-item{
            border:2px dashed #D3DCE6;
            margin-bottom:5px;
            padding:5px 10px;
            cursor:pointer;
            .address-name{
                color:#F7BA2A;
                font-size:14px;
            }
            .address{
                color:#8492A6;
                font-size:14px;
                line-height:2em;
                .default-address{
                    color:#FF4949;
                }
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
        .add-address{
            font-size:16px;
            .iconfont{
                font-size:18px;
                margin-right:5px;
            }
        }
        .address-page{
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
</style>
<script>
    import {
        loadOrderList,
        removeOrderList,
        loadOrderDetail,
        exportOrderList,
        printOrder,
        defaultAddress,
        getAddressList,
        newAddress,
        removeAddress,
        setDefault,
    } from '../../vuex/action';
    import printpage from '../common/printpage';
    export default {
        vuex: {
            actions: {
                loadOrderList,
                removeOrderList,
                loadOrderDetail,
                printOrder,
                defaultAddress,
                getAddressList,
                newAddress,
                removeAddress,
                setDefault,
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                orderList: ({
                    order
                }) => order.orderList,
                orderDetail: ({
                    order
                }) => order.orderDetail
            },
        },
        components:{
            printpage
        },
        data() {
            return {
                orderParams: {
                    orderNo:'',
                    comId: this.userInfo.comId,
                    page:1,
                },
                loading: true,
                printLoading: false,
                detailLoading: true,
                detailDialogShow: false,
                printDlConfirmShow: false,
                addressListDlShow: false,
                addressAddDlShow: false,
                carAddDlShow: false,
                orderNo:'',
                printParams: {
                    specs: [],//发货单规格列表
                    comInfo: {},//公司信息，需要填写
                },
                addressParams: {
                    addressType: 1,
                    isDefault: 0,
                    addressName: '',
                    address: '',
                    phone: '',
                    fax: '',
                    linkName: '',
                    finance: '',
                    emainl: '',
                },
                carParams: {
                    plate: '',
                    phone: '',
                },
                addressQuery: {
                    addressType:'',
                    page:1,
                },
                confirmParams: {
                    CAddress: {
                        address: '',
                    },//收货地址
                    BAddress: {
                        address: '',
                    },//发货地址
                    carList:[],
                },
                addressList: [],
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.orderParams.page = val;
                this.loadList();
            },
            handleAddressPage(val) {
                this.addressQuery.page = val;
                this.getAddressList(this.addressQuery).then( data => {
                    this.addressList = data;
                })
            },
            searchOrder() {
                this.loadList();
            },
            exportOrder() {
                var date = new Date().formatDate('yyyyMMdd');
                window.open(`/zues/api/export/order/订单列表${date}.xls`);
            },
            exportOrderDetail() {
                window.open(`/zues/api/export/orderdetail/${this.orderDetail[0].orderNo}订单详情.xls?orderNo=${this.orderDetail[0].orderNo}`);
            },
            statusFormatter(row,column){
                return row.validate === 0 ? '未审核' : '已审核';
            },
            dateFormat(row, column) {
                return new Date(parseInt(row.createTime)).formatDate('yyyy-MM-dd hh:mm:ss')
            },
            nameFormat(row, colum) {
                return row.supplierName.replace(/黑管|热镀锌|镀锌带/g,'');
            },
            unitFormatter(row,colum){
                return row.orderDcrease/row.Weight;
            },
            viewDetail(index,row) {
                this.detailDialogShow = true;
                this.detailLoading = true;
                this.loadOrderDetail({orderNo:row.orderNo}).then(()=>{
                    this.detailLoading = false;
                });
            },
            enterNum(index, row) {
                const orderNoArr = [row.orderNo].join(',');
                 
                this.$confirm('该订单将被删除, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  class:'LDW'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!',
                  },
                  this.removeOrderList({orderNo:orderNoArr})
                  );
                  this.loadList();
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
            },
            confirmPrintInfo(index,row) {
                this.printDlConfirmShow = true;
                this.orderNo = row.orderNo;
                var params = {};
                params.addressType = 1;
                this.defaultAddress(params).then(data => {
                    this.confirmParams.CAddress = data[0];
                    params.addressType = 2;
                    this.defaultAddress(params).then(data => {
                        this.confirmParams.BAddress = data[0];
                    })
                })
            },
            managerAddress(type) {
                this.addressQuery.addressType = type;
                this.addressParams.addressType = type;
                this.addressListDlShow = true;
                this.getAddressList(this.addressQuery).then( data => {
                    this.addressList = data;
                })
            },
            showNewAddress() {
                this.addressAddDlShow = true;
            },
            submitAddress() {
                this.newAddress(this.addressParams)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '地址添加成功!',
                    },
                    this.getAddressList(this.addressQuery).then( data => {
                        this.addressList = data;
                        this.addressAddDlShow = false;
                    }))
                })
            },
            deleteAddress(addressId) {
                this.addressQuery.page = 1;
                this.removeAddress({addressId:[addressId].join(',')})
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除地址成功!',
                    },
                    this.getAddressList(this.addressQuery).then( data => {
                        this.addressList = data;
                    }))
                })
            },
            setDefaultAddress(addressId) {
                this.setDefault({addressId,addressType:this.addressQuery.addressType})
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '设置默认地址成功!',
                    },
                    this.getAddressList(this.addressQuery).then( data => {
                        this.addressList = data;
                    }))
                })
            },
            onAddressClose() {
                this.addressQuery.page = 1;
            },
            selectAddress(address) {
                if(this.addressQuery.addressType == 1){
                    this.confirmParams.CAddress = address;
                }else{
                    this.confirmParams.BAddress = address;
                }
                this.addressListDlShow = false;
            },
            carAddShow() {
                this.carAddDlShow = true;
            },
            submitCar() {
                if(!this.carParams.plate){
                    this.$message({
                        type: 'warning',
                        message: '请填写车牌号!',
                    })
                    return false;
                }
                if(!this.carParams.phone){
                    this.$message({
                        type: 'warning',
                        message: '请填写手机号!',
                    })
                    return false;
                }
                var car = {};
                car.plate = this.carParams.plate;
                car.phone = this.carParams.phone;
                this.confirmParams.carList.push(car);
                this.carAddDlShow = false;
            },
            deleteCar(index) {
                this.confirmParams.carList.splice(index,1);
            },
            orderPrint() {
                var params = {
                    orderNo:this.orderNo
                }
                this.printOrder(params)
                .then(data => {
                    this.printParams.specs = data.orderDetail.slice();
                    this.$refs.printpage.print();
                })
            },
            loadList(){
                this.loading = true
                this.loadOrderList(this.orderParams).then(()=>{
                    this.loading = false;
                });
            }
        },
        mounted: function() {
            this.loadList();
        },
        filters:{
            dateFilter(val){
                return val.formatDate('yyyy-MM-dd');
            }
        }
    }
</script>
