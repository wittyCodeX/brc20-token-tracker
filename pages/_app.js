import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import { Provider } from 'react-redux';
import store from 'reducer/store'
import "styles/style.scss";
import "styles/style.css";
import Script from 'next/script'

const App = ({ Component, pageProps }) => {
  // default theme setup
  const { default_theme } = config.settings;

  // import google font css
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();
  useEffect(() => {
    fetch(
      `https://fonts.googleapis.com/css2?family=${pf}${sf ? "&family=" + sf : ""
      }&display=swap`
    ).then((res) => res.text().then((css) => setFontcss(css)));
  }, [pf, sf]);

  // google tag manager (gtm)
  const tagManagerArgs = {
    gtmId: config.params.tag_manager_id,
  };
  useEffect(() => {
    setTimeout(() => {
      process.env.NODE_ENV === "production" &&
        config.params.tag_manager_id &&
        TagManager.initialize(tagManagerArgs);
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <JsonContext>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `${fontcss}`,
          }}
        />
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </Head>
      <Script src="js/lib/indexeddb.js"  />
      <Script src="js/lib/wif.js"  />
      <Script src="js/lib/buffer.6.0.3.js"  />
      <Script src="js/lib/tapscript.1.2.7.js"  />
      <Script src="js/lib/crypto-utils.1.5.11.js"  />
      <Script src="js/lib/bech32.2.0.0.js"  />
      <Script src="js/lib/qrcode.js"  />
      <Script src="js/app/app-config.1.0.8.js"  />
      <Script src="js/app/inscriptions/plugins.1.0.2.js"  />
      <ThemeProvider attribute="class" defaultTheme={default_theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </JsonContext>
  );
};

export default App;
