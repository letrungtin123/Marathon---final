import { TModalType, TQueryParams } from '@/types/common.type'
import { Table } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'

// import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'
import { TOrder } from '@/types/order.type'
// import { useState } from 'react'
import FormOrder from './form/form-order'
import ColumnsTable from './table/columns-table'

interface MainOrderProps {
  orders: TOrder[]
  totalDocs: number
  isLoading?: boolean
  getData?: (type: TModalType, data?: TOrder) => void
}

const MainOrder = ({ orders, isLoading, getData, totalDocs }: MainOrderProps) => {
  const navigate = useNavigate()

  const queryParams: TQueryParams = useQueryParams()
  const { _limit, _page } = queryParams

  // const { accessToken } = useAuth()

  // const [order, setOrder] = useState<TOrder>()
  const { currentModal, onCloseModal } = useToggleModal<TOrder>()
  //onOpenModal
  const columns = ColumnsTable({
    // onDetail: setOrder,
    getData
    // onOpenModal
  })

  return (
    <div className=''>
      <Table
        loading={isLoading}
        rowKey={(record) => record._id}
        dataSource={orders}
        columns={columns}
        pagination={{
          current: Number(_page) || 1,
          pageSize: Number(_limit) || 8,
          total: totalDocs,
          onChange: (page, pageSize) => {
            navigate({
              pathname: '/orders',
              search: createSearchParams({
                _page: page.toString(),
                _limit: pageSize.toString()
              }).toString()
            })
          },
          showTotal(total, range) {
            return (
              <div className='flex items-center justify-between w-full mr-auto text-black-second'>
                Showing {range[0]}-{range[1]} of {total}
              </div>
            )
          }
        }}
      />

      <FormOrder currentData={currentModal} onClose={onCloseModal} />
    </div>
  )
}

export default MainOrder
