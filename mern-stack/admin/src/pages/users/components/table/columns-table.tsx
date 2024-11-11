import { Switch, TableColumnsType, Tag } from 'antd'
import dayjs from 'dayjs'
import { TUser } from '@/types/user.type'

interface ColumnUserProps {
  onToggleStatusUser: (value: boolean, record: TUser) => void
}

export const ColumnsTableUser = ({ onToggleStatusUser }: ColumnUserProps) => {
  const columns: TableColumnsType<TUser> = [
    {
      title: 'Khách hàng',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (_: string, record: TUser) => {
        const fullname = record
        return fullname?.fullname
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (_: string, record: TUser) => {
        const email = record
        return email?.email
      }
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_: string, record) => {
        return (
          <div className='flex gap-3'>
            <img
              src={record.avatar ?? 'https://picsum.photos/536/354'}
              alt={record.avatar}
              className='w-[50px] flex-shrink-0 h-[50px] object-cover rounded-[5px]'
            />
          </div>
        )
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (_: string, record: TUser) => {
        const phone = record
        return phone?.phone
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (_: string, record: TUser) => {
        const address = record
        return address?.address
      }
    },
    {
      title: 'Ngày tạo tài khoản',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: TUser, b: TUser) => {
        return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
      },
      defaultSortOrder: 'descend',
      render: (_: string, record: TUser) => {
        const createdAt = record
        return dayjs(createdAt?.createdAt).format('DD/MM/YYYY')
      }
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: TUser, b: TUser) => {
        return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix()
      },
      defaultSortOrder: 'descend',
      render: (_: string, record: TUser) => {
        const updatedAt = record
        return dayjs(updatedAt?.updatedAt).format('DD/MM/YYYY')
      }
    },
    {
      title: 'Thay đổi trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: TUser) => {
        const isActive = status === 'active'
        return <Switch checked={isActive} onChange={(value) => onToggleStatusUser(value, record)} />
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: string, record: TUser) => {
        const { status } = record
        return (
          <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'red'}>
            {status === 'active' ? 'Đang hoạt động' : status === 'inactive' ? 'Đã bị vô hiệu hóa' : 'Đang xử lý'}
          </Tag>
        )
      }
    }
  ]

  return columns
}

export default ColumnsTableUser
