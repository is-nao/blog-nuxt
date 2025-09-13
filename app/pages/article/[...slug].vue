<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const { data: page, status } = await useFetchArticle()

const items = ref<BreadcrumbItem[]>([
  {
    label: 'TOP',
    to: '/',
  }, {
    label: 'Article',
    to: '/article',
  }, {
    label: page.value?.title,
    to: page.value?.path,
  }
])

if (!page.value && status.value === 'error') {
  throw createError({ statusCode: 404, statusMessage: 'page not found', fatal: true })
}

useSeoMeta({
  title: `${page.value?.title} > article`,
  description: page.value?.description,
})
</script>

<template>
  <UContainer v-if="page">
    <UPage>
      <UPageHeader :title="page.title" :description="page.description">
        <template #headline>
          <NuxtImg
            v-if="page.thumbnail"
            :src="page.thumbnail"
            class="relative object-cover aspect-[21/9] w-full mb-3"
            :style="{'--vt-name': page.id + '-thumbnail'}"
          />
        </template>

        <p class="text-sm text-muted mt-3 flex items-center gap-1">
          <UIcon :name="appConfig.ui.icons.timer"/>
          <span>
            {{ appConfig.template.readingTime.replace('{readingTime}', page.readingTime) }}
          </span>
        </p>

        <div v-if="page.tags?.length" class="mt-3">
          <ArticleTag v-for="tag in page.tags" :key="tag.value" :tag />
        </div>

        <UBreadcrumb :items class="mt-4" />
      </UPageHeader>

      <UPageBody>
        <ContentRenderer v-if="page" :value="page" />
      </UPageBody>

      <template v-if="page.body.toc?.links.length" #right>
        <UContentToc title="目次" :links="page.body.toc.links" highlight :ui="{ container: 'border-solid' }" />
      </template>
    </UPage>
  </UContainer>
</template>
