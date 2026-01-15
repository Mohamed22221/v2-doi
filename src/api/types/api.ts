export type TAPIResponse<T> = {
    status: true
    message: string
    data: T
    pagination?: TPaginationSimple
}

export type TAPIResponseItems<T> = {
  status: true
  message: string
  data: {
    items: T
  } & TPaginationSimple
}



export type TPaginationSimple = {
  page: number
  limit: number
  total: number
  totalPages: number
}
