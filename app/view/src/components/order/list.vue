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
                <el-button type="warning" @click="exportOrder" :loading="loading">导出订单列表</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="exportOrderDetailList" :loading="loading">导出订单详情列表</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="orderList.row" stripe v-loading.body="loading" border>
                <el-table-column prop="orderNo" label="订单号" width="200"></el-table-column>
                <el-table-column prop="createTime" :formatter="dateFormat" label="下单时间" width="180"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" :formatter="nameFormat"></el-table-column>
                <el-table-column prop="orderWeight" label="总吨位"></el-table-column>
                <el-table-column prop="orderPrice" label="总价"></el-table-column>
                <el-table-column prop="orderAdjust" label="下浮总额"></el-table-column>
                <el-table-column prop="userId" label="下单人"></el-table-column>
                <el-table-column prop="validate" :formatter="statusFormatter" width="80" label="状态"></el-table-column>
                <el-table-column label="操作" align="left" width="200px" property="id">
                    <template slot-scope="scope">
                        <el-button size="small" @click="viewDetail(scope.index, scope.row)" type="info">查看</el-button>
                        <el-button size="small" @click="confirmPrintInfo(scope.index, scope.row)" type="success">打印</el-button>
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
        <el-dialog v-model="detailDialogShow" custom-class="o-detail">
            <el-table :data="orderDetail" stripe v-loading.body="detailLoading" border>
                <el-table-column prop="spec" label="规格" width="140px"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="100px"></el-table-column>
                <el-table-column prop="orderAmount" label="数量"></el-table-column>
                <el-table-column prop="unitPrice" label="单价"></el-table-column>
                <el-table-column prop="daPrice" label="到岸价"></el-table-column>
                <el-table-column prop="minPrice" label="最低价"/>
                <el-table-column prop="minSupplier" width="130px" label="最低价供应商"/>
                <el-table-column prop="minInventory" width="120px" label="最低价库存"/>
                <el-table-column prop="Weight" label="重量"></el-table-column>
                <el-table-column prop="orderDcrease" label="总下浮"></el-table-column>
                <el-table-column prop="dcreaseUnit" :formatter="unitFormatter" label="单位下浮"></el-table-column>
                <el-table-column prop="comment" label="备注"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateDatail(scope.index, scope.row)" type="success">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="warning" style="margin:5px 0px 10px 0px;;float:right;" @click="exportOrderDetail" :loading="loading">导出Excel</el-button>
        </el-dialog>

        <el-dialog
            v-model="updateDatailDlShow"
            size="tiny"
            class="custom-dialog"
            >
            <div class="dialog-content">
                <el-input v-model="detailUpdateParams.orderDcrease" class="dialog-item">
                    <template slot="prepend">下浮</template>
                </el-input>
                <el-input v-model="detailUpdateParams.Weight" class="dialog-item">
                    <template slot="prepend">重量</template>
                </el-input>
                <el-input v-model="detailUpdateParams.unitPrice" class="dialog-item">
                    <template slot="prepend">单价</template>
                </el-input>
                <el-input v-model="detailUpdateParams.orderAmount" class="dialog-item">
                    <template slot="prepend">数量</template>
                </el-input>
                <el-input v-model="detailUpdateParams.comment" class="dialog-item">
                    <template slot="prepend">备注</template>
                </el-input>
                <el-button type="info" class="dialog-item float-right" @click="submitOrderDetail">确定</el-button>
            </div>
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
                    <template slot="prepend">对方地址</template>
                    <el-button slot="append" style="box-sizing:border-box!import" @click="managerAddress(2)" type="success" icon="edit">管理</el-button>
                </el-input>
                <el-input v-model="confirmParams.comment" class="dialog-item">
                    <template slot="prepend">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</template>
                </el-input>
                <div class="car-list dialog-item clearfix">
                    <div class="car-item" v-for="(item,index) in confirmParams.carList" :key="index">
                        <span>{{item.plate}}</span>
                        <span class="close"><i class="iconfont icon-close" @click="deleteCar(index)"></i></span>
                    </div>
                </div>
                <div class="dialog-item add-car" @click="carListShow">
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
                <div style="margin-bottom:15px;">
                    <el-input placeholder="输入地址检索" v-model="addressQuery.address">
                        <template slot="append">
                            <el-button type="success" icon="search" @click="searchAddress">搜索</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="address-item" v-for="(item,index) in addressList.row" @click="selectAddress(item)" :key="index">
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
                <el-input v-model="addressParams.address" class="dialog-item" placeholder="">
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
                <el-input v-model="carParams.linkName" class="dialog-item" placeholder="可不填">
                    <template slot="prepend">货车名称</template>
                </el-input>
                <el-button type="info" class="dialog-item float-right" @click="submitCar">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            v-model="carListDlShow"
            size="tiny"
            @close="onCarClose">
            <div class="address-content">
                <div style="margin-bottom:15px;">
                    <el-input placeholder="输入车牌进行检索" v-model="carQuery.plate">
                        <template slot="append">
                            <el-button type="success" icon="search" @click="searchCar">搜索</el-button>
                        </template>
                    </el-input>
                </div>
                <div class="address-item" v-for="(item, index) in carList.row" :key="index" @click="selectCar(item)">
                    <div class="address-name">{{item.linkName}}</div>
                    <span class="plate"><i class="iconfont icon-plate"></i>{{item.plate}}</span>
                    <span class="phone"><i class="iconfont icon-phone"></i>{{item.phone}}</span>
                    <aside>
                        <span class="delete" @click.stop="removeRemoteCar(item.carId)">删除车辆</span>
                    </aside>
                </div>
                <div class="address-page">
                    <el-pagination
                        @current-change="handleCarPage"
                        :current-page.sync="carQuery.page"
                        layout=" prev, pager, next"
                        :page-size="5"
                        :total="carList.totalCount"
                    >
                    </el-pagination>
                </div>
                <div class="add-address address-item"  @click="showNewCar">
                    <span><i class="iconfont icon-rectadd"></i>添加车辆</span>
                </div>
            </div>
        </el-dialog>
        <printpage ref="printpage">
            <div class="print-content" style="position:relative;height:100%;">
                <div class="title" style="text-align:center;font-size:24px;letter-spacing:30px">{{confirmParams.CAddress.addressName}}</div>
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
                        <tr v-for="(item, index) in confirmParams.carList" :key="index">
                            <td style="width:50%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.plate}}</td>
                            <td style="width:50%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.phone}}</td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" border="0" style="width:100%;border-top:1px solid #dfe6ec;border-left:1px solid #dfe6ec;margin-top:20px;">
                    <caption style="text-align:left;margin-bottom:5px;font-size:12px;color:#888">规格如下：</caption>
                    <thead>
                        <tr>
                            <th style="width:10%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">序号</th>
                            <th style="width:30%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">规格</th>
                            <th style="width:10%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">长度</th>
                            <th style="width:10%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">类别</th>
                            <th style="width:15%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">数量（件）</th>
                            <th style="width:25%;padding:5px 0px;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in printParams.specs" :key="index">
                            <td style="width:10%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{index+1}}</td>
                            <td style="width:30%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.spec}}</td>
                            <td style="width:10%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.long}}米</td>
                            <td style="font-size:10px;width:10%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.type}}</td>
                            <td style="width:15%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.orderAmount}}</td>
                            <td style="width:25%;padding:5px 0px;text-align:center;border-right:1px solid #dfe6ec;border-bottom:1px solid #dfe6ec">{{item.comment}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="comment-container" style="margin-top:20px;font-family:'楷书'">
                    <div class="comment" style="text-align:center;font-size:18px;font-weight:bold">{{confirmParams.comment}}</div>
                    <div class="date" style="text-align:right">{{new Date() | dateFilter}}</div>
                </div>
                <div class="footer" style="position:absolute;bottom:0px;width:100%;font-size:14px;color:#ccc">
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
        display:none;
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
            .plate{
                color:#1F2D3D;
                font-size:14px;
                line-height:2em;
                font-weight:bold;
            }
            .phone{
                color:#99A9BF;
                font-size:12px;
                line-height:2em;
                margin-left:10px;
                font-weight:bold;
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
        printOrder,
        defaultAddress,
        getAddressList,
        newAddress,
        removeAddress,
        setDefault,
        getCarList,
        newCar,
        removeCar,
        orderDetailUp
    } from '../../vuex/action'
import printpage from '../common/printpage'
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
          getCarList,
          newCar,
          removeCar,
          orderDetailUp
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
        }
      },
      components: {
        printpage
      },
      data () {
        return {
          orderParams: {
            orderNo: '',
            comId: this.userInfo.comId,
            page: 1
          },
          loading: true,
          printLoading: false,
          detailLoading: true,
          detailDialogShow: false, // 订单详细
          printDlConfirmShow: false, // 打印确认
          addressListDlShow: false, // 地址列表
          addressAddDlShow: false, // 添加地址
          carAddDlShow: false, // 车辆添加
          carListDlShow: false, // 车辆列表
          updateDatailDlShow: false, // 更新订单详情
          orderNo: '',
          printParams: {
            specs: [], // 发货单规格列表
            comInfo: {} // 公司信息，需要填写
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
            emainl: ''
          },
          carParams: {
            plate: '',
            phone: '',
            linkName: ''
          },
          addressQuery: {
            addressType: '',
            page: 1,
            address: ''
          },
          carQuery: {
            plate: '',
            page: 1
          },
          confirmParams: {
            CAddress: {
              address: ''
            }, // 收货地址
            BAddress: {
              address: ''
            }, // 发货地址
            carList: [],
            comment: ''
          },
          addressList: [],
          carList: [],
          detailUpdateParams: {
            orderDetailId: '',
            orderNo: '',
            comment: '',
            orderDcrease: '',
            unitPrice: '',
            orderAmount: '',
            Weight: ''
          }
        }
      },
      methods: {
        handleCurrentChange (val) {
          this.orderParams.page = val
          this.loadList()
        },
        handleAddressPage (val) {
          this.addressQuery.page = val
          this.getAddressList(this.addressQuery).then(data => {
            this.addressList = data
          })
        },
        handleCarPage (val) {
          this.carQuery.page = val
          this.getCarList(this.carQuery).then(data => {
            this.carList = data
          })
        },
        searchOrder () {
          this.loadList()
        },
        exportOrder () {
          var date = new Date().formatDate('yyyyMMdd')
          window.open(`/zues/api/export/order/订单列表${date}.xls`)
        },
        exportOrderDetailList () {
          var date = new Date().formatDate('yyyyMMdd')
          window.open(`/zues/api/export/orderdetaillist/订单详情列表${date}.xls`)
        },
        exportOrderDetail () {
          window.open(`/zues/api/export/orderdetail/${this.orderDetail[0].orderNo}订单详情.xls?orderNo=${this.orderDetail[0].orderNo}`)
        },
        statusFormatter (row, column) {
          return row.validate === 0 ? '未审核' : '已审核'
        },
        dateFormat (row, column) {
          return new Date(parseInt(row.createTime)).formatDate('yyyy-MM-dd hh:mm:ss')
        },
        nameFormat (row, colum) {
          return row.supplierName.replace(/黑管|热镀锌|镀锌带/g, '')
        },
        unitFormatter (row, colum) {
          return Number(row.orderDcrease / row.Weight).toFixed(2)
        },
        viewDetail (index, row) {
          this.detailDialogShow = true
          this.detailLoading = true
          this.loadOrderDetail({orderNo: row.orderNo}).then(() => {
            this.detailLoading = false
          })
        },
        enterNum (index, row) {
          const orderNoArr = [row.orderNo].join(',')
          this.$confirm('该订单将被删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            class: 'LDW'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            },
                  this.removeOrderList({orderNo: orderNoArr})
                  )
            this.loadList()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        },
        confirmPrintInfo (index, row) {
          this.printDlConfirmShow = true
          this.orderNo = row.orderNo
          var params = {}
          params.addressType = 1
          this.defaultAddress(params).then(data => {
            if (data[0]) {
              this.confirmParams.CAddress = data[0]
            } else {
              this.confirmParams.CAddress = {}
            }
            params.addressType = 2
            this.defaultAddress(params).then(data => {
              if (data[0]) {
                this.confirmParams.BAddress = data[0]
              } else {
                this.confirmParams.BAddress = {}
              }
            })
          })
        },
        managerAddress (type) {
          this.addressQuery.addressType = type
          this.addressParams.addressType = type
          this.addressListDlShow = true
          this.getAddressList(this.addressQuery).then(data => {
            this.addressList = data
          })
        },
        searchAddress () {
          this.addressQuery.page = 1
          this.getAddressList(this.addressQuery).then(data => {
            this.addressList = data
          })
        },
        searchCar () {
          this.carQuery.page = 1
          this.getCarList(this.carQuery).then(data => {
            this.carList = data
          })
        },
        showNewAddress () {
          this.addressAddDlShow = true
        },
        showNewCar () {
          this.carAddDlShow = true
        },
        submitAddress () {
          this.newAddress(this.addressParams)
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '地址添加成功!'
                  },
                    this.getAddressList(this.addressQuery).then(data => {
                      this.addressList = data
                      this.addressAddDlShow = false
                    }))
                })
        },
        deleteAddress (addressId) {
          this.addressQuery.page = 1
          this.removeAddress({addressId: [addressId].join(',')})
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除地址成功!'
                  },
                    this.getAddressList(this.addressQuery).then(data => {
                      this.addressList = data
                    }))
                })
        },
        removeRemoteCar (carId) {
          this.carQuery.page = 1
          this.removeCar({carId: [carId].join(',')})
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除车辆成功!'
                  },
                    this.handleCarPage(1))
                })
        },
        setDefaultAddress (addressId) {
          this.setDefault({addressId, addressType: this.addressQuery.addressType})
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: '设置默认地址成功!'
                  },
                    this.getAddressList(this.addressQuery).then(data => {
                      this.addressList = data
                    }))
                })
        },
        onAddressClose () {
          this.addressQuery.page = 1
          this.addressQuery.address = ''
        },
        onCarClose () {
          this.carQuery.page = 1
          this.carQuery.plate = ''
        },
        selectAddress (address) {
          if (this.addressQuery.addressType === 1) {
            this.confirmParams.CAddress = address
          } else {
            this.confirmParams.BAddress = address
          }
          this.addressListDlShow = false
        },
        selectCar (car) {
          this.confirmParams.carList.push(car)
          this.carListDlShow = false
        },
        carListShow () {
          this.carListDlShow = true
          this.getCarList(this.carQuery).then(data => {
            this.carList = data
          })
        },
        submitCar () {
          if (!this.carParams.plate) {
            this.$message({
              type: 'warning',
              message: '请填写车牌号!'
            })
            return false
          }
          if (!this.carParams.phone) {
            this.$message({
              type: 'warning',
              message: '请填写手机号!'
            })
            return false
          }
          var car = {}
          car.plate = this.carParams.plate
          car.phone = this.carParams.phone
          car.linkName = this.carParams.linkName
          this.newCar(car).then(data => {
            this.$message(
              {
                type: 'warning',
                message: '添加车辆成功!'
              }
                    )
            this.carAddDlShow = false
            this.handleCarPage(1)
          })
        },
        deleteCar (index) {
          this.confirmParams.carList.splice(index, 1)
        },
        orderPrint () {
          var params = {
            orderNo: this.orderNo
          }
          this.printOrder(params)
                .then(data => {
                  this.printParams.specs = data.orderDetail.slice()
                  this.$refs.printpage.print()
                })
        },
        loadList () {
          this.loading = true
          this.loadOrderList(this.orderParams).then(() => {
            this.loading = false
          })
        },
        updateDatail (scope, row) {
          this.detailUpdateParams.orderNo = row.orderNo
          this.detailUpdateParams.orderDcrease = row.orderDcrease
          this.detailUpdateParams.comment = row.comment
          this.detailUpdateParams.orderDetailId = row.orderDetailId
          this.detailUpdateParams.orderAmount = row.orderAmount
          this.detailUpdateParams.Weight = row.Weight
          this.detailUpdateParams.unitPrice = row.unitPrice
          this.updateDatailDlShow = true
        },
        submitOrderDetail () {
          this.orderDetailUp(this.detailUpdateParams)
                    .then(() => {
                      this.$message(
                        {
                          type: 'success',
                          message: '更新成功!'
                        }
                        )
                      this.updateDatailDlShow = false
                      this.detailDialogShow = false
                      this.loadList()
                    })
        }
      },
      mounted: function () {
        this.loadList()
      },
      filters: {
        dateFilter (val) {
          return val.formatDate('yyyy-MM-dd')
        }
      }
    }
</script>
<style lang="less">
    .order-wrap {
        .o-detail {
            width:auto
        }
    }
</style>
