import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, Switch, message } from 'antd'
// import { CloseOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation
  // useQuery
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import QuillEditor from '@/components/qill-editor'
import { useAuth } from '@/contexts/auth-context'
import { TOrder, TOrderForm, TOrderFormEdit } from '@/types/order.type'
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

  // Create Order Mutation
  const createOrderMutation = useMutation({
    mutationKey: ['createOrder'],
    mutationFn: (order: TOrderForm) => addOrder(order, accessToken),
    onSuccess: () => {
      message.success('Thêm đơn hàng thành công')
      onClose()
      form.resetFields()
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Thêm đơn hàng thất bại')
    }
  })

  // Edit Order Mutation
  const editOrderMutation = useMutation({
    mutationKey: ['editOrder'],
    mutationFn: (data: TOrderFormEdit) => editOrder(data, accessToken),
    onSuccess: () => {
      message.success('Cập nhật đơn hàng thành công')
      onClose()
      form.resetFields()
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: () => {
      message.error('Cập nhật đơn hàng thất bại')
    }
  })

  // Handle form submission
  const onSubmit = (data: TOrderForm) => {
    const dataOrder: TOrderForm = {
      ...data,
      status: data.status || 'pending'
    }

    if (currentData.type === 'add') {
      createOrderMutation.mutate(dataOrder)
    } else if (currentData.type === 'edit') {
      editOrderMutation.mutate({ ...dataOrder, _id: currentData.currentData!._id })
    }
  }

  useEffect(() => {
    if (currentData.type === 'edit' && currentData.currentData) {
      const dataOrder = currentData.currentData
      form.setFieldsValue({
        userId: dataOrder?.userId,
        status: dataOrder?.status,
        note: dataOrder?.note,
        paymentMethod: dataOrder?.paymentMethod,
        total: dataOrder?.total,
        products: dataOrder?.products,
        inforOrderShipping: dataOrder?.inforOrderShipping,
        assignee: dataOrder?.assignee,
        reasonCancel: dataOrder?.reasonCancel
      })
      setValue(dataOrder.note)
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
            Đóng đơn hàng
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            loading={createOrderMutation.isLoading || editOrderMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Thêm đơn hàng' : 'Cập nhật đơn hàng'}
          </Button>
        </Space>
      }
    >
      {currentData.type !== 'view' && (
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={40}>
            <Col span={12}>
              <Form.Item
                name={'nameProduct'}
                label='Tên đơn hàng'
                rules={[{ required: true, message: 'Tên đơn hàng là bắt buộc' }]}
              >
                <Input size='large' placeholder='Tên đơn hàng' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'total'}
                label='Tổng giá trị đơn hàng'
                rules={[{ required: true, message: 'Tổng giá trị đơn hàng là bắt buộc' }]}
              >
                <InputNumber className='w-full' size='large' placeholder='Tổng giá trị' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'paymentMethod'}
                label='Phương thức thanh toán'
                rules={[{ required: true, message: 'Phương thức thanh toán là bắt buộc' }]}
              >
                <Select size='large' placeholder='Phương thức thanh toán'>
                  <Select.Option value='cod'>COD</Select.Option>
                  <Select.Option value='payment'>Thanh toán online</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'status'} label='Trạng thái đơn hàng'>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name={'note'} label='Ghi chú đơn hàng'>
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
