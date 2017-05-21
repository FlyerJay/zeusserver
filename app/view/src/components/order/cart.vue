<template>
    <div> 
          <div style="margin-top: 20px">
            <el-form style="margin-top:20px">
                <el-form-item label="库存紧张">
                    <el-tag  color="red">  </el-tag>
                </el-form-item>
                 <el-form-item label="已选商品(含运费):">
                    <span>999</span>
                    <el-button @click="submitOrder()">提交</el-button>
                </el-form-item>
            </el-form>
            
          </div>
          <el-table
                ref="multipleTable"
                :data="cartList"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="">
            </el-table-column>
            <el-table-column prop="spec" label="规格" width="">
            </el-table-column>
            <el-table-column prop="type" label="类别" width="">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商">
            </el-table-column>
            <el-table-column prop="freight" label="出厂单价(含运费)">
            </el-table-column>
            <el-table-column prop="chartAmount" label="采购数量(支)">
            </el-table-column>
            <el-table-column prop="benifit" label="采购吨位(吨)">
            </el-table-column>
            <el-table-column prop="charAdjust" label="采购下浮(元/吨)">
            </el-table-column>
            <el-table-column prop="value" label="金额">
            </el-table-column>
            <el-table-column label="操作" align="center" property="id">
                <template scope="scope">
                    <el-button size="small" @click="updateChart(scope.index,scope.row)" type="warning">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :visible.sync="dialogVisible"
            size="tiny"
            custom-class="zues-dialog">
            <el-form :model="changeParams">
                <el-form-item label="采购数量">
                    <el-input v-model="changeParams.chartAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="采购下浮">
                    <el-input v-model="changeParams.charAdjust" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgSupVisible = false">取 消</el-button>
                <el-button type="warning" @click="changeSup(changeSupParam.row)">确 定</el-button>
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
                updateCart
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
                },
                submitParams: {
                    comId: this.userInfo.comId,
                    userId: this.userInfo.userId,
                    supplierInventoryIds: []
                },
                changeParams:{
                    comId: this.userInfo.comId,
                    userId:this.userInfo.userId,
                    chartAmount:'',
                    charAdjust:''
                },
                supplierInventoryIds: [],
                dialogVisible:false
            }
        },
        methods: {
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.supplierInventoryIds = val;
            },
            submitOrder() {
               this.submitParams.supplierInventoryIds = this.supplierInventoryIds;
               this.addToList(this.submitParams)
               .then(rs => {
                 this.$message({
                 message: `下单成功`,
                  type: 'success'
                 });
              });
            },
            updateChart(index,row) {
                this.dialogVisible = true;
                for(var props in row){
                    this.changeParams[props] ? this.changeParams[props] = row[props] : '';
                }
            }
        },
        mounted: function() {
            this.loadCartList(this.listParams)
        }
    }
</script>
