import { Button, Input } from 'antd'

import { cn } from '@/utils/cn'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import { GlassesIcon } from '../icons'

interface NavbarProps {
  button: {
    title: React.ReactNode
    size?: SizeType
    type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
    className?: string
    onClick?: () => void
  }
  input: {
    placeholder?: string
    className?: string
    onSearch?: (value: string) => void
    value?: string
    onChange?: (value: string) => void
  }
}

const Navbar = ({ button, input }: NavbarProps) => {
  const { title, size, type, className, onClick, ...restButton } = button
  const { placeholder, className: inputClassName, onSearch, value, onChange, ...restInput } = input
  return (
    <div className='flex items-center justify-between w-full pb-7'>
      <Button size={size} type={type} {...restButton} className={cn(className)} onClick={onClick}>
        {title}
      </Button>

      <Input
        className={cn('h-[38px] rounded-[50px] w-[250px] border border-gray-six', inputClassName)}
        placeholder={placeholder}
        prefix={<GlassesIcon hanging={16} width={16} />}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...restInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch && onSearch((e.target as HTMLInputElement).value)
          }
        }}
      />
    </div>
  )
}

export default Navbar
