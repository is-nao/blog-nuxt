<script setup lang="ts">
import theme from '#build/ui/blog-post'
import type { BadgeProps, LinkProps } from '@nuxt/ui'
import { Primitive } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import type { Article, ArticleCardSlots, Orientation, Variant } from '~/types/article'

const props = withDefaults(defineProps<{
  page: Article
  badge?: string | BadgeProps
  orientation?: Orientation
  variant?: Variant
  ui?: ArticleCardSlots
  class?: ClassValue
  target?: LinkProps['target']
  onClick?: () => void
}>(), {
  badge: undefined,
  orientation: 'vertical',
  variant: 'outline',
  ui: undefined,
  class: undefined,
  target: null,
  onClick: undefined,
})

defineOptions({ inheritAttrs: false })

const slots = defineSlots<ArticleCardSlots>()
const appConfig = useAppConfig()

const ui = computed(() => tv({extend: tv(theme), ...appConfig.component.articleCard})({
  orientation: props.orientation,
  variant: props.variant,
  image: !!props.page.thumbnail,
  to: !!props.page.path || !!props.onClick,
}))
</script>

<template>
  <Primitive
    as="article"
    :data-orientation="props.orientation"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @click="onClick"
  >
    <div
      v-if="props.page.thumbnail || !!slots.header"
      :class="ui.header({ class: props.ui?.header })"
    >
      <slot name="header">
        <NuxtImg
          v-bind="{ src: props.page.thumbnail, alt: props.page.title }"
          :class="ui.image({ class: props.ui?.image, to: !!props.page.path })"
          :style="{'--vt-name': props.page.id + '-thumbnail'}"
        />
      </slot>
    </div>

    <div :class="ui.body({ class: props.ui?.body })">
      <ULink
        v-if="props.page.path"
        :aria-label="props.page.title"
        v-bind="{ to: props.page.path, target: props.target, ...$attrs }"
        class="focus:outline-none peer"
        tabindex="-1"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot name="body">
        <div
          v-if="(props.page.updatedAt || props.page.createdAt) || !!slots.date || props.badge || !!slots.badge"
          :class="ui.meta({ class: props.ui?.meta })"
        >
          <slot name="badge">
            <UBadge
              v-if="props.badge"
              color="neutral"
              variant="subtle"
              v-bind="typeof props.badge === 'string' ? { label: props.badge } : props.badge"
              :class="ui.badge({ class: props.ui?.badge })"
            />
          </slot>

          <span :class="ui.date({ class: props.ui?.date })">
            <slot name="date">
              <NuxtTime :datetime="new Date(props.page.updatedAt || props.page.createdAt).toISOString()" />
              {{ props.page.updatedAt ? '更新' : '公開' }}
            </slot>
          </span>
        </div>

        <h2 v-if="props.page.title || !!slots.title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.page.title }}
          </slot>
        </h2>

        <div
          v-if="props.page.description || !!slots.description"
          :class="ui.description({ class: props.ui?.description })"
        >
          <slot name="description">
            {{ props.page.description }}
          </slot>
        </div>

        <div v-if="props.page.tags?.length" :class="ui.tags({ class: props.ui?.tags })">
          <ArticleTag v-for="tag in page.tags" :key="tag.value" :tag highlight />
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
