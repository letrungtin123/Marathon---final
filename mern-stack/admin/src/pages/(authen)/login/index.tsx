import { PayloadLogin, TBodyLogin } from '@/types/auth/auth.type'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '@/apis/auth/auth.api'
import { useAppDispatch } from '@/stores/hooks'
import { setAccessToken } from '@/stores/slices/auth.slice'
import { ERole } from '@/types/enums/role.enum'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Logo from '@/assets/images/LogoProject.png'
const LoginPage = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const loginMutation = useMutation({
    mutationKey: ['auth-login'],
    mutationFn: (body: TBodyLogin) => login(body),
    onSuccess: (data) => {
      // Kiểm tra trạng thái người dùng
      if (data.user?.status === 'inactive') {
        message.error('Tài khoản đã bị vô hiệu hóa.')
        setIsLoading(false)
        return
      }
      const token = data.accessToken
      dispatch(setAccessToken(data.accessToken))

      // giải mã token để kiểm tra xem có phải là admin hoặc staff hay không
      const decode = jwtDecode(token) as PayloadLogin
      if (decode.role === ERole.CUSTORMER) {
        message.error('Tài khoản hoặc mật khẩu không đúng')
        return
      }
      setIsLoading(false)
      message.success('Login success')
      // set token to local storage or cookie

      // redirect to home page
      navigate('/')
    },
    onError: (error) => {
      setIsLoading(false)
      if (error instanceof Error && error.message === 'Tài khoản đã bị vô hiệu hóa.') {
        message.error(error.message)
      } else {
        message.error('Tài khoản hoặc mật khẩu không đúng')
      }
    }
  })

  const onSubmit = (values: TBodyLogin) => {
    setIsLoading(true)
    loginMutation.mutate(values)
  }

  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-md p-6 bg-white bg-opacity-90 rounded-xl shadow-lg border border-gray-200'>
      <div className='flex flex-col items-center w-full h-full'>
        <div className='h-20 w-40  font-semibold  flex items-center justify-center text-3xl '>
          <div className='text-xl '>
            <img src={Logo} alt='' />
          </div>
        </div>

        <div className='mt-8 text-center'>
          <h1 className='font-semibold text-3xl text-gray-800'>Cửa hàng kinh doanh hoa tươi</h1>
          <p className='text-lg font-medium text-gray-600 mt-2'>Quản lí tối ưu và hiệu quả</p>
        </div>

        <Form layout='vertical' className='mt-8 w-full' onFinish={onSubmit} form={form}>
          <Form.Item
            name='email'
            label={<span className='font-semibold text-gray-700'>{t('form.email')}</span>}
            rules={[
              { required: true, message: t('validate.required') },
              {
                type: 'email',
                message: t('validate.email')
              }
            ]}
          >
            <Input
              placeholder='Email'
              className='h-12 w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-500'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label={
              <div className='flex items-center justify-between w-full'>
                <span className='font-semibold text-gray-700'>{t('form.password')}</span>
                <Link to='/forgot-password' className='text-green-700 font-semibold hover:text-green-600'>
                  {t('form.forgotPassword')}
                </Link>
              </div>
            }
            rules={[
              { required: true, message: t('validate.required') },
              {
                min: 6,
                message: t('validate.min', { count: 6 })
              }
            ]}
          >
            <Input.Password
              placeholder='Password'
              className='h-12 w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-500'
            />
          </Form.Item>

          <Button
            htmlType='submit'
            className='h-12 mt-5 w-full bg-green-900 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md'
          >
            {isLoading ? 'Loading...' : t('form.login')}
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage

/*

b1. setup slice auth + context => lưu token vào store xuống local storage
b2. khi đăng nhập thành công => lưu token vào store slice auth + context
b3. khi đăng nhập thành công => check token có phải admin không => nếu không => thông báo lỗi
b4. khi đăng nhập thành công => chuyển hướng về trang admin
b5. guard check xem chúng ta đã đăng nhập chưa => nếu chưa => chuyển hướng về trang login

*/
