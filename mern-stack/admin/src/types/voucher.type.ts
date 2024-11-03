export type TVoucher = {
  _id: string
  code: string
  discount: number
  status: 'active' | 'inactive'
  desc: string
  startDate: string
  endDate: string
  voucherPrice: number
  applicablePrice: number
  createdAt: string
  updatedAt: string
}

export type TFormVoucher = Pick<
  TVoucher,
  'code' | 'discount' | 'applicablePrice' | 'desc' | 'endDate' | 'startDate' | 'status' | 'voucherPrice'
>
