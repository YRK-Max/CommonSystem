<template>
  <div class="p-2 overflow-hidden h-full flex" style="background: #ebeef3">
    <div calss="h-full" style="width: 300px; margin-right: 6px">
        <el-card class="h-full" body-style="display: flex; flex-direction: column; height: 100%; overflow: hidden">
            <el-form
                label-position="top"
            >
                <el-form-item label="所属分组">
                    <QuerySelect
                        v-model="form.sqlType"
                        method="post"
                        :isRemote="true"
                        :params="{ sql_name: 'getSqlType' }"
                        :option-config="{ label: 'belong', value: 'belong' }"
                        @change="handleTypeChange"
                    />
                </el-form-item>
            </el-form>
            <div class="flex justify-between h-8 items-center">
              <label style="font-size: 14px">
                  SQL 列表
              </label>
              <div class="flex">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="添加sql"
                  placement="bottom-start"
                >
                  <YIcon :size="14" icon="yiconjia" @click="handleAddSql" />
                </el-tooltip>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="刷新"
                  placement="bottom-start"
                >
                  <YIcon class="ml-2" :size="14" icon="yiconshuaxin" @click="initSqlList" />
                </el-tooltip>
              </div>
            </div>
            <div class="flex-1 overflow-auto pr-1">
                <div v-if="sqlList.source.length === 0" style="color: #426cb9" class="h-full flex items-center justify-center">
                  <div>
                    <YIcon class="loading" icon="yiconloading" color="#426cb9" :size="25" />
                    加载中....
                  </div>
                </div>
                <div v-for="sql in sqlList.displayList" class="sql-div mb-1 p-1" :class="[ currentSQL['sql_name'] === sql['sql_name']?'selected':'' ]" :key="sql['sql_name']" @click="handleSQLSelected(sql)">
                    <label>{{ sql.sql_name }}</label>
                    <label class="mt-2">所属：{{ sql.belong }}</label>
                    <label class="mt-1">更新时间：{{ sql.update_time }}</label>
                    <label class="mt-1">描述：{{ sql.description }}</label>
                </div>
            </div>
        </el-card>
    </div>
    <div class="h-full" style="width: calc(100% - 306px)">
        <div class="mb-2 flex">
          <el-button
            v-if="!isEdit && !isAdd"
            size="small"
            type="primary"
            color="#426cb9"
            :disabled="!currentSQL.sql_str"
            @click="handleSubmitExecuteSQL"
          >
            <template #icon>
              <YIcon icon="yiconzhihang" :size="11"></YIcon>
            </template>
            执行
          </el-button>
          <el-input v-if="isAdd" v-model="editForm.sql_name" class="ml-2 w-50" size="small" placeholder="sql_name"></el-input>
          <el-button v-if="isEdit || isAdd" class="ml-2" size="small" @click="handleSaveSql">
            <template #icon>
              <YIcon icon="yiconbaocun" :size="14"></YIcon>
            </template>
            保存
          </el-button>
        </div>
        <el-card class="h-2/4 mb-2" body-style="height: 100%">
          <div class="h-full w-full flex flex-col">
            <MonacoEditor class="flex-1 w-full" type="sql" :codeText="currentSQL.sql_str" @change="handleSqlChange" />
            <el-form  class="mt-2" :label-width="80" label-position="left">
              <el-form-item label="所属分组">
                <QuerySelect
                    v-model="editForm.belong"
                    :isRemote="true"
                    method="post"
                    :params="{ sql_name: 'getSqlType' }"
                    :option-config="{ label: 'belong', value: 'belong' }"
                />
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="editForm.description" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card style="height: calc(50% - 68px)" body-style="height: 100%; padding: 0 !important">
          <DataTable
            title="查询结果"
            :showToolbar="true"
            :loading="tableConfig.loading"
            :columns="tableConfig.columns"
            :data="tableConfig.datasource"
          />
        </el-card>
        <div class="sql-info flex justify-between items-center">
          <div class="flex items-center">
            <div :style="{ background: linkState==='连接中...'?'#ff7f50':'#7bed9f' }" class="link-state"></div>
            <div>{{ linkState }}</div>
          </div>
          <div>查询用时: {{ queryUseTime }}s</div>
        </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="参数列表"
    :width="380"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="h-80 overflow-auto">
      <el-form :model="paramsForm" label-width="80px" label-position="left">
        <el-form-item v-for="param in uniqueParams" :key="param" :label="param">
          <el-input v-model="paramsForm[param]" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleQueryCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleQuerySubmit"
        >
          查询
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import QuerySelect from '@/components/QuerySelect/index.vue'
import { executeSQL, insertSql, updateSql } from '@/api/server'
import YIcon from '@/components/YIcon.vue'
import DataTable from '@/components/DataTable.vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  setup() {
    const form = reactive({
      sqlType: ''
    })
    const paramsForm = reactive({})
    const uniqueParams = reactive([])
    const sqlList = reactive({
      source: [],
      displayList: []
    })
    const currentSQL = reactive({})
    const editForm = reactive({
      sql_name: '',
      sql_str: '',
      belong: '',
      description: ''
    })
    const tableConfig = reactive({
      loading: false,
      columns: [],
      datasource: []
    })
    const linkState = ref('连接中...')
    const linkStateColor = ref('#ff7f50')
    const queryUseTime = ref(0)
    const isEdit = ref(false)
    const isAdd = ref(false)
    const dialogVisible = ref(false)

    const handleTypeChange = (data) => {
      if (data.value) {
        sqlList.displayList = sqlList.source.filter(s => { return s['belong'] === data.value })
      } else {
        sqlList.displayList = sqlList.source
      }
    }

    const handleSQLSelected = (sql) => {
      currentSQL.sql_name = editForm.sql_name = sql.sql_name
      currentSQL.sql_str = editForm.sql_str = sql.sql_str
      currentSQL.belong = editForm.belong = sql.belong
      currentSQL.description = editForm.description = sql.description
      isEdit.value = false
    }

    const handleSubmitExecuteSQL = async() => {
      tableConfig.loading = true
      uniqueParams.length = 0
      const waitExeSqlStr = currentSQL.sql_str
      const paramsArray = waitExeSqlStr.match(/(?<=#{).*?(?=})/g)
      uniqueParams.push(...new Set(paramsArray))
      if (uniqueParams.length > 0) {
        dialogVisible.value = true
      } else {
        handleExecuteSQL()
      }
    }

    const handleExecuteSQL = (params = {}) => {
      const startTime = new Date()
      executeSQL({ sql_name: currentSQL.sql_name, ...params }).then(res => {
        if (res && res['data']) {
          const data = res['data']
          if (data.length > 0) {
            const first = data[0]
            const cols = []
            Object.keys(first).forEach(col => {
              cols.push({ title: col, field: col, align: 'center', width: 150, showOverflow: true })
            })
            tableConfig.columns = cols
          }
          tableConfig.datasource = data
          tableConfig.loading = false
        }
        queryUseTime.value = ((new Date()) - startTime) / 1000
      }).catch(err => {
        tableConfig.columns = []
        tableConfig.datasource = []
        tableConfig.loading = false
        console.log(err)
      })
    }

    const handleSqlChange = (sql_str) => {
      if (sql_str !== currentSQL.sql_str) {
        isEdit.value = true
        editForm.sql_str = sql_str
      } else {
        isEdit.value = false
      }
    }

    const handleSaveSql = () => {
      if (isAdd) {
        insertSql(editForm).then(res => {
          if (res && res['code'] === 200) {
            ElMessage.success(res['msg'])
            isAdd.value = false
            isEdit.value = false
            initSqlList()
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        updateSql(editForm).then(res => {
          if (res && res['code'] === 200) {
            ElMessage.success(res['msg'])
            isEdit.value = false
            initSqlList()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }

    const handleAddSql = () => {
      isAdd.value = true
      currentSQL.sql_name = editForm.sql_name = ''
      currentSQL.sql_str = editForm.sql_str = ''
      currentSQL.belong = editForm.belong = ''
      currentSQL.description = editForm.description = ''
    }

    const initSqlList = () => {
      sqlList.source = []
      sqlList.displayList = []
      executeSQL({ sql_name: 'getSqlList' }).then(res => {
        if (res && res['code'] === 200) {
          linkState.value = '连接成功'
          linkStateColor.value = '#7bed9f'
          sqlList.source.length = 0
          sqlList.source.push(...res['data'])
          sqlList.displayList = sqlList.source
        } else {
          linkState.value = '连接失败'
          linkStateColor.value = '#ff4757'
        }
      })
    }

    const handleQueryCancel = () => {
      dialogVisible.value = false
      tableConfig.columns = []
      tableConfig.datasource = []
      tableConfig.loading = false
    }

    const handleQuerySubmit = () => {
      dialogVisible.value = false
      handleExecuteSQL(paramsForm)
    }

    watch(editForm, (val) => {
      if (currentSQL.belong !== val.belong || currentSQL.description !== val.description || currentSQL.sql_str !== val.sql_str) {
        isEdit.value = true
      } else {
        isEdit.value = false
      }
    })

    nextTick(() => {
      initSqlList()
    })

    return {
      form,
      paramsForm,
      uniqueParams,
      sqlList,
      currentSQL,
      editForm,
      tableConfig,
      linkState,
      linkStateColor,
      queryUseTime,
      isEdit,
      isAdd,
      dialogVisible,
      handleTypeChange,
      handleSQLSelected,
      handleSubmitExecuteSQL,
      handleSqlChange,
      handleSaveSql,
      handleAddSql,
      initSqlList,
      handleQueryCancel,
      handleQuerySubmit,
      handleExecuteSQL
    }
  },
  components: { MonacoEditor, QuerySelect, YIcon, DataTable }
})
</script>
<style lang="scss" scoped>
.sql-div {
  font-size: 13px;
  height: 30px;
  border: 1px solid #426cb9;
  border-radius: 4px;
  transition: all 0.5s;
  overflow: hidden;

  label {
    display: block;
  }
}
.sql-div:hover {
  height: 122px;
  background: #677fac;
  color: white;
}
.selected {
  height: 122px;
  background: #426cb9;
  color: white;
}
.loading{
  animation:load 1.1s infinite linear;
}
@keyframes load{
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
.sql-info {
  height: 21px;
  background: #9aa7b1;
  margin: 4px 3px 0 3px;
  padding: 0 3px;
  font-size: 10px;
  color: white;
  border-radius: 2px;

  .link-state {
    height: 8px;
    width: 8px;
    background: #c0c0c0;
    margin-right: 5px;
    border-radius: 50%;
  }
}
</style>
