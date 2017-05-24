<template lang="html">
    <div class='order-wrap'>
<<<<<<< HEAD
        <el-form :inline="true" :model="operateParams" class="demo-form-inline">
            <!--<el-form-item label="用户ID:">
                    <el-input v-model="" placeholder="支持模糊搜索"></el-input>
                </el-form-item>-->
            <el-form-item>
                <el-button type="warning" @click="searchOperate">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="operateInfo.row" v-loading.body="loading" element-loading-text="拼命加载中">
            <el-table-column prop="recordId" label="序号"></el-table-column>
            <el-table-column prop="createTime" label="时间" :formatter="dateFormat"></el-table-column>
            <el-table-column prop="userId" label="用户ID"></el-table-column>
            <el-table-column prop="type" label="修改记录"></el-table-column>
            <el-table-column prop="detail" label="操作明细"></el-table-column>
        </el-table>
        <div class="page-wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="operateParams.page" :page-size="30" layout=" prev, pager, next" :total="operateInfo.totalCount">
            </el-pagination>
        </div>
=======
	     <el-table :data="operateInfo.row" :load="loading">
	     	<el-table-column prop="recordId" label="序号"></el-table-column>
	     	<el-table-column prop="createTime" label="时间"></el-table-column>
	     	<el-table-column prop="userId" label="用户ID"></el-table-column>
	     	<el-table-column prop="type" label="修改记录"></el-table-column>
	     	<el-table-column prop="detail" label="操作明细"></el-table-column>
	     </el-table>
       

>>>>>>> f1bd3c8c691c0359e22e618ea122df4e76c51a1d
    </div>
</template>

<script>
    import {
        loadOperateList
    } from '../../vuex/action'
    
    export default {
        vuex: {
            actions: {
                loadOperateList
            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                operateInfo: ({
                    manager
                }) => manager.operateInfo
            }
        },
        data() {
            return {
                operateParams: {
                    id: '',
                    page: 1
                },
                loading: true
            }
        },
        methods: {
            searchOperate() {
                console.log(this.operateParams);
                console.log(this.operateInfo);
            },
            dateFormat(row, column) {
                return new Date(parseInt(row.lastUpdateTime)).formatDate('yyyy-MM-dd hh:mm')
            },
            handleCurrentChange(val) {
                this.operateParams.page = val;
                this.loading = true;
                this.loadOperateList(this.operateParams)
                    .then(() => {
                        this.loading = false;
                });
            }
        },
        mounted: function() {
            this.loadOperateList(this.operateParams)
                .then(rs => {
                    this.loading = false;
                });
        }
    }
</script>

<style lang="css">
    
</style>
