import { BellIcon } from '@/components/icons'
import { Badge } from 'antd'

const Notification = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <Badge count={5} size='small' className='!bg-red'>
        <BellIcon className='size-5' />
      </Badge>
    </div>
  )
}

export default Notification
