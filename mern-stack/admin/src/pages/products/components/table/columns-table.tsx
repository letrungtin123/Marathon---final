import { ArrowRestoreIcon, EyeIcon } from '@/components/icons'
import { ClearOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { TCategroyRefProduct, TProduct, TSize } from '@/types/product.type'
import { TImage, TModalType } from '@/types/common.type'
import { TableColumnsType, Tag, Tooltip } from 'antd'

import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface ColumnsTableProps {
  onDelete?: (values: TProduct[] | TProduct, is_deleled?: boolean) => void
  onDetail?: (record: TProduct) => void
  setOpenModalDelete?: (value: boolean) => void
  rowSelections?: TProduct[]
  getData?: (type: TModalType, data?: TProduct) => void
  onOpenModal?: (type: TModalType, data?: TProduct) => void
}

const ColumnsTable = ({
  onDelete,
  setOpenModalDelete,
  onDetail,
  rowSelections,
  getData
  // onOpenModal
}: ColumnsTableProps) => {
  const navigate = useNavigate()
  const columns: TableColumnsType<TProduct> = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'images',
      key: 'images',
      render: (images: TImage[], record: TProduct) => {
        return (
          <div className='flex gap-3'>
            <img
              src={images[0].url ? images[0].url : 'https://picsum.photos/536/354'}
              alt={images[0].public_id}
              className='w-[50px] flex-shrink-0 h-[50px] object-cover rounded-[5px]'
            />

            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <p className='!text-lg font-medium text-black-second'>{record?.nameProduct}</p>
                {record.sale > 0 && (
                  <div className='!text-xs bg-red-400 text-white rounded-sm p-0.5 px-2'>
                    Sale: {record.sale.toLocaleString()}đ
                  </div>
                )}
              </div>
              <p className='!text-xs text-slate-800 flex items-center gap-3'>
                <span className=''>{(record.price - record.sale).toLocaleString()}đ</span>
                <span className='text-gray-300 line-through'>{record.price.toLocaleString()}đ</span>
              </p>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: TCategroyRefProduct) => {
        return category?.nameCategory
      }
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand: TCategroyRefProduct) => {
        return brand?.nameBrand
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: string, record: TProduct) => {
        const { status, is_deleted } = record
        return (
          <Tag color={is_deleted ? 'red' : 'green'}>
            {status === 'inactive' && !is_deleted && 'Không hoạt động'}
            {status === 'active' && !is_deleted && 'Hoạt động'}
            {is_deleted && 'Đã xoá'}
          </Tag>
        )
      }
    },
    {
      title: 'Available Color',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes: TSize[]) => {
        return (
          <div className='flex items-center gap-3'>
            {sizes.map((size) => (
              <Tooltip
                key={size._id}
                title={
                  <ul className='min-w-[150px] list-disc p-4'>
                    <li>Tên size: {size.size}</li>
                    <li>Màu sắc: {size.color}</li>
                    <li>Số lượng: {size.quantity}</li>
                  </ul>
                }
              >
                <div
                  className='w-[20px] h-[20px] rounded-full shadow-xl shadow-black border border-x-gray-light cursor-pointer'
                  style={{ backgroundColor: size.color }}
                />
              </Tooltip>
            ))}
          </div>
        )
      }
    },
    {
      title: 'Active',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record: TProduct) => {
        return (
          <div className='flex items-center'>
            {record.is_deleted ? (
              <>
                <Tooltip title={'Khôi phục sản phẩm'}>
                  <button
                    className='h-8 px-4 border border-r-0 border-gray-400 rounded-r-none rounded-l-md '
                    onClick={() => onDelete && onDelete(record, false)}
                  >
                    <ArrowRestoreIcon />
                  </button>
                </Tooltip>
                <Tooltip title={'Xem chi tiết sản phẩm'}>
                  <Link
                    to={`/product/${record._id}`}
                    className='flex items-center h-8 px-4 border border-r-0 border-gray-400 rounded-none'
                  >
                    <EyeIcon height={20} width={20} />
                  </Link>
                </Tooltip>
                <Tooltip title={'Xoá vĩnh viễn'}>
                  <button
                    disabled={rowSelections && rowSelections.length > 0}
                    className={cn('h-8 px-4 border border-gray-400 rounded-l-none rounded-r-md', {
                      'cursor-not-allowed': rowSelections && rowSelections.length > 0
                    })}
                    onClick={() => {
                      setOpenModalDelete && setOpenModalDelete(true)
                      onDetail && onDetail(record)
                    }}
                  >
                    <ClearOutlined height={20} width={20} className='text-red-600' />
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title={'Cập nhật sản phẩm'}>
                  <button
                    className='h-8 px-4 border border-r-0 border-gray-400 rounded-r-none rounded-l-md '
                    onClick={() => getData && getData('edit', record)}
                  >
                    <EditOutlined height={20} width={20} />
                  </button>
                </Tooltip>
                <Tooltip title={'Xem chi tiết sản phẩm'}>
                  <button
                    className='h-8 px-4 border border-r-0 border-gray-400 rounded-none '
                    onClick={() => navigate(`/product/${record._id}`)}
                  >
                    <EyeIcon height={20} width={20} />
                  </button>
                </Tooltip>
                <Tooltip title={'Xoá sản phẩm'}>
                  <button
                    disabled={rowSelections && rowSelections.length > 0}
                    className={cn('h-8 px-4 border border-gray-400 rounded-l-none rounded-r-md', {
                      'cursor-not-allowed': rowSelections && rowSelections.length > 0
                    })}
                    onClick={() => {
                      setOpenModalDelete && setOpenModalDelete(true)
                      onDetail && onDetail(record)
                    }}
                  >
                    <DeleteOutlined height={20} width={20} className='text-red-600' />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
        )
      }
    }
  ]

  return columns
}

export default ColumnsTable
