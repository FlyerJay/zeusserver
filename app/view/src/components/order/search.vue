<template>
  <div class="search-wrap">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="规格">
        <el-input v-model="stockParams.spec" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="目的地">
        <el-select v-model="stockParams.region" placeholder="活动区域">
          <el-option label="南京" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="材质">
        <el-select v-model="stockParams.material" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="stockParams.type" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tb-wrap">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  loadStock
} from '../../vuex/action'

export default {
  vuex: {
    actions: {
      loadStock
    },
    getters: {
      userInfo: ({
        common
      }) => common.userInfo
    }
  },
  data() {
    return {
      stockParams: {
        spec: '',
        material: '',
        type: '',
        region: '',
        comId: this.userInfo.comId
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    searchStock() {
      this.loadStock(this.stockParams)
    }
  },
  mounted: function() {
      this.loadStock(this.stockParams)
  }
}
</script>
<style media="less">
.tb-wrap {
  padding: 20px;
  border: 1px solid #d3dce6;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  overflow: hidden;
}
</style>
