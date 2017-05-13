<template>
    <div>
          <el-table
                ref="multipleTable"
                :data="cartList"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="spec" label="规格" width="">
            </el-table-column>
            <el-table-column prop="date" label="最新更新时间" width="">
            </el-table-column>
            <el-table-column prop="type" label="类别" width="">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商">
            </el-table-column>
            <el-table-column prop="inventoryAmount" label="出厂价(元/吨)">
            </el-table-column>
            <el-table-column prop="inventoryWeight" label="库存（支）">
            </el-table-column>
            <el-table-column prop="freight" label="运费（元）">
            </el-table-column>
            <el-table-column prop="benifit" label="厂家政策优惠（元/吨）">
            </el-table-column>
            <el-table-column prop="perAmount" label="出厂单价（元）">
            </el-table-column>
            <el-table-column label="操作" align="center" property="id">
                <template scope="scope">
                    <el-button size="small" @click="" type="warning">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
            <el-button @click="submitOrder()">提交</el-button>
        </div>
  </div>
</template>

<script>
    import {
      loadCartList
    } from '../../vuex/action'

    export default {
        vuex: {
            actions: {
                loadCartList
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                cartList: ({
                    order
                }) => order.cartList
            }
        },
        data() {
            return {
                params: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                },
                multipleSelection: []
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
                this.multipleSelection = val;
            },
            submitOrder() {

            }
        },
        mounted: function() {
            this.loadCartList(this.params)
        }
    }
</script>
