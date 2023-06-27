import { useEffect, useRef } from 'react'
import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import Link from 'next/link';
import $ from 'jquery'
import Script from 'next/script'
import { Head } from 'next/document'


const Inscribe = ({ }) => {
  var $$;

  let loadScript = function (uri) {
    return new Promise((resolve, reject) => {
      let tag = document.createElement('script');
      tag.src = uri;
      tag.async = true;
      tag.onload = () => {
        resolve();
      };
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
  }
  async function loadPlugins() {
    await loadScript('js/lib/crypto-utils.1.5.11.js')
    await loadScript('js/app/inscriptions/inscriptions.1.0.19.js');
  }
  useEffect(() => {

    $$ = document.querySelectorAll.bind(document);
    (async function () {
      await loadPlugins();
    })();
    return () => { 
    }
  }, []);
  const handleMultiRow = (e) => {
    const btn = $('#text-addrow');
    !e.target.checked ? $('#text-addrow').css('display', 'none') : $('#text-addrow').css('display', 'inline-block')
  }

  function addMoreText() {
    let cloned = $('.text_area')[0].cloneNode(true);
    cloned.value = '';
    document.getElementById("form_container").appendChild(cloned);
    cloned.focus();
  }
  function modalVanish() {
    $(".black-bg").style.display = "none";
    $(".modal").style.display = "none";
  }
  return (
    <section className='section mt-16 container'>

      <div className="border rounded-xl mx-auto max-w-3xl p-6 shadow-lg">

        <h1 className='h1 mb-6 pt-4 text-center'>Inscribe</h1>
        <hr />
        <div id="setup">
          <div className="mb-3 mt-4">
            <label className='label font-bold' htmlFor="taproot_address">&gt;&gt; Receiving address <span className="type_of_address">(taproot)</span></label>
            <input id="taproot_address" className="input address  p-2"
              placeholder="Enter a taproot address from an ordinals wallet" />
          </div>

          <p className='p font-bold mb-3'>&gt;&gt; Please choose what you want to inscribe:</p>

          <div className="options">
            <div>Standard</div>
            <div style={{ fontSize: '14px', color: 'gray' }}>Most popular &amp; standard inscriptions</div>
            <ul className='ul list-disc ml-4'>
              <li className='li'>
                <a id="upload_file_nav" className="upload_file active a hover:cursor-pointer">files</a>
              </li>
              <li className='li'>
                <a id="text_nav" className="text a hover:cursor-pointer">text</a>
              </li>
              <li className='li'>
                <a id="registration_nav" className="registration a hover:cursor-pointer">.sats domains</a>
              </li>
              <li className='li'>
                <a id="unisat_nav" className="unisat a hover:cursor-pointer">.unisat domains</a>
              </li>
              <li className='li'>
                <a id="brc20_mint_nav" className="brc20_mint hover:cursor-pointer">brc-20 mint</a>
              </li>
              <li className="nav-item li">
                <a id="brc20_deploy_nav" className="brc20_deploy a hover:cursor-pointer">brc-20 deploy</a>
              </li>
              <li className="nav-item li">
                <a id="brc20_transfer_nav" className="brc20_transfer a hover:cursor-pointer">brc-20 transfer</a>
              </li>
            </ul>
          </div>

          <div className="options" style={{ display: 'none' }} id="plugin-list">
            <div>Special</div>
            <div style={{ fontSize: '14px', color: 'gray' }}><a style={{ fontSize: '14px', color: 'gray' }} href="https://discord.gg/Ur8XGaurSd" target="_blank">Contact us</a> to list your project here</div>
            <ul className='ul list-disc' style={{ verticalAlign: 'top' }}></ul>
          </div>

          <form id="app-form" className='mt-4'>

            <div className="file_form option_form">
              <input
                accept=".json,.pdf,.asc,.yaml,.yml,.flac,.mp3,.wav,.apng,.avif,.gif,.jpg,.jpeg,.png,.svg,.webp,.glb,.stl,.html,.txt,.mp4,.webm" type="file" className="form" style={{ border: 'none !important', borderRadius: 'none !important' }} multiple />
              <br />
              <button id="bytes_checker" type="button" className='btn btn-outline-primary my-2'>
                Check if file(s) are inscribed already
              </button>
            </div>

            <div className="text_form option_form">

              <div id="form_container" className='mt-4'>

                <textarea className="text_area textarea border roudned-xl p-2" style={{ width: '100%', height: '75px' }}
                  placeholder="add some text"></textarea>

              </div>
              <div className='flex items-center mt-2'>
                <label className='label' htmlFor="text-multirow">Multi row</label>
                <input onClick={(e) => handleMultiRow(e)} className='ml-3'
                  id="text-multirow" type="checkbox" />
                <button className='btn btn-primary ml-3' style={{ display: 'none' }} id="text-addrow" onClick={(e) => { e.preventDefault(); addMoreText(); }}>Add Row</button>
              </div>

              <div style={{ marginTop: "15px" }}>
                <label className='label' htmlFor="text-repeat">Repeat</label>
                <input id="text-repeat" className='input border-gray-300 rounded-xl' type="text" defaultdefaultvalue="1"
                  placeholder="e.g. 10 to mint ten times" />
              </div>

            </div>

            <div className="dns_form option_form">
              <p className='p pl-1'>tip: use the .sats domain feature in the Special section above to host your content</p>
              <textarea className="dns textarea mt-1" style={{ width: '100%', height: '250px' }}
                placeholder="One domain per line. Example:&#10;&#10;ordi.sats&#10;btc.sats"></textarea>
              <button className="dns_checker btn btn-outline-primary mt-3 mb-3" type="button">Check availability</button>
            </div>

            <div className="unisat_form option_form ">
              <textarea className="textarea unisat_text" style={{ width: '100%', height: '250px' }}
                placeholder="One domain per line. Example:&#10;&#10;ordi.unisat&#10;btc.unisat"></textarea>
              <button className="unisat_checker btn btn-outline-primary mt-3 mb-3" type="button">Check availability</button>
            </div>

            <div className="brc20_mint_form option_form ">

              <div className="mb-3">
                <label className='label ml-1' htmlFor="brc20-mint-ticker">Ticker</label>
                <input className='input border-gray-300 rounded-xl' id="brc20-mint-ticker" type="text" maxLength="4" defaultValue=""
                  placeholder="e.g. ordi" />
              </div>

              <div className="mb-3">
                <label htmlFor="brc20-mint-amount ml-1">Amount</label>
                <input id="brc20-mint-amount" className=' border-gray-300 rounded-xl' type="text" defaultValue="" placeholder="e.g. 1000" />
              </div>

              <div className="mb-3">
                <label className='label ml-1' htmlFor="brc20-mint-repeat">Repeat</label>
                <input id="brc20-mint-repeat" className='input border-gray-300 rounded-xl' type="text" defaultValue="1"
                  placeholder="e.g. 10 to mint ten times" />
              </div>

            </div>

            <div className="brc20_deploy_form option_form">

              <div className="mb-3">
                <label className='label ml-1' htmlFor="brc20-deploy-ticker">Ticker</label>
                <input id="brc20-deploy-ticker" className='input border-gray-300 rounded-xl' type="text" maxLength="4" defaultValue=""
                  placeholder="e.g. ordi" />
              </div>

              <div className="mb-3">
                <label className='label ml-1' htmlFor="brc20-deploy-max">Supply</label>
                <input id="brc20-deploy-max" className='input border-gray-300 rounded-xl' type="text" defaultValue="" placeholder="e.g. 21000000" />
              </div>

              <div className="mb-3">
                <label className='label ml-1' htmlFor="brc20-deploy-lim">Limit per mint</label>
                <input className='input border-gray-300 rounded-xl' id="brc20-deploy-lim" type="text" defaultValue="" placeholder="e.g. 1000" />
              </div>

            </div>

            <div className="brc20_transfer_form option_form">

              <hr />

              <p className='p mt-3 font-bold'>
                HOWTO:
              </p>

              <p className='p'>
                1. To send tokens to someone, you need to have enough transferable balance registered first. Only
                then
                you may perform the actual transfer with another inscription. To add tokens to your transferable
                balance, use an address of yours that previously minted enough tokens in "Receiving address" above.
              </p>

              <p className='p'>
                2. You can check your transferable balance using <a id="transfer-balance-link"
                  href="https://unisat.io/brc20?q="
                  target="_blank">this
                  link</a>.
              </p>

              <p className='p'>
                3. If your transferable balance is sufficient, you can skip step 1. and use the actual token
                recipient
                address in "Receiving address" above.
              </p>

              <p className='p'>
                WARNING:<br />
                To register your balance, the "Receiving address" above must be an address of yours that originally
                minted the token.
                If you are mixing this up or use the wrong address, risk is that the transfer will be invalid or
                being
                sent to the wrong recipient. This tool is not responsible htmlFor any of your decisions.
              </p>

              <hr className='my-3' />

              <div id="brc-transfer-container">

                <div className="brc-transfer-block">

                  <div className="mb-3">
                    <label className='label ml-1'>Ticker</label>
                    <input className="brc20-transfer-ticker input border-gray-300 rounded-xl" type="text" maxLength="4" defaultValue=""
                      placeholder="e.g. ordi" />
                  </div>

                  <div className="mb-3">
                    <label className='label ml-1'>Amount</label>
                    <input className="brc20-transfer-amount input border-gray-300 rounded-xl" type="text" defaultValue="" placeholder="e.g. 21000000" />
                  </div>

                </div>

              </div>

              <button id="add_transfer_button" className='btn btn-outline-primary'>Add Transfer</button>

            </div>

            <div id="plugin_form" className="option_form" style={{ display: 'none' }}></div>

            <span className="timer">61</span>

            <p className='p font-bold mt-3'>&gt;&gt; Select a feerate (sats/vB)</p>
            <div className="feerates mt-3">
              <div className="fee minfee">
                <div style={{ color: 'white' }} className="num rounded">...</div>
                <div className="name">Min</div>
              </div>
              <div className="fee midfee">
                <div style={{ color: 'white' }} className="num rounded">...</div>
                <div className="name">Mid</div>
              </div>
              <div className="fee maxfee">
                <div style={{ color: 'white' }} className="num rounded">...</div>
                <div className="name">Max</div>
              </div>
            </div>
            <div style={{ marginTop: '15px' }} id="sliderange">
              <label className='label' htmlFor="sats_range">sats/vB: <span id="sats_per_byte">1</span></label>
              <input className="form-range input" id="sats_range" type="range" min="1" max="500" defaultValue="1" />
            </div>
          </form>

          <hr className='my-3' />

          <div><label className='label'><span style={{ marginRight: '10px' }}>🔧</span> Options</label></div>

          <div>
            <label className='label mr-3' style={{ display: 'inline-block' }} htmlFor="padding"><span
              style={{ marginRight: '16px' }}>🔧</span>
              Sats in inscription (padding)</label>
            <input style={{ width: "20%" }} className='input border-gray-300 rounded-xl' id="padding" type="text" defaultValue="" />
          </div>
          <div>
            <label className='label' style={{ display: 'inline-block' }} htmlFor="cpfp"><span style={{ marginRight: '6px' }}>🚀</span> Enable
              CPFP</label>
            <input className='ml-2' style={{ display: 'inline-block', height: '0.9rem', width: "1rem" }} id="cpfp" type="checkbox" defaultChecked={true} />
          </div>

          <div id="backup" className='mt-3'>
            <div><span className='span' style={{ marginRight: '6px' }}>🚑</span> <a id="backup-usage">Backup
              Usage</a>
              <span className='span ml-2' id="db-quota">0%</span></div>
            <div id="backup-recovery"
              style={{ border: "1px solid white", padding: '10px', display: 'none', marginTop: '15px', marginBottom: '15px', maxHeight: '500px', overflowX: 'auto' }}></div>
            <div id="backup-list" style={{ display: 'none', marginTop: '15px', maxHeight: '500px', overflowX: 'auto' }}></div>
          </div>

          <div id="tipping" style={{ display: 'inline-block' }}>
            <label htmlFor="tip" className='label' style={{ display: 'inline-block', marginBottom: '0' }}><span style={{ marginRight: '6px' }}>💖</span>
              Developer Tip</label>
            <input id="tip" className='input border-gray-300 rounded-xl ml-1' style={{ width: '100px', marginBottom: '0' }} type="text" defaultValue="0" /> sats ($<span
              id="tip-usd">0</span>)
          </div>

          <hr className='my-3' />

        </div>

        <div className='my-3 text-center'>
          <button className="submit btn btn-primary">Inscribe!</button>
          <button className="estimate btn btn-primary ml-3">Estimate Fees</button>
          <span className='span' id="estimated-fees"></span>
          <button style={{ display: 'none' }} className="startover btn btn-primary">Reset</button>
        </div>

        <div className="display"></div>
        <div style={{ display: 'none' }} className="file"></div>

        <div className="black-bg"></div>
        <div className="black-bg" onClick={() => modalVanish()}></div>
        <div className="modal">
          <span className='span' id="descendants-warning" style={{ display: 'none', color: 'red', marginBottom: '20px', fontSize: '13px' }}>For the remaining inscriptions, please wait htmlFor the parent transaction to confirm. Do NOT close this window.</span>
          <div className="modal-content text-truncate"></div>
          <button id="modal-reset" className="btn btn-primary" style={{ marginTop: '15px', display: 'none' }} onClick={() => window.location.reload()}
          >Reset
          </button>
        </div>

      </div>

      <div className="ad-box" style={{ position: 'fixed', top: '0', left: '0' }} aria-hidden="true">
        &nbsp;
      </div>
    </section>
  );
};

export default Inscribe;
