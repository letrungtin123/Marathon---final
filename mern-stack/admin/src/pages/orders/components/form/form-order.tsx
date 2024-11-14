import { Button, Col, Drawer, Form, Row, Select, Space, message } from 'antd'
// import { CloseOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import QuillEditor from '@/components/qill-editor'
import { useAuth } from '@/contexts/auth-context'
import { TOrder, TOrderForm } from '@/types/order.type'
import { addOrder, editOrder } from '@/apis/order.api'
import { TModal, TResponse } from '@/types/common.type'

interface IFormOrderProps {
  currentData: TModal<TOrder>
  onClose: () => void
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TResponse<TOrder>, Error>>
}

const FormOrder = ({ currentData, onClose, refetch }: IFormOrderProps) => {
  const { accessToken } = useAuth()
  const [form] = Form.useForm()
  const queryClient = new QueryClient()
  const [value, setValue] = useState<string>('')

  // Define mutation to create order
  const createOrderMutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: (order: TOrderForm) => addOrder(order, accessToken),
    onSuccess: () => {
      message.success('Order created successfully')
      onClose()
      form.resetFields()
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Failed to create order')
    }
  })

  // Define mutation to edit order
  const editOrderMutation = useMutation({
    mutationKey: ['editOrder'],
    mutationFn: (data: { _id: string; status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled' }) =>
      editOrder(data, accessToken),
    onSuccess: () => {
      message.success('Order updated successfully')
      onClose()
      form.resetFields()
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Failed to update order')
    }
  })

  // Handle form submission
  const onSubmit = (data: TOrderForm) => {
    if (currentData.type === 'edit') {
      editOrderMutation.mutate({ _id: currentData.currentData!._id, status: data.status || 'pending' })
    } else {
      createOrderMutation.mutate(data)
    }
  }

  useEffect(() => {
    // Populate form data when editing an order
    if (currentData.type === 'edit' && currentData.currentData) {
      const dataOrder = currentData.currentData
      console.log('Setting form values:', dataOrder?.products)
      console.log('🚀 ~ useEffect ~ dataOrder:', dataOrder)
      form.resetFields()
      form.setFieldsValue({
        userId: dataOrder?.userId,
        status: dataOrder?.status,
        note: dataOrder?.note,
        paymentMethod: dataOrder?.paymentMethod,
        total: dataOrder?.total,
        products: [
          {
            color: dataOrder?.products,
            size: dataOrder?.products,
            quantity: dataOrder?.products,
            nameProduct: dataOrder?.products
          }
        ],
        infoOrderShipping: {
          name: dataOrder?.infoOrderShipping?.name,
          email: dataOrder?.infoOrderShipping?.email,
          phone: dataOrder?.infoOrderShipping?.phone,
          address: dataOrder?.infoOrderShipping?.address
        },
        reasonCancel: dataOrder?.reasonCancel
      })
      setValue(dataOrder.note || '')
    }
  }, [currentData, form])

  return (
    <Drawer
      title={currentData.type === 'add' ? 'Thêm đơn hàng' : 'Cập nhật đơn hàng'}
      onClose={onClose}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Đóng
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            loading={createOrderMutation.isLoading || editOrderMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Add Order' : 'Cập nhật'}
          </Button>
        </Space>
      }
    >
      {currentData.type !== 'view' && (
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={40}>
            <Col span={12}>
              <Form.Item label='Khách hàng'>
                <div>{currentData.currentData?.infoOrderShipping?.name} </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'total'}
                label='Tổng giá trị đơn hàng'
                rules={[{ required: true, message: 'Order total is required' }]}
              >
                <div>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                    currentData?.currentData?.total || 0
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'paymentMethod'}
                label='Phương thức thanh toán'
                rules={[{ required: true, message: 'Payment method is required' }]}
              >
                <div className='font-semibold flex ml-4'>{currentData.currentData?.paymentMethod}</div>
              </Form.Item>
            </Col>
            <Col span={9}>
              <Form.Item name={'status'} label='Trạng thái đơn hàng' className='w-25'>
                <Select value={currentData.currentData?.status} className='w-20 h-full'>
                  <Select.Option value='pending'>Đang chờ</Select.Option>
                  <Select.Option value='confirmed'>Đã xác nhận</Select.Option>
                  <Select.Option value='delivery'>Đang vận chuyển</Select.Option>
                  <Select.Option value='completed'>Đã hoàn thành</Select.Option>
                  <Select.Option value='cancelled'> Đã hủy</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'products'} label='Sản phẩm'>
                {currentData.currentData?.products.map((product, index) => (
                  <div key={index} className='ml-4 mb-2'>
                    <div>
                      <strong>Tên sản phẩm:</strong> {product.productId?.nameProduct}
                    </div>
                    <div>
                      <strong>Số lượng:</strong> {product.quantity}
                    </div>
                    <div>
                      <strong>Màu:</strong> {product.color}
                    </div>
                    <div>
                      <strong>Kích cỡ:</strong> {product.size}
                    </div>
                    <div>
                      <strong>Giá:</strong>{' '}
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </div>
                    <hr />
                  </div>
                ))}
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={'note'} label='Ghi chú'>
                <QuillEditor value={value} onChange={setValue} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Drawer>
  )
}

export default FormOrder
