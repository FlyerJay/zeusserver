<template>
  <div class="statics">
    <el-form inline :model="form" class="demo-form-inline">
      <el-form-item prop="userIds" label="销售">
        <el-select multiple :disabled="isLoading" v-model="form.userIds" placeholder="你可以选择多个销售员" @change="search">
          <el-option
            v-for="(item, index) in sellerList"
            :key="index"
            :label="item.userId"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="date" label="查看日期">
        <el-date-picker
          :disabled="isLoading"
          v-model="form.date"
          type="daterange"
          align="right"
          :picker-options="options"
          @change="search"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>

      <el-form-item prop="date" label="查看日期">
        <el-date-picker
          :disabled="isLoading"
          v-model="form.date"
          type="daterange"
          align="right"
          :picker-options="options"
          @change="search"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div class="tips" style="color:#67C23A">注：订单总数、成交订单数的统计以提交时间为准</div>

    <div class="tb-wrap">
      <el-tabs type="border-card" @tab-click="switchTab" ref="tab">
        <el-tab-pane label="使用分析（频次）">
          <count-table :dataList="demandCountList" :isLoading="isLoading"></count-table>
        </el-tab-pane>

        <el-tab-pane label="订单统计（重量）">
          <weight-table :dataList="demandCountList" :isLoading="isLoading"></weight-table>
        </el-tab-pane>

        <el-tab-pane label="规格明细统计">
          <spec-table :isLoading="isLoading"></spec-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getSellerListX, getDemandCountDateX } from '../../vuex/action'
import countTable from './components/countTable'
import weightTable from './components/weightTable'
import specTable from './components/specTable'
export default {
  name: 'statics',

  vuex: {
    actions: {
      getSellerListX,
      getDemandCountDateX
    },
    getters: {
      userInfo: state => state.userInfo
    }
  },

  components: {
    countTable,
    weightTable,
    specTable
  },

  data () {
    return {
      sellerList: [],
      demandCountList: [],
      activeName: '0',
      form: {
        userIds: [],
        date: Date.now() - 8.64e7
      },
      options: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        },

        shortcuts: [{
          text: '近七日',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      isLoading: false
    }
  },

  methods: {
    async getSellerList () {
      this.sellerList = await this.getSellerListX()
    },

    search () {
      this.getDemandCountDate()
    },

    async getDemandCountDate () {
      this.isLoading = true
      this.demandCountList = await this.getDemandCountDateX({
        userIds: this.form.userIds.join(','),
        startDate: this.form.date[0] ? new Date(this.form.date[0]).formatDate('YYYYMMDD') : new Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatDate('YYYYMMDD'),
        endDate: this.form.date[1] ? new Date(this.form.date[1]).formatDate('YYYYMMDD') : new Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatDate('YYYYMMDD')
      })
      this.isLoading = false
    },

    switchTab (vm, name) {
      vm.$children[0].flush && vm.$children[0].flush()
      this.search()
      this.activeName = this.$refs['tab'].currentName
    }
  },

  created () {
    this.getSellerList()
    this.search()
  }
}
</script>
<style lang="less">
  .statics {
    .progress-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      span {
        width: 60px;
      }

      .el-progress {
        flex-grow: 1;
      }
    }

    .canvas {
      background-color: #FFFFFF;
      border-radius: 10px;
    }
  }
</style>
