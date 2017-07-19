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
                        <el-button :disabled="scope.row.validate == 0" size="small" @click="orderPrint(scope.index, scope.row)" type="success">打印</el-button>
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
        <printpage ref="printpage">
            <div class="print-content">
                <div class="title" style="text-align:center;font-size:24px;letter-spacing:30px">南京奎鑫物资有限公司</div>
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #dfe6ec;border-left:1px solid #dfe6ec;margin-top:20px;">
                    <thead>
                        <tr>
                            <th style="width:20%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">序号</th>
                            <th style="width:30%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">规格</th>
                            <th style="width:20%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">数量</th>
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
            </div>
        </printpage>
     </div>
</template>
<style lang="less">
    .print-content{
        //display:none;//打印时只读取内联样式，这个设置只是让页面忽略不展示打印页面
    }
</style>
<script>
    import {
        loadOrderList,
        removeOrderList,
        loadOrderDetail,
        exportOrderList,
        printOrder,
    } from '../../vuex/action';
    import printpage from '../common/printpage';
    export default {
        vuex: {
            actions: {
                loadOrderList,
                removeOrderList,
                loadOrderDetail,
                printOrder,
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
                detailLoading: true,
                detailDialogShow: false,
                printParams: {
                    specs: [],//发货单规格列表
                    comInfo: {},//公司信息，需要填写
                }
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.orderParams.page = val;
                this.loadList();
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
            orderPrint(index, row) {
                var params = {
                    orderNo:row.orderNo
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
        }
    }
</script>
