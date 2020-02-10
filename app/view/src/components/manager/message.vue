<template lang="html">
    <div class='order-wrap'>
        <el-form :inline="true" :model="searchParams" class="demo-form-inline">
          <!-- <el-form-item label="消息类型:">
              <el-input v-model="searchParams.messageType" placeholder="支持模糊搜索"></el-input>
          </el-form-item> -->
          <el-form-item label="创建日期：">
            <el-date-picker v-model="searchParams.startTime" type="date" placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker v-model="searchParams.endTime" type="date" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="searchMessage" :loading="loading">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="addMessage" :loading="loading">添加消息</el-button>
          </el-form-item>
        </el-form>
    	  <el-table :data="messageList.row" v-loading.body="loading" element-loading-text="拼命加载中" border>
    	     	<el-table-column prop="messageType" label="消息类型" :formatter="messageFormatter"></el-table-column>
    	     	<el-table-column prop="message" label="消息内容"></el-table-column>
    	     	<el-table-column prop="createTime" :formatter="dateFormat" label="创建时间"></el-table-column>
    	     	<el-table-column label="操作" width="160px">
    	     		<template scope="scope">
                <el-button size="small" @click="updateMessage(scope.index, scope.row)" type="warning">修改</el-button>
    	     			<el-button size="small" @click="deleteMessage(scope.index, scope.row)" type="danger">删除</el-button>
    	     		</template>
    	     	</el-table-column>
    	  </el-table>
        <div class="page-wrap">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchParams.page"
            :page-size="15"
            layout=" prev, pager, next"
            :total="messageList.totalCount">
          </el-pagination>
        </div>
        <el-dialog title="" v-model="dlgAddMessage" size="tiny" class="custom-dialog">
          <div class="dialog-content">
            <div class="select-control clearfix dialog-item">
              <el-row :gutter="0">
              <el-col :span="7"><div class="select-prepend">消息类型</div></el-col>
              <el-col :span="17">
                  <el-select v-model="addPrams.messageType" placeholder="请选择">
                    <el-option v-for="item in messageTypeList" :key="item.key" :label="item.key" :value="item.value">
                    </el-option>
                  </el-select>
              </el-col>
              </el-row>
            </div>
            <el-input class="dialog-item" placeholder="填写消息内容" v-model="addPrams.message" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
            <el-button type="info" class="dialog-item float-right" @click="submitNewMessage">确 定</el-button>
            <el-button type="warning" @click="dlgAddMessage = false" class="dialog-item float-right">取 消</el-button>
          </div>
        </el-dialog>
        <el-dialog title="" v-model="dlgUpdateMessage" size="tiny" class="custom-dialog">
          <div class="dialog-content">
            <div class="select-control clearfix dialog-item">
              <el-row :gutter="0">
              <el-col :span="7"><div class="select-prepend">消息类型</div></el-col>
              <el-col :span="17">
                  <el-select v-model="updateParams.messageType" placeholder="请选择">
                    <el-option v-for="item in messageTypeList" :key="item.key" :label="item.key" :value="item.value">
                    </el-option>
                  </el-select>
              </el-col>
              </el-row>
            </div>
            <el-input class="dialog-item" placeholder="填写消息内容" v-model="updateParams.message" :maxlength="100" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" auto-complete="off"></el-input>
            <el-button type="info" class="dialog-item float-right" @click="submitUpdate">确 定</el-button>
            <el-button type="warning" @click="dlgUpdateMessage = false" class="dialog-item float-right">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>

import {
  getMessageList,
  newMessage,
  removeMessage,
  modifyMessage
} from '../../vuex/action'

export default {
  vuex: {
    actions: {
      getMessageList,
      newMessage,
      removeMessage,
      modifyMessage
    },
    getters: {
      userInfo: ({ common }) => common.userInfo,
      messageList: ({
          manager
        }) => manager.messageList
    }
  },
  data () {
    return {
      loading: false,
      searchParams: {
        messageType: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 30
      },
      updateParams: {
        messageId: '',
        messageType: '',
        message: ''
      },
      addPrams: {
        messageType: '',
        message: ''
      },
      dlgAddMessage: false,
      dlgUpdateMessage: false,
      messageTypeList: [{ value: '1', key: '供应商' }, { value: '2', key: '需求' }, { value: '3', key: '现货' }]
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.searchParams.page = val
      this.searchMessage()
    },
    searchMessage () {
      this.loading = true
      this.getMessageList(this.searchParams)
        .then(rs => {
          this.loading = false
        })
    },
    dateFormat (row, column) {
      if (!row[column.property]) {
        return ''
      } else {
        return new Date(parseInt(row[column.property])).formatDate('yyyy-MM-dd hh:mm')
      }
    },
    messageFormatter (row, column) {
      var messageType = {
        '1': '供应商',
        '2': '需求',
        '3': '现货'
      }
      if (!row[column.property]) {
        return ''
      } else {
        return messageType[row[column.property]]
      }
    },
    addMessage () {
      this.dlgAddMessage = true
    },
    submitNewMessage () {
      this.newMessage(this.addPrams)
        .then(rs => {
          this.$message({
            message: '添加消息成功',
            type: 'success'
          })
          this.dlgAddMessage = false
          this.addPrams.messageType = ''
          this.addPrams.message = ''
          this.searchMessage()
        })
    },
    updateMessage (index, row) {
      this.dlgUpdateMessage = true
      this.updateParams.messageId = row.messageId
      this.updateParams.messageType = row.messageType
      this.updateParams.message = row.message
    },
    submitUpdate () {
      this.modifyMessage(this.updateParams)
        .then(rs => {
          this.$message({
            message: '修改消息成功',
            type: 'success'
          })
          this.dlgUpdateMessage = false
          this.updateParams.messageId = ''
          this.updateParams.messageType = ''
          this.updateParams.message = ''
          this.searchMessage()
        })
    },
    deleteMessage (index, row) {
      this.$confirm('确定删除这条消息?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeMessage({messageId: row.messageId})
          .then(rs => {
            this.$message({
              message: '删除消息成功',
              type: 'success'
            })
            this.searchMessage()
          })
      })
    }
  },
  mounted: function () {
    this.searchMessage()
  }
}
</script>
