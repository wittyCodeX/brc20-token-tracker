import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";

const Market = ({ }) => {

  return (
    <section className="section mt-16 container">
      <div className="border border-gray-300 border-solid rounded-3xl xl:w-6/12 md:w-8/12 sm:w-full m-auto shadow-xl">
        <h2 className="text-center p-8">Welcome</h2>
        <hr />
        <div className="my-5">
          <h3 className="text-center p-5">Add your BRC-20 sale</h3>
          <p className="text-gray-400 text-center">Put link to your Ordinalswallet/openOrdex sale here</p>
          <p className="text-gray-400 text-center">Only valid <b>"op": "transfer"</b> inscriptions</p>
          <div className="p-5 mb-5 w-full m-auto flex justify-center">
            <input className="border w-8/12 p-3 rounded-l-2xl" placeholder="https://ordinalswallet.com/inscription/53de9727..." />
            <button className="bg-[#2ba283] py-3 rounded-r-2xl px-6 text-white font-bold hover:bg-[#0e654f] ">Send</button>
          </div>
        </div>
        <hr />
        <p className="text-center p-5 my-5">All sales are checked and verified by our team</p>

      </div>
    </section>
  );
};

export default Market;
