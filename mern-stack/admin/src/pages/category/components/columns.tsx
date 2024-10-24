import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Popconfirm, Switch, TableColumnsType, Tag, Tooltip } from 'antd'

import { TCategory } from '@/types/category.type'
import { TModalType } from '@/types/common.type'
import { cn } from '@/utils/cn'

interface ColumnCategoryProps {
  onOpenModal: (type: TModalType, data?: TCategory) => void
  onToggleStatusCategory: (value: boolean, record: TCategory) => void
  onDeleteCategory: (id: string) => void
}

export const ColumnCategory = ({ onDeleteCategory, onToggleStatusCategory, onOpenModal }: ColumnCategoryProps) => {
  const columns: TableColumnsType<TCategory> = [
    {
      title: 'Thông tin danh mục',
      dataIndex: 'nameCategory',
      key: 'nameCategory',
      render: (nameCategory: string, record) => {
        return (
          <div className='flex gap-3'>
            <img
              src={record.image ?? 'https://picsum.photos/536/354'}
              alt={record.nameCategory}
              className='w-[50px] flex-shrink-0 h-[50px] object-cover rounded-[5px]'
            />

            <div className='flex items-center gap-2'>
              <p className='!text-lg font-medium text-black-second'>{nameCategory}</p>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const isActive = status === 'active'
        return <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hoạt động' : 'Không hoạt động'}</Tag>
      }
    },
    {
      title: 'Thay đổi trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: TCategory) => {
        const isActive = status === 'active'
        return <Switch checked={isActive} onChange={(value) => onToggleStatusCategory(value, record)} />
      }
    },
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: TCategory) => {
        return (
          <>
            <Tooltip title={'Cập nhật danh mục sản phẩm'}>
              <button
                className='h-8 px-4 border border-r-0 border-gray-400 rounded-r-none rounded-l-md '
                onClick={() => onOpenModal('edit', record)}
              >
                <EditOutlined height={20} width={20} />
              </button>
            </Tooltip>

            <Tooltip title={'Xoá danh mục'}>
              <Popconfirm title='Delete category?' onConfirm={() => onDeleteCategory(record._id)}>
                <button className={cn('h-8 px-4 border border-gray-400 rounded-l-none rounded-r-md')}>
                  <DeleteOutlined height={20} width={20} className='text-red-600' />
                </button>
              </Popconfirm>
            </Tooltip>
          </>
        )
      }
    }
  ]

  return columns
}
