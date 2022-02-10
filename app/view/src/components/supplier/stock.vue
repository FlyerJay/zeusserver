<template>
    <div>
        <el-form :inline="true" :model="searchInvenParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchInvenParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>

            <el-form-item label="类别">
                <el-select v-model="searchInvenParam.type">
                    <el-option value="">全部</el-option>
                    <el-option value="黑管">黑管</el-option>
                    <el-option value="热镀锌">热镀锌</el-option>
                    <el-option value="镀锌带">镀锌带</el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="供应商名称">
                <el-input v-model="searchInvenParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
            </el-form-item>

            <el-form-item label="所在地">
                <el-select v-model="searchInvenParam.address" placeholder="全部">
                    <el-option value="">全部</el-option>
                    <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="warning" @click="searchStock" :loading="loading">查询</el-button>
            </el-form-item>

            <el-form-item>
                <el-upload class="upload-demo" action="/zues/api/upload/excel?type=inventory">
                  <el-button type="info" v-if="inventoryAuth">上传库存表</el-button><span class="warn-txt">(命名格式：供应商名称_类型_日期[_库存表])</span>
                </el-upload>
                <el-button type="warning" style="margin-left: 10px" @click="inventoryExport">导出库存表</el-button>
            </el-form-item>

        </el-form>

        <el-table :data="inventory.row" style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
            <el-table-column property="spec" label="规格"></el-table-column>
            <el-table-column property="long" label="长度"></el-table-column>
            <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
            <el-table-column property="type" label="类别"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="inventoryAmount" label="库存数量(件)"></el-table-column>
            <el-table-column property="perAmount" label="包装"></el-table-column>
            <el-table-column property="perWeight" label="单支重量(kg)" :formatter="perWeightFormatter"></el-table-column>
            <el-table-column property="inventoryWeight" label="库存重量(吨)" :formatter="weightFormatter"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                        <el-button size="small" @click="changeStock(scope.index, scope.row)" type="warning"  >修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchInvenParam.page" layout=" prev, pager, next" :page-size="15" :total="inventory.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgStockVisible" class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="newStockParam.inventoryAmount" auto-complete="off" type="number">
                    <template slot="prepend">库存数量</template>
                </el-input>
                <el-button type="info" @click="confirmChangeStock(newStockParam.row)" class="dialog-item float-right">确 定</el-button>
                <el-button type="warning" @click="dlgStockVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    loadSupInventoryList,
    loadSupAddress,
    updateStock
} from '../../vuex/action'

export default {
  vuex: {
    actions: {
      loadSupInventoryList,
      loadSupAddress,
      updateStock
    },
    getters: {
      inventory: ({
                    supplier
                }) => supplier.inventory,
      supAddress: ({
                    supplier
                }) => supplier.supAddress,
      userInfo: ({
                    common
                }) => common.userInfo
    }
  },
  data () {
    return {
      searchInvenParam: {
        spec: '',
        type: '',
        material: '',
        supplierName: '',
        address: '',
        page: 1
      },
      newStockParam: {
        inventoryAmount: '',
        supplierInventoryId: ''
      },
      row: {},
      loading: true,
      dlgStockVisible: false
    }
  },
  methods: {
    searchStock () {
      this.loading = true
      this.searchInvenParam.page = 1
      this.loadSupInventoryList(this.searchInvenParam)
                .then(rs => {
                  this.loading = false
                })
    },
    weightFormatter (row, column) {
      const specArr = row.spec.split('*')
      const height = Number(specArr[0])
      const width = Number(specArr[1])
      const land = Number(specArr[2])
      const long = Number(row.long) ? Number(row.long) : 6
      const perimeter = 2 * height + 2 * width
      const amount = Number(row.perAmount)
      const inventoryAmount = Number(row.inventoryAmount)
      return ((perimeter / 3.14 - land) * land * long * 0.02466 * amount * inventoryAmount / 1000).toFixed(2)
    },
    perWeightFormatter (row, column) {
      const specArr = row.spec.split('*')
      const height = Number(specArr[0])
      const width = Number(specArr[1])
      const land = Number(specArr[2])
      const long = Number(row.long) ? Number(row.long) : 6
      const perimeter = 2 * height + 2 * width
    //   const amount = Number(row.perAmount)
    //   const inventoryAmount = Number(row.inventoryAmount)
      return ((perimeter / 3.14 - land) * land * long * 0.02466).toFixed(2)
    },
    handleCurrentChange (val) {
      this.searchInvenParam.page = val
      this.loading = true
      this.loadSupInventoryList(this.searchInvenParam)
                .then(() => {
                  this.loading = false
                })
    },
    changeStock (index, row) {
      this.dlgStockVisible = true
      this.newStockParam.inventoryAmount = Number(row.inventoryAmount)
      this.newStockParam.supplierInventoryId = row.supplierInventoryId
      this.row = row
    },
    confirmChangeStock (row) {
      this.updateStock(this.newStockParam)
                .then(rs => {
                  this.$message({
                    message: `库存修改成功`,
                    type: 'success'
                  })
                  this.dlgStockVisible = false
                  this.row.inventoryAmount = this.newStockParam.inventoryAmount
                })
    },
    inventoryExport () {
      window.open(`/zues/api/export/inventory/库存列表.xls?spec=${this.searchInvenParam.spec}&type=${this.searchInvenParam.type}&material=${this.searchInvenParam.material}&supplierName=${this.searchInvenParam.supplierName}&address=${this.searchInvenParam.address}`)
    },
  },
  mounted: function () {
    this.loadSupInventoryList()
            .then(rs => {
              this.loading = false
            })
    this.loadSupAddress()
  },
  computed: {
    inventoryAuth () {
      return Boolean(parseInt(this.userInfo.userRole.charAt(2)))
    }
  }

}
</script>

<style lang="css">

</style>
