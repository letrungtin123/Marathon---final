import { createSearchParams, useNavigate } from 'react-router-dom'
import { memo, useEffect, useState } from 'react'

import FomrProduct from './components/form/form-product'
import MainProduct from './components/main-product'
import Navbar from '@/components/navbar'
import { TProduct } from '@/types/product.type'
import { TResponse } from '@/types/common.type'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import _ from 'lodash'
import { getProducts } from '@/apis/product.api'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useToggleModal } from '@/hooks/useToggleModal'

const ProductPage = () => {
  const { accessToken } = useAuth()

  // lấy ra các dữ liệu trên url
  const queryParams = useQueryParams()

  const [products, setProducts] = useState<TProduct[]>([])
  const navigate = useNavigate()

  const { currentModal, onCloseModal, onOpenModal } = useToggleModal<TProduct>()

  const { data, isError, isLoading, isSuccess, isFetching, refetch } = useQuery<TResponse<TProduct>, Error>({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(accessToken, queryParams),
    keepPreviousData: true
  })

  useEffect(() => {
    if (isSuccess) {
      setProducts(data.docs)
    }
  }, [isSuccess, data])

  const [inputValue, setInputValue] = useState<string>('')

  const handleSearch = (value: string) => {
    setInputValue(value)
    navigate({
      pathname: '/products',
      search: createSearchParams({
        ...queryParams,
        _page: '1',
        q: value
      }).toString()
    })
  }

  // xử lý xử kiện khi click vào tab
  const handleChangeTab = (key: string) => {
    switch (key) {
      case '1':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            _page: '1',
            _limit: '8',
            tab: key
          }).toString()
        })
        break
      case '2':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'active',
            deleted: 'false',
            tab: key
          }).toString()
        })
        break
      case '3':
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'inactive',
            deleted: 'false',
            tab: key
          }).toString()
        })
        break
      case '4':
        const newQueryParams = _.omit(queryParams, 'status')
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...newQueryParams,
            _page: '1',
            deleted: 'true',
            tab: key
          }).toString()
        })
        break
      default:
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            deleted: 'true',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả sản phẩm',
      children: (
        <MainProduct
          totalDocs={data.totalDocs}
          isLoading={isFetching || isLoading}
          products={products}
          getData={onOpenModal}
        />
      )
    },
    {
      key: '2',
      label: 'Sản phẩm đang hoạt động',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    },
    {
      key: '3',
      label: 'Sản phẩm không hoạt động',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    },
    {
      key: '4',
      label: 'Sản phẩm đã xoá',
      children: <MainProduct totalDocs={data.totalDocs} isLoading={isFetching || isLoading} products={products} />
    }
  ]

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <Navbar
        button={{
          title: 'Thêm sản phẩm',
          size: 'large',
          type: 'primary',
          onClick: () => onOpenModal('add')
        }}
        input={{
          placeholder: 'Search for product',
          onSearch: (value) => handleSearch(value),
          value: inputValue,
          onChange: (value) => setInputValue(value)
        }}
      />

      <div>
        <Tabs defaultActiveKey={queryParams.tab || '1'} items={items} onChange={(value) => handleChangeTab(value)} />
      </div>

      {/* form add product */}
      <FomrProduct currentData={currentModal} onClose={onCloseModal} refetch={refetch} />
    </div>
  )
}

export default memo(ProductPage)
