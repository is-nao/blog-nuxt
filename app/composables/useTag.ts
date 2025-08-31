export const useTag = () => {
  const route = useRoute()

  const selectedTags = computed(() => {
    const raw = route.query.tag
    const v = (typeof raw === 'string' ? [raw] : raw ? raw as string[] : []).map(t => t.toLowerCase())
    return [...new Set(v)]
  })

  const isFilterOpen = useState('tag-filter', () => true)

  const toggleTags = (value: string) => new Set(selectedTags.value).has(value)
    ? selectedTags.value.filter(t => value !== t)
    : [...selectedTags.value, value]

  return {
    isFilterOpen,
    selectedTags,
    toggleTags,
  }
}
