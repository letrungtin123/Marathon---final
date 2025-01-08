import { orderApi } from '@/apis/order.api'
import { useQueryParams } from '@/hooks/useQueryParams'
import { TCancelOrder } from '@/types/order.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, message, Modal, Space } from 'antd'
import { omit } from 'lodash'

interface IModalOrderCancel {
  isVisible: boolean
  idOrder: string
  onClose: () => void
}
const ModalOrderCancel = ({ isVisible, idOrder, onClose }: IModalOrderCancel) => {
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const params = useQueryParams()

  // huỷ đơn hàng
  const cancelOrderMutation = useMutation({
    mutationKey: ['cancel-order'],
    mutationFn: (body: TCancelOrder & { _id: string }) => orderApi.cancelOrder(body._id, omit(body, '_id')),
    onSuccess: (data) => {
      console.log('🚀 ~ OrderStatus ~ data:', data)
      message.success('Huỷ đơn hàng thành công')
      queryClient.invalidateQueries({ queryKey: ['orders', params] })
    }
  })

  const onFinish = (value: { message: string }) => {
    cancelOrderMutation.mutate({ message: value.message, status: 'cancelled', _id: idOrder })
  }

  return (
    <Modal
      title='Huỷ đơn hàng'
      open={isVisible}
      onCancel={onClose}
      footer={
        <Space>
          <Button type='dashed' danger className='text-red-500 border-solid'>
            Huỷ
          </Button>
          <Button type='primary' className='text-white border-solid' onClick={() => form.submit()}>
            Gửi
          </Button>
        </Space>
      }
    >
      <Form layout='vertical' form={form} onFinish={onFinish}>
        <Form.Item name='message' rules={[{ required: true, message: 'Lý do huỷ đơn hàng không được để trống' }]}>
          <Input.TextArea placeholder='Lý do huỷ đơn hàng' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalOrderCancel
