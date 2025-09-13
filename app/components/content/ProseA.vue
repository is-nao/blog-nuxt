<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import theme from '#build/ui/prose/a'
import { tv, type ClassValue } from 'tailwind-variants'

const appConfig = useAppConfig()
const ui = computed(() => tv({
  extend: tv({
    slots: { base: theme.base }
  })
})())

const props = withDefaults(defineProps<{
  href?: string,
  target?: NuxtLinkProps['target'],
  class?: ClassValue,
  card?: boolean,
}>(), {
  href: '',
  target: undefined,
  class: undefined,
  card: false,
})

const target = computed(() => props.href.startsWith('http') ? '_blank' : props.target)
</script>

<template>
  <LinkCard v-if="props.card" :href="props.href" :target />
  <ULink v-else :href="props.href" :target :class="ui.base({ class: props.class })" raw>
    <slot />
  </ULink>
</template>
