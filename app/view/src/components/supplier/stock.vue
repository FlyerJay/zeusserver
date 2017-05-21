<template lang="html">
    <div>
        <el-form :inline="true" :model="searchInvenParam" class="demo-form-inline">
            <el-form-item label="规格">
                <el-input v-model='searchInvenParam.spec' placeholder="支持关键词/模糊查询"></el-input>
            </el-form-item>
    
            <el-form-item label="类别">
                <el-select v-model="searchInvenParam.type">
                    <el-option :value='0'>全部</el-option>
                    <el-option :label="item.type" :value="item.type" v-for="(item,index) in inventoryList" :key="index"></el-option>
                </el-select>
            </el-form-item>
    
            <el-form-item label="材质">
                <el-select v-model="searchInvenParam.material">
                    <el-option :value='0'>全部</el-option>
                    <el-option :label="item.material" :value="item.material" v-for="(item,index) in inventoryList" :key="index"></el-option>
                </el-select>
            </el-form-item>
    
            <el-form-item label="供应商名称">
                <el-input v-model="searchInvenParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
            </el-form-item>
    
            <el-form-item label="所在地">
                <el-select v-model="searchInvenParam.address" placeholder="全部">
                    <el-option :value='0'>全部</el-option>
                    <el-option :label="item.address" :value="item.address" v-for="(item, index) in supAddress" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-upload class="upload-demo" action="http://127.0.0.1:7001/zues/api/upload/excel?type=inventory" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchPrice">查询</el-button>
            </el-form-item>
        </el-form>
    
        <el-table :data="inventoryList" style="width: 100%" height="500" :loading="loading">
            <el-table-column property="spec" label="规格"></el-table-column>
            <el-table-column property="lastUpdateTime" label="最新更新时间"></el-table-column>
            <el-table-column property="type" label="类别"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="inventoryAmount" label="库存数量(支)"></el-table-column>
            <el-table-column property="inventoryWeight" label="库存重量(吨)"></el-table-column>
            <el-table-column property="perAmount" label="单件支数"></el-table-column>
            <el-table-column inline-template label="操作" align="center" property="id">
                <el-button type="text" size="mini" @click.native="">修改</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        loadSupInventoryList,
        loadSupAddress
    } from '../../vuex/action'
    
    export default {
        vuex: {
            actions: {
                loadSupInventoryList,
                loadSupAddress
            },
            getters: {
                inventoryList: ({
                    supplier
                }) => supplier.inventoryList,
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
                searchInvenParam: {
                    spec: '',
                    type: '',
                    material: '',
                    supplierName: '',
                    address: '',
                    comId: this.userInfo.comId
                },
                loading: true
            }
        },
        methods: {
            searchPrice() {
                this.loading = true;
                this.loadSupInventoryList(this.searchInvenParam)
                    .then(rs => {
                        this.loading = false;
                    })
            }
        },
        mounted: function() {
            this.loadSupInventoryList({
                comId: this.userInfo.comId
            });
            this.loadSupAddress({
                comId: this.userInfo.comId
            });
        }
    }
</script>

<style lang="css">
    
</style>
