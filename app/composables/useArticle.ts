import type { ArticleCollectionItem } from '@nuxt/content'
import type { Article, ArticleQueryParams, Tag, TagQueryParams } from '~/types/article'

/**
 * カスタム useAsyncData ラッパーの作成方法について
 * @see https://nuxt.com/docs/api/composables/use-async-data#usage
 * @see https://nuxt.com/docs/guide/recipes/custom-usefetch#custom-usefetchuseasyncdata
 */

/**
 * URLに対応する記事を1件取得する
 * @returns Article | null
 */
export const useFetchArticle = () => {
  const route = useRoute()

  return useAsyncData(
    route.path,
    () => queryBuilder().path(route.path).first(),
    {
      transform: article => article ? transform(article) : null,
    }
  )
}

/**
 * 引数で記事を絞り込んで取得する
 * @todo 無限 or 仮想スクロール対応
 * @see https://vueuse.org/core/useInfiniteScroll/
 * @see https://github.com/vueuse/vueuse/blob/main/packages/core/useInfiniteScroll/demo.vue
 *
 * @async
 * @params params skip, limit
 * @returns Article[]
 */
export const useFetchArticles = (params?: ArticleQueryParams) => useAsyncData(
  serializeParams(params, 'articles'),
  () => {
    const builder = queryBuilder()
      .order('id', 'DESC')
      .order('updatedAt', 'DESC')
      .order('createdAt', 'DESC')

    if (params?.limit) builder.limit(params.limit)
    if (params?.skip) builder.skip(params.skip)

    return builder.all()
  },
  {
    lazy: params?.lazy ?? false,
    transform: articles => articles.map(transform),
  }
)

/**
 * タグ全件を集約して取得する
 * @async
 * @param params タグ名と個数の並び順
 * @returns 並び替えたタグ配列
 */
export const useFetchTags = (params?: TagQueryParams) => useAsyncData(
  serializeParams(params, 'article-tags'),
  () => queryBuilder().select('tags').all(),
  {
    lazy: params?.lazy ?? false,
    transform: (pages): Tag[] => {
      const agg = new Map<string, number>()

      for (const page of pages) {
        const tags = page.tags ?? []
        for (const tag of tags) {
          agg.set(tag, (agg.get(tag) ?? 0) + 1)
        }
      }

      return [...agg.entries()]
        .map(([label, count]) => ({ label, value: label.toLowerCase(), count } satisfies Tag))
        .sort((a, b) => {
          if (params?.count) {
            const diff = params.count === 'ASC' ? a.count - b.count : b.count - a.count
            if (diff !== 0) return diff
          }
          return a.value.localeCompare(b.value)
        })
    }
  }
)

/**
 * 共通抽出条件クエリビルダー
 * - isDraft: false
 * - createdAt: 現在日時以前
 * @returns クエリビルダー
 */
const queryBuilder = () =>
  queryCollection('article')
    .where('isDraft', '=', false)
    .where('createdAt', '<=', new Date().toISOString())

/**
 * ArticleCollectionItem を Article に変換する
 * - id: view transition のキーとして使う為に正規化
 * - tags: string[] から Tag[] へ変換
 * @param article
 * @returns Article
 */
const transform = (article: ArticleCollectionItem): Article => ({
  ...article,
  id: article.id.replace(/\W/g, '-'),
  tags: (article.tags ?? []).map((label): Tag => ({
    label,
    value: label.toLowerCase()
  }))
})
