<template lang="html">
  <el-card class="box-card">
    <el-row type="flex" align="middle" style="padding:20px 0;">
      <el-col :span="7" style="text-align: center;">
        供应商名称：
      </el-col>
      <el-col :span="7">
        <el-input v-model="supParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
      </el-col>
      <el-col :span="7">
        所在地：
      </el-col>
      <el-col :span="7">
        <el-select v-model="supParam.region" placeholder="活动区域">
          <el-option label="南京" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-button :plain="true" @click.native="searchSup" type="info">查询</el-button>
      </el-col>
    </el-row>
  
    <el-row type="flex" align="middle" style="padding:20px 0;">
      <el-col :span="10">
        <el-button type="primary" @click="dialogFormVisible = true">供应商信息录入</el-button>
        <el-button :plain="true" @click.native="handleCopy" type="info">每日运费录入</el-button>
      </el-col>
    </el-row>
  
    <el-table :data="supplierList" style="width: 100%">
      <el-table-column property="supplierName" label="供应商名称"></el-table-column>
      <el-table-column property="address" label="供应商所在地"></el-table-column>
      <el-table-column property="freight" label="运费（元/吨）"></el-table-column>
      <el-table-column property="benifit" label="厂家优惠政策（元/吨）"></el-table-column>
      <el-table-column inline-template label="操作" align="center" property="id">
        <el-button type="text" size="mini" @click.native="">修改</el-button>
      </el-table-column>
    </el-table>
  
    <el-row type="flex" justify="end" style="padding:20px 0; ">
      <el-pagination :current-page="5" layout="prev, pager, next">
      </el-pagination>
    </el-row>
  
    <el-dialog title="收货地址" >
      <el-form :model="form">
        <el-form-item label="活动名称">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {
    loadSupList
  } from '../../vuex/action'
  
  export default {
    vuex: {
      actions: {
        loadSupList
      },
      getters: {
        supplierList: ({
          supplier
        }) => supplier.supplierList
      }
    },
    data() {
      return {
        supParam: {
          supplierName: '',
          region: ''
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
        dialogFormVisible: false
      }
    },
    methods: {
      searchSup() {
        this.loadSupList(this.supParam)
      }
    },
    mounted: function() {
      this.loadSupList()
    }
  }
</script>

<style lang="css">
  
</style>
