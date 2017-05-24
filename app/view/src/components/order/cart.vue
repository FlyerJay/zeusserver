<template>
    <div> 
          <div style="margin-top: 20px">
            <el-form style="margin-top:20px">
                <!--<el-form-item label="库存紧张">
                    <el-tag  color="red">  </el-tag>
                </el-form-item>-->
                <el-form-item label="已选商品(含运费):">
                    <span>{{totalPrice|priceFilter}}</span>
                    <el-button @click="submitOrder()">提交</el-button>
                </el-form-item>
            </el-form>
            
          </div>
          <div class="tb-wrap">
            <el-table
                    ref="multipleTable"
                    :data="cartList.row"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading.body="loading">
                <el-table-column type="selection" width="">
                </el-table-column>
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商">
                </el-table-column>
                <el-table-column prop="purePrice" :formatter="purePriceFormatter" label="出厂单价(含运费)">
                </el-table-column>
                <el-table-column prop="chartAmount" label="采购数量(件)">
                </el-table-column>
                <el-table-column prop="chartWeight" :formatter="weightFormatter" label="采购吨位(吨)">
                </el-table-column>
                <el-table-column prop="chartAdjust" label="采购下浮(元/吨)">
                </el-table-column>
                <el-table-column prop="totalAdjust" :formatter="adjustFormatter" label="下浮总额(元)">
                </el-table-column>
                <el-table-column prop="totalPrice" :formatter="totalPriceFormatter" label="金额">
                </el-table-column>
                <el-table-column label="操作" align="center" property="id">
                    <template scope="scope">
                        <el-button size="small" @click="updateChart(scope.row)" type="warning">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="listParams.page"
                layout=" prev, pager, next"
                :page-size="30"
                :total="cartList.totalCount"
            >
            </el-pagination>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            size="tiny"
            custom-class="zues-dialog">
            <el-form :model="changeParams">
                <el-form-item label="采购数量">
                    <el-input v-model="changeParams.chartAmount" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="采购下浮">
                    <el-input v-model="changeParams.chartAdjust" auto-complete="off" type="number"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="warning" @click="submitChange(changeParams)">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<style lang="less">
    .zues-dialog{
        width:300px!important;
    }
</style>
<script>
    import {
      loadCartList,
      addToList,
      removeCartList,
      updateCart
    } from '../../vuex/action'

    export default {
        vuex: {
            actions: {
                loadCartList,
                addToList,
                removeCartList,
                updateCart,
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                cartList: ({
                    order
                }) => order.cartList,
                orderList:({
                    order
                }) => order.orderList
            }
        },
        data() {
            return {
                listParams: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    page:1
                },
                submitParams: {
                    comId: this.userInfo.comId,
                    userId: this.userInfo.userId,
                    supplierInventoryIds: [],
                    orderWeight: 0,
                    orderPrice: 0,
                    orderAdjust: 0
                },
                changeParams:{
                    chartId: '',
                    chartAmount: '',
                    charAdjust: ''
                },
                supplierInventoryIds: [],
                dialogVisible: false,
                loading: true,
                totalPrice: 0,
                totalWeight: 0,
                totalAdjust: 0
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.listParams.page = val;
                this.loadCartList(this.listParams).then(()=>{
                    this.loading = false;
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            weightFormatter(row,column) {
                const specArr = row.spec.split('*');
                const height = Number(specArr[0]);
                const width = Number(specArr[1]);
                const land = Number(specArr[2]);
                const long = Number(row.long);
                const perimeter = 2 * height + 2 * width;
                const amount = Number(row.chartAmount);
                row.chartWeight = (((perimeter/3.14 - land) * land * 6 * 0.02466 * amount)/1000).toFixed(2);
                return (((perimeter/3.14 - land) * land * 6 * 0.02466 * amount)/1000).toFixed(2);
            },
            purePriceFormatter(row,column){
                const value = Number(row.value);
                const freight = Number(row.freight) - Number(row.benifit?row.benifit:0);
                row.purePrice = value + freight;
                return value + freight
            },
            adjustFormatter(row,column){
                const adjust = Number(row.chartAdjust?row.chartAdjust:0) * row.chartWeight;
                row.totalAdjust = adjust;
                return adjust;
            },
            totalPriceFormatter(row,column){
                const price = Number(row.purePrice);
                const adjust = Number(row.chartAdjust?row.chartAdjust:0) * row.chartWeight;
                const totoalPice = price?price*row.chartWeight-adjust:'';
                row.totalPrice = totoalPice.toFixed(2);
                return totoalPice.toFixed(2);
            },
            handleSelectionChange(val) {
                this.supplierInventoryIds = val;
                var totalPrice = 0;
                var totalWeight = 0;
                var totalAdjust = 0;
                this.supplierInventoryIds.map((v)=>{
                    totalPrice += v.totalPrice?Number(v.totalPrice):0;
                    totalWeight += v.chartWeight?Number(v.chartWeight):0;
                    totalAdjust += v.totalAdjust?Number(v.totalAdjust):0;
                })
                this.totalPrice = totalPrice;
                this.totalWeight = totalWeight;
                this.totalAdjust = totalAdjust;
            },
            submitOrder() {
               this.submitParams.supplierInventoryIds = this.supplierInventoryIds;
               this.submitParams.orderWeight = this.totalWeight;
               this.submitParams.orderPrice = this.totalPrice;
               this.submitParams.orderAdjust = this.totalAdjust;
               this.addToList(this.submitParams)
               .then(rs => {
                 this.$message({
                    message: `下单成功`,
                    type: 'success'
                 });
              });
            },
            updateChart(row) {
                this.dialogVisible = true;
                this.changeParams = row;
            },
            submitChange(data) {
                this.dialogVisible = false;
                this.updateCart(this.changeParams);
            }
        },
        mounted: function() {
            this.loadCartList(this.listParams).then(()=>{
                this.loading = false;
            })
        },
        filters:{
            priceFilter:function(v){
                return '￥' + Number(v).toFixed(2);
            }
        }
    }
</script>
