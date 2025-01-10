import { forgotPasswordApi } from '@/apis/auth/forgot-password.api'
import { MailOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Card, Form, Input, message, Typography } from 'antd'

const { Title, Text } = Typography

const ForgotPassword = () => {
  const [form] = Form.useForm()

  const sendEmailMutation = useMutation({
    mutationKey: ['send-email'],
    mutationFn: (email: string) => forgotPasswordApi.sendResetPasswordEmail(email),
    onSuccess: () => {
      message.success('Email sent successfully!')
    }
  })

  const onFinish = (values: { email: string }) => {
    sendEmailMutation.mutate(values.email)
  }

  return (
    <div className='bg-gray-100 flex items-center justify-center py-10 h-screen'>
      <Card className='w-full max-w-lg'>
        <div className='text-center mb-6'>
          <Title level={2} className='my-3 !font-medium mb-6'>
            Forgot Password
          </Title>
          <Text>Enter your email below to recieve your password reset instructions</Text>
        </div>

        <Form layout='vertical' onFinish={onFinish} form={form}>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Email is invalid' }
            ]}
          >
            <Input size='large' placeholder='Email' prefix={<MailOutlined className='text-gray-400 ' />} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ForgotPassword
