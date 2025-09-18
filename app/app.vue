<script setup lang="ts">
import type { TooltipProps } from '@nuxt/ui'
import { ja } from '@nuxt/ui/locale'
import ja_ex from '~/utils/locales/ja'

const locale = extendLocale(ja, ja_ex)
const appconfig = useAppConfig()
const x = appconfig.header.links.find(link => link.label === 'X')

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('article'))
const { data: search } = await useLazyAsyncData('search', () => queryCollectionSearchSections('article'), {
  server: false,
})

const searchTerm = ref('')

const tooltip: TooltipProps = {
  arrow: true,
  delayDuration: 100,
  content: {
    side: 'bottom',
    sideOffset: 2,
  }
}

useSeoMeta({
  titleTemplate: title => title ? `${title} - ${appconfig.title}`: appconfig.title,
  description: appconfig.description,
})
</script>

<template>
  <UApp :locale>
    <NuxtLoadingIndicator />

    <ClientOnly>
      <LazyUContentSearch
        v-model:search-term="searchTerm" :navigation
        :files="search"
      />
    </ClientOnly>

    <UHeader :title="appconfig.title" :toggle="false">
      <template #right>
        <UContentSearchButton :tooltip="{text: 'search', ...tooltip}" />

        <UTooltip v-for="link in appconfig.header.links" :key="link.label" :text="link.tooltip" v-bind="tooltip">
          <UButton
            :to="link.to" :icon="link.icon" :aria-label="link.label"
            color="neutral" variant="ghost" target="_blank"
          />
        </UTooltip>

        <UColorModeSwitch />
      </template>
    </UHeader>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          <span>{{ `Copyright © ${new Date().getFullYear()} ${appconfig.title}` }}</span>
          <ULink v-if="x" :to="x.to" class="mx-2">
            {{ `@${x?.to.split('/').pop()}` }}
          </ULink>
          <span>All Rights Reserved.</span>
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
