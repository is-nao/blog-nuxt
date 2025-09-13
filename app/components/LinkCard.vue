<script setup lang="ts">
import type { NuxtLinkProps } from '#app'

const props = withDefaults(defineProps<{
  href?: string,
  target?: NuxtLinkProps['target'],
}>(), {
  href: '',
  target: undefined,
})

const url = computed(() => decodeURI(props.href))
const target = computed(() => props.href.startsWith('http') ? '_blank' : props.target)

const { data: result } = await useFetch('/api/ogp', {
  method: 'get',
  query: { url: props.href }
})
</script>

<template>
  <NuxtLink
    v-if="url && result" :to="props.href" :target
    :class="[
      'relative grid overflow-hidden ring ring-default rounded-lg group hover:bg-elevated/50',
      {'grid-cols-[auto_minmax(0,1fr)]': !!result.image}
    ]"
  >
    <NuxtImg
      v-if="result.image" :src="result.image"
      class="aspect-video object-cover w-32 md:w-64 h-full"
    />
    <div class="p-4 place-content-center">
      <p :title="result.title" class="truncate text-lg font-semibold">
        {{ result.title }}
      </p>
      <p :title="result.description" class="line-clamp-2 text-sm text-muted">
        {{ result.description }}
      </p>
      <div class="pt-2 text-sm font-semibold text-muted group-hover:text-primary flex items-center gap-1">
        <p :title="url" class="truncate">{{ url }}</p>
        <UIcon name="i-lucide-external-link" class="shrink-0"/>
      </div>
    </div>
  </NuxtLink>
</template>
