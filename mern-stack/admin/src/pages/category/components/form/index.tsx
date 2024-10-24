import { createCategory, updateCategory } from '@/apis/category.api'
import { TCategory, TFormCategory } from '@/types/category.type'
import { ImageType, TModal } from '@/types/common.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Drawer, Form, Image, Input, Space, Upload, UploadProps, message } from 'antd'
import { useEffect, useState } from 'react'

import { uploadImage } from '@/apis/upload-image.api'
import QuillEditor from '@/components/qill-editor'
import { useAuth } from '@/contexts/auth-context'
import { InboxOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'

interface IFormCategory {
  currentData: TModal<TCategory>
  onClose: () => void
}

const { Dragger } = Upload

const FormCategory = ({ currentData, onClose }: IFormCategory) => {
  const { accessToken } = useAuth()
  const [value, setValue] = useState<string>('')
  const [image, setImage] = useState<ImageType>({ url: '', public_id: '', visiable: false })
  const queryClient = useQueryClient()

  const updateCategoryMutation = useMutation({
    mutationKey: ['update-category'],
    mutationFn: (body: TCategory) => updateCategory(body, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      message.success('Update category successfully!')
      form.resetFields()
      onClose()
    },
    onError: () => {
      message.error('Update category failed!')
    }
  })

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    listType: 'picture',
    accept: 'image/*',
    async customRequest({ file, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('images', file)

      const response = await uploadImage(formData, accessToken)
      const urlInfo: ImageType = response.data.urls[0]

      if (urlInfo) {
        setImage({
          url: urlInfo.url,
          public_id: urlInfo.public_id,
          visiable: false
        })
        onSuccess && onSuccess(urlInfo)
      } else {
        onError &&
          onError({
            name: 'error',
            message: 'Lỗi khi upload ảnh'
          })
      }
    },
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  const [form] = useForm()

  const createCategoryMutation = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (body: TFormCategory) => createCategory(body, accessToken),
    onSuccess: () => {
      message.success('Thêm danh mục thành công!')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      form.resetFields()
      onClose()
    },
    onError: () => {
      message.error('Thêm danh mục thất bại!')
    }
  })

  const handleSubmit = (value: TFormCategory) => {
    const bodyData: TFormCategory = {
      nameCategory: value.nameCategory,
      image: image.url,
      desc: value.desc || ''
    }

    if (currentData.type === 'add') {
      createCategoryMutation.mutate(bodyData)
    }

    if (currentData.type === 'edit' && currentData.currentData) {
      const { currentData: category } = currentData
      updateCategoryMutation.mutate({
        ...category,
        ...bodyData
      })
    }
  }

  useEffect(() => {
    if (currentData.type === 'edit') {
      const { currentData: category } = currentData
      // const category2 = currentData.currentData
      form.setFieldsValue({
        nameCategory: category?.nameCategory ?? '',
        desc: category?.desc ?? ''
      })
      setImage({
        public_id: category?.image ?? '',
        visiable: true,
        url: category?.image ?? ''
      })
    }
  }, [currentData, form])

  return (
    <Drawer
      title={currentData.type === 'add' ? 'Thêm danh mục' : 'Cập nhật lại danh mục'}
      onClose={() => {
        onClose()
        form.resetFields()
      }}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Đóng danh mục
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            disabled={createCategoryMutation.isLoading}
            loading={createCategoryMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Thêm danh mục' : 'Cập nhật lại danh mục'}
          </Button>
        </Space>
      }
    >
      <Form layout='vertical' form={form} onFinish={handleSubmit}>
        <Form.Item
          name='nameCategory'
          label='Danh mục danh mục'
          rules={[{ required: true, message: 'Tên danh mục là bắt buộc' }]}
        >
          <Input placeholder='Tên danh mục' size='large' />
        </Form.Item>

        <Form.Item name={'desc'} label='Mô tả danh mục' rules={[{ required: true, message: 'Mô tả là bắt buộc' }]}>
          <QuillEditor value={value} onChange={(value) => setValue(value)} />
        </Form.Item>

        <Form.Item
          name={'image'}
          label='Hình ảnh danh mục'
          rules={[{ required: true, message: 'Hình ảnh danh mục là bắt buộc' }]}
        >
          <Dragger {...props}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>Click hoặc kéo thả hình ảnh</p>
          </Dragger>
        </Form.Item>
        {currentData.type === 'edit' && image.visiable && (
          <div>
            <Image width={120} height={120} className='!rounded-md object-cover' src={image.url} alt={image.url} />
          </div>
        )}
      </Form>
    </Drawer>
  )
}

export default FormCategory
