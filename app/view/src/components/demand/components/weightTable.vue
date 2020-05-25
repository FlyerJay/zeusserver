<template>
  <el-row :gutter="20" class="weight-table">
    <el-col :span="12">
      <div class="canvas-wrapper">
        <div ref="weight" style="padding: 10px" class="canvas" :class="{ 'disabled': chartSource.length === 0 }"></div>
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
        :default-sort="{ prop: 'weight', order: 'descending' }"
        v-loading.body="isLoading"
        @selection-change="changeHandler"
        ref="table">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="userId" label="销售"/>
        <el-table-column prop="weight" sortable label="合计"/>
        <el-table-column prop="deal" sortable label="成交数据" width="300">
          <template slot-scope="scope">
            <div class="progress-wrapper">
              <span>已成交{{ scope.row.dealWeight }}</span>
              <el-progress
                v-if="scope.row.weight && scope.row.dealWeight"
                :text-inside="true"
                :stroke-width="18"
                status="success"
                :percentage="Number((scope.row.dealWeight / scope.row.weight * 100).toFixed(0))">
              </el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>未成交{{ scope.row.noDealWeight }}</span>
              <el-progress
                v-if="scope.row.weight && scope.row.noDealWeight"
                :text-inside="true"
                :stroke-width="18"
                status="exception"
                :percentage="Number((scope.row.noDealWeight / scope.row.weight * 100).toFixed(0))">
              </el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :percentage="0">
              </el-progress>
            </div>

            <div class="progress-wrapper">
              <span>已反馈{{ scope.row.feedbackWeight }}</span>
              <el-progress
                class="feedback"
                v-if="scope.row.weight && scope.row.feedbackWeight"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.feedbackWeight / scope.row.weight * 100).toFixed(0))">
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
              <span>待反馈{{ scope.row.pendingFeedbackWeight }}</span>
              <el-progress
                class="pending"
                v-if="scope.row.weight && scope.row.pendingFeedbackWeight"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.pendingFeedbackWeight / scope.row.weight * 100).toFixed(0))">
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
              <span>未报价{{ scope.row.noOfferWeight }}</span>
              <el-progress
                class="nooffer"
                v-if="scope.row.weight && scope.row.noOfferWeight"
                :text-inside="true"
                :stroke-width="18"
                :percentage="Number((scope.row.noOfferWeight / scope.row.weight * 100).toFixed(0))">
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
  name: 'weight-table',

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
      if (window.getComputedStyle(this.$refs['weight']).width === '100%') return
      if (!this.chart) {
        this.createEchart()
      } else {
        this.refeshChart()
      }
    }
  },

  computed: {
    chartSource () {
      var weight = 0
      var deal = 0
      var noDeal = 0
      var feedback = 0
      var pendingFeedback = 0
      var noOffer = 0
      this.selectedRows.forEach(item => {
        weight += (item.weight || 0)
        deal += (item.dealWeight || 0)
        noDeal += (item.noDealWeight || 0)
        feedback += (item.feedbackWeight || 0)
        pendingFeedback += (item.pendingFeedbackWeight || 0)
        noOffer += (item.noOfferWeight || 0)
      })
      return [
        { item: '已成交', weight: deal, percent: weight === 0 ? 0 : Number((deal / weight).toFixed(2)) },
        { item: '未成交', weight: noDeal, percent: weight === 0 ? 0 : Number((noDeal / weight).toFixed(2)) },
        { item: '已反馈', weight: feedback, percent: weight === 0 ? 0 : Number((feedback / weight).toFixed(2)) },
        { item: '未反馈', weight: pendingFeedback, percent: weight === 0 ? 0 : Number((pendingFeedback / weight).toFixed(2)) },
        { item: '未报价', weight: noOffer, percent: weight === 0 ? 0 : Number((noOffer / weight).toFixed(2)) }
      ].filter(item => item.weight !== 0)
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
          rows.sort((a, b) => b.weight - a.weight)
          this.selectedRows = [rows[0]]
          this.toggleSelectionRows(this.selectedRows)
        }
      })
    },

    createEchart () {
      /* eslint-disable no-undef */
      if (!G2) return
      this.chart = new G2.Chart({
        container: this.$refs['weight'],
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
            return `${data.item}: ${data.weight}吨`
          }
        })
        .adjust('stack')

      this.chart.interaction('element-active')
      this.chart.render()
    },

    refeshChart () {
      if (!this.chart) return
      this.chart.changeData(this.chartSource)
    },

    flush () {
      this.toggleSelectionRows()
      this.$nextTick(() => {
        const rows = this.dataList.slice()
        rows.sort((a, b) => b.weight - a.weight)
        this.selectedRows = [rows[0]]
        this.toggleSelectionRows(this.selectedRows)
      })
    }
  }
}
</script>
<style lang="less">
  .weight-table {

    .progress-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      span {
        width: 80px;
      }

      .el-progress {
        flex-grow: 1;
      }
    }

    .canvas-wrapper {
      height: 460px;
      position: relative;
    }
    .canvas {
      height: 460px;
      line-height: 460px;
      text-align: center;
      position: absolute;
      width: 100%;
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
