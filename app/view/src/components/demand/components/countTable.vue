<template>
  <el-row :gutter="20" class="count-table">
    <el-col :span="12">
      <div class="canvas-wrapper">
        <div ref="count" style="padding: 10px" class="canvas" :class="{ 'disabled': chartSource.length === 0 }"></div>
        <div class="canvas" :class="{ 'disabled': chartSource.length > 0 }">
          暂无数据
        </div>
      </div>
    </el-col>

    <el-col :span="12">
      <el-table
        :data="dataList"
        height="460"
        style="width: 100%" fit border align="center"
        :default-sort="{ prop: 'count', order: 'descending' }"
        v-loading.body="isLoading"
        @selection-change="changeHandler"
        ref="table">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="userId" label="销售"/>
        <el-table-column prop="count" sortable label="合计"/>
        <el-table-column prop="deal" sortable label="成交数据" width="300">
          <template slot-scope="scope">
            <div class="progress-wrapper">
              <span>已成交{{ scope.row.deal }}</span>
              <el-progress
                v-if="scope.row.count && scope.row.deal"
                :text-inside="true"
                :stroke-width="18"
                status="success"
                :percentage="Number((scope.row.deal / scope.row.count * 100).toFixed(0))">
              </el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>未成交{{ scope.row.noDeal }}</span>
              <el-progress
                v-if="scope.row.count && scope.row.noDeal"
                :text-inside="true"
                :stroke-width="18"
                status="exception"
                :percentage="Number((scope.row.noDeal / scope.row.count * 100).toFixed(0))">
              </el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>已反馈{{ scope.row.feedback }}</span>
              <el-progress
                class="feedback"
                v-if="scope.row.count && scope.row.feedback"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.feedback / scope.row.count * 100).toFixed(0))">
              </el-progress>
              <el-progress
                class="feedback"
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>待反馈{{ scope.row.pendingFeedback }}</span>
              <el-progress
                class="pending"
                v-if="scope.row.count && scope.row.pendingFeedback"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.pendingFeedback / scope.row.count * 100).toFixed(0))">
              </el-progress>
              <el-progress
                class="pending"
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>未报价{{ scope.row.noOffer }}</span>
              <el-progress
                class="nooffer"
                v-if="scope.row.count && scope.row.noOffer"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.noOffer / scope.row.count * 100).toFixed(0))">
              </el-progress>
              <el-progress
                class="nooffer"
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    
  </el-row>
</template>
<script>
export default {
  name: 'count-table',

  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      value: () => []
    }
  },

  watch: {
    dataList (rows) {
      this.dataChangeHandler(rows)
    },

    chartSource (rows) {
      if (!this.chart) {
        this.createEchart()
      } else {
        this.refeshChart()
      }
    }
  },

  computed: {
    chartSource () {
      var count = 0
      var deal = 0
      var noDeal = 0
      var feedback = 0
      var pendingFeedback = 0
      var noOffer = 0
      this.selectedRows.forEach(item => {
        count += (item.count || 0)
        deal += (item.deal || 0)
        noDeal += (item.noDeal || 0)
        feedback += (item.feedback || 0)
        pendingFeedback += (item.pendingFeedback || 0)
        noOffer += (item.noOffer || 0)
      })
      return [
        { item: '已成交', count: deal, percent: count === 0 ? 0 : Number((deal / count).toFixed(2)) },
        { item: '未成交', count: noDeal, percent: count === 0 ? 0 : Number((noDeal / count).toFixed(2)) },
        { item: '已反馈', count: feedback, percent: count === 0 ? 0 : Number((feedback / count).toFixed(2)) },
        { item: '未反馈', count: pendingFeedback, percent: count === 0 ? 0 : Number((pendingFeedback / count).toFixed(2)) },
        { item: '未报价', count: noOffer, percent: count === 0 ? 0 : Number((noOffer / count).toFixed(2)) }
      ].filter(item => item.count !== 0)
    }
  },

  data () {
    return {
      chart: null,
      selectedRows: []
    }
  },

  methods: {
    changeHandler (rows) {
      this.selectedRows = rows
    },

    toggleSelectionRows (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs['table'].toggleRowSelection(row, true)
        })
      } else {
        this.$refs['table'].clearSelection()
      }
    },

    dataChangeHandler (rows) {
      this.$nextTick(() => {
        if (this.dataList.length > 0) {
          const rows = this.dataList.slice()
          rows.sort((a, b) => b.count - a.count)
          this.selectedRows = [rows[0]]
          this.toggleSelectionRows(this.selectedRows)
        }
      })
    },

    createEchart () {
      /* eslint-disable no-undef */
      if (!G2) return
      this.chart = new G2.Chart({
        container: this.$refs['count'],
        autoFit: true,
        height: 460
      })

      this.chart.coordinate('theta', {
        radius: 0.75
      })

      this.chart.data(this.chartSource)

      this.chart.scale('percent', {
        formatter: (val) => {
          val = (val * 100).toFixed(0) + '%'
          return val
        }
      })

      this.chart.tooltip({
        showTitle: false,
        showMarkers: false
      })
      this.chart
        .interval()
        .position('percent')
        .color('item', item => {
          const mapping = {
            '已成交': '#13ce66',
            '未成交': '#ff4949',
            '已反馈': '#20a0ff',
            '未反馈': '#F7BA2A',
            '未报价': '#C0CCDA'
          }
          return mapping[item]
        })
        .label('percent', {
          content: (data) => {
            return `${data.item}: ${data.count}笔`
          }
        })
        .adjust('stack')

      this.chart.interaction('element-active')
      this.chart.render()
    },

    refeshChart () {
      if (!this.chart) return
      this.chart.changeData(this.chartSource)
    }
  }
}
</script>
<style lang="less">
  .count-table {

    .canvas-wrapper {
      height: 460px;
      position: relative;
    }
    .canvas {
      height: 460px;
      width: 100%;
      line-height: 460px;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;

      &.disabled {
        transform: translateY(-1000%);
      }
    }

    .pending {
      .el-progress-bar__inner {
        background-color: #F7BA2A;
      }
    }

    .nooffer {
      .el-progress-bar__inner {
        background-color: #C0CCDA;
      }
    }
  }
</style>
