<template>
  <div class="statics">
    <el-form inline :model="form" class="demo-form-inline">
      <!-- <el-form-item prop="userIds" label="销售">
        <el-select multiple :disabled="isLoading" v-model="form.userIds" placeholder="你可以选择多个销售员" @change="search">
          <el-option
            v-for="(item, index) in sellerList"
            :key="index"
            :label="item.userId"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item prop="date" label="查看日期">
        <el-date-picker
          :disabled="isLoading"
          v-model="form.date"
          type="date"
          align="right"
          :picker-options="options"
          @change="search"
          placeholder="选择日期范围">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div class="tb-wrap">
      <el-tabs type="border-card" @tab-click="switchTab">
        <el-tab-pane label="使用分析（频次）">
          <count-table :dataList="demandCountList" :isLoading="isLoading"></count-table>
        </el-tab-pane>

        <el-tab-pane label="订单统计（重量）">
          <weight-table :dataList="demandCountList" :isLoading="isLoading"></weight-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getSellerListX, getDemandCountDateX } from '../../vuex/action'
import countTable from './components/countTable'
import weightTable from './components/weightTable'
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
    weightTable
  },

  data () {
    return {
      sellerList: [],
      demandCountList: [],
      form: {
        userIds: [],
        date: Date.now() - 8.64e7
      },
      options: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
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
        startDate: new Date(this.form.date).formatDate('YYYYMMDD'),
        endDate: new Date(this.form.date).formatDate('YYYYMMDD')
      })
      this.isLoading = false
    },

    switchTab (vm) {
      vm.$children[0].flush && vm.$children[0].flush()
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
