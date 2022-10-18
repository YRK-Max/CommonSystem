<template>
  <div class="w-full h-full bg-white">
    <div class="h-full w-full sql-div p-1" id="codeEditBox"></div>
  </div>
</template>
<script>
import { defineComponent, nextTick, watch } from 'vue'
import * as monaco from 'monaco-editor'
import * as sqlLanguage from 'monaco-editor/esm/vs/basic-languages/sql/sql'
const { keywords } = sqlLanguage.language

export default defineComponent({
  props: {
    type: {
      type: String,
      default: () => {
        return 'javascript'
      }
    },
    codeText: {
      type: String,
      default: () => {
        return '// 在此处编辑'
      }
    }
  },
  emits: ['change'],
  setup(props, context) {
    let editor = null

    const registerCompletion = () => {
      monaco.languages.registerCompletionItemProvider('sql', {
        triggerCharacters: ['.', ...keywords],
        provideCompletionItems: (model, position) => {
          let suggestions = []

          const { lineNumber, column } = position

          const textBeforePointer = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 0,
            endLineNumber: lineNumber,
            endColumn: column
          })

          const tokens = textBeforePointer.trim().split(/\s+/)
          const lastToken = tokens[tokens.length - 1] // 获取最后一段非空字符串

          if (lastToken === '.') {
            suggestions = []
          } else {
            suggestions = [...getSQLSuggest()]
          }

          return {
            suggestions
          }
        }
      })
    }

    const getSQLSuggest = () => {
      return keywords.map((key) => ({
        label: key,
        kind: monaco.languages.CompletionItemKind.Enum,
        insertText: key
      }))
    }

    const initEditor = () => {
      // 初始化编辑器，确保dom已经渲染
      editor = monaco.editor.create(document.getElementById('codeEditBox'), {
        value: props.codeText, // 编辑器初始显示文字
        language: props.type, // 此处使用的python，其他语言支持自行查阅demo
        theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
        selectOnLineNumbers: true, // 显示行号
        roundedSelection: true,
        readOnly: false, // 只读
        cursorStyle: 'line', // 光标样式
        automaticLayout: true, // 自动布局
        glyphMargin: true, // 字形边缘
        useTabStops: false,
        fontSize: 15, // 字体大小
        autoIndent: true, // 自动布局
        quickSuggestionsDelay: 100 // 代码提示延时
      })
      // 监听值的变化
      editor.onDidChangeModelContent(() => {
        context.emit('change', editor.getValue())
      })
    }

    watch(props, (val) => {
      editor.setValue(val.codeText)
    })

    nextTick(() => {
      registerCompletion()
      initEditor()
    })
    return {}
  }
})
</script>
<style lang="scss" scoped>
.sql-div {
  border: 1px solid #c0c0c0;
  border-radius: 6px;
}
</style>
