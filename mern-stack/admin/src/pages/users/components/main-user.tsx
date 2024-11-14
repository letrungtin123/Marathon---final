import { TModalType, TQueryParams } from '@/types/common.type'
import { Table } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'

// import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import ColumnsTableUser from './table/columns-table'
import { TUser } from '@/types/user.type'
import { useEditUser } from './hooks/useUser'

// import { useState } from 'react'

interface MainUserProps {
  users: TUser[]
  totalDocs: number
  isLoading?: boolean
  getData?: (type: TModalType, data?: TUser) => void
}

const MainUser = ({ users, isLoading, totalDocs }: MainUserProps) => {
  const navigate = useNavigate()

  const queryParams: TQueryParams = useQueryParams()
  const { _limit, _page } = queryParams

  // update User
  const { handleEditUser } = useEditUser()

  const handleToggleStatusUser = (value: boolean, record: TUser) => {
    const status = value === true ? 'active' : 'inactive'

    const newUser: TUser = {
      // _id: record._id,
      // createdAt: record.createdAt,
      // desc: record.desc,
      // image: record.image,
      // nameUser: record.nameUser,
      // products: record.products,
      // updatedAt: record.updatedAt,
      ...record,
      status: status
    }

    handleEditUser(newUser)
  }
  const columns = ColumnsTableUser({
    onToggleStatusUser: handleToggleStatusUser
  })
  // const { accessToken } = useAuth()

  // const [order, seTUser] = useState<TUser>()

  //onOpenModal

  return (
    <div className=''>
      <Table
        loading={isLoading}
        rowKey={(record) => record._id}
        dataSource={users}
        columns={columns}
        pagination={{
          current: Number(_page) || 1,
          pageSize: Number(_limit) || 8,
          total: totalDocs,
          onChange: (page, pageSize) => {
            navigate({
              pathname: '/users',
              search: createSearchParams({
                _page: page.toString(),
                _limit: pageSize.toString()
              }).toString()
            })
          },
          showTotal(total, range) {
            return (
              <div className='flex items-center justify-between w-full mr-auto text-black-second'>
                Hiển thị {range[0]}-{range[1]} của tổng {total} người dùng
              </div>
            )
          }
        }}
      />
    </div>
  )
}

export default MainUser
