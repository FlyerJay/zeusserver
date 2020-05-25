<template>
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>
    
            <el-form-item label="类别">
                <el-select v-model="searchParam.type">
                    <el-option value="">全部</el-option>
                    <el-option value="黑管">黑管</el-option>
                    <el-option value="热镀锌">热镀锌</el-option>
                    <el-option value="镀锌带">镀锌带</el-option>
                </el-select>
            </el-form-item>
    
            <el-form-item label="供应商名称">
                <el-input v-model="searchParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
            </el-form-item>
    
            <el-form-item label="所在地">
                <el-select v-model="searchParam.address" placeholder="全部">
                    <el-option :value='0'>全部</el-option>
                    <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
                </el-select>
            </el-form-item>
    
            <el-form-item>
                <el-button type="warning" @click="searchPrice" :loading="loading">查询</el-button>
            </el-form-item>
    
            <el-form-item>
                <el-upload class="upload-demo" action="/zues/api/upload/excel">
                    <el-button type="info" v-if="valueAuth">上传价格表</el-button><span class="warn-txt">(命名格式：价格表_类型_日期)</span>
                </el-upload>
            </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input-number v-model="newPrice" :step="10"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="adjustPriceEvent">价格调整</el-button><span class="warn-txt">（非当天上传的价格无法统一调整）</span>
            </el-form-item>
        </el-form>
        <el-table :data="price.row" style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中" border>
            <el-table-column property="spec" label="规格"></el-table-column>
            <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
            <el-table-column property="type" label="类别"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="value" label="出厂价(元/吨)"></el-table-column>
    
            <el-table-column label="操作" align="center" v-if="valueAuth">
                <template slot-scope="scope">
                            <el-button size="small" @click="changePrice(scope.index, scope.row)" type="warning">修改</el-button>
                        </template>
            </el-table-column>
        </el-table>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchParam.page" layout=" prev, pager, next" :page-size="15" :total="price.totalCount">
            </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgPriceVisible" class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="newPriceParam.value" auto-complete="off" type="number">
                    <template slot="prepend">出厂价</template>
                </el-input>
                <el-button type="info" @click="confirmChangePrice(newPriceParam.row)" class="dialog-item float-right">确 定</el-button>
                <el-button type="warning" @click="dlgPriceVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        loadSupPriceList,
        loadSupAddress,
        updatePrice,
        adjustPrice
    } from '../../vuex/action'
    
    export default {
      vuex: {
        actions: {
          loadSupPriceList,
          loadSupAddress,
          updatePrice,
          adjustPrice
        },
        getters: {
          price: ({
                    supplier
                }) => supplier.price,
          supAddress: ({
                    supplier
                }) => supplier.supAddress,
          userInfo: ({
                    common
                }) => common.userInfo,
          userRoleInfo: ({
                    manager
                }) => manager.userRoleInfo
        }
      },
      data () {
        return {
          searchParam: {
            spec: '',
            type: '',
            material: '',
            supplierName: '',
            address: '',
            page: 1
          },
          newPriceParam: {
            value: '',
            supplierValueId: '',
            row: ''
          },
          unitePriceParam: {
            comId: '',
            spec: '',
            lastUpdateTime: '',
            type: '',
            address: '',
            supplierName: ''
          },
          row: {},
          loading: true,
          newPrice: 0,
          dlgPriceVisible: false,
          dlgUnitePriceVisible: false
        }
      },
      methods: {
        searchPrice () {
          this.loading = true
          this.searchParam.page = 1
          this.loadSupPriceList(this.searchParam)
                    .then(rs => {
                      this.loading = false
                    })
        },
        changePrice (index, row) {
          this.dlgPriceVisible = true
          this.newPriceParam.value = Number(row.value)
          this.newPriceParam.supplierValueId = row.supplierValueId
          this.row = row
        },
        confirmChangePrice (row) {
          this.updatePrice(this.newPriceParam)
                    .then(rs => {
                      this.$message({
                        message: `价格修改成功`,
                        type: 'success'
                      })
                      this.dlgPriceVisible = false
                      this.row.value = this.newPriceParam.value
                    })
        },
        handleCurrentChange (val) {
          this.searchParam.page = val
          this.loading = true
          this.loadSupPriceList(this.searchParam)
                    .then(() => {
                      this.loading = false
                    })
        },
        adjustPriceEvent () {
          this.$confirm('是否确认统一调整价格?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = {
              spec: this.searchParam.spec,
              type: this.searchParam.type,
              supplierName: this.searchParam.supplierName,
              address: this.searchParam.address,
              comId: this.userInfo.comId,
              lastUpdateTime: new Date().formatDate('yyyyMMdd'),
              adjust: this.newPrice
            }
            this.adjustPrice(params)
                        .then(rs => {
                          this.$message({
                            message: `价格调整成功`,
                            type: 'success'
                          })
                          this.searchPrice()
                        })
          })
        }
      },
      mounted: function () {
        this.loadSupPriceList().then(rs => {
          this.loading = false
        })
        this.loadSupAddress()
      },
      computed: {
        valueAuth () {
          return Boolean(parseInt(this.userInfo.userRole.charAt(1)))
        }
      }
    }
</script>

<style lang="less">
    .warn-txt {
        font-size: 12px;
        color: #a09f9f;
        display: inline-block;
        margin-left: 10px;
    }
</style>
