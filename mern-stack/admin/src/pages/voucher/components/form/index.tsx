import { TModal } from '@/types/common.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, DatePicker, Drawer, Form, Input, Space, message } from 'antd'
import { useEffect, useState } from 'react'
import QuillEditor from '@/components/qill-editor'
import { useAuth } from '@/contexts/auth-context'
import { useForm } from 'antd/es/form/Form'
import { TFormVoucher, TVoucher } from '@/types/voucher.type'
import { createVoucher, updateVoucher } from '@/apis/voucher.api'
import moment from 'moment'

interface IFormVoucher {
  currentData: TModal<TVoucher>
  onClose: () => void
}

const FormVoucher = ({ currentData, onClose }: IFormVoucher) => {
  const { accessToken } = useAuth()
  const [value, setValue] = useState<string>('')
  const queryClient = useQueryClient()

  const updateVoucherMutation = useMutation({
    mutationKey: ['update-voucher'],
    mutationFn: (body: TVoucher) => updateVoucher(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      message.success('Update Voucher successfully!')
      form.resetFields()
      onClose()
    },
    onError: () => {
      message.error('Update Voucher failed!')
    }
  })

  const [form] = useForm()

  const createVoucherMutation = useMutation({
    mutationKey: ['create-voucher'],
    mutationFn: (body: TFormVoucher) => createVoucher(body, accessToken),
    onSuccess: () => {
      message.success('Thêm khuyến mãi thành công!')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      form.resetFields()
      onClose()
    },
    onError: () => {
      message.error('Thêm khuyến mãi thất bại!')
    }
  })

  const handleSubmit = (value: TFormVoucher) => {
    const bodyData: TFormVoucher = {
      code: value.code,
      discount: value.discount,
      status: value.status,
      desc: value.desc || '',
      startDate: value.startDate,
      endDate: value.endDate,
      voucherPrice: value.voucherPrice,
      applicablePrice: value.applicablePrice
    }

    if (currentData.type === 'add') {
      createVoucherMutation.mutate(bodyData)
    }

    if (currentData.type === 'edit' && currentData.currentData) {
      const { currentData: voucher } = currentData
      updateVoucherMutation.mutate({
        ...voucher,
        ...bodyData
      })
    }
  }

  useEffect(() => {
    if (currentData.type === 'edit') {
      const { currentData: voucher } = currentData
      // const voucher2 = currentData.currentData
      form.setFieldsValue({
        code: voucher?.code ?? '',
        desc: voucher?.desc ?? '',
        discount: voucher?.discount ?? '',
        status: voucher?.status ?? '',
        startDate: voucher?.startDate ? moment(voucher.startDate) : null,
        endDate: voucher?.endDate ? moment(voucher.endDate) : null,
        voucherPrice: voucher?.voucherPrice ?? '',
        applicablePrice: voucher?.applicablePrice ?? ''
      })
    }
  }, [currentData, form])

  return (
    <Drawer
      title={currentData.type === 'add' ? 'Thêm khuyến mãi' : 'Cập nhật lại khuyến mãi'}
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Đóng khuyến mãi
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            disabled={createVoucherMutation.isLoading}
            loading={createVoucherMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Thêm khuyến mãi' : 'Cập nhật lại khuyến mãi'}
          </Button>
        </Space>
      }
    >
      <Form layout='vertical' form={form} onFinish={handleSubmit}>
        <Form.Item
          name='code'
          label='Mã khuyến mãi (COL + 10 số)'
          rules={[{ required: true, message: 'Mã khuyến mãi là bắt buộc' }]}
        >
          <Input placeholder='Mã khuyến mãi' size='large' />
        </Form.Item>
        <Form.Item
          name='discount'
          label='Số lượng khuyến mãi'
          rules={[{ required: true, message: 'số lượng khuyến mãi là bắt buộc' }]}
        >
          <Input placeholder='số lượng khuyến mãi' size='large' />
        </Form.Item>
        <Form.Item
          name='voucherPrice'
          label='Giá trị khuyến mãi'
          rules={[{ required: true, message: 'Giá trị khuyến mãi là bắt buộc' }]}
        >
          <Input placeholder='Giá trị khuyến mãi' size='large' />
        </Form.Item>
        <Form.Item
          name='applicablePrice'
          label='Áp dụng cho đơn hàng'
          rules={[{ required: true, message: 'Áp dụng cho đơn hàng là bắt buộc' }]}
        >
          <Input placeholder='Áp dụng cho đơn hàng' size='large' />
        </Form.Item>
        <Form.Item
          name='startDate'
          label='Ngày hiệu lực'
          rules={[{ type: 'object', required: true, message: 'Ngày hiệu lực là bắt buộc' }]}
        >
          <DatePicker
            placeholder='Ngày hiệu lực'
            size='large'
            format='DD/MM/YYYY'
            value={currentData.currentData?.startDate ? moment(currentData.currentData.startDate, 'DD/MM/YYYY') : null}
          />
        </Form.Item>
        <Form.Item
          name='endDate'
          label='Ngày hết hạn'
          rules={[{ type: 'object', required: true, message: 'Ngày hết hạn là bắt buộc' }]}
        >
          <DatePicker
            placeholder='Ngày hết hạn'
            size='large'
            format='DD/MM/YYYY'
            value={currentData.currentData?.endDate ? moment(currentData.currentData.endDate, 'DD/MM/YYYY') : null}
          />
        </Form.Item>
        <Form.Item name={'desc'} label='Mô tả khuyến mãi' rules={[{ required: true, message: 'Mô tả là bắt buộc' }]}>
          <QuillEditor value={value} onChange={(value) => setValue(value)} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default FormVoucher
