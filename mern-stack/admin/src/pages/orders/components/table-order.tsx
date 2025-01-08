import { orderApi } from '@/apis/order.api'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TOrder, TOrderStatus } from '@/types/order.type'
import { TProduct } from '@/types/product.type'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { CheckOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, message, Space, Table, Tag, Tooltip } from 'antd'
import { ColumnType } from 'antd/es/table'
import { useState } from 'react'
import ModalOrderCancel from './modal-order-cancel'
import ModalOrderDetail from './modal-order-detail'

interface TableOrderProps {
  data?: TOrder[]
}

interface IModalOrderDetail {
  isVisible: boolean
  order: TOrder | null
}

interface IModalOrderCancel {
  isVisible: boolean
  idOrder: string | null
}

const TableOrder = ({ data }: TableOrderProps) => {
  const params = useQueryParams()
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const columns: ColumnType<TOrder>[] = [
    {
      title: 'Thông tin người nhận',
      dataIndex: '_id',
      key: '_id',
      render: (_: string, order: TOrder) => {
        return (
          <div className='flex gap-3'>
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <p className='!text-lg font-medium text-black-second'>{order?.infoOrderShipping?.name}</p>
              </div>
              <p className='!text-xs text-slate-800 flex items-center gap-3'>
                <span className=''>{order?.infoOrderShipping?.phone}</span>
              </p>
              <p className=''>{order?.infoOrderShipping?.email}</p>
              <p className=''>{order?.infoOrderShipping?.address}</p>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Ngày đặt đơn',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => formatDate(createdAt, { format: 'DD/MM/YYYY HH:mm:ss' })
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${formatCurrency(total)} VNĐ`
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod: string) => <Tag>{paymentMethod}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag>{status}</Tag>
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products: TProduct[]) => {
        return products.length
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (note: string) => <p className='truncate'>{note}</p>
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      key: 'action',
      render: (_: string, order: TOrder) => {
        return (
          <Space>
            <Tooltip title='Xem đơn hàng'>
              <Button
                type='dashed'
                className='border-solid'
                icon={<FileDoneOutlined />}
                onClick={() => setModalOrderDetail({ isVisible: true, order })}
              ></Button>
            </Tooltip>
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <Tooltip title={handleRenderData()?.title}>
                <Button icon={<CheckOutlined />} onClick={() => handleRenderData()?.onClick(order)}></Button>
              </Tooltip>
            )}
            {/* {order.status === 'pending' && (
              <Tooltip title='Huỷ đơn hàng'>
                <Popconfirm
                  title='Bạn có chắc chắn muốn huỷ đơn hàng này không?'
                  onConfirm={() =>
                    setModalOrderCancel({
                      isVisible: true,
                      idOrder: order._id
                    })
                  }
                >
                  <Button danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>
              </Tooltip>
            )} */}
          </Space>
        )
      }
    }
  ]

  const [modalOrderDetail, setModalOrderDetail] = useState<IModalOrderDetail>({
    isVisible: false,
    order: null
  })

  const [modalOrderCancel, setModalOrderCancel] = useState<IModalOrderCancel>({
    isVisible: false,
    idOrder: null
  })

  const updateOrderStatusMutation = useMutation({
    mutationKey: ['update-order-status'],
    mutationFn: (body: { status: TOrderStatus; _id: string }) =>
      orderApi.updateOrderStatus(body._id, { status: body.status }, accessToken),
    onSuccess: () => {
      message.success('Xác nhận đơn hàng thành công!')
      queryClient.invalidateQueries({ queryKey: ['orders', params] })
    }
  })

  const handleRenderData = () => {
    switch (params?.status) {
      case 'pending':
        return {
          title: 'Xác nhận đơn hàng',
          onClick: (order: TOrder) => {
            updateOrderStatusMutation.mutate({ status: 'confirmed', _id: order._id })
          }
        }
      case 'confirmed':
        return {
          title: 'Đơn hàng đã xác nhận',
          onClick: (order: TOrder) => {
            updateOrderStatusMutation.mutate({ status: 'delivery', _id: order._id })
          }
        }
      case 'delivery':
        return {
          title: 'Đơn hàng đang giao',
          onClick: (order: TOrder) => {
            updateOrderStatusMutation.mutate({ status: 'completed', _id: order._id })
          }
        }
      default:
        return {
          title: '',
          onClick: () => {}
        }
    }
  }

  return (
    <>
      <Table columns={columns} dataSource={data} scroll={{ x: 1500 }} />
      <ModalOrderDetail
        isVisible={modalOrderDetail.isVisible}
        order={modalOrderDetail.order}
        onClose={() => setModalOrderDetail({ isVisible: false, order: null })}
      />
      {modalOrderCancel.idOrder && (
        <ModalOrderCancel
          isVisible={modalOrderCancel.isVisible}
          idOrder={modalOrderCancel.idOrder}
          onClose={() => setModalOrderCancel({ isVisible: false, idOrder: null })}
        />
      )}
    </>
  )
}

// áo thun nam dài tay
// slug: ao-thun-nam-dai-tay-234567893456789

export default TableOrder
