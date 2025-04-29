<template>
    <div class="h-full">
      <div ref="editorContainer" class="w-full h-full"></div>
    </div>
  </template>
  
  <script setup>
import { onMounted, ref, watch } from 'vue'
import loader from '@monaco-editor/loader'

const props = defineProps({
  modelValue: String,
  language: { type: String, default: 'go' },
  theme:    { type: String, default: 'vs-dark' },
  fontSize: { type: Number, default: 18 }
})
const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
let editorInstance = null
let monacoInstance = null

onMounted(async () => {
  monacoInstance = await loader.init()
  editorInstance = monacoInstance.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    fontSize: props.fontSize
  })
  editorInstance.onDidChangeModelContent(() => {
    emit('update:modelValue', editorInstance.getValue())
  })
})

watch(() => props.modelValue, (v) => {
  if (editorInstance && editorInstance.getValue() !== v) {
    editorInstance.setValue(v)
  }
})
watch(() => props.theme, (newTheme) => {
  if (monacoInstance) {
    monacoInstance.editor.setTheme(newTheme)
  }
})
watch(() => props.fontSize, (size) => {
  if (editorInstance) {
    editorInstance.updateOptions({ fontSize: size })
  }
})
</script>

  
<style scoped>
div { height: 100%; }
</style>
  