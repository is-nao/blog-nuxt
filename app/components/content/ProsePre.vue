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

/**
 * 下記の順にアイコンを検索する
 * 1. フルパスのファイル名 > ファイル名 > 拡張子
 * 2. 言語 (設定していない言語の場合は vscode-icons での解決を試みる)
 */
const name = computed(() => (props.filename && findIcon(props.filename)) ?? (props.language && findIcon(props.language, extention => `i-vscode-icons-file-type-${extention}`)) ?? '')

/**
 * コピー用コード
 * @description
 * - diffの削除行もコピー対象のコードに含まれる
 * - 削除行が分かりやすいように削除マーカーは残しておく
 * @see https://shiki.style/packages/transformers#transformernotationdiff
 */
const copyText = computed(() => props.code?.replace(/\/\/\s*\[!code\s+\+\+(?::\d+)?\]/g, '') || '')

const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui.prose.pre })({
  filename: !!props.filename,
  mermaid: props.language === 'mermaid',
}))
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <div v-if="props.filename && !props.hideHeader" :class="ui.header({ class: props.ui?.header })">
      <UIcon :name :class="ui.icon({ class: props.ui?.icon })" />
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
        @click="copy(copyText)"
      />
    </UTooltip>
    <Mermaid v-if="props.language === 'mermaid'" :code="props.code" :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs" />
    <pre v-else :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style>
@reference "../../assets/css/main.css";

.shiki {
  span.line {
    @apply block;

    &.highlight, &.diff {
      @apply my-0 -mx-4 py-0 px-4;
    }

    &.highlight {
      @apply bg-(--ui-warning)/10;
    }

    &.diff {
      @apply relative;

      &::before {
        @apply absolute left-0 px-1;
      }

      &.add {
        @apply bg-(--ui-success)/10;

        &::before {
          @apply content-['+'] text-(--ui-success);
        }
      }

      &.remove {
        @apply bg-(--ui-error)/10;

        &::before {
          @apply content-['-'] text-(--ui-error);
        }
      }
    }
  }
}
</style>
