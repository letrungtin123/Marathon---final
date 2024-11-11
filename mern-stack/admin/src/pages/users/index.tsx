import { createSearchParams, useNavigate } from 'react-router-dom'
import { memo, useEffect, useState } from 'react'
import { TResponse } from '@/types/common.type'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { useQuery } from '@tanstack/react-query'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TUser } from '@/types/user.type'
import { getUsers } from '@/apis/user.api'
import MainUser from './components/main-user'

const UserPage = () => {
  const { accessToken } = useAuth()

  const queryParams = useQueryParams()

  const [users, setUsers] = useState<TUser[]>([])
  const navigate = useNavigate()

  const { data, isError, isLoading, isSuccess, isFetching } = useQuery<TResponse<TUser>, Error>({
    queryKey: ['users', queryParams],
    queryFn: () => getUsers(accessToken, queryParams),
    keepPreviousData: true
  })

  useEffect(() => {
    if (isSuccess) {
      setUsers(data.docs)
    }
  }, [isSuccess, data])

  const handleChangeTab = (key: string) => {
    switch (key) {
      case '1':
        navigate({
          pathname: '/users',
          search: createSearchParams({
            _page: '1',
            _limit: '8',
            tab: key
          }).toString()
        })
        break
      case '2':
        navigate({
          pathname: '/users',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'active',
            tab: key
          }).toString()
        })
        break
      case '3':
        navigate({
          pathname: '/users',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            status: 'inactive',
            tab: key
          }).toString()
        })
        break
      default:
        navigate({
          pathname: '/users',
          search: createSearchParams({
            ...queryParams,
            _page: '1',
            tab: key
          }).toString()
        })
        break
    }
  }

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả người dùng',
      children: <MainUser totalDocs={data.totalDocs} isLoading={isFetching || isLoading} users={users} />
    },
    {
      key: '2',
      label: 'Người dùng đang hoạt dộng',
      children: <MainUser totalDocs={data.totalDocs} isLoading={isFetching || isLoading} users={users} />
    },
    {
      key: '3',
      label: 'Người dùng bị vô hiệu hóa',
      children: <MainUser totalDocs={data.totalDocs} isLoading={isFetching || isLoading} users={users} />
    }
  ]

  return (
    <div className='bg-gray-third py-[30px] px-[30px]'>
      <div>
        <Tabs defaultActiveKey={queryParams.tab || '1'} items={items} onChange={(value) => handleChangeTab(value)} />
      </div>
    </div>
  )
}

export default memo(UserPage)
