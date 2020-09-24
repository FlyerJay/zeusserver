<template>
  <el-row :gutter="20" class="spec-table">
    <el-col :span="20">
      <div class="canvas-wrapper">
        <div ref="weight" style="padding: 10px" class="canvas" :class="{ 'disabled': chartSource.length === 0 }"></div>
        <div class="canvas" :class="{ 'disabled': chartSource.length > 0 }">
          暂无数据
        </div>
      </div>
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
    },
    type: String
  },

  watch: {
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
      const data = []
      if (this.type.indexOf('COUNT') > -1) {
        this.dataList.forEach(item => {
          data.push({
            text: item.spec + ' ' + item.type,
            value: item.count,
            count: item.count,
            weight: item.weight
          })
        })
      } else {
        this.dataList.forEach(item => {
          data.push({
            text: item.spec + ' ' + item.type,
            value: item.weight,
            count: item.count,
            weight: item.weight
          })
        })
      }
      return data
    }
  },

  data () {
    return {
      chart: null
    }
  },

  methods: {
    createEchart () {
      /* eslint-disable no-undef */
      if (!G2) return
      if (this.chartSource.length === 0) return

      this.chart = new G2.Chart({
        container: this.$refs['weight'],
        autoFit: true,
        height: 600
      })

      this.chart.data(this.chartSource)

      this.chart.scale('value', {
        nice: true
      })

      this.chart.tooltip({
        showMarkers: true,
        containerTpl: '<div class="g2-tooltip">' +
    '<div class="g2-tooltip-title" style="margin:10px 0;"></div>' +
    '<ul class="g2-tooltip-list"></ul></div>',
        itemTpl: `<li data-index={index}>
          <div style="text-align:left">{name}: {value}</div>
          <div style="text-align:left;margin-top:8px;padding-bottom:10px">{name1}: {value1}</div>
        </li>`
      })
      this.chart.interaction('active-region')

      this.chart
        .interval()
        .position('text*value')
        .label('value', {
          content: (data) => {
            if (this.type.indexOf('COUNT') > -1) {
              return `${data.value}次`
            } else {
              return `${data.value.toFixed(2)}吨`
            }
          }
        })
        .tooltip('count*weight', (count, weight) => {
          return {
            name: '频次',
            value: count + '次',
            name1: '重量',
            value1: weight.toFixed(2) + '吨'
          }
        })

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
  .spec-table {
    .canvas-wrapper {
      height: 600px;
      position: relative;
    
      .canvas {
        height: 600px;
        line-height: 600px;
        text-align: center;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;

        &.disabled {
          transform: translateY(-1000%);
        }
      }
    }
  }
</style>
