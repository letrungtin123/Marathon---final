import { ArrowDownSmallIcon, BarsIcon, GlassesIcon } from '@/components/icons'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { Dropdown, Form, Input, Space } from 'antd'

import { useLanguage } from '@/contexts/language-context'
import { setLanguage as setLanguageRedux } from '@/stores/slices/language.slice'
import { RootState } from '@/stores/store'
import { useTranslation } from 'react-i18next'
import InfoUser from './info-user'
import { itemsLanguage } from './init'
import Notification from './notification'

const Header = () => {
  const { t } = useTranslation()
  const { language } = useAppSelector((state: RootState) => state.language)
  const { setLanguage } = useLanguage()
  const dispath = useAppDispatch()

  const items = itemsLanguage(t)

  const handleDropdownItemClick = (e: any) => {
    const key = e.key
    setLanguage(key)
    dispath(setLanguageRedux(key))
  }

  return (
    <div className='flex justify-between w-full'>
      <div className='flex items-center gap-6'>
        <button>
          <BarsIcon className='fill-black size-[22px]' />
        </button>

        <Form>
          <Form.Item name={'product'} className='!mb-0'>
            <Input
              className='rounded-[20px] !bg-gray-third border border-gray-fourth h-[38px] !text-sm w-[388px] focus-within:border-gray-fourth flex-shrink-0 focus:border-gray-fourth hover:border-gray-fourth focus:ring-0'
              prefix={<GlassesIcon className='stroke-gray-fifth' />}
              placeholder='Search'
            />
          </Form.Item>
        </Form>
      </div>
      <div className='flex items-center gap-6'>
        <Notification />

        <Dropdown menu={{ items, onClick: (e) => handleDropdownItemClick(e) }}>
          <button>
            <Space>
              {language === 'vi' ? t('languages.vi') : t('languages.en')}
              <ArrowDownSmallIcon height={6} width={10} className='mt-1' />
            </Space>
          </button>
        </Dropdown>

        <InfoUser />
      </div>
    </div>
  )
}

export default Header
