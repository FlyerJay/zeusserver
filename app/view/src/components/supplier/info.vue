<template>
  <div class="sup-info">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="供应商信息" name="first">
        <el-form :inline="true" :model="searchSupParam" class="demo-form-inline">
          <el-form-item label="供应商名称">
            <el-input v-model="searchSupParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
          </el-form-item>
          <el-form-item label="所在地">
            <el-select v-model="searchSupParam.address" placeholder="全部">
              <el-option value="">全部</el-option>
              <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="searchSup" :loading="infoloading">查询</el-button>
          </el-form-item>
          <slide ref="slide" :items="messageList"></slide>
        </el-form>
        <el-table :data="supInfo.row" style="width: 100%" v-loading.body="infoloading" element-loading-text="拼命加载中" border>
          <el-table-column property="supplierName" label="供应商名称"></el-table-column>
          <el-table-column property="address" label="供应商所在地"></el-table-column>
          <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
          <el-table-column property="benifit" label="厂家优惠政策（元/吨）"></el-table-column>
          <el-table-column property="valueTime" :formatter="valueDateFormat" label="价格更新"></el-table-column>
          <el-table-column property="inventoryTime" :formatter="inventoryDateFormat" label="库存更新"></el-table-column>
          <el-table-column label="启用状态" align="center" property="id" v-if="supplierAuth">
            <template slot-scope="scope" >
              <el-select size="small" :class="{'open': scope.row.isValide==1 }" v-model="scope.row.isValide" placeholder="请选择" @change="changeState.call(this,$event,scope.row)">
                <el-option
                  label="开启"
                  :value="1">
                </el-option>
                <el-option
                  label="关闭"
                  :value="0">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" property="id" v-if="supplierAuth">
            <template slot-scope="scope" >
              <el-button size="small" @click="changeSupDlg(scope.index, scope.row)" type="warning">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleInfoCurrentChange"
            :current-page.sync="searchSupParam.page"
            layout=" prev, pager, next"
            :total="supInfo.totalCount"
            :page-size="15"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="运费信息" name="second">
          <el-button style="margin:0px 0px 15px 0;" type="warning" @click="fredlgAddshow = true" v-if="Boolean(supplierAuth)">每日运费录入</el-button>
          <el-table :data="freightList" style="width: 100%" v-loading.body="freightloading" element-loading-text="拼命加载中" border>
            <el-table-column property="address" label="所在地"></el-table-column>
            <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
            <el-table-column  label="操作" align="center" property="id" v-if="Boolean(supplierAuth)">
            <template slot-scope="scope">
              <el-button size="small" @click="changeFreDlg(scope.index, scope.row)" type="warning">
                修改</el-button>
              <el-button size="small" @click="deleteFre(scope.index, scope.row)" type="danger">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
    </el-tabs>
     
    <!--运费信息录入dlg-->
    <el-dialog title="" v-model="fredlgAddshow" class="custom-dialog">
      <div class="dialog-content">
        <el-input v-model="freParam.address" auto-complete="off">
          <template slot="prepend">所在地</template>  
        </el-input>
        <el-input v-model="freParam.freight" auto-complete="off" type="number" class="dialog-item">
          <template slot="prepend">运费</template>
        </el-input>
        <el-button type="info" @click="addFre()" class="dialog-item float-right">确 定</el-button>
        <el-button type="warning" @click="fredlgAddshow = false" class="dialog-item float-right">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改运费信息对话框-->
    <el-dialog title="" v-model="fredlgChangeshow" class="custom-dialog">
      <div class="dialog-content">
        <el-input v-model="changeFreParam.address" auto-complete="off">
          <template slot="prepend">所在地</template>
        </el-input>
        <el-input v-model="changeFreParam.freight" auto-complete="off" type="number" class="dialog-item">
          <template slot="prepend">运费</template>
        </el-input>
        <el-button type="info" @click="changeFre()" class="dialog-item float-right">确 定</el-button>
        <el-button type="warning" @click="fredlgChangeshow = false" class="dialog-item float-right">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改供应商信息-->
    <el-dialog title="" v-model="dlgChangeSupVisible" class="custom-dialog">
      <div class="dialog-content">
        <el-input v-model="changeSupParam.supplierName" auto-complete="off" readonly>
          <template slot="prepend">供应商名称</template>
        </el-input>
        <el-input v-model="changeSupParam.address" auto-complete="off" class="dialog-item" readonly>
          <template slot="prepend">供应商名称</template>
        </el-input>
        <el-input v-model="changeSupParam.benifit" auto-complete="off" type="number" class="dialog-item">
          <template slot="prepend">政策下浮</template>
        </el-input>
        <el-button type="info" @click="changeSup(changeSupParam.row)" class="dialog-item float-right">确 定</el-button>
        <el-button type="warning" @click="dlgChangeSupVisible = false" class="dialog-item float-right">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    loadSupAddress,
    loadSupList,
    loadfreightList,
    addNewSup,
    addNewFre,
    updataSup,
    updateFre,
    deleteFreight,
    openRelate,
    closeRelate,
    getMessageList
  } from '../../vuex/action'
import Slide from '../plugin/slide'

export default {
    vuex: {
      actions: {
        loadSupList,
        loadSupAddress,
        addNewSup,
        addNewFre,
        updataSup,
        loadfreightList,
        updateFre,
        deleteFreight,
        openRelate,
        closeRelate,
        getMessageList
      },
      getters: {
        supInfo: ({
          supplier
        }) => supplier.supInfo,
        supAddress: ({
          supplier
        }) => supplier.supAddress,
        userInfo: ({
          common
        }) => common.userInfo,
        freightList: ({
          supplier
        }) => supplier.freightList
      }
    },
    components: {
      Slide
    },
    data () {
      return {
        searchSupParam: {
          supplierName: '',
          address: '',
          page: 1,
          comId: this.userInfo.comId
        },
        newSupParam: {
          supplierName: '',
          address: '',
          freight: '',
          benifit: '',
          freightId: '',
          comId: this.userInfo.comId
        },
        changeSupParam: {
          supplierName: '',
          address: '',
          benifit: '',
          supplierId: '',
          row: '',
          comId: this.userInfo.comId
        },
        freParam: {
          address: '',
          freight: ''
        },
        changeFreParam: {
          address: '',
          freight: ''
        },
        deleteFreParams: {
          freightId: ''
        },
        activeName: 'first',
        dlgSupVisible: false,
        dlgChangeSupVisible: false,
        fredlgAddshow: false,
        fredlgChangeshow: false,
        infoloading: true,
        freightloading: true,
        messageList: []
      }
    },
    methods: {
      searchSup () {
        this.infoloading = true
        this.loadSupList(this.searchSupParam)
          .then(rs => {
            this.infoloading = false
          })
      },
      handleInfoCurrentChange (val) {
        this.searchSupParam.page = val
        this.infoloading = true
        this.loadSupList(this.searchSupParam)
          .then(() => {
            this.infoloading = false
          })
      },
      handleFreightCurrentChange (val) {
        this.searchSupParam.page = val
        this.freightloading = true
        this.loadfreightList(this.searchSupParam)
          .then(() => {
            this.freightloading = false
          })
      },
      addSup () { // 录入供应商信息
        this.addNewSup(this.newSupParam)
          .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            })
            this.dlgSupVisible = false
            this.dlgFreightVisible = false
            this.loadSupList(this.searchSupParam)
          })
      },
      addFre () { // 录入运费信息
        this.addNewFre(this.freParam)
          .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            })
            this.fredlgAddshow = false
            this.loadfreightList(this.searchSupParam)
          })
      },
      deleteFre (index, row) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteFreParams.freightId = row.freightId.toString()
          this.deleteFreight(this.deleteFreParams)
            .then(rs => {
              this.$message({
                message: `删除成功`,
                type: 'success'
              })
              this.loadfreightList(this.searchSupParam)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      changeSupDlg (index, row) { // 修改供应商dlg
        this.dlgChangeSupVisible = true
        this.changeSupParam.supplierName = row.supplierName
        this.changeSupParam.address = row.address
        this.changeSupParam.benifit = row.benifit
        this.changeSupParam.supplierId = row.supplierId
        this.changeSupParam.row = row
      },
      changeSup (row) { // 确认修改供应商信息
        this.updataSup(this.changeSupParam, this.changeSupParam.supplierId)
          .then(rs => {
            this.$message({
              message: `信息修改成功`,
              type: 'success'
            })
            this.dlgChangeSupVisible = false
            this.loadSupList(this.searchSupParam)
          })
      },
      changeFreDlg (index, row) { // 修改运费dlg
        this.fredlgChangeshow = true
        this.changeFreParam.freight = row.freight
        this.changeFreParam.freightId = row.freightId
        this.changeFreParam.address = row.address
        this.changeFreParam.row = row
      },
      changeFre (row) { // 确认修改运费
        this.updateFre(this.changeFreParam)
          .then(rs => {
            this.$message({
              message: `信息修改成功`,
              type: 'success'
            })
            this.fredlgChangeshow = false
            this.loadfreightList()
          })
      },
      changeState (value, {supplierId}) {
        if (value === 1) {
          this.openRelate({supplierId})
        } else {
          this.closeRelate({supplierId})
        }
      },
      valueDateFormat (row, colum) {
        if (row.valueTime) { return new Date(parseInt(row.valueTime)).formatDate('yyyy-MM-dd hh:mm:ss') }
        return ''
      },
      inventoryDateFormat (row, colum) {
        if (row.inventoryTime) { return new Date(parseInt(row.inventoryTime)).formatDate('yyyy-MM-dd hh:mm:ss') }
        return ''
      }
    },
    mounted: function () {
      this.loadSupAddress({
        comId: this.userInfo.comId
      })
      this.loadSupList({
        comId: this.userInfo.comId
      }).then(rs => {
        this.infoloading = false
      })
      this.loadfreightList({
        comId: this.userInfo.comId
      }).then(rs => {
        this.freightloading = false
      })
    },
    created () {
      this.getMessageList({messageType: 1})
        .then(data => {
          this.messageList = data.row
        })
    },
    computed: {
      supplierAuth () {
        return Boolean(parseInt(this.userInfo.userRole.charAt(3)))
      }
    }
  }
</script>

<style lang="less">
  .sup-info {
    .demo-form-inline {
        margin-top: 16px;
    }
    .open{
      input{
        color: #13CE66;
        border-color: #13CE66;
      }
      .el-input__inner:hover{
        border-color: #13CE66;
      }
      & .el-input .el-input__icon{
        color: #13CE66;
      }
    }
  }
</style>
