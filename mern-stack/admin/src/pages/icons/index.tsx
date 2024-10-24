import * as Icons from '@/components/icons'

import { Button, message } from 'antd'

const IconPage = () => {
  const icons = Object.entries(Icons)

  const handleCopy = (name: string) => {
    const text = `<${name} />`
    navigator.clipboard.writeText(text)
    message.success('Copied to clipboard: ' + text)
  }

  return (
    <div className='grid grid-cols-2 gap-10 p-4 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3'>
      {icons.map(([key, Icon]) => {
        return (
          <Button key={key} className='bg-blue-300' onClick={() => handleCopy(key)}>
            {key}
            <Icon />
          </Button>
        )
      })}
    </div>
  )
}

export default IconPage
