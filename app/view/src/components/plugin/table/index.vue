<template>
    <div class="filter-table">
        <div class="field-filter" v-if="setting">
            <i class="el-icon-setting field-setting" @click="settingFields = !settingFields">设置</i>
            <transition name="el-zoom-in-top">
                <el-checkbox-group v-model="fields" v-if="settingFields" class="field-check-list">
                    <template v-for="(item,index) in columns">
                        <el-checkbox
                            :key="index"
                            v-if="item.name"
                            :label="item.name"
                            @change="checkChangeHandler"
                            :disabled="item.disabled">{{item.name}}</el-checkbox>
                    </template>
                </el-checkbox-group>
            </transition>
        </div>
        <el-table
            :data="data"
            :stripe="stripe"
            :height="height"
            :border="border"
            :fit="fit"
            :maxHeight="maxHeight"
            :size="size"
            :showHeader="showHeader"
            :highlightCurrentRow="highlightCurrentRow"
            :currentRowKey="currentRowKey"
            :rowClassName="rowClassName"
            :rowStyle="rowStyle"
            :cellClassName="cellClassName"
            :cellStyle="cellStyle"
            :headerRowClassName="headerRowClassName"
            :headerRowStyle="headerRowStyle"
            :headerCellClassName="headerCellClassName"
            :headerCellStyle="headerCellStyle"
            :rowKey="rowKey"
            :emptyText="emptyText"
            :defaultExpandAll="defaultExpandAll"
            :expandRowKeys="expandRowKeys"
            :defaultSort="defaultSort"
            :tooltipEffect="tooltipEffect"
            :showSummary="showSummary"
            :sumText="sumText"
            :summaryMethod="summaryMethod"
            :spanMethod="spanMethod"
            :selectOnIndeterminate="selectOnIndeterminate"
            @select="select"
            @select-all="selectAll"
            @selection-change="selectionChange"
            @cell-mouse-enter="cellMouseEnter"
            @cell-mouse-leave="cellMouseLeave"
            @cell-click="cellClick"
            @cell-dblclick="cellDblclick"
            @row-click="rowClick"
            @row-contextmenu="rowContextmenu"
            @row-dblclick="rowDblclick"
            @header-click="headerClick"
            @header-contextmenu="headerContextmenu"
            @sort-change="sortChange"
            @filter-change="filterChange"
            @current-change="currentChange"
            @header-dragend="headerDragend"
            @expand-change="expandChange"
            ref="table">
            <template v-for="(item, index) in columns">
                <template v-if="fields.indexOf(item.name) !== -1">
                    <!-- 使用render方法渲染 -->
                    <template v-if="item.render">
                        <el-table-column
                                :key="index"
                                :type="item.type"
                                :columnKey="item.columnKey"
                                :minWidth="item.minWidth"
                                :label="item.name"
                                :prop="item.field"
                                :fixed="item.fixed"
                                :width="item.width"
                                :sortable="item.sortable"
                                :sortMethod="item.sortMethod"
                                :sortBy="item.sortBy"
                                :sortOrders="item.sortOrders"
                                :resizable="item.resizable"
                                :showOverflowTooltip="item.showOverflowTooltip"
                                :align="item.align"
                                :selectable="item.selectable"
                                :renderHeader="item.renderHeader"
                                :filters="(item.filters && rowFilters(item.field)) || (item.rowFilters && item.rowFilters())"
                                :filterMethod="(item.filters && filterMethod) || item.filterMethod">
                            <template v-slot="scope">
                                <template v-if="item.render">
                                    <table-expand
                                            :row="scope.row"
                                            :column="item"
                                            :index="index"
                                            :render="item.render"></table-expand>
                                </template>
                            </template>
                        </el-table-column>
                    </template>

                    <!-- 一般表格 -->
                    <template v-else>
                        <el-table-column
                                :key="index"
                                :type="item.type"
                                :columnKey="item.columnKey"
                                :minWidth="item.minWidth"
                                :label="item.name"
                                :prop="item.field"
                                :fixed="item.fixed"
                                :width="item.width"
                                :sortable="item.sortable"
                                :sortMethod="item.sortMethod"
                                :sortBy="item.sortBy"
                                :sortOrders="item.sortOrders"
                                :resizable="item.resizable"
                                :showOverflowTooltip="item.showOverflowTooltip"
                                :align="item.align"
                                :selectable="item.selectable"
                                :formatter="item.formatter"
                                :renderHeader="item.renderHeader"
                                :filters="(item.filters && rowFilters(item.field)) || (item.rowFilters && item.rowFilters())"
                                :filterMethod="(item.filters && filterMethod) || item.filterMethod">
                        </el-table-column>
                    </template>
                </template>
            </template>

            <!-- table slot append-->
            <template #append>
                <slot name="append"></slot>
            </template>

            <!-- table slot empty -->
            <template #empty>
                <slot name="empty"></slot>
            </template>
        </el-table>

        <!-- 分页插件 -->
        <el-pagination
            v-if="pagination"
            class="pagination"
            :background="background"
            :layout="layout"
            @current-change="currentChangeHandler"
            @size-change="sizeChangeHandler"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import tableExpand from './expand'
    import md5 from 'blueimp-md5'
    export default {
      name: 'filter-table',

      data () {
        return {
          uuid: md5(this.columns.map(v => {
            return v.name
          }).join()),
          fields: [],
          settingFields: false
        }
      },

      created () {
        this.fields = (localStorage.getItem(this.uuid) && JSON.parse(localStorage.getItem(this.uuid))) || this.columns.map(v => {
          return v.name
        })
      },

      props: {
        setting: { // 是否显示设置
          type: Boolean,
          default: true
        },
        columns: Array, // 列表头定义

            /* table */
        data: {
          type: Array,
          default: () => {
            return []
          }
        }, // 列表数据
        stripe: Boolean, // 斑马
        border: Boolean, // 边框
        fit: {
          type: Boolean,
          default: true
        }, // 宽度自适应
        height: Number || String, // 高度
        maxHeight: Number || String, // 最大高度
        size: String, // 尺寸
        showHeader: {
          type: Boolean,
          default: true
        }, // 显示表头
        highlightCurrentRow: Boolean, // 高亮显示当前行
        currentRowKey: Number || String, // 当前行key
        rowClassName: Function, // 行className回调
        rowStyle: Function, // 行style回调
        cellClassName: Function, // 单元格className回调
        cellStyle: Function, // 单元格style回调
        headerRowClassName: Function, // 表头行className回调
        headerRowStyle: Function, // 表头行style回调
        headerCellClassName: Function, // 表头单元格className回调
        headerCellStyle: Function, // 表头单元格style回调
        rowKey: Function || String, // 设置行key
        emptyText: String, // 为空时默认显示暂无数据
        defaultExpandAll: Boolean, // 默认展开所有行
        expandRowKeys: Array, // 展开key在数组中的行
        defaultSort: Object, // 默认排序
        tooltipEffect: String,
        showSummary: Boolean, // 显示合计
        sumText: String, // 合计行标题
        summaryMethod: Function, // 自定义合计方法
        spanMethod: Function, // 合并行和列的计算方法
        selectOnIndeterminate: {
          type: Boolean,
          default: true
        }, // 表头全选

            /* table-method */

            /* 分页相关 */
        pagination: { // 是否使用分页插件
          type: Boolean,
          default: false
        },
        background: {
          type: Boolean,
          default: true
        },
        layout: {
          type: String,
          default: 'prev, pager, next'
        },
        pageSizes: {
          type: Array,
          default: () => [10, 15, 20, 30, 50, 100]
        },
        pageSize: {
          type: Number,
          default: 10
        },
        total: {
          type: Number,
          default: 0
        }
      },

      components: {
        tableExpand
      },

      methods: {
            // 修复自定义表格不能自适应的问题 --- hack QAQ
        fixFitBug () {
          const _fields = this.fields.slice()
          this.fields.pop()
          this.$nextTick(() => {
            this.fields = _fields
          })
        },
        rowFilters (field) {
          let filters = []
          for (let value of this.data) {
            filters.push(JSON.stringify({ text: value[field], value: value[field] }))
          }
          filters = [...new Set(filters)].map(item => JSON.parse(item))
          return filters
        },
        filterMethod (value, row, column) {
          return value === row[column.property]
        },

            /* extend table method */
        clearSelection (...args) {
          this.$refs.table.clearSelection(...args)
        },

        toggleRowSelection (...args) {
          this.$refs.table.toggleRowSelection(...args)
        },

        toggleAllSelection (...args) {
          this.$refs.table.toggleAllSelection(...args)
        },

        toggleRowExpansion (...args) {
          this.$refs.table.toggleRowExpansion(...args)
        },

        setCurrentRow (...args) {
          this.$refs.table.setCurrentRow(...args)
        },

        clearSort (...args) {
          this.$refs.table.clearSort(...args)
        },

        clearFilter (...args) {
          this.$refs.table.clearFilter(...args)
        },

        doLayout (...args) {
          this.$refs.table.doLayout(...args)
        },

        sort (...args) {
          this.$refs.table.sort(...args)
        },

            /* table event */
        select (...args) {
          this.$emit('select', ...args)
        },

        selectAll (...args) {
          this.$emit('select-all', ...args)
        },

        selectionChange (...args) {
          this.$emit('selection-change', ...args)
        },

        cellMouseEnter (...args) {
          this.$emit('cell-mouse-enter', ...args)
        },

        cellMouseLeave (...args) {
          this.$emit('cell-mouse-leave', ...args)
        },

        cellClick (...args) {
          this.$emit('cell-click', ...args)
        },

        cellDblclick (...args) {
          this.$emit('cell-dblclick', ...args)
        },

        rowClick (...args) {
          this.$emit('row-click', ...args)
        },

        rowContextmenu (...args) {
          this.$emit('row-contextmenu', ...args)
        },

        rowDblclick (...args) {
          this.$emit('row-dblclick', ...args)
        },

        headerClick (...args) {
          this.$emit('header-click', ...args)
        },

        headerContextmenu (...args) {
          this.$emit('header-contextmenu', ...args)
        },

        sortChange (...args) {
          this.$emit('sort-change', ...args)
        },

        filterChange (...args) {
          this.$emit('filter-change', ...args)
        },

        currentChange (...args) {
          this.$emit('current-change-table', ...args)
        },

        headerDragend (...args) {
          this.$emit('header-dragend', ...args)
        },

        expandChange (...args) {
          this.$emit('expand-change', ...args)
        },

        checkChangeHandler () {
          localStorage.setItem(this.uuid, JSON.stringify(this.fields))
          this.$emit('columns-change', this.columns.filter(value => {
            return this.fields.includes(value.name)
          }))
        },

            /* 分页事件 */
        currentChangeHandler (...args) {
          this.$emit('current-change', ...args)
        },

        sizeChangeHandler (...args) {
          this.$emit('size-change', args)
        }
      }
    }
</script>
<style lang="less">
.filter-table{
  .el-table{
    font-size: 14px;
  }
  .field-filter {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .field-setting {
      width: 40px;
      font-size: 12px;
      line-height: 30px;
      margin-right: 30px;
      cursor: pointer;
    }
    .field-check-list {
      flex: 1;
      .el-checkbox__label {
          font-size: 12px;
      }
    }
  }

  .el-pagination{
    padding: 3px 0px;
    text-align: right;
    margin-top: 20px;
    li.active{
      background-color: #f7ba2a;
      border-color: #f7ba2a;
      &:hover{
        background-color: #f7ba2a;
        border-color: #f7ba2a;
        color: #fff;
      }
    }
    li:hover{
        color: #f7ba2a;
    }
  }
}
</style>
