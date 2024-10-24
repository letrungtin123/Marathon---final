import { itemUser } from './init'

import { ArrowDownCircleIcon } from '@/components/icons'
import { Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'

const InfoUser = () => {
  const { t } = useTranslation()

  const items = itemUser(t)

  return (
    <Dropdown menu={{ items }}>
      <div className='flex items-center gap-4'>
        <img
          alt='avt'
          src='https://picsum.photos/536/354'
          className='object-cover size-[50px] rounded-full flex-shrink-0'
        />

        <div className='flex flex-col gap-1'>
          <p className='text-sm font-bold'>Moni Roy</p>
          <p className='text-xs font-light'>Admin</p>
        </div>

        <ArrowDownCircleIcon height={20} width={20} />
      </div>
    </Dropdown>
  )
}

export default InfoUser
