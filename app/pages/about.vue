<script setup lang="ts">
const route = useRoute()
const { data: page } = useAsyncData(route.path, () => queryCollection('article').path(route.path).first())

const { years, months } = durationFrom(new Date('2022/4'))

const mdcVariable = ref({
  yearsOfExperience: `${Math.floor(years)}年${months}ヶ月`,
})
</script>

<template>
  <main>
    <UContainer>
      <UPage>
        <UPageBody>
          <ContentRenderer v-if="page" :value="page" :data="mdcVariable"/>
        </UPageBody>
      </UPage>
    </UContainer>
  </main>
</template>
