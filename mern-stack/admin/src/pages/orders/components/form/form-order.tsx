import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Switch, message } from 'antd'
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
      console.log('Setting form values:', dataOrder?.infoOrderShipping)
      console.log('🚀 ~ useEffect ~ dataOrder:', dataOrder)
      form.resetFields()
      form.setFieldsValue({
        userId: dataOrder?.userId,
        status: dataOrder?.status,
        note: dataOrder?.note,
        paymentMethod: dataOrder?.paymentMethod,
        total: dataOrder?.total,
        products: dataOrder?.products,
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
  console.log('🚀 ~ useEffect ~ currentData.currentData:', currentData.currentData)
  return (
    <Drawer
      title={currentData.type === 'add' ? 'Add Order' : 'Update Order'}
      onClose={onClose}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Close
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            loading={createOrderMutation.isLoading || editOrderMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Add Order' : 'Update Order'}
          </Button>
        </Space>
      }
    >
      {currentData.type !== 'view' && (
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={40}>
            <Col span={12}>
              <Form.Item label='Customer Name' name={['infoOrderShipping', 'name']}>
                <Input value={currentData.currentData?.infoOrderShipping?.name} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'total'}
                label='Order Total'
                rules={[{ required: true, message: 'Order total is required' }]}
              >
                <InputNumber
                  className='w-full'
                  size='large'
                  placeholder='Total amount'
                  disabled={currentData.type === 'edit'}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'paymentMethod'}
                label='Payment Method'
                rules={[{ required: true, message: 'Payment method is required' }]}
              >
                <Input size='large' placeholder='Payment method' disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'status'} label='Order Status'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={'note'} label='Order Note'>
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
