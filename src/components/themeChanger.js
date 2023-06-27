import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { Button } from '@headlessui/react'

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      type='button'
      className='rounded-full p-1 text-gray-800 bg-light dark:bg-gray-800 dark:text-white'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <MoonIcon className='h-6 w-6' aria-hidden='true' />
      ) : (
        <SunIcon className='h-6 w-6' aria-hidden='true' />
      )}
    </button>
  )
}

export default ThemeChanger
