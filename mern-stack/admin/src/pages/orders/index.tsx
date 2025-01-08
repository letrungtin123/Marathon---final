import { orderApi } from '@/apis/order.api'
import Navbar from '@/components/navbar'
import path from '@/configs/path'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsProps } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'
import TableOrder from './components/table-order'

const OrderPage = () => {
  const params = useQueryParams()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['orders', params],
    queryFn: () =>
      orderApi.getAllOrders(
        Object.keys(params).length === 0 ? { status: 'pending', _page: 1, _limit: 10 } : params,
        accessToken
      )
  })
  const orders = data?.docs

  const items: TabsProps['items'] = [
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      children: <TableOrder data={orders} />
    },
    {
      key: 'confirmed',
      label: 'Đã xác nhận',
      children: <TableOrder data={orders} />
    },
    {
      key: 'delivery',
      label: 'Đang giao hàng',
      children: <TableOrder data={orders} />
    },
    {
      key: 'completed',
      label: 'Đã giao hàng',
      children: <TableOrder data={orders} />
    },
    {
      key: 'cancelled',
      label: 'Đã hủy',
      children: <TableOrder data={orders} />
    }
  ]

  const handleChangeTab = (key: string) => {
    navigate({
      pathname: path.orders,
      search: createSearchParams({
        ...params,
        status: key
      }).toString()
    })
  }

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        // button={{
        //   title: 'Thêm đơn hàng',
        //   size: 'large',
        //   type: 'primary'
        // }}
        input={{
          placeholder: 'Search for order'
        }}
      />

      <div>
        <Tabs defaultActiveKey={params?.status ?? '1'} items={items} onChange={(key) => handleChangeTab(key)} />
      </div>
    </div>
  )
}

export default OrderPage
