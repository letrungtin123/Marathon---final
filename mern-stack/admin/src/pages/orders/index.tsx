import { createSearchParams, useNavigate } from 'react-router-dom'
import { memo, useEffect, useState } from 'react'

import FormOrder from './components/form/form-order'
import MainOrder from './components/main-order'
import Navbar from '@/components/navbar'
import { TOrder } from '@/types/order.type'
import { TResponse } from '@/types/common.type'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
// import _ from 'lodash'
import { getOrders } from '@/apis/order.api'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'

const OrderPage = () => {
  const { accessToken } = useAuth()

  const queryParams = useQueryParams()

  const [orders, setOrders] = useState<TOrder[]>([])
  const navigate = useNavigate()

  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TOrder>()

  const { data, isError, isLoading, isSuccess, isFetching, refetch } = useQuery<TResponse<TOrder>, Error>({
    queryKey: ['orders', queryParams],
    queryFn: () => getOrders(accessToken, queryParams),
    keepPreviousData: true
  })

  useEffect(() => {
    if (isSuccess) {
      setOrders(data.docs)
    }
  }, [isSuccess, data])

  const [inputValue, setInputValue] = useState<string>('')

  const handleSearch = (value: string) => {
    setInputValue(value)
    navigate({
      pathname: '/orders',
      search: createSearchParams({
        ...queryParams,
        _page: '1',
        q: value
      }).toString()
    })
  }

  const handleChangeTab = (key: string) => {
    switch (key) {
      case '1':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            _page: '1',
            _limit: '8',
            tab: key
          }).toString()
        })
        break
      case '2':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'pending',
            tab: key
          }).toString()
        })
        break
      case '3':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'confirmed',
            tab: key
          }).toString()
        })
        break
      case '4':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'delivery',
            tab: key
          }).toString()
        })
        break
      case '5':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'completed',
            tab: key
          }).toString()
        })
        break
      case '6':
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'cancelled',
            tab: key
          }).toString()
        })
        break
      default:
        navigate({
          pathname: '/orders',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            tab: key
          }).toString()
        })
        break
    }
  }

  useEffect(() => {
    if (queryParams.q) {
      setInputValue(queryParams.q)
    }
  }, [queryParams.q])

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả đơn hàng',
      children: (
        <MainOrder
          totalDocs={data.totalDocs}
          isLoading={isFetching || isLoading}
          orders={orders}
          getData={onOpenModal}
        />
      )
    },
    {
      key: '2',
      label: 'Đơn hàng đang chờ',
      children: <MainOrder totalDocs={data.totalDocs} isLoading={isFetching || isLoading} orders={orders} />
    },
    {
      key: '3',
      label: 'Đơn hàng đã xác nhận',
      children: <MainOrder totalDocs={data.totalDocs} isLoading={isFetching || isLoading} orders={orders} />
    },
    {
      key: '4',
      label: 'Đơn hàng đang vận chuyển',
      children: <MainOrder totalDocs={data.totalDocs} isLoading={isFetching || isLoading} orders={orders} />
    },
    {
      key: '5',
      label: 'Đơn hàng đã giao',
      children: <MainOrder totalDocs={data.totalDocs} isLoading={isFetching || isLoading} orders={orders} />
    },
    {
      key: '6',
      label: 'Đơn hàng đã hủy',
      children: <MainOrder totalDocs={data.totalDocs} isLoading={isFetching || isLoading} orders={orders} />
    }
  ]

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm đơn hàng',
          size: 'large',
          type: 'primary',
          onClick: () => onOpenModal('add')
        }}
        input={{
          placeholder: 'Search for order',
          onSearch: (value) => handleSearch(value),
          value: inputValue,
          onChange: (value) => setInputValue(value)
        }}
      />

      <div>
        <Tabs defaultActiveKey={queryParams.tab || '1'} items={items} onChange={(value) => handleChangeTab(value)} />
      </div>

      <FormOrder currentData={currentModal} onClose={onCloseModal} refetch={refetch} />
    </div>
  )
}

export default memo(OrderPage)
