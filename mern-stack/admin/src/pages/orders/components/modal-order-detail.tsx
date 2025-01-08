import { TOrder, TOrderProduct } from '@/types/order.type'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Card, Descriptions, Divider, Drawer, Table, Tag, Typography } from 'antd'

interface IModalOrderDetail {
  isVisible: boolean
  order: TOrder | null
  onClose: () => void
}

const { Title } = Typography

const ModalOrderDetail = ({ isVisible, order, onClose }: IModalOrderDetail) => {
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, order: TOrderProduct) => {
        return <div>{order?.productId?.nameProduct}</div>
      }
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        return <p>{formatCurrency(price)} VNĐ</p>
      }
    }
  ]

  return (
    <Drawer title='Xem chi tiết đơn hàng' open={isVisible} onClose={onClose} width={1000}>
      <Card className='w-full'>
        <div className='flex justify-between items-center'>
          {/* h3 */}
          <Title level={3} className='!m-0'>
            <ShoppingCartOutlined className='mr-2' />
            Chi tiết đơn hàng
          </Title>
          <Tag color='blue' className='text-sm capitalize px-3 py-1'>
            {order?.status}
          </Tag>
        </div>

        <Divider orientation='left'>Thông tin người nhận</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label='Họ và tên'>{order?.infoOrderShipping.name}</Descriptions.Item>
          <Descriptions.Item label='Email'>{order?.infoOrderShipping.email}</Descriptions.Item>
          <Descriptions.Item label='Địa chỉ'>{order?.infoOrderShipping.address}</Descriptions.Item>
          <Descriptions.Item label='Số điện thoại'>{order?.infoOrderShipping.phone}</Descriptions.Item>
        </Descriptions>

        <Divider orientation='left'>Thông tin thanh toán</Divider>
        <Descriptions bordered column={2}>
          <Descriptions.Item label='Phương thức thanh toán'>{order?.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label='Ngày tạo'>
            {formatDate(order?.createdAt ?? '', { format: 'DD/MM/YYYY HH:mm' })}
          </Descriptions.Item>
          <Descriptions.Item label='Số tiền'>{formatCurrency(order?.total ?? 0)} VNĐ</Descriptions.Item>
        </Descriptions>

        <Divider orientation='left'>Các sản phẩm</Divider>
        <Table columns={columns} dataSource={order?.products} pagination={false} rowKey={(record) => record._id} />
      </Card>
    </Drawer>
  )
}

export default ModalOrderDetail
