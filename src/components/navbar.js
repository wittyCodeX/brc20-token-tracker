import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeChanger from "./themeChanger";

const navigation = [
  { name: "BRC20 tokens", href: "/" },
  { name: "Exchanges", href: "/exchanges" },
  { name: "Products", href: "/products" },
  { name: "Learn", href: "/learn" }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Disclosure
      as='nav'
      className='bg-white shadow-md md:h-[83px] dark:bg-[#252525]'
    >
      {({ open }) => (
        <>
          <div className='m-auto  max-w-full px-2 sm:px-6 lg:px-8 dark:dark:bg-[#100D0D]'>
            <div className='relative flex items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-gray-400'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start  md:h-full'>
                <div className='flex flex-shrink-0 items-center md:text-xl mt-[28px] mb-[26px] lg:ml-[44px] lg:mr-[53px]'>
                  BRC-20 [REDACTED]
                </div>
                <div className='hidden sm:ml-6 sm:block md:h-full'>
                  <div className='flex'>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? "border-b border-b-2 dark:bg-[#131313] dark:text-white"
                            : "text-gray-800 hover:border-b hover:border-gray-800 dark:hover:bg-[#131313] dark:hover:text-white dark:text-gray-300 dark:hover:border-none",
                          " pt-[28px] pb-[26px] px-[25px] text-xl dark:border-none cursor-pointer md:h-full break-keep"
                        )}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                {/* <ThemeChanger /> */}
                <form>
                  <label
                    for='default-search'
                    class='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                  >
                    Search
                  </label>
                  <div class='relative'>
                    <div class='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <svg
                        aria-hidden='true'
                        class='w-5 h-5 text-gray-500 dark:text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          stroke-linecap='round'
                          stroke-linejoin='round'
                          stroke-width='2'
                          d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                        ></path>
                      </svg>
                    </div>
                    <input
                      type='search'
                      id='default-search'
                      class='block w-full p-3 pl-10 text-sm text-gray-900 rounded-lg bg-gray-50 dark:bg-[#161616] dark:focus:outline-none dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                      placeholder='Search'
                      required
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pb-3 pt-2'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          <div className='navbar-line'>
            <Image
              src='/images/navbar-line.png'
              layout='fill'
              alt='ad'
              className='image max-w-full'
            />
          </div>
        </>
      )}
    </Disclosure>
  );
}
