<template>
    <div class="invoice-list">
      <el-form ref="queryForm" :model="query" inline size="mini">
        <el-form-item label="公司名称" prop="enterpriseName">
          <el-input v-model="query.enterpriseName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="query.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="未审核" value="U"></el-option>
            <el-option label="已审核" value="P"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="warning" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      
      <custom-table
        v-loading="loading"
        :setting="false"
        border
        pagination
        :data="invoiceList"
        :columns="columns"
        @current-change="onPageChange"
        :pageSize="pagination.pageSize"
        :total="pagination.total">
      </custom-table>

      <!-- 企业信息 -->
      <el-dialog
        title="企业信息"
        size="tiny"
        v-model="enterpriseInfoDialogVisible"
        :close-on-click-modal="false">
        <el-row :gutter="8" style="line-height: 40px">
          <el-col :span="24">
            企业名称：{{ enterpriseInfo.enterpriseName }}
          </el-col>
          <el-col :span="24">
            邮寄地址：{{ enterpriseInfo.address }}
          </el-col>
          <el-col :span="24">
            营业执照：<el-button type="text" @click="previewImage(enterpriseInfo.businessLicense)">查看</el-button>
          </el-col>
          <el-col :span="24">
            开票信息：<el-button type="text" @click="previewImage(enterpriseInfo.invoiceInfo)">查看</el-button>
          </el-col>
          <el-col :span="24">
            合同信息：<el-button type="text" @click="previewImage(enterpriseInfo.contract)">查看</el-button>
          </el-col>
          <el-col :span="24">
            收件人电话：{{ enterpriseInfo.telephone }}
          </el-col>
          <!-- <el-col :span="12">
            公司税号：{{ enterpriseInfo.taxNumber }}
          </el-col>
          <el-col :span="12">
            开户银行：{{ enterpriseInfo.bankName }}
          </el-col>
          <el-col :span="12">
            对公账户：{{ enterpriseInfo.bankcardNo }}
          </el-col> -->
          <el-col :span="24">
            认证状态：<el-tag :type="enterpriseInfo.auditStatus === 'P' ? 'success' : 'info'">{{ enterpriseInfo.auditStatus === 'P' ? '已认证' : '未认证' }}</el-tag>
          </el-col>
        </el-row>
      </el-dialog>

      <preview-image :visible.sync="previewWrapperShow" :img-src="previewImageUrl"></preview-image>

      <el-dialog
        v-model="refuseDialogVisible"
        size="tiny"
        :close-on-click-modal="false">
        <el-form ref="refuseForm" :model="refuseParam" :rules="refuseRules">
          <el-form-item prop="feedback">
            <el-input v-model="refuseParam.feedback" auto-complete="off" type="textarea" :rows="2" placeholder="请填写拒绝原因">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="info" @click="confirmRefuse">提 交</el-button>
			      <el-button type="warning" @click="cancelRefuse">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-dialog
        v-model="sendDialogVisible"
        size="tiny"
        :close-on-click-modal="false">
        <el-form ref="sendForm" :model="sendParam" :rules="sendRules">
          <el-form-item prop="trackNumber">
            <el-input v-model="sendParam.trackNumber" auto-complete="off">
              <template slot="prepend">快递单号</template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="info" @click="confirmSend">提 交</el-button>
			      <el-button type="warning" @click="cancelSend">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>
<script>
import customTable from '../plugin/table'
import previewImage from '../plugin/previewImage'
import { invoiceQuery, invoiceUpdate } from '../../vuex/action'

export default {
  components: {
    customTable,
    previewImage
  },

  vuex: {
    actions: {
      invoiceQuery,
      invoiceUpdate
    }
  },

  data () {
    return {
      activeName: 'first',
      loading: false,
      invoiceList: [],
      pagination: {
        pageSize: 15,
        page: 1,
        total: 0
      },
      query: {
        enterpriseName: '',
        status: ''
      },
      enterpriseInfoDialogVisible: false,
      enterpriseInfo: {
        enterpriseName: '',
        address: '',
        businessLicense: '',
        invoiceInfo: '',
        contract: '',
        telephone: '',
        taxNumber: '',
        bankName: '',
        bankcardNo: '',
        auditStatus: ''
      },
      refuseDialogVisible: false,
      sendDialogVisible: false,
      refuseParam: {
        feedback: '',
        invoiceId: '',
        status: 'REFUSE'
      },
      refuseRules: {
        feedback: [
          { required: true, message: '拒绝原因不可为空', trigger: 'input' }
        ]
      },
      sendParam: {
        trackNumber: '',
        invoiceId: '',
        status: 'SEND'
      },
      sendRules: {
        trackNumber: [
          { required: true, message: '运单号不可为空', trigger: 'input' }
        ]
      },
      passParam: {
        invoiceId: '',
        status: 'PASSED'
      },
      previewImageUrl: '',
      previewWrapperShow: false,
      columns: [
        {
          field: 'enterpriseName',
          name: '企业名称'
        }, {
          field: 'invoiceAmount',
          name: '开票金额'
        }, {
          field: 'invoiceTime',
          name: '开票时间段',
          formatter: this.dateFormat
        }, {
          field: 'status',
          name: '订单状态',
          render: (h, params) => {
            const classMapping = {
              'APPLY': '',
              'WAIT': '',
              'PASSED': 'success',
              'REFUSE': 'danger',
              'SEND': 'warning',
              'COMPLETE': 'success'
            }
            const statusMapping = {
              'APPLY': '申请中',
              'WAIT': '已查看',
              'PASSED': '已通过',
              'REFUSE': '已拒绝',
              'SEND': '已邮寄',
              'COMPLETE': '已完成'
            }
            return h('el-tag', {
              props: {
                type: classMapping[params.row.status]
              }
            }, statusMapping[params.row.status])
          }
        }, {
          field: 'trackNumber',
          name: '运单号'
        }, {
          field: 'description',
          name: '描述'
        }, {
          field: 'feedback',
          name: '反馈'
        }, {
          field: 'enterprise',
          name: '企业信息',
          render: (h, params) => {
            return h('el-button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  this.viewEnterpriseInfo(params.row)
                }
              }
            }, '查看')
          }
        }, {
          field: 'createTime',
          name: '申请时间',
          formatter: this.dateFormat
        }, {
          field: 'operate',
          name: '操作',
          width: 140,
          render: (h, params) => {
            let row = params.row
            if (row.status === 'APPLY' || row.status === 'WAIT') {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: {
                      size: 'small',
                      type: 'danger'
                    },
                    on: {
                      click: () => {
                        this.refuseInvoice(row)
                      }
                    }
                  },
                  '拒绝'
                ),
                h(
                  'el-button',
                  {
                    props: {
                      size: 'small',
                      type: 'success'
                    },
                    on: {
                      click: () => {
                        this.passInvoice(row)
                      }
                    }
                  },
                  '通过'
                )
              ])
            }
            if (row.status === 'PASSED') {
              return h(
                'el-button',
                {
                  props: {
                    size: 'small',
                    type: 'warning'
                  },
                  on: {
                    click: () => {
                      this.sendInvoice(row)
                    }
                  }
                },
                '邮寄'
              )
            }
            return h('div')
          }
        }
      ]
    }
  },

  created () {
    this.search()
  },

  methods: {
    previewImage (url) {
      if (!url) {
        return this.$message({
          message: '无图片',
          type: 'warning'
        })
      }
      this.previewImageUrl = `http://zeuskx-mina-prod.oss-cn-beijing.aliyuncs.com/${url}`
      this.previewWrapperShow = true
    },

    dateFormat (row, column) {
      if (!row[column.property]) {
        return ''
      } else {
        return new Date(parseInt(row[column.property])).formatDate('yyyy-MM-dd hh:mm')
      }
    },

    search () {
      this.pagination.page = 1
      this.queryInvoiceList()
    },

    async queryInvoiceList () {
      this.loading = true
      const response = await this.invoiceQuery(Object.assign({}, this.query, this.pagination))
      this.loading = false
      this.invoiceList = response.row
      this.pagination.total = response.totalCount
    },

    onPageChange (page) {
      this.pagination.page = page
      this.search()
    },

    viewEnterpriseInfo (row) {
      this.enterpriseInfo.enterpriseName = row.enterpriseName
      this.enterpriseInfo.address = row.address
      this.enterpriseInfo.businessLicense = row.businessLicense
      this.enterpriseInfo.invoiceInfo = row.invoiceInfo
      this.enterpriseInfo.contract = row.contract
      this.enterpriseInfo.telephone = row.telephone
      this.enterpriseInfo.taxNumber = row.taxNumber
      this.enterpriseInfo.bankName = row.bankName
      this.enterpriseInfo.bankcardNo = row.bankcardNo
      this.enterpriseInfo.auditStatus = row.auditStatus

      this.enterpriseInfoDialogVisible = true
    },

    refuseInvoice (row) {
      this.refuseDialogVisible = true
      this.refuseParam.invoiceId = row.invoiceId
    },

    passInvoice (row) {
      this.passParam.invoiceId = row.invoiceId
      this.$confirm('确认通过开票请求?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        class: 'LDW'
      }).then(async () => {
        await this.invoiceUpdate(this.passParam)
        this.queryInvoiceList()
      })
    },

    sendInvoice (row) {
      this.sendDialogVisible = true
      this.sendParam.invoiceId = row.invoiceId
    },

    confirmRefuse () {
      this.$refs.refuseForm.validate(async valid => {
        if (!valid) return
        this.loading = true
        await this.invoiceUpdate(this.refuseParam)
        this.loading = false
        this.refuseDialogVisible = false
        this.queryInvoiceList()
        return this.$message({
          message: '拒绝发票请求成功',
          type: 'success'
        })
      })
    },

    confirmSend () {
      this.$refs.sendForm.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        await this.invoiceUpdate(this.sendParam)
        this.loading = false
        this.sendDialogVisible = false
        this.queryInvoiceList()
        return this.$message({
          message: '补充邮寄信息成功',
          type: 'success'
        })
      })
    },

    cancelRefuse () {
      this.$refs.refuseForm.resetFields()
      this.$nextTick(() => {
        this.refuseDialogVisible = false
      })
    },

    cancelSend () {
      this.$refs.sendForm.resetFields()
      this.$nextTick(() => {
        this.sendDialogVisible = false
      })
    }
  }
}
</script>
