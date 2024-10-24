import { Tag } from 'antd'
import { getProduct } from '@/apis/product.api'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const ProductDetail = () => {
  const { productId } = useParams()
  console.log('🚀 ~ ProductDetail ~ productId:', productId)

  const { data } = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => getProduct(productId as string),
    enabled: !!productId
  })
  const product = data?.data
  console.log('🚀 ~ ProductDetail ~ product:', product)

  return (
    <div className='h-full p-10 overflow-y-scroll'>
      <div className='items-start justify-center md:flex'>
        <div className='hidden w-full md:block'>
          <img className='w-full' alt='img of a girl posing' src={product?.images?.[0]?.url} />
        </div>

        <div className='mt-6 xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0'>
          <div className='pb-6 border-b border-gray-200'>
            <p className='text-sm leading-none text-gray-600'>{product?.category?.nameCategory}</p>
            <h1 className='mt-2 text-xl font-semibold leading-7 text-gray-800 lg:text-xl lg:leading-6'>
              {product?.nameProduct}
            </h1>
          </div>
          <div className='flex items-center justify-between py-4 border-b border-gray-200'>
            {/* <p className='text-base leading-4 text-gray-800'>Colours</p> */}
            <div className='flex items-center w-full gap-2'>
              {product?.sizes.map((size) => {
                return (
                  <div className='flex items-center justify-center' key={size._id}>
                    <p className='text-sm leading-none text-gray-600'>{size.size}</p>
                    <div
                      className={`w-6 h-6 ml-3 mr-4 border-gray-300 shadow cursor-pointer bg-[${size.color}] bg-gradient-to-b from-[${size.color}] to-[${size.color}]`}
                      style={{
                        backgroundColor: size.color
                      }}
                    ></div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <p className='text-base leading-4 text-gray-600 mt-7'>Price: {product?.price.toLocaleString() ?? 0}đ</p>
            <p className='text-base leading-4 text-gray-600 mt-7'>Sale: {product?.sale.toLocaleString() ?? 0}đ</p>
            <p className='mt-4 text-base leading-4 text-gray-600'>Brand: {product?.brand?.nameBrand}</p>
            <p className='mt-4 text-base leading-4 text-gray-600'>Category: {product?.category?.nameCategory}</p>
            <p className='mt-4 text-base leading-4 text-gray-600'>
              Status:{' '}
              <Tag color={product?.status === 'active' ? 'green' : 'red'}>
                {product?.status === 'inactive' && 'Không hoạt động'}
                {product?.status === 'active' && 'Hoạt động'}
              </Tag>
            </p>
            {product?.is_deleted && (
              <p className='mt-4 text-base leading-4 text-gray-600'>
                Deleted: <Tag color={product?.is_deleted ? 'red' : 'green'}>{product?.is_deleted && 'Đã xoá'}</Tag>
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        {product?.desc && (
          <p
            className='text-base leading-normal text-gray-600 xl:pr-48 lg:leading-tight mt-7'
            dangerouslySetInnerHTML={{
              __html: product?.desc
            }}
          >
            {/* {parse(product?.desc)} */}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
