import { Inter } from 'next/font/google'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export default function Inscribe() {
  return (
    <main
      className={`${inter.className} bg-gray-100 dark:bg-gray-900 h-screen`}
    >
      <Header />
      <div className='flex justify-center items-center'>
        <h1 className='text-5xl mt-10'>{'Coming soon...'}</h1>
      </div>
    </main>
  )
}
