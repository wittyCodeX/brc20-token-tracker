import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import { FaEnvelope, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";
import ImageFallback from "./components/ImageFallback";

const Contact = ({ data }) => {
  const { frontmatter } = data;
  const { title, form_action, phone, mail, location } = frontmatter;

  return (
    <section className="section lg:mt-16">
      <div className="container">
          this is contact page          
      </div>
    </section>
  );
};

export default Contact;
