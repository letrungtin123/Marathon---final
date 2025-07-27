import {
  Button,
  Col,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Upload,
  UploadProps,
  message
} from 'antd'
import { CloseOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons'
import { ImageType, TModal, TResponse } from '@/types/common.type'
import {
  QueryClient,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { TProduct, TProductForm, TProductFormEdit } from '@/types/product.type'
import { addProduct, editProduct } from '@/apis/product.api'
import { useEffect, useState } from 'react'

import { ArrowDownSmallIcon } from '@/components/icons'
import QuillEditor from '@/components/qill-editor'
import { getBrands } from '@/apis/brand.api'
import { uploadImage } from '@/apis/upload-image.api'
import { useAuth } from '@/contexts/auth-context'
import { useGetCategory } from '@/pages/category/hooks/useCategory'
import { useQueryParams } from '@/hooks/useQueryParams'

interface IFormProductProps {
  currentData: TModal<TProduct>
  onClose: () => void
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TResponse<TProduct>, Error>>
}

const { Dragger } = Upload

const FomrProduct = ({ currentData, onClose, refetch }: IFormProductProps) => {
  const { accessToken } = useAuth()
  const queryParams = useQueryParams()
  const [form] = Form.useForm()
  const queryClient = new QueryClient()

  const createProductMutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: (product: TProductForm) => addProduct(product, accessToken),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công')
      onClose()
      form.resetFields()
      setImage({ url: '', public_id: '', visiable: false })
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
    },
    onError: () => {
      message.error('Thêm sản phẩm thất bại')
    }
  })

  const editProductMutation = useMutation({
    mutationKey: ['editProduct'],
    mutationFn: (data: TProductFormEdit) => editProduct(data, accessToken),
    onSuccess: () => {
      message.success('Cập nhật sản phẩm thành công')
      onClose()
      form.resetFields()
      setImage({ url: '', public_id: '', visiable: false })
      setValue('')
      refetch && refetch()
      queryClient.invalidateQueries({ queryKey: ['products', queryParams] })
    },
    onError: () => {
      message.error('Cập nhật sản phẩm thất bại')
    }
  })

  // lưu trữ văn bản từ text editor
  const [value, setValue] = useState<string>('')
  const [image, setImage] = useState<ImageType>({ url: '', public_id: '', visiable: false })

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
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
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

  // categories
  const { data, isLoading } = useGetCategory({ enable: currentData.visiable })
  const categories = data?.data

  // brand
  const { data: dataBrand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getBrands(accessToken),
    enabled: currentData.visiable
  })
  const brands = dataBrand?.data

  const onSubmit = (data: TProductForm) => {
    if (!data.sizes) {
      message.error('Vui lòng thêm size sản phẩm')
      return
    }

    const dataProduct: TProductForm = {
      ...data,
      sale: data.sale || 0,
      status: data.status ? 'active' : 'inactive',
      images: [
        {
          public_id: image.public_id,
          url: image.url
        }
      ]
    }

    if (currentData.type === 'add') {
      createProductMutation.mutate(dataProduct)
    }

    if (currentData.type === 'edit') {
      editProductMutation.mutate({ ...dataProduct, _id: currentData?.currentData!._id })
    }
  }

  useEffect(() => {
    // Boolean(currentData.currentData) === true bằng với cách viết  currentData.currentData
    const { currentData: dataProduct } = currentData
    if (currentData.type === 'edit' && Boolean(dataProduct) === true) {
      form.setFieldsValue({
        nameProduct: dataProduct?.nameProduct,
        price: dataProduct?.price,
        brand: dataProduct?.brand?._id,
        category: dataProduct?.category?._id,
        sale: dataProduct?.sale,
        status: dataProduct?.status === 'active' ? true : false,
        sizes: dataProduct?.sizes,
        desc: dataProduct?.desc
      })
      setImage({
        url: dataProduct?.images[0].url ?? '',
        public_id: dataProduct?.images[0].public_id ?? '',
        visiable: true
      })
    }
  }, [currentData, form])
  // có 3 trường hợp
  // [] => thực hiện lại useEffect 1 lần
  // [currentData] => currentData có thay đổi => useEffect sẽ thực hiện lại logic
  // không truyền gì có => request liiên tục vào useEffect

  return (
    <Drawer
      title={currentData.type === 'add' ? 'Thêm sản phẩm' : 'Cập nhật lại sản phẩm'}
      onClose={onClose}
      open={currentData.visiable}
      width={800}
      extra={
        <Space>
          <Button size='large' onClick={onClose}>
            Đóng sản phẩm
          </Button>
          <Button
            size='large'
            type='primary'
            onClick={() => form.submit()}
            disabled={createProductMutation.isLoading}
            loading={createProductMutation.isLoading}
          >
            {currentData.type === 'add' ? 'Thêm sản phẩm' : 'Cập nhật lại sản phẩm'}
          </Button>
        </Space>
      }
    >
      {currentData.type === 'view' ? null : (
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Row gutter={40}>
            <Col span={12}>
              <Form.Item
                name={'nameProduct'}
                label='Tên sản phẩm'
                rules={[{ required: true, message: 'Tên sản phẩm là bắt buộc' }]}
              >
                <Input size='large' placeholder='Tên sản phẩm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'price'}
                label='Giá sản phẩm'
                rules={[{ required: true, message: 'Giá sản phẩm là bắt buộc' }]}
              >
                <InputNumber className='w-full' size='large' placeholder='Giá sản phẩm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'brand'}
                label='Thương hiệu sản phẩm'
                rules={[{ required: true, message: 'Thương hiệu sản phẩm là bắt buộc' }]}
              >
                <Select
                  loading={isLoadingBrand}
                  size='large'
                  suffixIcon={<ArrowDownSmallIcon />}
                  placeholder='Thương hiệu sản phẩm'
                  options={brands?.map((brand) => ({
                    value: brand?._id,
                    label: brand?.nameBrand
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'category'}
                label='Danh mục sản phẩm'
                rules={[{ required: true, message: 'Danh mục sản phẩm là bắt buộc' }]}
              >
                <Select
                  loading={isLoading}
                  size='large'
                  suffixIcon={<ArrowDownSmallIcon />}
                  placeholder='Danh mục sản phẩm'
                  options={categories?.map((category) => ({
                    value: category._id,
                    label: category.nameCategory
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={'sale'}
                label='Giá khuyến mại sản phẩm'
                rules={[
                  // giá khuyến mại luôn nhỏ hơn giá sản phẩm
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const price = getFieldValue('price')
                      if (!value || value < price) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Giá khuyến mại phải nhỏ hơn giá sản phẩm'))
                    }
                  })
                ]}
              >
                <InputNumber className='w-full' size='large' placeholder='Giá khuyến mại sản phẩm' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={'status'} label='Trạng thái sản phẩm'>
                <Switch />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='Size sản phẩm' className='!mb-0' rules={[{ required: true, message: 'Size sản phẩm' }]}>
                <Form.List name='sizes'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex' }} align='baseline'>
                          <Form.Item
                            {...restField}
                            name={[name, 'size']}
                            rules={[{ required: true, message: 'Size sản phẩm' }]}
                          >
                            <Input size='large' placeholder='Size sản phẩm' />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[{ required: true, message: 'Số lượng' }]}
                          >
                            <InputNumber className='w-full' size='large' placeholder='Số lượng' />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'color']}
                            rules={[{ required: true, message: 'Màu sản phẩm' }]}
                          >
                            <Input size='large' placeholder='Màu sản phẩm' />
                          </Form.Item>
                          <CloseOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type='dashed' size='large' onClick={() => add()} block icon={<PlusOutlined />}>
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Col>

            {/* desc */}
            <Col span={24}>
              <Form.Item name={'desc'} label='Mô tả sản phẩm'>
                <QuillEditor value={value} onChange={(value) => setValue(value)} />
              </Form.Item>
            </Col>

            {/* image */}
            <Col span={24}>
              <Form.Item
                label='Hình ảnh sản phẩm'
                rules={[{ required: true, message: 'Hình ảnh sản phẩm là bắt buộc' }]} // vẫn giữ rule nếu muốn
              >
                <Dragger {...props}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>Click hoặc kéo thả hình ảnh</p>
                </Dragger>
              </Form.Item>

              {image.visiable && (
                <Image src={image.url} alt={image.public_id} className='!w-[120px] !h-[120px] rounded-md' />
              )}
            </Col>
          </Row>
        </Form>
      )}
    </Drawer>
  )
}

export default FomrProduct
