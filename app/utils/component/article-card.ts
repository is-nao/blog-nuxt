// @extends #build/ui/blog-post
export default {
  slots: {
    root: 'hover:-translate-y-1 z-0 shadow-md',
    image: 'relative object-center w-full h-full',
    title: 'group-hover/blog-post:text-primary',
    description: 'mt-2 line-clamp-2',
    tags: 'pt-2 flex flex-wrap',
  },
  variants: {
    to: {
      true: {
        image: 'group-hover/blog-post:scale-none',
      }
    },
  },
}
