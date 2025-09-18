export default {
  slots: {
    root: 'relative z-10 rounded-lg font-normal m-1',
    count: 'pl-2 border-l border-l-accented',
  },
  variants: {
    hover: {
      true: {
        root: 'hover:scale-110',
      }
    },
    highlight: {
      true: {
        root: 'text-primary ring-primary',
        count: 'border-l-primary',
      }
    },
  },
}
