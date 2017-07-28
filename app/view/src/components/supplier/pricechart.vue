<template>
    <div> 
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="类型：">
                <el-select v-model="searchParam.type" placeholder="请选择">
                    <el-option value="">全部</el-option>
                    <el-option :label="item" :value="item" v-for="item in types" :key="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规格：">
                <el-input v-model="searchParam.spec" placeholder="输入规格"></el-input>
            </el-form-item>
            <el-form-item label="供应商：">
                <el-select v-model="searchParam.supplierId" placeholder="请选择">
                    <el-option value="">全部</el-option>
                    <el-option :label="item.supplierName" :value="item.supplierId" v-for="(item,index) in suppliers" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="addToCharts">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="price.row" style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
            <el-table-column property="spec" label="规格"></el-table-column>
            <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
            <el-table-column property="type" label="类别"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="value" label="出厂价(元/吨)"></el-table-column>
            <el-table-column label="操作" align="center" v-if="valueAuth">
                <template scope="scope">
                            <el-button size="small" @click="changePrice(scope.index, scope.row)" type="warning">修改</el-button>
                        </template>
            </el-table-column>
        </el-table>

        <linechart
            ref="lineChart"
        />
    </div>
</template>

<script>
    import linechart from '../common/linechart';
    import {
        getPriceChart
    } from '../../vuex/action';
    export default {
        vuex: {
            actions: {
                getPriceChart
            },
            getters: {
            }
        },
        components:{
            linechart,
        },
        data() {
            return {
                searchParam:{
                    spec: '',
                    supplierId: '',
                    type:'',
                },
                loading:false,
                price:{
                    row:[],
                },
                suppliers:[
                    {
                        supplierName: '源泰黑管',
                        supplierId: 1,
                    }
                ],
                types:['黑管','热镀锌','镀锌带'],
                chartOption:{
                    xAxis:{
                        data:[],
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[]
                    },
                    series:[]
                },
            }
        },
        methods: {
            addToCharts(){
                this.getPriceChart(this.searchParam)
                .then(data => {
                    var date = [];
                    var value = [];
                    data.map(v => {
                        date.push(v.time);
                        value.push(v.value);
                    })
                    this.chartOption.xAxis.data = date;
                    this.chartOption.legend.data.push(`${data[0].supplierName}${data[0].spec}`);
                    this.chartOption.series.push({
                        name:`${data[0].supplierName}${data[0].spec}`,
                        type:'line',
                        data:value,
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        normal: {
                                            position: 'start',
                                            formatter: '最大值'
                                        }
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }
                    });
                    this.$refs.lineChart.setOption(this.chartOption);
                })
            }
        },
        mounted: function() {
        },
        computed: {
        },
    }
</script>