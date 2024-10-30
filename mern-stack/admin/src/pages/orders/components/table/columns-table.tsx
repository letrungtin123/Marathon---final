import { EyeIcon } from '@/components/icons'
import { EditOutlined } from '@ant-design/icons'
import { TAssignee, TInforOrderShipping, TOrder } from '@/types/order.type'
import { TModalType } from '@/types/common.type'
import { TableColumnsType, Tag, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

interface ColumnsTableProps {
  // onDetail?: (record: TOrder) => void
  // setOpenModalDelete?: (value: boolean) => void
  rowSelections?: TOrder[]
  getData?: (type: TModalType, data?: TOrder) => void
  // onOpenModal?: (type: TModalType, data?: TOrder) => void
}

const ColumnsTable = ({ getData }: ColumnsTableProps) => {
  const navigate = useNavigate()
  const columns: TableColumnsType<TOrder> = [
    {
      title: 'Khách hàng',
      dataIndex: 'infoOrderShipping',
      key: 'infoOrderShipping',
      render: (infoOrderShipping: TInforOrderShipping) => {
        return infoOrderShipping?.name
      }
    },
    {
      title: 'Ngày tạo đơn',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: string, record: TOrder) => {
        const createdAt = record
        return dayjs(createdAt?.createdAt).format('DD/MM/YYYY')
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (_: string, record: TOrder) => {
        const totalPrice = record
        return totalPrice?.total
      }
    },
    {
      title: 'Nhân viên đảm nhận',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (record: TAssignee) => {
        const assignee = record
        return assignee?.fullname
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_: string, record: TOrder) => {
        const { status } = record
        return (
          <Tag
            color={
              status === 'pending'
                ? 'yellow'
                : status === 'confirmed'
                  ? 'green'
                  : status === 'delivery'
                    ? 'orange'
                    : status === 'completed'
                      ? 'green'
                      : status === 'cancelled'
                        ? 'red'
                        : 'orange'
            }
          >
            {status === 'pending'
              ? 'Đang chờ'
              : status === 'confirmed'
                ? 'Đã xác nhận'
                : status === 'delivery'
                  ? 'Đang vận chuyển'
                  : status === 'completed'
                    ? 'Đã hoàn thành'
                    : status === 'cancelled'
                      ? 'Đã hủy'
                      : 'Đang xử lý'}
          </Tag>
        )
      }
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, record: TOrder) => {
        return (
          <div className='flex items-center'>
            <>
              <Tooltip title={'Cập nhật đơn hàng'}>
                <button
                  className='h-8 px-4 border border-r-0 border-gray-400 rounded-r-none rounded-l-md'
                  onClick={() => getData && getData('edit', record)}
                >
                  <EditOutlined height={20} width={20} />
                </button>
              </Tooltip>
              <Tooltip title={'Xem chi tiết đơn hàng'}>
                <button
                  className='h-8 px-4 border  border-gray-400 rounded-none rounded-r-md'
                  onClick={() => navigate(`/order/${record._id}`)}
                >
                  <EyeIcon height={20} width={20} />
                </button>
              </Tooltip>
            </>
          </div>
        )
      }
    }
  ]

  return columns
}

export default ColumnsTable
