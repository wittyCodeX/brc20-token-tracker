import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ImageFallback from './ImageFallback';
import Link from 'next/link';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

const Table = () => {
    const unisat = useSelector(state => state.unisat);
    const ranking = useSelector(state => state.ranking);

    const unisatTokens = unisat.detail;
    const hasPriceObjectArray = ranking.hasPriceObjectArray;
    const query = unisat.query;

    const hasValueAndMatchQueryTokens = hasPriceObjectArray.filter(one => one.name.toLowerCase().includes(query.toLowerCase()));

    const hasPriceNameArray = hasValueAndMatchQueryTokens.map(token => token.name.toLowerCase())

    const checkInPriceTokenArray = (tokenName) => {
        return hasPriceNameArray.includes(tokenName?.toLowerCase())
    }

    const isBottom = (el) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const onScroll = useCallback(event => {
        // const { pageYOffset, scrollY } = window;
        const wrappedElement = document.getElementById('__next');
        if (isBottom(wrappedElement)) {
            goto();
        }
    }, []);

    const goto = async () => {

        let presentHasValueCount = parseInt(document.getElementById('presentHasValueCount').innerText);
        let matchQueryValueCount = parseInt(document.getElementById('matchQueryValueCount').innerText);
        let currentPage = parseInt(document.getElementById('currentPage').innerText);

        if (presentHasValueCount >= matchQueryValueCount) {
            const el = document.getElementById('tokenList')
            let addedComponent = '';
            const unisatData = await axios.get(`https://unisat.io/brc20-api-v2/brc20/status?ticker=${query}&start=${(currentPage)}&limit=${20}&complete=&sort=deploy`)

            unisatData.data.data.detail.map((token, i) => {
                if (!checkInPriceTokenArray(token.ticker)) {
                    addedComponent += "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" + i + "}>" +
                        "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
                        "<div class='flex items-center justify-start min-w-[20%]'>" +
                        '<a class="pl-2" href="https://ordiscan.com/inscription/' + token.inscriptionNumber + '"><div class="font-bold">' + token.ticker + '</div></a></div>' +
                        '<p class="min-w-[25%]"><b>$ 0.00</b></p>' + '<p class="text-green-500 min-w-[15%]"><b>0.00%</b></p>' + '<p class="min-w-[20%]"><b>$ 0.00</b></p><p class="min-w-[20%]"><b>$ 0.00</b></p>' +
                        '</div></div>'
                }
            })
            el.innerHTML += addedComponent
            document.getElementById('currentPage').innerText = currentPage + 20;
        }
        else {
            const el = document.getElementById('tokenList')
            const nextPage = presentHasValueCount + 20;
            if (nextPage <= matchQueryValueCount) {
                const addedTokenList = hasValueAndMatchQueryTokens.slice(presentHasValueCount, nextPage)

                let addedComponent = '';
                addedTokenList.forEach((token, i) => {
                    const price = token.price != (undefined || null) ? token.price : '0.00';
                    const change = (parseFloat(token.change)) > 0 ? "text-green-500" : "text-red-500";
                    const cap = token.marketCap != (undefined || null) ? parseInt(token.marketCap).toLocaleString() : '0.00';
                    const vol = token['24hVolume'] != (undefined || null) ? parseInt(token['24hVolume']).toLocaleString() : '0.00';
                    const changeVal = token['change'] != (undefined || null) ? parseFloat(token['change']).toLocaleString() : '0.00';
                    addedComponent += "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" + i + "}>" +
                        "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
                        "<div class='flex items-center justify-start min-w-[20%]'>" +
                        '<img alt="logo" srcset="/_next/image?url=' + token.iconUrl + '&amp;w=32&amp;q=75 1x, /_next/image?url=' + token.iconUrl + '&amp;w=64&amp;q=75 2x" src="http://localhost:3000/_next/image?url=' + token.iconUrl + '&amp;w=64&amp;q=75" width="30" height="30" decoding="async" data-nimg="1" class="rounded-xl" style="color: transparent; width: 25px; height: 25px;"></img>' +
                        '<a class="pl-2" href="/tokens/' + token.name + '?uuid=' + token.uuid + '&amp;name=' + token.name + '&amp;symbol=' + token.symbol + '"><div class="font-bold">' + token.name + '</div></a></div>' +
                        "<p class='min-w-[25%]'><b>$" + price + "</b></p>" +
                        "<p class='min-w-[15%] " + change + "'><b>" + changeVal + "%</b></p>" +
                        "<p class='min-w-[20%]'>$" + cap + "</p>" +
                        "<p class='min-w-[20%]'>$" + vol + "</p>" +
                        "</div>" +
                        "</div>"
                })
                el.innerHTML += addedComponent
                document.getElementById('presentHasValueCount').innerText = nextPage;
            }
            else {
                const addedTokenList = hasValueAndMatchQueryTokens.slice(ranking.presentHasValueCount);
                let addedComponent = '';
                addedTokenList.forEach((token, i) => {
                    const price = token.price != (undefined || null) ? token.price : '0.00';
                    const change = (parseFloat(token.change)) > 0 ? "text-green-500" : "text-red-500";
                    const cap = token.marketCap != (undefined || null) ? parseInt(token.marketCap).toLocaleString() : '0.00';
                    const vol = token['24hVolume'] != (undefined || null) ? parseInt(token['24hVolume']).toLocaleString() : '0.00';
                    const changeVal = token['change'] != (undefined || null) ? parseInt(token['change']).toLocaleString() : '0.00';
                    addedComponent += "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" + i + "}>" +
                        "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
                        "<div class='flex items-center justify-start min-w-[20%]'>" +
                        '<img alt="logo" srcset="/_next/image?url=' + token.iconUrl + '&amp;w=32&amp;q=75 1x, /_next/image?url=' + token.iconUrl + '&amp;w=64&amp;q=75 2x" src="http://localhost:3000/_next/image?url=' + token.iconUrl + '&amp;w=64&amp;q=75" width="30" height="30" decoding="async" data-nimg="1" class="rounded-xl" style="color: transparent; width: 25px; height: 25px;"></img>' +
                        '<a class="pl-2" href="/tokens/' + token.name + '?uuid=' + token.uuid + '&amp;name=' + token.name + '&amp;symbol=' + token.symbol + '"><div class="font-bold">' + token.name + '</div></a></div>' +
                        "<p class='min-w-[25%]'><b>$" + price + "</b></p>" +
                        "<p class='min-w-[15%] " + change + "'><b>" + changeVal + "%</b></p>" +
                        "<p class='min-w-[20%]'>$" + cap + "</p>" +
                        "<p class='min-w-[20%]'>$" + vol + "</p>" +
                        "</div>" +
                        "</div>"
                })
                const restUnisatTokenCount = ranking.tokenPerScreen - addedTokenList.length;
                let count = 0, j;
                for (j = 0; count < restUnisatTokenCount || j < unisatTokens.length; j++) {
                    if (!checkInPriceTokenArray(unisatTokens[j].ticker.toLowerCase()))
                        count++;
                }

                document.getElementById('currentPage').innerText =j;

                unisat.detail.map((token, i) => {
                    if (!checkInPriceTokenArray(token.ticker) && i < j) {
                        addedComponent += "<div class='mt-2  overflow-hidden rounded-xl mx-4' key={" + i + "}>" +
                            "<div class='flex gap-3 justify-start items-center  px-4 py-4 bg-[#f5f0f0] dark:bg-[#1f2154] hover:bg-[#dedcdc] dark:hover:bg-[#1f2168] transition-all ease-linear duration-200'>" +
                            "<div class='flex items-center justify-start min-w-[20%]'>" +
                            '<a class="pl-2" href="https://ordiscan.com/inscription/' + token.inscriptionNumber + '"><div class="font-bold">' + token.ticker + '</div></a></div>' +
                            '<p class="min-w-[25%]"><b>$ 0.00</b></p>' + '<p class="text-green-500 min-w-[15%]"><b>0.00%</b></p>' + '<p class="min-w-[20%]"><b>$ 0.00</b></p><p class="min-w-[20%]"><b>$ 0.00</b></p>' +
                            '</div></div>'
                    }
                })

                el.innerHTML += addedComponent
                document.getElementById('presentHasValueCount').innerText = nextPage;
            }
        }
    }

    useEffect(() => {
        goto();
        window.addEventListener("scroll", onScroll, { passive: true });
        document.getElementById('tokenList').innerText = "";
        return () => {
            window.removeEventListener("scroll", onScroll, { passive: true });
        }
    }, [])



    return (
        <div className='overflow-auto w-full mb-6'>
            <div className='min-w-[800px]' id='tokenList'>
                <div className='overflow-hidden rounded-xl w-full'>
                    <div className='flex gap-3 justify-between mt-4 mx-4 px-4 py-4 transition-all ease-linear duration-200 roundex-xl'>
                        <div className=' min-w-[20%]'>name</div>
                        <div className=' min-w-[25%]'>Price</div>
                        <div className=' min-w-[15%]'>24%</div>
                        <div className=' min-w-[20%]'>Market Cap</div>
                        <div className=' min-w-[20%]'>Volume(24h)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Table;