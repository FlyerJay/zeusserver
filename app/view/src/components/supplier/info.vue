<template lang="html">
  <div>
    <el-form :inline="true" :model="searchSupParam" class="demo-form-inline">
      <el-form-item label="供应商名称">
        <el-input v-model="searchSupParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
      </el-form-item>
      <el-form-item label="所在地">
        <el-select v-model="searchSupParam.address" placeholder="全部">
          <el-option :value='0'>全部</el-option>
          <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchSup">查询</el-button>
      </el-form-item>
    </el-form>
  
  
    <el-row type="flex" align="middle" style="padding:20px 0;">
      <el-col :span="10">
        <el-button type="warning" @click="dlgSupVisible = true">供应商信息录入</el-button>
        <el-button type="warning" @click="dlgFreightVisible = true">每日运费录入</el-button>
      </el-col>
    </el-row>
  
    <el-table :data="supList" style="width: 100%" height="" :loading="loading">
      <el-table-column property="supplierName" label="供应商名称"></el-table-column>
      <el-table-column property="address" label="供应商所在地"></el-table-column>
      <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
      <el-table-column property="benifit" label="厂家优惠政策（元/吨）"></el-table-column>
      <el-table-column  label="操作" align="center" property="id">
          <template scope="scope">
              <el-button size="small" @click="changeSupList(scope.index, scope.row)" type="warning">修改</el-button>
          </template>
      </el-table-column>
    </el-table>
  
     <el-row type="flex" justify="end" style="padding:20px 0; ">
         <el-pagination :current-page="5" layout="prev, pager, next">
         </el-pagination>
     </el-row>
     
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
        <el-button @click="dlgSupVisible = false">取 消</el-button>
        <el-button type="warning" @click="addSup">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" v-model="dlgFreightVisible">
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
        <el-button @click="dlgFreightVisible = false">取 消</el-button>
        <el-button type="warning" @click="addSup">确 定</el-button>
      </div>
    </el-dialog>

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
        <el-button @click="dlgSupVisible = false">取 消</el-button>
        <el-button type="warning" @click="changeSup(changeSupParam.row)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    loadSupList,
    loadSupAddress,
    addNewSup,
    updataSup
  } from '../../vuex/action'
  
  export default {
    vuex: {
      actions: {
        loadSupList,
        loadSupAddress,
        addNewSup,
        updataSup
      },
      getters: {
        supList: ({
          supplier
        }) => supplier.supList,
        supAddress: ({
          supplier
        }) => supplier.supAddress,
        userInfo: ({
          common
        }) => common.userInfo
      }
    },
    data() {
      return {
        searchSupParam: {
          supplierName: '',
          address: '',
          comId: this.userInfo.comId
        },
        newSupParam: {
          supplierName: '',
          address: '',
          freight: '',
          benifit: '',
          comId: this.userInfo.comId
        },
        changeSupParam:{
          supplierName: '',
          address: '',
          freight: '',
          benifit: '',
          supplierId:'',
          row:'',
          comId: this.userInfo.comId
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dlgSupVisible: false,
        dlgFreightVisible: false,
        dlgChangeSupVisible:false,
        loading: true
      }
    },
    methods: {
      searchSup() {
        this.loading = true;
        this.loadSupList(this.searchSupParam)
          .then(rs => {
            this.loading = false;
          })
      },
      addSup() {
        this.addNewSup(this.newSupParam, this.searchSupParam)
          .then(rs => {
            this.$message({
              message: `信息录入成功`,
              type: 'success'
            });
            this.dlgSupVisible = false;
            this.dlgFreightVisible = false
          })
      },
      changeSupList(index, row){
         this.dlgChangeSupVisible=true;
         this.changeSupParam.supplierName = row.supplierName;
         this.changeSupParam.address = row.address;
         this.changeSupParam.freight = row.freight ;
         this.changeSupParam.benifit = row.benifit;
         this.changeSupParam.supplierId = row.supplierId;
         this.changeSupParam.row = row
      },
      changeSup(row){
           this.updataSup(this.changeSupParam, this.changeSupParam.supplierId)
          .then(rs => {
            this.$message({
              message: `信息修改成功`,
              type: 'success'
            });
            this.dlgChangeSupVisible=false;
            row.supplierName =  this.changeSupParam.supplierName;
            row.address = this.changeSupParam.address;
            row.freight = this.changeSupParam.freight;
            row.benifit = this.changeSupParam.benifit;
          })
      }

    },
    mounted: function() {
      this.loadSupAddress({
        comId: this.userInfo.comId
      })
      this.loadSupList({
        comId: this.userInfo.comId
      })
    }
  }
</script>

<style lang="css">
  
</style>
