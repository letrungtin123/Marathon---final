import { Input } from 'antd'

import { cn } from '@/utils/cn'

import { GlassesIcon } from '../icons'

interface NavbarProps {
  input: {
    placeholder?: string
    className?: string
    onSearch?: (value: string) => void
    value?: string
    onChange?: (value: string) => void
  }
}

const NavbarNoButton = ({ input }: NavbarProps) => {
  const { placeholder, className: inputClassName, onSearch, value, onChange, ...restInput } = input
  return (
    <div className='flex items-center justify-between w-full pb-7'>
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

export default NavbarNoButton
