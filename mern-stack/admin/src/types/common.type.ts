// generic type
export type TResponse<T> = {
  message: string
  success: boolean
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: number | boolean
  hasNextPage: number | boolean
  prevPage: number | null
  nextPage: number | null
}

export type TResponseNoPagination<Data> = {
  message: string
  success: boolean
  data: Data[]
}

export type TResponseDetail<Data> = {
  message: string
  success: boolean
  data: Data
}

// export type TResponseDetail<T> = Omit<TResponseNoPagination<T>, 'data'> & { data: T }

export type TImage = {
  url: string
  public_id: string
  _id: string
}

export interface ImageType {
  url: string
  public_id: string
  visiable: boolean
}

export type TBaseResponseDelete = {
  message: string
  success: boolean
}

// tạo 1 type cho modal để sử dụng trong useToggleModal
export type TModalType = 'add' | 'edit' | 'delete' | 'view' | null

export type TModal<T> = {
  visiable: boolean
  type: TModalType
  currentData: T | null
}

export type TQueryParams = {
  // ❗ Dùng đúng tên tham số chuẩn của mongoose-paginate-v2
  page?: number
  limit?: number

  // Giữ tương thích ngược nếu nơi khác còn dùng _page/_limit
  _page?: number
  _limit?: number

  q?: string
  status?: string
  deleted?: string
  sort?: string
}

// int abc = 5 => abc = 'ahihi'
// let exampleJs = 5 => exampleJs = 'ahihi'
// let abc: string = 'abc'
