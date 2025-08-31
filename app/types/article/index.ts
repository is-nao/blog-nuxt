/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { blogPost } from '#build/ui'
import type { ArticleCollectionItem } from '@nuxt/content'
import type { articleCard, articleTag } from '~/utils/tv'

export type Orientation = 'horizontal' | 'vertical'

export type Variant = 'outline' | 'soft' | 'subtle' | 'ghost' | 'naked'

export type Direction = 'ASC' | 'DESC'

export interface ArticleQueryParams extends Lazy {
  skip?: number
  limit?: number
}

export interface TagQueryParams extends Lazy {
  count?: Direction
}

interface Lazy {
  lazy?: boolean
}

export interface Article extends Omit<ArticleCollectionItem, 'tags'> {
  tags: Tag[]
}

export interface Tag {
  label: string
  value: string
  count?: number
}

export interface ArticleCardSlots
  extends Partial<Omit<typeof blogPost.slots, "authors" | "avatar">>, Partial<typeof articleCard.slots> {
}

export interface ArticleTagSlots extends Partial<typeof articleTag.slots> {
}
