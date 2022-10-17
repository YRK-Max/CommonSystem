<template>
  <div class="p-2 overflow-hidden h-full flex flex-col" style="background: #ebeef3">
    <el-upload
        class="upload-demo pb-2"
        name="reportFiles"
        :headers="{'Authorization': auth_header}"
        action="/server/common/uploadRpts"
        multiple
        :show-file-list="false"
        :on-success="handleUploadSuccess"
    >
        <el-button>上传</el-button>
    </el-upload>
    <div class="flex-1 overflow-hidden">
        <DataTable
            class="h-full"
            :columns="tableConfig.columns"
            :data="tableConfig.datasource"
        >
            <template #operation="{ row }">
                <el-button type="primary" size="small" link @click="handleDownloadFile(row)">下载</el-button>
                <el-button type="primary" size="small" link @click="handleDeleteFile(row)">删除</el-button>
            </template>
        </DataTable>
    </div>
  </div>
</template>

<script setup>
import { getToken } from '@/utils/token'
import { getRptFiles, downloadRptFiles, deleteRptFile } from '@/api/server'
import DataTable from '@/components/DataTable.vue'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
const auth_header = 'Bearer ' + getToken()
const tableConfig = reactive({
  columns: [
    { field: 'fileName', title: '文件名', showOverflow: true },
    { field: 'filePath', title: '文件路径', showOverflow: true },
    { field: 'fileSize', title: '文件大小', showOverflow: true },
    { field: 'fileLastModified', title: '修改时间', sortable: true, showOverflow: true },
    { field: 'operation', title: '操作', slots: { default: 'operation' }}
  ],
  datasource: []
})

const initData = () => {
  getRptFiles().then(res => {
    if (res && res['code'] === 200) {
      tableConfig.datasource = res['data']
    }
  })
}

const handleDownloadFile = (row) => {
  downloadRptFiles(row).then(res => {
    const blob = new Blob([res], { type: 'application/octet-stream' })
    const dom = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    dom.href = url
    dom.download = decodeURI(row['fileName'])
    dom.style.display = 'none'
    document.body.appendChild(dom)
    dom.click()
    dom.parentNode.removeChild(dom)
    window.URL.revokeObjectURL(url)
  })
}

const handleDeleteFile = (row) => {
  deleteRptFile(row['fileName']).then(() => {
    ElMessage.success('已执行删除')
    initData()
  })
}

const handleUploadSuccess = () => {
  ElMessage.success('上传成功')
  initData()
}

initData()
</script>

<style>
</style>
