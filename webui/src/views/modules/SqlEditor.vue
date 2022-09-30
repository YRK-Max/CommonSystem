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
                                :isRemote="true"
                                method="post"
                                :params="{ sql_name: 'getSqlType' }"
                                :option-config="{ label: 'belong', value: 'belong' }"
                                @change="handleTypeChange"
                            />
                        </el-form-item>
                    </el-form>
                    <label style="font-size: 14px">
                        SQL 列表
                    </label>
                    <div class="flex-1 overflow-auto pr-1">
                        <div v-if="sqlList.length === 0" style="color: #426cb9" class="h-full flex items-center justify-center">
                          <div>
                            <YIcon class="loading" icon="yiconloading" color="#426cb9" :size="25" />
                            加载中....
                          </div>
                        </div>
                        <div v-for="sql in sqlList" class="sql-div mb-1 p-1" :class="[ currentSQL['sql_name'] === sql['sql_name']?'selected':'' ]" :key="sql['sql_name']" @click="handleSQLSelected(sql)">
                            <label>{{ sql.sql_name }}</label>
                            <label class="mt-2">所属：{{ sql.belong }}</label>
                            <label class="mt-1">描述：{{ sql.description }}</label>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="h-full flex-1">
                <div class="mb-2">
                  <el-button
                    size="small"
                    type="primary"
                    color="#426cb9"
                    :disabled="!currentSQL.sql_str"
                    @click="handleExecuteSQL"
                  >
                    <template #icon>
                      <YIcon icon="yiconzhihang" :size="11"></YIcon>
                    </template>
                    执行
                  </el-button>
                  <el-button size="small">
                    <template #icon>
                      <YIcon icon="yiconeditor" :size="11"></YIcon>
                    </template>
                    编辑
                  </el-button>
                </div>
                <el-card class="h-2/4 mb-2" body-style="height: 100%">
                  <div class="h-full w-full flex flex-col">
                    <MonacoEditor class="flex-1 w-full" type="sql" :codeText="currentSQL.sql_str" />
                    <el-form  class="mt-2" :label-width="80" label-position="left">
                      <el-form-item label="所属分组">
                        <QuerySelect
                            v-model="editForm.belong"
                            :isRemote="true"
                            method="post"
                            :params="{ sql_name: 'getSqlType' }"
                            :option-config="{ label: 'belong', value: 'belong' }"
                            @change="handleTypeChange"
                        />
                      </el-form-item>
                      <el-form-item label="描述">
                        <el-input v-model="editForm.description" />
                      </el-form-item>
                    </el-form>
                  </div>
                </el-card>
                <el-card style="height: calc(50% - 42px)" body-style="height: 100%">
                  <DataTable />
                </el-card>
            </div>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import QuerySelect from '@/components/QuerySelect/index.vue'
import { executeSQL } from '@/api/server'
import YIcon from '@/components/YIcon.vue'
import DataTable from '@/components/DataTable.vue'

export default defineComponent({
  setup() {
    const form = reactive({
      sqlType: ''
    })
    const sqlList = reactive([])
    const currentSQL = reactive({})
    const editForm = reactive({
      belong: '',
      description: ''
    })

    const handleTypeChange = (data) => {
      console.log(data)
    }

    const handleSQLSelected = (sql) => {
      currentSQL.sql_name = sql.sql_name
      currentSQL.sql_str = sql.sql_str
      editForm.belong = sql.belong
      editForm.description = sql.description
    }

    const handleExecuteSQL = () => {

    }

    executeSQL({ sql_name: 'getSqlList' }).then(res => {
      if (res && res['code'] === 200) {
        sqlList.length = 0
        sqlList.push(...res['data'])
      }
    })

    return {
      form,
      sqlList,
      currentSQL,
      editForm,
      handleTypeChange,
      handleSQLSelected,
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
  height: 80px;
  background: #677fac;
  color: white;
}
.selected {
  height: 80px;
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
</style>
