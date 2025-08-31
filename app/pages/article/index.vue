<script setup lang="ts">
const { data: pages } = await useFetchArticles()
const { data: tags } = await useFetchTags({ count: 'DESC'})
const { isFilterOpen, selectedTags } = useTag()
const appConfig = useAppConfig()

const filtered = computed(() => {
  if (!pages.value) return []
  if (!selectedTags.value.length) return pages.value

  return pages.value.filter(page => {
    const s = new Set(page.tags.map(t => t.value))
    return selectedTags.value.every(t => s.has(t))
  })
})

useSeoMeta({
  title: 'article',
  description: 'article list',
})
</script>

<template>
  <main>
    <UContainer>
      <UCollapsible
        v-model:open="isFilterOpen" :unmount-on-hide="false" block
        class="sticky top-[var(--ui-header-height)] z-10 group bg-default/75 backdrop-blur rounded-b-lg"
      >
        <UButton
          label="Filter by tags" :trailing-icon="appConfig.ui.icons.chevronDown" variant="ghost" color="neutral"
          :ui="{trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'}"
        />
        <template #content>
          <ArticleTag v-for="tag in tags" :key="tag.value" :tag highlight hover/>
        </template>
      </UCollapsible>

      <p class="my-4">{{ filtered?.length }} results</p>

      <UBlogPosts class="lg:gap-8">
        <ArticleCard v-for="page in filtered" :key="page.id" :page />
      </UBlogPosts>
    </UContainer>
  </main>
</template>
