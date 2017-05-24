<template lang="html">
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
        </el-form>
        <el-button style="margin:0px 0px 15px 0;" type="warning" @click="dlgSupVisible = true">供应商信息录入</el-button>
        <el-table :data="supInfo.row" style="width: 100%" v-loading.body="infoloading" element-loading-text="拼命加载中">
          <el-table-column property="supplierName" label="供应商名称"></el-table-column>
          <el-table-column property="address" label="供应商所在地"></el-table-column>
          <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
          <el-table-column property="benifit" label="厂家优惠政策（元/吨）"></el-table-column>
          <el-table-column label="操作" align="center" property="id">
            <template scope="scope">
              <el-button size="small" @click="changeSupDlg(scope.index, scope.row)" type="warning">修改</el-button>
              <el-button size="small" @click="deleteSup(scope.index, scope.row)" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleInfoCurrentChange"
            :current-page.sync="searchSupParam.page"
            layout=" prev, pager, next"
            :total="supInfo.totalCount"
            :page-size="30"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="运费信息" name="second">
          <el-button style="margin:0px 0px 15px 0;" type="warning" @click="fredlgAddshow = true">每日运费录入</el-button>
          <el-table :data="freightList" style="width: 100%" v-loading.body="freightloading" element-loading-text="拼命加载中">
            <el-table-column property="address" label="所在地"></el-table-column>
            <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
            <el-table-column  label="操作" align="center" property="id">
            <template scope="scope">
              <el-button size="small" @click="changeFreDlg(scope.index, scope.row)" type="warning">
                修改</el-button>
              <el-button size="small" @click="deleteFre(scope.index, scope.row)" type="danger">删除</el-button>
            </template>
            </el-table-column>
          </el-table>
      </el-tab-pane>
    </el-tabs>
     
    <!--供应商信息录入dlg--> 
    <el-dialog title="" v-model="dlgSupVisible">
      <el-form :model="newSupParam">
        <el-form-item label="供应商名称：">
          <el-input v-model="newSupParam.supplierName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在地：">
          <el-select v-model="newSupParam.address" placeholder="请选择活动区域">
            <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运费：">
          <el-input v-model="newSupParam.freight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="政策下浮：">
          <el-input v-model="newSupParam.benifit" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addSup">确 定</el-button>
        <el-button @click="dlgSupVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--运费信息录入dlg-->
    <el-dialog title="" v-model="fredlgAddshow">
      <el-form :model="freParam">
        <el-form-item label="所在地：">
          <el-input v-model="freParam.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运费：">
          <el-input v-model="freParam.freight" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addFre()">确 定</el-button>
        <el-button @click="fredlgAddshow = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改运费信息对话框-->
    <el-dialog title="" v-model="fredlgChangeshow">
      <el-form :model="changeFreParam">
        <el-form-item label="所在地：">
          <el-input v-model="changeFreParam.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="运费：">
          <el-input v-model="changeFreParam.freight" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="changeFre()">确 定</el-button>
        <el-button @click="fredlgChangeshow = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--修改供应商信息-->
    <el-dialog title="" v-model="dlgChangeSupVisible">
      <el-form :model="changeSupParam">
        <el-form-item label="供应商名称：">
          <el-input v-model="changeSupParam.supplierName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所在地：">
          <el-select v-model="changeSupParam.address" placeholder="请选择活动区域">
            <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运费：">
          <el-input v-model="changeSupParam.freight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="政策下浮：">
          <el-input v-model="changeSupParam.benifit" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="changeSup(changeSupParam.row)">确 定</el-button>
        <el-button @click="dlgChangeSupVisible = false">取 消</el-button>
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
    deletSupplier,
    deleteFreight
  } from '../../vuex/action'
  
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
        deletSupplier,
        deleteFreight
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
    data() {
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
          freight: '',
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
        deleteSupParams: {
          supplierId: ''
        },
        deleteFreParams: {
          freightId: ''
        },
        activeName: "first",
        dlgSupVisible: false,
        dlgChangeSupVisible: false,
        fredlgAddshow: false,
        fredlgChangeshow: false,
        infoloading: true,
        freightloading: true
      }
    },
    methods: {
      searchSup() {
        this.infoloading = true;
        this.loadSupList(this.searchSupParam)
          .then(rs => {
            this.infoloading = false;
          })
      },
      handleInfoCurrentChange(val) {
        this.searchSupParam.page = val;
        this.infoloading = true;
        this.loadSupList(this.searchSupParam)
          .then(() => {
            this.infoloading = false;
          });
      },
      handleFreightCurrentChange(val) {
        this.searchSupParam.page = val;
        this.freightloading = true;
        this.loadfreightList(this.searchSupParam)
          .then(() => {
            this.freightloading = false;
          });
      },
      addSup() { //录入供应商信息
        this.addNewSup(this.newSupParam)
          .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            })
            this.dlgSupVisible = false;
            this.dlgFreightVisible = false;
            this.loadSupList(this.searchSupParam);
          })
      },
      addFre() { //录入运费信息
        this.addNewFre(this.freParam)
          .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            })
            this.fredlgAddshow = false;
            this.loadSupList(this.searchSupParam);
          })
      },
      deleteSup(index, row) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteSupParams.supplierId = row.supplierId.toString();
          this.deletSupplier(this.deleteSupParams)
            .then(rs => {
              this.$message({
                message: `删除成功`,
                type: 'success'
              })
              this.loadSupList(this.searchSupParam);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });    
      },
      deleteFre(index, row) {
        this.$confirm('确认删除?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.deleteFreParams.freightId = row.freightId.toString();
          this.deleteFreight(this.deleteFreParams)
            .then(rs => {
              this.$message({
                message: `删除成功`,
                type: 'success'
              })
              this.loadfreightList(this.searchSupParam);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });  
      },
      changeSupDlg(index, row) { //修改供应商dlg
        this.dlgChangeSupVisible = true;
        this.changeSupParam.supplierName = row.supplierName;
        this.changeSupParam.address = row.address;
        this.changeSupParam.freight = row.freight;
        this.changeSupParam.benifit = row.benifit;
        this.changeSupParam.supplierId = row.supplierId;
        this.changeSupParam.row = row
      },
      changeSup(row) { //确认修改供应商信息
        this.updataSup(this.changeSupParam, this.changeSupParam.supplierId)
          .then(rs => {
            this.$message({
              message: `信息修改成功`,
              type: 'success'
            });
            this.dlgChangeSupVisible = false;
            this.loadSupList(this.searchSupParam);
          })
      },
      changeFreDlg(index, row) { // 修改运费dlg
        this.fredlgChangeshow = true;
        this.changeFreParam.freight = row.freight;
        this.changeFreParam.freightId = row.freightId;
        this.changeFreParam.address = row.address;
        this.changeFreParam.row = row
      },
      changeFre(row) { //确认修改运费
        this.updateFre(this.changeFreParam)
          .then(rs => {
            this.$message({
              message: `信息修改成功`,
              type: 'success'
            })
            this.fredlgChangeshow = false;
            this.loadfreightList();
          })
      },
    },
    mounted: function() {
      this.loadSupAddress({
        comId: this.userInfo.comId
      });
      this.loadSupList({
        comId: this.userInfo.comId
      }).then(rs => {
        this.infoloading = false;
      });
      this.loadfreightList({
        comId: this.userInfo.comId
      }).then(rs => {
        this.freightloading = false;
      })
    }
  }
</script>

<style lang="less" scoped>
  .sup-info {
    .demo-form-inline {
        margin-top: 16px;
    }
  }
</style>
