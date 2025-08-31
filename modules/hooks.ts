import { defineNuxtModule } from 'nuxt/kit'

declare module '@nuxt/content' {
  interface ParsedContentFile {
    readingTime: string
  }
}

export default defineNuxtModule({
  hooks: {
    /**
     * 読了時間の設定
     * @see https://content.nuxt.com/docs/advanced/hooks
     */
    'content:file:afterParse': ({ file, content }) => {
      const wordsPerMinute = 180
      const wordCount = file.body.split(/\s+/).length

      content.readingTime = Math.ceil(wordCount / wordsPerMinute).toString()
    },
  }
})
