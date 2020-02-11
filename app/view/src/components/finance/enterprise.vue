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
					<el-row :gutter="6">
						<el-col :span="12">
							<el-form-item prop="address">
								<el-input v-model="authParam.address" auto-complete="off">
									<template slot="prepend">地址</template>
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item prop="telephone">
								<el-input v-model="authParam.telephone" auto-complete="off">
									<template slot="prepend">电话</template>
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item prop="taxNumber">
								<el-input v-model="authParam.taxNumber" auto-complete="off">
									<template slot="prepend">税号</template>
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item prop="bankName">
								<el-input v-model="authParam.bankName" auto-complete="off">
									<template slot="prepend">开户行</template>
								</el-input>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item prop="bankcardNo">
								<el-input v-model="authParam.bankcardNo" auto-complete="off">
									<template slot="prepend">对公账号</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>

				<el-button :loading="loading" type="info" @keyup.enter.native="submitAuth" @click="submitAuth" class="dialog-item float-right">提 交</el-button>
				<el-button type="warning" @click="authCancel" class="dialog-item float-right">取 消</el-button>
			</el-dialog>
    </div>
</template>
<script>
	import customTable from '../plugin/table'
	import previewImage from '../plugin/previewImage'
	import { enterpriseQuery, enterpriseAuth } from '../../vuex/action'
	
	export default {
	  name: 'enterprise-list',
	
	  components: {
	    customTable,
	    previewImage
	  },
	
	  vuex: {
	    actions: {
	      enterpriseQuery,
	      enterpriseAuth
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
	        taxNumber: '',
	        bankName: '',
	        bankcardNo: ''
	      },
	      authDialogVisible: false,
	      columns: [{
	        field: 'enterpriseName',
	        name: '公司名字'
	      }, {
	        field: 'address',
	        name: '公司地址'
	      }, {
	        field: 'businessLicense',
	        name: '营业执照',
	        render: (h, params) => {
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
	      }, {
	        field: 'telephone',
	        name: '企业电话'
	      }, {
	        field: 'taxNumber',
	        name: '企业税号'
	      }, {
	        field: 'bankName',
	        name: '开户行'
	      }, {
	        field: 'bankcardNo',
	        name: '对公账号'
	      }, {
	        field: 'createTime',
	        name: '创建时间',
	        width: 140,
	        formatter: this.dateFormat
	      }, {
	        field: 'operate',
	        name: '操作',
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
	          }, '认证')
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
	
	    async queryEnterprise () {
	      this.loading = true
	      const response = await this.enterpriseQuery(Object.assign({}, this.query, this.pagination))
	      this.loading = false
	      this.enterpriseList = response.row
	      this.pagination.total = response.totalCount
	    },
	
	    onPageChange (page) {
	      this.pagination.page = page
	      this.search()
	    },

	    openAuthDialog (row) {
	      this.authDialogVisible = true
	      this.authParam.enterpriseId = row.enterpriseId
	      this.authParam.address = row.address
	      this.authParam.telephone = row.telephone
	      this.authParam.taxNumber = row.taxNumber
	      this.authParam.bankName = row.bankName
	      this.authParam.bankcardNo = row.bankcardNo
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
