<template lang="html">
    <div>
       <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>

            <el-form-item label="类别">
                <el-select v-model="searchParam.type">
                      <el-option value="全部">全部</el-option>
                      <el-option value="镀带方矩管">镀带方矩管</el-option>
                      <el-option value="方矩管">方矩管</el-option>
                      <el-option value="镀锌方矩管">镀锌方矩管</el-option>
                      <el-option value="镀锌角槽">镀锌角槽</el-option>
                      <el-option value="其它">其它</el-option>
                </el-select>                
            </el-form-item>

            <el-form-item label="材质" >
                <el-select v-model="searchParam.material">
                     <el-option :value='0'>全部</el-option>
                      <el-option value="黑管">黑管</el-option>
                      <el-option value="镀锌">镀锌</el-option>
                      <el-option value="镀锌带">镀锌带</el-option>
                      <el-option value="其它">其它</el-option>
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
            <el-upload
                class="upload-demo"
                action="http://127.0.0.1:7001/zues/api/upload/excel"
                >
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
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

              <el-table-column label="操作" align="center" >
                   <template scope="scope">
                        <el-button size="small" @click="changePrice(scope.index, scope.row)" type="warning">修改</el-button>
                   </template>
              </el-table-column>
       </el-table>

       <el-dialog title="" v-model="dlgPriceVisible">
          <el-form :model="newPriceParam">
            <el-form-item label="修改后的价格：">
              <el-input v-model="newPriceParam.value" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dlgPriceVisible = false">取 消</el-button>
            <el-button type="warning" @click="confirmChangePrice(newPriceParam.row)">确 定</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
    import {
        loadSupPriceList,
        loadSupAddress,
        updataPrice
    } from '../../vuex/action'

    export default {
        vuex:{
            actions:{
                loadSupPriceList,
                loadSupAddress,
                updataPrice
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
                newPriceParam:{
                    value:'',
                    supplierValueId:'',
                    row:'',
                    comId:this.userInfo.comId

                },
                loading: true,
                dlgPriceVisible:false
            }
        },
        methods: {
            searchPrice(){
                this.loading = true;
                this.loadSupPriceList(this.searchParam)
                .then(rs=>{
                    this.loading = false;
                })
            },
            changePrice(index, row){
               this.dlgPriceVisible = true;
               this.newPriceParam.value = row.value;
               this.newPriceParam.supplierValueId = row.supplierValueId;
               this.newPriceParam.row = row;

            },
            confirmChangePrice(row){
               this.updataPrice(this.newPriceParam, this.newPriceParam.supplierValueId)
              .then(rs => {
                this.$message({
                  message: `价格修改成功`,
                  type: 'success'
                });
                this.dlgPriceVisible = false;
                row.value =  this.newPriceParam.value;
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
