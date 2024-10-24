import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Popconfirm, Switch, TableColumnsType, Tag, Tooltip } from 'antd'

import { TModalType } from '@/types/common.type'
import { cn } from '@/utils/cn'
import { TBrand } from '@/types/brand.type'

interface ColumnBrandProps {
  onOpenModal: (type: TModalType, data?: TBrand) => void
  onToggleStatusBrand: (value: boolean, record: TBrand) => void
  onDeleteBrand: (id: string) => void
}

export const ColumnBrand = ({ onDeleteBrand, onToggleStatusBrand, onOpenModal }: ColumnBrandProps) => {
  const columns: TableColumnsType<TBrand> = [
    {
      title: 'Thông tin thương hiệu',
      dataIndex: 'nameBrand',
      key: 'nameBrand',
      render: (nameBrand: string, record) => {
        return (
          <div className='flex gap-3'>
            <img
              src={record.image ?? 'https://picsum.photos/536/354'}
              alt={record.nameBrand}
              className='w-[50px] flex-shrink-0 h-[50px] object-cover rounded-[5px]'
            />

            <div className='flex items-center gap-2'>
              <p className='!text-lg font-medium text-black-second'>{nameBrand}</p>
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
      render: (status: string, record: TBrand) => {
        const isActive = status === 'active'
        return <Switch checked={isActive} onChange={(value) => onToggleStatusBrand(value, record)} />
      }
    },
    {
      title: null,
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: TBrand) => {
        return (
          <>
            <Tooltip title={'Cập nhật thương hiệu sản phẩm'}>
              <button
                className='h-8 px-4 border border-r-0 border-gray-400 rounded-r-none rounded-l-md '
                onClick={() => onOpenModal('edit', record)}
              >
                <EditOutlined height={20} width={20} />
              </button>
            </Tooltip>

            <Tooltip title={'Xoá thương hiệu'}>
              <Popconfirm title='Delete brand?' onConfirm={() => onDeleteBrand(record._id)}>
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
