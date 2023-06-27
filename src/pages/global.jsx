import React from "react";
import Header from "./component/header";
import Gchart from "../../Runner/GlobalChart";
import Footer from "./component/footer";

function global() {
  return (
    <>
      <Header />
      <title>Global Allocation Of BRC20</title>
      <main style={{ minHeight: "100vh" }}>
        <Gchart />
      </main>
      <Footer />
    </>
  );
}

export default global;
