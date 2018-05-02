<template>
    <div class="order-wrap">
        <el-form :inline="false" :model="seachParams" class="demo-form-inline">
            <el-form-item>
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    v-model="seachParams.searchData">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="batchSearch" :loading="loading" class="search-bt">批量上传</el-button>
            </el-form-item>
        </el-form>
        <div class="tb-wrap">
            <el-table :data="searchResult.row" stripe style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
                <el-table-column prop="name" label="解决方案名称"></el-table-column>
                <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
                <el-table-column prop="price" label="总价格"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="viewDetail(scope.index, scope.row)" type="info">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model="detailDialogShow" custom-class="o-detail">
            <el-form :inline="false" :model="seachParams" class="demo-form-inline">
                <el-form-item>
                    <el-button type="warning" @click="addToChart" :loading="addLoading" class="search-bt">添加到购物车</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="batchDetail" stripe v-loading.body="batchLoading" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width=""></el-table-column>
                <el-table-column prop="spec" label="规格" width="140px"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="100px"></el-table-column>
                <el-table-column prop="inventoryAmount" label="库存数量"></el-table-column>
                <el-table-column prop="weight" label="需求重量" :formatter="weightFormatter"></el-table-column>
                <el-table-column prop="daPrice" label="到岸单价"></el-table-column>
                <el-table-column prop="totalPrice" label="到岸总价" width="120px"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<style lang="less">
    .order-wrap {
        .o-detail {
            width:auto
        }
    }
</style>
<script>
    import  { batchQuery, addToChartBatch } from "../../vuex/action";
    export default {
        vuex: {
            actions: {
                batchQuery,
                addToChartBatch
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo
            }
        },
        data () {
            return {
                seachParams: {
                    searchData: '',
                },
                loading: false,
                addLoading: false,
                searchResult: {
                    row: [],
                },
                detailDialogShow: false,
                batchLoading: false,
                batchDetail: [],
                selects: []
            }
        },
        methods: {
            batchSearch() {
                if(!this.seachParams.searchData) {
                    this.$message({
                        message: `请输入数据`,
                        type: 'warning'
                    })
                    return false
                }
                this.loading = true;
                this.batchQuery(this.seachParams).then(rs => {
                    this.loading = false;
                    this.searchResult = rs;
                }, err => {
                    this.loading = false;
                });
            },
            viewDetail(index, row) {
                this.batchDetail = row.list;
                this.detailDialogShow = true;
            },
            weightFormatter(row, column) {
                return Number(row.weight).toFixed(2) + "吨";
            },
            handleSelectionChange(val) {
                this.selects = val;
                console.log(val);
            },
            addToChart() {
                if(this.selects.length == 0) {
                    this.$message({
                        message: '选择不能为空',
                        type: 'warning'
                    })
                    return;
                }
                var param = {};
                param.charts = [];
                this.selects.forEach(v => {
                    var data = {};
                    data.id = v.supplierInventoryId;
                    data.amount = v.amount;
                    param.charts.push(data);
                });
                this.addLoading = true;
                this.addToChartBatch(param).then(rs => {
                    this.addLoading = false;
                }, err => {
                    this.addLoading = true;
                })
            }
        }
    }
</script>