import React from "react";
import Head from "next/head";
import HeaderWrapper from "../HeaderWrapper";
import Footer from "../Footer";

interface Props {
  children: React.ReactElement;
}

export default function BaseLayout({ children }: Props) {
  return (
    <>
      <Head>
        <title>PartsMojo Canada – Your trusted online destination for high-quality car parts at unbeatable prices! 🇨🇦 Fast shipping, top brands & expert support to keep you on the road. Shop smart, drive safe!</title>
        </Head>
      
      {children}
     
    </>
  );
}
