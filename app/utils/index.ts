import type { ArticleQueryParams, TagQueryParams } from '~/types/article'
import codeIcon from '#build/ui/prose/code-icon'
import { defu } from 'defu'

/**
 * 配列を等分する
 * @param array 対象の配列
 * @param chunkSize 各要素数
 * @returns array を なるべく chunkSize 個ずつに等分した2次元配列
 */
export const splitIntoChunks = <T>(array: T[], chunkSize = 5) => {
  const result: T[][] = []
  const total = array.length
  const groupCount = Math.ceil(total / chunkSize)
  const baseSize = Math.floor(total / groupCount)
  let remainder = total % groupCount

  let i = 0
  for (let g = 0; g < groupCount; g++) {
    const size = baseSize + (remainder-- > 0 ? 1 : 0)
    result.push(array.slice(i, i + size))
    i += size
  }

  return result
}

/**
 * パラメーターをシリアライズする
 * @param params object
 * @param prefix string
 * @param separator default: '-'
 * @returns falsyな params を除外して prefix を separator で結合した文字列
 */
export const serializeParams = (
  params?: ArticleQueryParams | TagQueryParams,
  prefix: string = '',
  separator: string = '-'
) => {
  if (!params) return prefix

  const parts = [prefix]
  for (const key in params) {
    const value = params[key as keyof typeof params]
    if (value) parts.push(key, String(value))
  }
  return parts.join(separator)
}

/**
 * アイコンを検索する
 * @param key キー
 * @returns アイコン名 | 空文字
 */
export const findIcon = (key: string) => {
  const appConfig = useAppConfig()
  const icons: Record<string, string> = defu(appConfig.ui.prose.codeIcon, codeIcon)
  const name = key.toLowerCase().replace(/\s*\(.*\)\s*$/, '').split('/').pop()
  const extension = name?.split('.').pop()

  return (name && icons[name]) ?? (extension && icons[extension]) ?? ''
}

export const durationFrom = (from: Date, to: Date = new Date()) => {
  const totalMonths =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth()) +
    (to.getDate() - from.getDate() < 0 ? -1 : 0)
  const years = totalMonths / 12
  const months = totalMonths % 12
  return { years, months }
}
