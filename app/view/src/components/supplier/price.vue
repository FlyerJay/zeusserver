<template lang="html">
    <div>
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>
    
            <el-form-item label="类别">
                <el-select v-model="searchParam.type">
                    <el-option value="">全部</el-option>
                    <el-option value="黑管">黑管</el-option>
                    <el-option value="镀锌">镀锌</el-option>
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
                    <el-button type="warning" v-if="Boolean(valueAuth)">上传价格表</el-button>
                </el-upload>
            </el-form-item>
    
        </el-form>
    
        <el-table :data="price.row" style="width: 100%" v-loading.body="loading" element-loading-text="拼命加载中">
            <el-table-column property="spec" label="规格"></el-table-column>
            <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
            <el-table-column property="type" label="类别"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="value" label="出厂价(元/吨)"></el-table-column>
    
            <el-table-column label="操作" align="center" v-if="Boolean(valueAuth)">
                <template scope="scope">
                        <el-button size="small" @click="changePrice(scope.index, scope.row)" type="warning"  >修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchParam.page" layout=" prev, pager, next" :page-size="30" :total="price.totalCount">
            </el-pagination>
        </div>

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
        updataPrice,
        getUserRole
    } from '../../vuex/action'
    
    export default {
        vuex: {
            actions: {
                loadSupPriceList,
                loadSupAddress,
                updataPrice,
                getUserRole
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
                userRoleInfo:({
                    manager
                }) => manager.userRoleInfo,

            }
        },
        data() {
            return {
                searchParam: {
                    userId: this.userInfo.userId,
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
                valueAuth: parseInt(this.userInfo.roleInfo.charAt(1)),
                loading: true,
                dlgPriceVisible: false
            }
        },
        methods: {
            searchPrice() {
                this.loading = true;
                this.searchParam.page = 1;
                this.loadSupPriceList(this.searchParam)
                    .then(rs => {
                        this.loading = false;
                    })
            },
            changePrice(index, row) {
                this.dlgPriceVisible = true;
                this.newPriceParam.value = Number(row.value);
                this.newPriceParam.supplierValueId = row.supplierValueId;
            },
            confirmChangePrice(row) {
                this.updataPrice(this.newPriceParam)
                    .then(rs => {
                        this.$message({
                            message: `价格修改成功`,
                            type: 'success'
                        });
                        this.dlgPriceVisible = false;
                        row.value = this.newPriceParam.value;
                    })
            },
            handleCurrentChange(val) {
                this.searchParam.page = val;
                this.loading = true;
                this.loadSupPriceList(this.searchParam)
                    .then(() => {
                        this.loading = false;
                    });
            }
        },
        mounted: function() {
            this.loadSupPriceList().then(rs => {
                this.loading = false;
            });
            this.loadSupAddress();
            this.getUserRole(this.searchParam.userId);

             
        }
    }
</script>

<style lang="css">
    
</style>
