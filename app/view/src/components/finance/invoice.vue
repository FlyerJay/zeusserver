<template>
    <div class="invoice-list">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="未审核" name="first">
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
        </el-tab-pane>

        <el-tab-pane label="已审核" name="second">
        </el-tab-pane>
      </el-tabs>
    </div>
</template>
<script>
import customTable from '../plugin/table'
export default {
  components: {
    customTable
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
      columns: [

      ]
    }
  },

  methods: {
    onPageChange (page) {

    }
  }
}
</script>
