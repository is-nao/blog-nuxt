<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import mermaid from 'mermaid'
import type { ClassValue } from 'tailwind-variants'

const props = defineProps<{
  code?: string
  class?: ClassValue
}>()

const colorMode = useColorMode()
const key = ref(0)

const renderMermaid = async () => {
  mermaid.initialize({
    startOnLoad: false,
    darkMode: colorMode.value === 'dark',
    theme: colorMode.value === 'dark' ? 'dark' : 'default',
  })

  key.value++
  await nextTick() // DOM更新を待つ
  await mermaid.run()
}

onMounted(() => {
  renderMermaid()
})

watch(() => colorMode.value, () => {
  renderMermaid()
})
</script>

<template>
  <pre :key :class="props.class" v-bind="$attrs">{{ props.code }}</pre>
</template>
