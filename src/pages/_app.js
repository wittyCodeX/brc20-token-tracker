import { ThemeProvider } from 'next-themes'
import Script from 'next/script'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute='class'>
      <Script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-67WCPX14PL'
      />
      <Script id='google-analytics'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-67WCPX14PL');
        `}
      </Script>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
