<template>
    <div> 
        <el-upload
           class="upload-demo"
           action="url" >
            <el-button size="big" type="warning" >定制需求上传</el-button>
        </el-upload>
        <div class="title">定制货品价格列表</div> 
        <div class="tb-wrap">
          <el-table :data="cartList" stripe style="width: 100%">
                <el-table-column prop="spec" label="规格" width="">
                </el-table-column>
                <el-table-column prop="lastUpdateTime" label="最新更新时间(按采购)" width="" :formatter="dateFormat">
                </el-table-column>
                <el-table-column prop="type" label="类别" width="">
                </el-table-column>
                <el-table-column label="需求明细" align="center" property="id">
                     <template scope="scope">
                        <el-button size="small" @click="enterNum(scope.index, scope.row)" type="warning" >点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="charAdjust" label="工期">
                </el-table-column>
                <el-table-column prop="userId" label="用户ID">
                </el-table-column>
                <el-table-column prop="inventoryAmount" label="出厂价">
                </el-table-column>
                <el-table-column prop="freight" label="运费）">
                </el-table-column>
                <el-table-column prop="benifit" label="总成本"> 
                </el-table-column>
                <el-table-column prop="value" label="成交接口">
                </el-table-column>
                <el-table-column prop="supplierName" label="原因">
                </el-table-column>
          </el-table>
        </div>
         <el-dialog title="" v-model="dlgDemandVisible">
            <el-form :model="demandParams">
                <el-form-item label="规格：">
                   <el-input v-model="demandParams.charSpec" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别：">
                   <el-input v-model="demandParams.charType" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item label="数量：">
                   <el-input v-model="demandParams.charAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="目的地：">
                   <el-input v-model="demandParams.charAddress" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户：">
                   <el-input v-model="demandParams.charCustomer" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话：">
                   <el-input v-model="demandParams.charTel" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dlgDemandVisible = false">取 消</el-button>
                <el-button  @click="">提 交</el-button>
            </div>
       </el-dialog>
  </div>
</template>

<script>
    import {
      upLoadFile,
      loadCartList
    } from '../../vuex/action'

    export default {
        vuex: {
            actions: {
                upLoadFile ,
                loadCartList

            },
            getters: {
                userInfo: ({
                    common
                }) => common.userInfo,
                demandList: ({
                    order
                }) => order.demandList,
                cartList: ({
                    order
                }) => order.cartList
            }
        },
        data() {
            return {
                params: {
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                },
                demandParams:{
                    userId: this.userInfo.userId,
                    comId: this.userInfo.comId,
                    charSpec:'',
                    charType:'',
                    charAmount:'',
                    charAddress:'',
                    charCustomer:'',
                    charTel:'',
                    demandListId:''
                },
                dlgDemandVisible:false
            }
        },
        methods: {
         dateFormat(row, column) {
           return new Date(parseInt(row.lastUpdateTime)).formatDate('yyyy-MM-dd hh:mm')
         },
      
         enterNum(index, row) {
                this.dlgDemandVisible = true;
                this.demandParams.demandListId = row.demandListId;
            }

        },
         mounted: function() {
           
            this.loadCartList(this.params)
        }
    }
</script>
<style lang="css">
  .title{
    margin: 20px 0px;
    font-size:24px;
  }
</style>