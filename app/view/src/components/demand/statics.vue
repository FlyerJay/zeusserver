<template>
  <div class="statics">
    <el-form inline :model="form" class="demo-form-inline">
      <el-form-item prop="userIds" label="销售" v-if="activeName !== '2'">
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

      <el-form-item prop="type" label="查看维度" v-if="activeName === '2'">
        <el-select v-model="form.type" :disabled="isLoading" @change="search">
          <el-option
            v-for="item in types"
            :key="item.value"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
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
          <spec-table :isLoading="isLoading" :dataList="specRountList" :type="form.type"></spec-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getSellerListX, getDemandCountDateX, getSpecRoundMonthX } from '../../vuex/action'
import countTable from './components/countTable'
import weightTable from './components/weightTable'
import specTable from './components/specTable'
export default {
  name: 'statics',

  vuex: {
    actions: {
      getSellerListX,
      getDemandCountDateX,
      getSpecRoundMonthX
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
      specRountList: [],
      activeName: '0',
      form: {
        userIds: [],
        date: Date.now() - 8.64e7,
        type: 'COUNT'
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
      isLoading: false,
      types: [
        {
          value: 'COUNT',
          label: '询价频次最多的20个品类及规格'
        }, {
          value: 'WEIGHT',
          label: '询价重量最多的20个品类及规格'
        }, {
          value: 'COUNT_UNDEAL',
          label: '未成交频次最高的20个品类及规格'
        }, {
          value: 'WEIGHT_UNDEAL',
          label: '未成交重量最多的20个品类及规格'
        }, {
          value: 'COUNT_DEAL',
          label: '成交频次最高的20个品类及规格'
        }, {
          value: 'WEIGHT_DEAL',
          label: '成交重量最多的20个品类及规格'
        }
      ]
    }
  },

  methods: {
    async getSellerList () {
      this.sellerList = await this.getSellerListX()
    },

    search () {
      if (this.activeName === '2') {
        this.getSpecRoundMonth()
      } else {
        this.getDemandCountDate()
      }
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

    async getSpecRoundMonth () {
      this.isLoading = true
      this.specRountList = await this.getSpecRoundMonthX({
        type: this.form.type,
        startDate: this.form.date[0] ? new Date(this.form.date[0]).formatDate('YYYY-MM-DD') : new Date().formatDate('YYYY-MM-DD'),
        endDate: this.form.date[1] ? new Date(this.form.date[1]).formatDate('YYYY-MM-DD') : new Date().formatDate('YYYY-MM-DD')
      })
      this.isLoading = false
    },

    switchTab (vm, name) {
      vm.$children[0].flush && vm.$children[0].flush()
      this.activeName = this.$refs['tab'].currentName
      this.search()
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
