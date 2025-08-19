// components/tableorder.tsx
import { orderApi } from '@/apis/order.api'
import { useAuth } from '@/contexts/auth-context'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TOrder, TOrderStatus } from '@/types/order.type'
import { TProduct } from '@/types/product.type'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { CheckOutlined, FileDoneOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Space, Table, Tag, Tooltip } from 'antd'
import { ColumnType } from 'antd/es/table'
import { useEffect, useMemo, useRef, useState } from 'react'
import ModalOrderCancel from './modal-order-cancel'
import ModalOrderDetail from './modal-order-detail'

interface IModalOrderDetail {
  isVisible: boolean
  order: TOrder | null
}

interface IModalOrderCancel {
  isVisible: boolean
  idOrder: string | null
}

const TableOrder = () => {
  const params = useQueryParams() // Đọc filter ?status=
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  // 🔢 State phân trang local (điều khiển hoàn toàn)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Đổi filter -> quay về trang 1
  useEffect(() => {
    setPage(1)
  }, [params?.status])

  // 🧲 Fetch theo state page/pageSize, KHÔNG phụ thuộc data.page
  const { data, isFetching } = useQuery({
    queryKey: ['orders', { page, limit: pageSize, status: params?.status }],
    queryFn: () =>
      orderApi.getAllOrders({ page, limit: pageSize, status: params?.status, sort: '-createdAt' }, accessToken),
    keepPreviousData: true,
    enabled: !!accessToken
  })

  const docs = data?.docs ?? []
  const totalDocs = Number(data?.totalDocs ?? 0)

  // 🔁 Sort mới nhất lên đầu (phòng backend chưa sort)
  const sortedData = useMemo(
    () => [...docs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [docs]
  )

  // 🧠 Theo dõi đơn mới nhất để tự về trang 1 khi có đơn mới
  const newestCreatedAtRef = useRef<number | null>(null)
  useEffect(() => {
    if (!sortedData.length) return
    const currentNewest = new Date(sortedData[0].createdAt).getTime()

    if (newestCreatedAtRef.current === null) {
      newestCreatedAtRef.current = currentNewest
      return
    }

    if (currentNewest > (newestCreatedAtRef.current ?? 0)) {
      newestCreatedAtRef.current = currentNewest
      if (page !== 1) setPage(1)
      return
    }

    newestCreatedAtRef.current = currentNewest
  }, [sortedData, page])

  // Modals
  const [modalOrderDetail, setModalOrderDetail] = useState<IModalOrderDetail>({
    isVisible: false,
    order: null
  })
  const [modalOrderCancel, setModalOrderCancel] = useState<IModalOrderCancel>({
    isVisible: false,
    idOrder: null
  })

  // ✅ Update trạng thái đơn → invalidate toàn bộ list
  const updateOrderStatusMutation = useMutation({
    mutationKey: ['update-order-status'],
    mutationFn: (body: { status: TOrderStatus; _id: string }) =>
      orderApi.updateOrderStatus(body._id, { status: body.status }, accessToken),
    onSuccess: () => {
      message.success('Cập nhật trạng thái đơn hàng thành công!')
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false })
    }
  })

  const handleRenderData = () => {
    switch (params?.status) {
      case 'pending':
        return {
          title: 'Xác nhận đơn hàng',
          onClick: (order: TOrder) => updateOrderStatusMutation.mutate({ status: 'confirmed', _id: order._id })
        }
      case 'confirmed':
        return {
          title: 'Đơn hàng đã xác nhận',
          onClick: (order: TOrder) => updateOrderStatusMutation.mutate({ status: 'delivery', _id: order._id })
        }
      case 'delivery':
        return {
          title: 'Đơn hàng đang giao',
          onClick: (order: TOrder) => updateOrderStatusMutation.mutate({ status: 'completed', _id: order._id })
        }
      default:
        return { title: '', onClick: () => {} }
    }
  }

  const columns: ColumnType<TOrder>[] = [
    {
      title: 'Thông tin người nhận',
      dataIndex: '_id',
      key: '_id',
      render: (_: string, order: TOrder) => (
        <div className='flex gap-3'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <p className='!text-lg font-medium text-black-second'>{order?.infoOrderShipping?.name}</p>
            </div>
            <p className='!text-xs text-slate-800 flex items-center gap-3'>
              <span>{order?.infoOrderShipping?.phone}</span>
            </p>
            <p>{order?.infoOrderShipping?.email}</p>
            <p>{order?.infoOrderShipping?.address}</p>
          </div>
        </div>
      )
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
      render: (products: TProduct[]) => products.length
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
      render: (_: string, order: TOrder) => (
        <Space>
          <Tooltip title='Xem đơn hàng'>
            <Button
              type='dashed'
              className='border-solid'
              icon={<FileDoneOutlined />}
              onClick={() => setModalOrderDetail({ isVisible: true, order })}
            />
          </Tooltip>
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <Tooltip title={handleRenderData()?.title}>
              <Button icon={<CheckOutlined />} onClick={() => handleRenderData()?.onClick(order)} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey='_id'
        loading={isFetching}
        scroll={{ x: 1500 }}
        pagination={{
          // ❗ Điều khiển bằng state, KHÔNG dùng data?.page nữa
          current: page,
          pageSize,
          total: totalDocs, // = 166 từ API của bạn
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (p, ps) => {
            setPage(p)
            setPageSize(ps)
          },
          onShowSizeChange: (p, ps) => {
            setPage(1) // đổi size → về trang 1 cho chắc
            setPageSize(ps)
          }
        }}
      />

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

export default TableOrder
