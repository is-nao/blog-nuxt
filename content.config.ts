import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const schema = z.object({
  title: z.string(),
  description: z.string(),
  readingTime: z.string(),
})

export default defineContentConfig({
  collections: {
    article: defineCollection({
      type: 'page',
      source: '**',
      schema: schema.extend({
        createdAt: z.date(),
        updatedAt: z.date(),
        isDraft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        thumbnail: z.string().editor({ input: 'media' }),
      }),
    }),
  }
})
