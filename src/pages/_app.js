import '@/styles/globals.css'
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return  <>  <Script
        id="google_view"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-J4SCGDQRFT`}
      />
      <Script
        id="google_views"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J4SCGDQRFT', {
              page_path: window.location.pathname,
            });
          `,
        }}
      /> <Component {...pageProps} /> </>
}
