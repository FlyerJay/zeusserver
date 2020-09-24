<template>
    <div class="pricechart" ref="pagecontainer"> 
        <el-row :gutter="20" type="flex" class="wrap-content">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <el-row :gutter="10" cl>
                        <el-col :span="12">
                            <div class="select-control clearfix">
                                <el-row :gutter="0">
                                    <el-col :span="6"><div class="select-prepend">类别</div></el-col>
                                    <el-col :span="18">
                                        <el-select v-model="searchParam.type" placeholder="请选择">
                                            <el-option value="">全部</el-option>
                                            <el-option :label="item" :value="item" v-for="item in types" :key="item"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="searchParam.spec" placeholder="输入规格">
                                <template slot="prepend">规格</template>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="select-control clearfix">
                                <el-row :gutter="0">
                                    <el-col :span="6"><div class="select-prepend">供应商</div></el-col>
                                    <el-col :span="18">
                                        <el-select v-model="searchParam.supplierId" placeholder="请选择">
                                            <el-option value="">全部</el-option>
                                            <el-option :label="item.supplierName" :value="item.supplierId" v-for="(item,index) in suppliers" :key="index"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="warning" @click="addToCharts" icon="search">查询</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="price.row" style="width:100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
                        <el-table-column property="spec" label="规格"></el-table-column>
                        <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
                        <el-table-column property="type" label="类别"></el-table-column>
                        <el-table-column property="supplierName" label="供应商"></el-table-column>
                        <el-table-column property="value" label="出厂价(元/吨)"></el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <linechart
                        ref="lineChart"
                    />
                </div>
            </el-col>
        </el-row>
        
    </div>
</template>
<style lang="less" scoped>
    .el-row{
        margin-bottom:5px;
    }
    .wrap-content{
        height:100%;
        .grid-content{
            height:100%;
        }
    }
    .select-control{
        .select-prepend{
            font-size:14px;
        }
    }
</style>
<script>
    import linechart from '../common/linechart'
import {
        getPriceChart
    } from '../../vuex/action'
export default {
      vuex: {
        actions: {
          getPriceChart
        },
        getters: {
        }
      },
      components: {
        linechart
      },
      data () {
        return {
          searchParam: {
            spec: '',
            supplierId: '',
            type: ''
          },
          loading: false,
          price: {
            row: []
          },
          suppliers: [
            {
              supplierName: '源泰黑管',
              supplierId: 1
            }
          ],
          types: ['黑管', '热镀锌', '镀锌带'],
          chartOption: {
            xAxis: {
              data: []
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: []
            },
            series: []
          }
        }
      },
      methods: {
        addToCharts () {
          this.getPriceChart(this.searchParam)
                .then(data => {
                  var date = []
                  var value = []
                  data.map(v => {
                    date.push(v.time)
                    value.push(v.value)
                  })
                  this.chartOption.xAxis.data = date
                  this.chartOption.legend.data.push(`${data[0].supplierName}${data[0].spec}`)
                  this.chartOption.series.push({
                    name: `${data[0].supplierName}${data[0].spec}`,
                    type: 'line',
                    data: value,
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
                  })
                  this.$refs.lineChart.setOption(this.chartOption)
                })
        }
      },
      mounted: function () {
        var windowHeight = document.documentElement.clientHeight
        var otherHeight = 44 + 50 + 20 + 25
        var finalHeight = windowHeight - otherHeight
        $(this.$refs.pagecontainer).css('height', `${finalHeight}px`)
      },
      computed: {
      }
    }
</script>
