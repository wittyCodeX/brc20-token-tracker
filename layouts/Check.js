import {useState} from 'react'
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import { FaEnvelope, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import ImageFallback from "./components/ImageFallback";

const Check = ({ }) => {

  const [block, setBlock] = useState();
  const scan = () => {

  }

  return (
    <section className="section mt-16">
      <div className="container">
        <div className="p-6 border border-gray-300 border-solid rounded-3xl w-12/12 md:w-8/12 m-auto shadow-xl">
          <h2 className="text-center p-5 mb-5">Check a BRC-20 Transfer</h2>
          <hr />
          <p className='text-center mt-5'>Put the inscription number and click on check</p>
          <div className="p-5 mt-5 w-full m-auto flex justify-center">
            <input className="border w-8/12 p-3 rounded-l-2xl" placeholder="3099023" onChange={(e) => setBlock(e.target.value)} required />
            <button className="bg-[#2ba283] py-3 px-8 text-white font-bold rounded-r-2xl hover:bg-[#0e654f]" onClick={() => scan()}>Check</button>
          </div>
          {block && <div className='row flex'>
            <div className='p-5 w-8/12 m-auto flex'>
              <h5 className='flex mr-3'>Address: </h5> {block}
            </div>
            <div className='p-5 w-8/12 m-auto flex'>
              <h5 className='flex mr-3'>Total: </h5>$0
            </div>          
          </div>}
        </div>
      </div>
    </section>
  );
};

export default Check;
