import dayjs from 'dayjs'

export const formatDate = (date: string, options?: { format: string }) => {
  if (options) {
    return dayjs(date).format(options.format)
  }
  return dayjs(date).format('DD/MM/YYYY')
}
