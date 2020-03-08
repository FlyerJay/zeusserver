<template>
	<div class="enterprise-list">
		<el-form ref="queryForm" :model="query" inline size="mini">
			<el-form-item label="公司名称" prop="enterpriseName">
				<el-input v-model="query.enterpriseName" auto-complete="off"></el-input>
			</el-form-item>

			<el-form-item label="认证状态" prop="auditStatus">
				<el-select v-model="query.auditStatus">
					<el-option label="全部" value=""></el-option>
					<el-option label="未认证" value="U"></el-option>
					<el-option label="已认证" value="P"></el-option>
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
			:data="enterpriseList"
			:columns="columns"
			@current-change="onPageChange"
			:pageSize="pagination.pageSize"
			:total="pagination.total">
		</custom-table>

		<preview-image :visible.sync="previewWrapperShow" :img-src="previewImageUrl"></preview-image>

		<el-dialog
			v-model="authDialogVisible"
			:close-on-click-modal="false">
			<el-form ref="authForm" class="auth-form" :model="authParam">
				<el-form-item prop="enterpriseName">
					<el-input v-model="authParam.enterpriseName" auto-complete="off">
						<template slot="enterpriseName">公司名称</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="address">
					<el-input v-model="authParam.address" auto-complete="off">
						<template slot="prepend">邮寄地址</template>
					</el-input>
				</el-form-item>

				<el-form-item prop="telephone">
					<el-input v-model="authParam.telephone" auto-complete="off">
						<template slot="prepend">收件人电话</template>
					</el-input>
				</el-form-item>

        <el-form-item prop="telephone">
					<el-input v-model="authParam.taxNumber" auto-complete="off">
						<template slot="prepend">企业税号</template>
					</el-input>
				</el-form-item>

        <el-form-item prop="telephone">
					<el-input v-model="authParam.addr" auto-complete="off">
						<template slot="prepend">企业地址</template>
					</el-input>
				</el-form-item>

        <el-form-item prop="telephone">
					<el-input v-model="authParam.tel" auto-complete="off">
						<template slot="prepend">企业电话</template>
					</el-input>
				</el-form-item>

        <el-form-item prop="telephone">
					<el-input v-model="authParam.bankName" auto-complete="off">
						<template slot="prepend">开户银行</template>
					</el-input>
				</el-form-item>

        <el-form-item prop="telephone">
					<el-input v-model="authParam.bankcardNo" auto-complete="off">
						<template slot="prepend">对公账号</template>
					</el-input>
				</el-form-item>
			</el-form>

			<el-button :loading="loading" type="info" @keyup.enter.native="submitAuth" @click="submitAuth" class="dialog-item float-right">提 交</el-button>
			<el-button type="warning" @click="authCancel" class="dialog-item float-right">取 消</el-button>
		</el-dialog>

		<el-dialog
        title="企业信息"
        size="small"
        v-model="enterpriseInfoDialogVisible"
        :close-on-click-modal="false">
        <el-row :gutter="8" style="line-height: 40px">
          <el-col :span="24">
            企业名称：{{ enterpriseInfo.enterpriseName }}
            <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.enterpriseName)">复制</el-button>
          </el-col>
          <el-col :span="24">
            邮寄地址：{{ enterpriseInfo.address }}
          </el-col>
          <el-col :span="24">
            收件人电话：{{ enterpriseInfo.telephone }}
          </el-col>
          <template v-if="enterpriseInfo.taxNumber">
            <el-col :span="24">
              企业税号：{{ enterpriseInfo.taxNumber }}
              <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.taxNumber)">复制</el-button>
            </el-col>
            <el-col :span="24">
              企业地址：{{ enterpriseInfo.addr }}
              <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.addr)">复制</el-button>
            </el-col>
            <el-col :span="24">
              企业电话：{{ enterpriseInfo.tel }}
              <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.tel)">复制</el-button>
            </el-col>
            <el-col :span="24">
              开户银行：{{ enterpriseInfo.bankName }}
              <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.bankName)">复制</el-button>
            </el-col>
            <el-col :span="24">
              对公账户：{{ enterpriseInfo.bankcardNo }}
              <el-button type="primary" plain size="small" class="clipboard-btn" @click="copy(enterpriseInfo.bankcardNo)">复制</el-button>
            </el-col>
          </template>
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
            认证状态：<el-tag :type="enterpriseInfo.auditStatus === 'P' ? 'success' : 'info'">{{ enterpriseInfo.auditStatus === 'P' ? '已认证' : enterpriseInfo.auditStatus === 'D' ? '已删除' : '未认证' }}</el-tag>
          </el-col>

          <el-button v-if="!enterpriseInfo.taxNumber" :loading="loading" type="info" @click="completeEnterprize" class="dialog-item float-right">使用企查查完善企业信息</el-button>
        </el-row>
      </el-dialog>
	</div>
</template>
<script>
	import customTable from '../plugin/table'
	import previewImage from '../plugin/previewImage'
	import { enterpriseQuery, enterpriseAuth, appendTaxNumber } from '../../vuex/action'
	
	export default {
	  name: 'enterprise-list',
	
	  components: {
	    customTable,
	    previewImage
	  },
	
	  vuex: {
	    actions: {
	      enterpriseQuery,
	      enterpriseAuth,
	      appendTaxNumber
	    }
	  },
	
	  data () {
	    return {
	      loading: false,
	      enterpriseList: [],
	      pagination: {
	        pageSize: 15,
	        page: 1,
	        total: 0
	      },
	      previewImageUrl: '',
	      previewWrapperShow: false,
	      query: {
	        enterpriseName: '',
	        auditStatus: ''
	      },
	      authParam: {
	        enterpriseId: '',
	        address: '',
	        telephone: '',
	        enterpriseName: '',
        taxNumber: '',
        addr: '',
        tel: '',
	        bankName: '',
	        bankcardNo: ''
	      },
	      authDialogVisible: false,
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
        auditStatus: '',
        addr: '',
        tel: '',
        enterpriseId: ''
      },
	      columns: [{
	        field: 'enterpriseName',
	        name: '企业名字'
	      }, {
	        field: 'address',
	        name: '邮寄地址'
	      }, {
	        field: 'telephone',
	        name: '收件人电话'
	      }, {
	        field: 'businessLicense',
	        name: '营业执照',
	        render: (h, params) => {
          if (!params.row.businessLicense) {
            return h('el-button', {
              props: {
                type: 'text',
                size: 'small',
                disabled: true
              }
            }, '无图片')
          }
	          return h('el-button', {
	            props: {
	              type: 'text',
	              size: 'small'
	            },
	            on: {
	              click: () => {
	                if (!params.row.businessLicense) {
	                  return this.$message({
	                    message: '无图片',
	                    type: 'warning'
	                  })
	                }
	                this.previewImage(`http://zeuskx-mina-prod.oss-cn-beijing.aliyuncs.com/${params.row.businessLicense}`)
	              }
	            }
	          }, '查看图片')
	        }
	      }, {
	        field: 'invoiceInfo',
	        name: '开票信息',
	        render: (h, params) => {
          if (!params.row.invoiceInfo) {
            return h('el-button', {
              props: {
                type: 'text',
                size: 'small',
                disabled: true
              }
            }, '无图片')
          }
	          return h('el-button', {
	            props: {
	              type: 'text',
	              size: 'small'
	            },
	            on: {
	              click: () => {
	                if (!params.row.invoiceInfo) {
	                  return this.$message({
	                    message: '无图片',
	                    type: 'warning'
	                  })
	                }
	                this.previewImage(`http://zeuskx-mina-prod.oss-cn-beijing.aliyuncs.com/${params.row.invoiceInfo}`)
	              }
	            }
	          }, '查看图片')
	        }
	      }, {
	        field: 'contract',
	        name: '合同信息',
	        render: (h, params) => {
          if (!params.row.contract) {
            return h('el-button', {
              props: {
                type: 'text',
                size: 'small',
                disabled: true
              }
            }, '无图片')
          }
	          return h('el-button', {
	            props: {
	              type: 'text',
	              size: 'small'
	            },
	            on: {
	              click: () => {
	                if (!params.row.contract) {
	                  return this.$message({
	                    message: '无图片',
	                    type: 'warning'
	                  })
	                }
	                this.previewImage(`http://zeuskx-mina-prod.oss-cn-beijing.aliyuncs.com/${params.row.contract}`)
	              }
	            }
	          }, '查看图片')
	        }
      },
      {
        field: 'detail',
        name: '查看详情',
        render: (h, params) => {
          return h('el-button', {
            props: {
              type: 'text',
              size: 'small'
            },
            on: {
              click: () => {
                this.viewEnterpriseInfo(params.row)
              }
            }
          }, '查看')
        }
      },
	      {
	        field: 'createTime',
	        name: '创建时间',
	        width: 140,
	        formatter: this.dateFormat
	      },
	      {
	        field: 'auditStatus',
	        name: '认证状态',
	        render: (h, params) => {
	          const typeMapping = {
	            'P': 'success',
	            'U': 'info',
	            'D': 'info'
	          }
	          const textMapping = {
	            'P': '已认证',
	            'U': '未认证',
	            'D': '已删除'
	          }
	          return h('el-tag', {
	            props: {
	              type: typeMapping[params.row.auditStatus]
	            }
	          }, textMapping[params.row.auditStatus])
	        }
	      },
	      {
	        field: 'operate',
	        name: '操作',
	        width: 105,
	        render: (h, params) => {
	          return h('el-button', {
	            props: {
	              type: 'warning',
	              size: 'small'
	            },
	            on: {
	              click: () => {
	                this.openAuthDialog(params.row)
	              }
	            }
	          }, params.row.auditStatus === 'U' ? '认证' : '修改信息')
	        }
	      }]
	    }
	  },
	
	  created () {
	    this.search()
	  },
	
	  methods: {
	    previewImage (url) {
	      this.previewImageUrl = url
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
	      this.queryEnterprise()
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
      this.enterpriseInfo.addr = row.addr
      this.enterpriseInfo.tel = row.tel
      this.enterpriseInfo.enterpriseId = row.enterpriseId

      this.enterpriseInfoDialogVisible = true
    },

    async completeEnterprize () {
      try {
        this.loading = true
        const response = await this.appendTaxNumber({
          name: this.enterpriseInfo.enterpriseName,
          enterpriseId: this.enterpriseInfo.enterpriseId
        })
        this.loading = false
        this.enterpriseInfo.taxNumber = response.taxNumber
        this.enterpriseInfo.bankName = response.bankName
        this.enterpriseInfo.bankcardNo = response.bankcardNo
        this.enterpriseInfo.addr = response.addr
        this.enterpriseInfo.tel = response.tel
        this.queryEnterprise()
      } finally {
        this.loading = false
      }
    },
	
	    async queryEnterprise () {
	      this.loading = true
	      const response = await this.enterpriseQuery(Object.assign({}, this.query, this.pagination))
	      this.loading = false
	      this.enterpriseList = response.row
	      this.pagination.total = response.totalCount
	    },
	
	    onPageChange (page) {
	      this.pagination.page = page
	      this.queryEnterprise()
	    },

	    openAuthDialog (row) {
	      this.authDialogVisible = true
	      this.authParam.enterpriseId = row.enterpriseId
	      this.authParam.address = row.address
	      this.authParam.telephone = row.telephone
      this.authParam.enterpriseName = row.enterpriseName
	      this.authParam.taxNumber = row.taxNumber
	      this.authParam.bankName = row.bankName
      this.authParam.bankcardNo = row.bankcardNo
      this.authParam.addr = row.addr
      this.authParam.tel = row.tel
	    },
	
	    auth () {
	      this.enterpriseAuth()
	    },

	    async submitAuth () {
	      this.loading = true
	      await this.enterpriseAuth(this.authParam)
	      this.loading = false
	      this.authDialogVisible = false
	      this.$message({
	        message: '企业认证成功',
	        type: 'success'
	      })
	      this.queryEnterprise()
	    },
	
	    authCancel () {
	      this.authDialogVisible = false
	    }
	  }
	}
</script>
<style lang="less" scoped>
	.enterprise-list {
		.custom-dialog {
			.spec-wrap {
				border: 1px solid #eaeefb;
				padding: 15px;
				box-shadow: 1px 1px 1px 1px #e5e7ef;
			}

			.detailview {
				width: auto;
			}

			.demand-dlg {
				width: 840px;
			}
    }
	}
</style>
