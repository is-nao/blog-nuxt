<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { breakpointsTailwind } from '@vueuse/core'

const appConfig = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isLgOrOver = breakpoints.greaterOrEqual('lg')

const { data: pages } = await useFetchArticles({limit: 3})
const { data: tags } = await useFetchTags()
const { isFilterOpen } = useTag()
const tagChunks = computed(() => splitIntoChunks(tags.value ?? []))

const links = ref<ButtonProps[]>([
  {
    label: 'About me',
    to: '/about',
    variant: 'outline',
    color: 'neutral',
  },
  {
    label: 'ブログを読む',
    to: '/article',
    variant: 'outline',
    color: 'neutral',
    trailingIcon: appConfig.ui.icons.bookOpen,
  },
])

useSeoMeta({
  title: "This site is nao's portfolio.",
})
</script>

<template>
  <main>
    <UPageHero
      title="Hello World!" description="技術ブログとエッセイを不定期に更新します" :links orientation="horizontal"
      :ui="{
        root: 'bg-gradient-to-b from-teal-600',
        title: 'text-white',
        description: 'text-white'
      }"
    >
      <!-- <NuxtImg v-if="isLgOrOver" src="" /> -->
    </UPageHero>

    <UContainer>
      <UButton
        label="タグから探す" to="/article" variant="link"
        class="p-0 text-3xl font-bold mt-12 mb-3 text-default"
        @click="isFilterOpen = true"
      />
    </UContainer>

    <UMarquee
      v-for="(tagChunk, index) in tagChunks" :key="index"
      pause-on-hover :reverse="index % 2 === 0" :overlay="true" :repeat="10"
      :ui="{root: '[--gap:--spacing(1)] [--duration:30s] before:w-1/10 after:w-1/10', content: 'w-auto my-1'}"
    >
      <ArticleTag v-for="tag in tagChunk" :key="tag.value" :tag size="md" hover />
    </UMarquee>

    <UContainer>
      <UButton
        label="最新記事" to="/article" variant="link"
        class="p-0 text-3xl font-bold mt-12 mb-6 text-default"
      />

      <UBlogPosts>
        <ArticleCard v-for="page in pages" :key="page.id" :page />
      </UBlogPosts>

    </UContainer>
  </main>
</template>
