<template lang="html">
    <div>
       <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>

            <el-form-item label="类别">
                <el-select v-model="searchParam.type">
                     <el-option :value='0'>全部</el-option>
                     <el-option :label="item.type" :value="item.type" v-for="(item,index) in priceList" :key="index"></el-option>
                </el-select>                
            </el-form-item>

            <el-form-item label="材质" >
                <el-select v-model="searchParam.material">
                     <el-option :value='0'>全部</el-option>
                     <el-option :label="item.material" :value="item.material" v-for="(item,index) in priceList" :key="index"></el-option>
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
                <el-button type="warning" @click="searchPrice">查询</el-button>
              </el-form-item>
       </el-form>

       <el-table :data="priceList" style="width: 100%" height="500" :loading="loading">
              <el-table-column property="spec" label="规格"></el-table-column>
              <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
              <el-table-column property="type" label="类别"></el-table-column>
              <el-table-column property="supplierName" label="供应商"></el-table-column>
              <el-table-column property="value" label="出厂价(元/吨)"></el-table-column>
              <el-table-column inline-template label="操作" align="center" property="id">
                  <el-button type="text" size="mini" @click.native="">修改</el-button>
              </el-table-column>
       </el-table>
    </div>
</template>

<script>
    import {
        loadSupPriceList,
        loadSupAddress
    } from '../../vuex/action'

    export default {
        vuex:{
            actions:{
                loadSupPriceList,
                loadSupAddress
            },
            getters:{
                priceList: ({
                    supplier
                })=> supplier.priceList,
                supAddress:({
                    supplier
                })=> supplier.supAddress,
                userInfo:({
                    common
                })=> common.userInfo
            }
        },
        data(){
            return {
                searchParam:{
                    spec:'',
                    type:'',
                    material:'',
                    supplierName:'',
                    address:'',
                    comId: this.userInfo.comId
                },
                loading: true
            }
        },
        methods: {
            searchPrice(){
                this.loading = true;
                this.loadSupPriceList(this.searchParam)
                .then(rs=>{
                    this.loading = false;
                })
            }
        },
        mounted: function() {
            this.loadSupPriceList({
                comId :this.userInfo.comId
            });
            this.loadSupAddress({
                comId: this.userInfo.comId
            });
        }
    }
</script>

<style lang="css">
</style>
