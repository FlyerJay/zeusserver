<template lang="html">

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
    },
    computed: {
      supplierAuth() {
        return Boolean(parseInt(this.userInfo.userRole.charAt(3)));
      }
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
