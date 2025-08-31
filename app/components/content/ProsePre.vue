<script setup lang="ts">
import theme from '#build/ui/prose/pre'
import { tv, type ClassValue } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  icon?: string
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  hideHeader?: boolean
  meta?: string
  class?: ClassValue
  ui?: typeof theme.slots
}>(), {
  icon: undefined,
  code: undefined,
  language: undefined,
  filename: undefined,
  highlights: () => [],
  hideHeader: false,
  meta: undefined,
  class: undefined,
  ui: undefined,
})

const { t } = useLocale()
const { copy, copied } = useClipboard()
const appConfig = useAppConfig()

const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui.prose.pre })({
  filename: !!props.filename,
  mermaid: props.language === 'mermaid',
}))
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <div v-if="props.filename && !props.hideHeader" :class="ui.header({ class: props.ui?.header })">
      <UIcon
        :name="findIcon(props.filename) || props.language && findIcon(props.language) || ''"
        :class="ui.icon({ class: props.ui?.icon })"
      />
      <span :class="ui.filename({ class: props.ui?.filename })">{{ props.filename }}</span>
    </div>
    <UTooltip
      :text="copied ? 'copied!': 'copy'"
      :disable-closing-trigger="true"
      :disable-hoverable-content="true"
      :delay-duration="100"
      :content="{side: 'left', sideOffset: 2}"
      :arrow="true"
    >
      <UButton
        :trailing-icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
        color="neutral"
        variant="outline"
        size="sm"
        :aria-label="t('prose.pre.copy')"
        :class="ui.copy({ class: props.ui?.copy })"
        tabindex="-1"
        @click="copy(props.code || '')"
      />
    </UTooltip>
    <Mermaid v-if="props.language === 'mermaid'" :code="props.code" :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs" />
    <pre v-else :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;
  @apply bg-(--ui-bg-accented)/50;
}
</style>
