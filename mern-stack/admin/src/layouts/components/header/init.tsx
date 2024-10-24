import { MenuProps } from 'antd'
import { TFunction } from 'i18next'

export const itemsLanguage = (t: TFunction) => {
  const items: MenuProps['items'] = [
    {
      key: 'en',
      label: <p className=''>{t('languages.en')}</p>
    },
    {
      key: 'vi',
      label: <p className=''>{t('languages.vi')}</p>
    }
  ]

  return items
}

export const itemUser = (t: TFunction) => {
  const itemsUser: MenuProps['items'] = [
    {
      key: '1',
      label: <p className=''>{t('userMenu.profile')}</p>
    },
    {
      key: '2',
      label: <p className=''>{t('userMenu.logout')}</p>
    }
  ]

  return itemsUser
}
