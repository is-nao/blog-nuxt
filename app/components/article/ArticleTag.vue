<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { tv, type ClassValue } from 'tailwind-variants'
import type { ArticleTagSlots, Tag } from '~/types/article'

const props = withDefaults(defineProps<{
  tag: Tag
  highlight?: boolean
  size?: ButtonProps['size']
  hover?: boolean
  ui?: ArticleTagSlots
  class?: ClassValue
}>(), {
  highlight: false,
  size: 'sm',
  hover: false,
  ui: undefined,
  class: undefined,
})

const appConfig = useAppConfig()
const route = useRoute()
const { selectedTags, toggleTags } = useTag()

const isHighlighted = computed(() => props.highlight && new Set(selectedTags.value).has(props.tag.value))

const icon = computed(() => findIcon(props.tag.value) || appConfig.ui.icons.hash)

const ui = computed(() => tv(appConfig.component.articleTag)({
  hover: props.hover,
  highlight: isHighlighted.value
}))
</script>

<template>
  <UButton
    :icon :to="{path: '/article', query: {...route.query, tag: toggleTags(props.tag.value)}}"
    :size="props.size" variant="outline" color="neutral"
    :class="ui.root({ class: props.ui?.root })"
  >
    <span>{{ props.tag.label }}</span>
    <span v-if="props.tag.count" :class="ui.count({ class: props.ui?.count })">
      {{ props.tag.count }}
    </span>
  </UButton>
</template>
