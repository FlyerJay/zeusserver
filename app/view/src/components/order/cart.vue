<template>
    <div> 
        <div style="margin-top: 20px">
            <el-form style="margin-top:20px">
                <!--<el-form-item label="库存紧张">
                    <el-tag  color="red">  </el-tag>
                </el-form-item>-->
                <el-form-item label="已选商品(含运费):">
                    <span>{{totalPrice | priceFilter}}</span>
                    <span>（采购吨位：{{totalWeight}}）</span>
                    <el-button @click="submitOrder()" type="warning">提交</el-button>
                </el-form-item>
            </el-form>
        </div> 
        <div class="sea-title clearfix">
            <el-button type="success" @click="dlgTbheadVisible = true" style="float:right" size="small"><i class="iconfont icon-custom">&nbsp;</i>自定义表头</el-button>
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
                <el-table-column prop="spec" label="规格" width="140px" v-if="checkedTBhead.indexOf('规格') > -1">
                </el-table-column>
                <el-table-column prop="long" label="长度" width="70px" v-if="checkedTBhead.indexOf('长度') > -1">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="80px" v-if="checkedTBhead.indexOf('类别') > -1">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="120px" v-if="checkedTBhead.indexOf('供应商') > -1">
                </el-table-column>
                <el-table-column prop="chartAmount" label="数量" width="80px" v-if="checkedTBhead.indexOf('数量') > -1">
                </el-table-column>
                <el-table-column prop="perAmount" label="包装" width="80px" v-if="checkedTBhead.indexOf('包装') > -1"></el-table-column>
                </el-table-column>
                <el-table-column prop="chartWeight" :formatter="weightFormatter" label="吨位" v-if="checkedTBhead.indexOf('包装') > -1">
                </el-table-column>
                <el-table-column prop="purePrice" :formatter="purePriceFormatter" label="开单价" v-if="checkedTBhead.indexOf('开单价') > -1">
                </el-table-column>
                <el-table-column prop="chartAdjust" label="采购议价" width="100px" v-if="checkedTBhead.indexOf('采购议价') > -1">
                </el-table-column>
                <el-table-column prop="totalAdjust" :formatter="adjustFormatter" label="议价总额" width="100px" v-if="checkedTBhead.indexOf('议价总额') > -1">
                </el-table-column>
                <el-table-column prop="totalPrice" :formatter="totalPriceFormatter" label="金额" width="100px" v-if="checkedTBhead.indexOf('金额') > -1">
                </el-table-column>
                <el-table-column prop="userId" label="用户Id" v-if="checkedTBhead.indexOf('用户Id') > -1">
                </el-table-column>
                <el-table-column prop="comment" label="备注" v-if="checkedTBhead.indexOf('备注') > -1">
                </el-table-column>
                <el-table-column label="操作" align="center" property="id" width="150px" v-if="checkedTBhead.indexOf('操作') > -1">
                    <template scope="scope">
                        <el-button size="small" @click="updateChart(scope.index,scope.row)" type="warning">修改</el-button>
                        <el-button size="small" @click="deleteChart(scope.index,scope.row)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-wrap">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="listParams.page"
                layout=" prev, pager, next"
                :page-size="100"
                :total="cartList.totalCount"
            >
            </el-pagination>
        </div>
        <el-dialog
            v-model="dialogVisible"
            size="tiny"
            custom-class="zues-dialog">
            <el-form :model="changeParams" label-width="80px" label-position="left">
                <el-form-item label="采购数量" >
                    <el-input style="width:85%" @input="computePrice"  v-model="changeParams.chartAmount" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="采购议价">
                    <el-input style="width:85%" @input="computePrice" v-model="changeParams.chartAdjust" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="总价">
                    <el-input style="width:85%" v-model="changeParams.newPrice" :readonly="true" auto-complete="off" type="number"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input style="width:85%" v-model="changeParams.comment" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submitChange(changeParams.row)">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="" v-model="dlgTbheadVisible" size="tiny">
            <div class="tbhead-wrap">
            <el-checkbox-group v-model="checkedTBhead">
                <el-checkbox v-for="head in TBheads" :label="head" :key="head">{{head}}</el-checkbox>
            </el-checkbox-group>
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
                    chartAmount: 0,
                    chartAdjust: 0,
                    newPrice: 0,
                    oldPrice: 0,
                    comment: '',
                    row: {}
                },
                supplierInventoryIds: [],
                dlgTbheadVisible: false,
                checkedTBhead: ['规格', '长度',	'类别', '供应商', '数量', '包装', '吨位', '开单价', '采购议价',	'议价总额',	'金额', '用户Id', '备注', '操作'],
                TBheads: ['规格',	'长度', '类别',	'供应商', '数量', '包装', '吨位', '开单价',	'采购议价',	'议价总额',	'金额', '用户Id', '备注', '操作'],
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
                this.loading = true;
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
                if(!row.spec) {
                    row.chartWeight = 0;
                    return ''
                }
                const specArr = row.spec.split('*');
                const height = Number(specArr[0]);
                const width = Number(specArr[1]);
                const land = Number(specArr[2]);
                const long = Number(row.long) ? Number(row.long) : 6;
                const per = Number(row.perAmount);
                const perimeter = 2 * height + 2 * width;
                const amount = Number(row.chartAmount);
                row.chartWeight = (((perimeter/3.14 - land) * land * long * 0.02466 * amount * per)/1000).toFixed(2);
                return (((perimeter/3.14 - land) * land * long * 0.02466 * amount * per)/1000).toFixed(2);
            },
            purePriceFormatter(row,column){
                const value = Number(row.value);
                const freight = Number(row.freight) - Number(row.benifit?row.benifit:0);
                row.purePrice = (row.value - row.benifit).toFixed(2);
                return (row.value - row.benifit).toFixed(0);
            },
            adjustFormatter(row,column){
                const adjust = Number(row.chartAdjust?row.chartAdjust:0) * row.chartWeight;
                row.totalAdjust = adjust.toFixed(2);
                return adjust.toFixed(2);
            },
            totalPriceFormatter(row,column){
                const price = Number(row.purePrice);
                const adjust = Number(row.chartAdjust?row.chartAdjust:0) * row.chartWeight;
                const totoalPice = price?price*row.chartWeight-adjust:0;
                row.totalPrice = totoalPice.toFixed(2);
                return totoalPice.toFixed(2);
            },
            handleSelectionChange(val) {
                this.supplierInventoryIds = val;
                this.updateTotalPrice(this.supplierInventoryIds);
            },
            updateTotalPrice(row) {
                var totalPrice = 0;
                var totalWeight = 0;
                var totalAdjust = 0;
                row.map((v)=>{
                    totalPrice += v.totalPrice?Number(v.totalPrice):0;
                    totalWeight += v.chartWeight?Number(v.chartWeight):0;
                    totalAdjust += v.totalAdjust?Number(v.totalAdjust):0;
                })
                this.totalPrice = totalPrice;
                this.totalWeight = totalWeight.toFixed(2);
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
                    this.loading = true;
                    this.loadCartList(this.listParams).then(()=>{
                        this.loading = false;
                    })
              });
            },
            updateChart(index,row) {
                this.dialogVisible = true;
                this.changeParams.chartId = row.chartId;
                this.changeParams.chartAmount = row.chartAmount;
                this.changeParams.chartAdjust = row.chartAdjust;
                this.changeParams.newPrice = row.totalPrice;
                this.changeParams.oldPrice = row.totalPrice;
                this.changeParams.comment = row.comment;
                this.changeParams.row = row;
            },
            deleteChart(index,row) {
                console.log(row);
                this.$confirm('确定删除购物车?','警告',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removeCartList({
                        chartId:row.chartId+'',
                    }).then(()=>{
                        this.$message({
                            message: `删除成功`,
                            type: 'success'
                        })
                    })
                    this.loading = true;
                    this.loadCartList(this.listParams).then(()=>{
                        this.loading = false;
                    })
                })
            },
            computePrice() {
                var specArr = this.changeParams.row.spec.split('*');
                var height = Number(specArr[0]);
                var width = Number(specArr[1]);
                var land = Number(specArr[2]);
                var long = Number(this.changeParams.row.long);
                var per = Number(this.changeParams.row.perAmount);
                var perimeter = 2 * height + 2 * width;
                var weight = (((perimeter/3.14 - land) * land * long * 0.02466 * this.changeParams.chartAmount * per)/1000).toFixed(2);
                this.changeParams.newPrice = (( this.changeParams.row.purePrice - this.changeParams.chartAdjust ) * weight ).toFixed(2);
            },
            submitChange(row) {
                this.updateCart(this.changeParams).then(() => {
                    this.$message({
                        message: `购物车修改成功`,
                        type: 'success'
                    });
                    this.dialogVisible = false;
                    row.chartAmount = this.changeParams.chartAmount;
                    row.chartAdjust = this.changeParams.chartAdjust;
                    row.comment = this.changeParams.comment;
                    this.supplierInventoryIds.map((v) => {
                        if(v.chartId === row.chartId){
                            this.totalPrice = (Number(this.totalPrice) + Number(this.changeParams.newPrice) - Number(this.changeParams.oldPrice)).toFixed(2);
                            const specArr = row.spec.split('*');
                            const height = Number(specArr[0]);
                            const width = Number(specArr[1]);
                            const land = Number(specArr[2]);
                            const long = Number(row.long) ? Number(row.long) : 6;
                            const per = Number(row.perAmount);
                            const perimeter = 2 * height + 2 * width;
                            const amount = Number(row.chartAmount);
                            this.totalWeight = (((perimeter/3.14 - land) * land * long * 0.02466 * amount * per)/1000).toFixed(2);
                            this.totalAdjust = (Number(this.changeParams.chartAdjust) * Number(this.totalWeight)).toFixed(2);
                        }
                    })
                })
            }
        },
        mounted: function() {
            this.loading = true;
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
<style lang="less" scoped>
    .sea-title {
        font-size: 20px;
        margin-bottom: 10px;
    }
</style>