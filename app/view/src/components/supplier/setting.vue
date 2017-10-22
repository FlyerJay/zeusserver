<template lang="html">
    <div class="sup-info">
        <el-form :inline="true" :model="searchSupParam" class="demo-form-inline">
            <el-form-item label="供应商名称">
                <el-input v-model="searchSupParam.supplierName" placeholder="支持关键词/模糊搜索"></el-input>
            </el-form-item>
            <el-form-item label="所在地">
                <el-input v-model="searchSupParam.address" placeholder="支持关键词/模糊搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="searchSup" :loading="infoloading">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button style="margin:0px 0px 15px 0;" type="warning" @click="dlgSupVisible = true"  v-if="supplierAuth">供应商信息录入</el-button>
        <el-table :data="supInfo.row" style="width: 100%" v-loading.body="infoloading" element-loading-text="拼命加载中" border>
            <el-table-column property="supplierName" label="供应商名称"></el-table-column>
            <el-table-column property="address" label="供应商所在地"></el-table-column>
            <el-table-column label="操作" align="center" property="id" v-if="supplierAuth">
                <template scope="scope" >
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
                :page-size="15"
            >
            </el-pagination>
        </div>
        <!--供应商信息录入dlg--> 
        <el-dialog title="" v-model="dlgSupVisible" class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="newSupParam.supplierName" auto-complete="off" >
                    <template slot="prepend">供应商名称</template>
                </el-input>
                <el-input v-model="newSupParam.address" auto-complete="off" class="dialog-item">
                    <template slot="prepend">供应商地址</template>
                </el-input>
                <el-button type="info" @click="addSup" class="dialog-item float-right">确 定</el-button>
                <el-button type="warning" @click="dlgSupVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
        <!--修改供应商信息-->
        <el-dialog title="" v-model="dlgChangeSupVisible" class="custom-dialog">
            <div class="dialog-content">
                <el-input v-model="changeSupParam.supplierName" auto-complete="off">
                    <template slot="prepend">供应商名称</template>
                </el-input>
                <el-input v-model="changeSupParam.address" auto-complete="off" class="dialog-item">
                    <template slot="prepend">供应商地址</template>
                </el-input>
                <el-button type="info" @click="changeSup(changeSupParam.row)" class="dialog-item float-right">确 定</el-button>
                <el-button type="warning" @click="dlgChangeSupVisible = false" class="dialog-item float-right">取 消</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
    import {
        loadSupList,
        addNewSup,
        updataSup,
        deletSupplier
    } from '../../vuex/action'
  
    export default {
        vuex: {
            actions: {
                loadSupList,
                addNewSup,
                updataSup,
                deletSupplier
            },
            getters: {
                supInfo: ({
                    supplier
                }) => supplier.supInfo,
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
                    page: 1,
                    comId: this.userInfo.comId
                },
                newSupParam: {
                    supplierName: '',
                    address: '',
                    comId: this.userInfo.comId
                },
                changeSupParam: {
                    supplierName: '',
                    address: '',
                    supplierId: '',
                    row: '',
                    comId: this.userInfo.comId
                },
                deleteSupParams: {
                    supplierId: ''
                },
                infoloading: false,
                dlgSupVisible: false,
                dlgChangeSupVisible: false,
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
            deleteSup(index, row) {
                this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
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
            changeSupDlg(index, row) { //修改供应商dlg
                this.dlgChangeSupVisible = true;
                this.changeSupParam.supplierName = row.supplierName;
                this.changeSupParam.address = row.address;
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
        },
        mounted: function() {
            this.loadSupList({
                comId: this.userInfo.comId
            }).then(rs => {
                this.infoloading = false;
            });
        },
        computed: {
            supplierAuth() {
                return Boolean(parseInt(this.userInfo.userRole.charAt(3)));
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
            .el-input .el-input__icon{
                color: #13CE66;
            }
        }
    }
</style>
