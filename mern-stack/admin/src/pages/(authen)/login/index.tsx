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
      const token = data.accessToken
      dispatch(setAccessToken(data.accessToken))

      // giải mã token để kiểm tra xem có phải là admin hay không
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
    onError: () => {
      setIsLoading(false)
      message.error('Tài khoản hoặc mật khẩu không đúng')
    }
  })

  const onSubmit = (values: TBodyLogin) => {
    setIsLoading(true)
    loginMutation.mutate(values)
  }

  return (
    <div className='flex flex-col justify-center w-full h-full gap-2.5 md:w-2/3 lg:w-full'>
      <div className='h-[60px] w-[60px] bg-[#EEF2FF] text-[#4F46E5] font-semibold rounded-xl flex items-center justify-center text-[28px]'>
        G
      </div>

      <div className='mt-[45px]'>
        <h1 className='font-semibold text-[32px] text-black'>Masuk ke akun kamu</h1>
        <p className='text-base font-normal text-[#4B5563]'>
          Belajar gratis di Namanyajugabelajar.io, dan memulai karir yang kamu cita-citata sejak dalam embrio!
        </p>
      </div>

      <Form layout='vertical' className='mt-[35px]' onFinish={onSubmit} form={form}>
        <Form.Item
          name={'email'}
          label={<span className='font-semibold'>{t('form.email')}</span>}
          rules={[
            { required: true, message: t('validate.required') },
            {
              type: 'email',
              message: t('validate.email')
            }
          ]}
        >
          <Input placeholder='Email' className='h-[48px] w-full' />
        </Form.Item>

        <Form.Item
          name={'password'}
          label={
            <div className='flex items-center justify-between flex-1'>
              <span className='font-semibold'>{t('form.password')}</span>
              <Link to={'/forgot-password'} className='text-[#4F46E5] font-semibold hover:text-[#4F46E5]'>
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
          <Input.Password placeholder='Password' className='h-[48px] w-full' />
        </Form.Item>

        <Button
          type='primary'
          htmlType='submit'
          className='h-[48px] mt-5 w-full bg-[#4F46E5] hover:!bg-[#4F46E5] text-base'
        >
          {isLoading ? 'Loading...' : t('form.login')}
        </Button>
      </Form>
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
