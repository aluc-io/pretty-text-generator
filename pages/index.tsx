import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import GHCorner from 'react-gh-corner'
import { detect } from 'detect-browser'
import { getScale, useScale } from '../logic/helper'

const DynamicComponent = dynamic(
  () => import('../components/CanvasAndController'),
  { loading: () => <p>loading...</p>, ssr: false }
)

const DynamicGithubCorner = dynamic(
  () => Promise.resolve(GHCorner),
  { loading: () => <p>loading...</p>, ssr: false }
)

const Home = () => {

  const scale = useScale(getScale(640))

  return (
    <div>
      <Head>
        <title>Pretty Text Generator</title>
        <link rel='icon' href='/favicon.ico' />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta property="og:site_name" content="Pretty Text Generator"/>
        <meta property="og:title" content="Create images of pretty letters!"/>
        <meta property="og:image" content="https://repository-images.githubusercontent.com/217741173/15ca9080-f9e3-11e9-94ef-4aa7a1f08a46"/>
      </Head>

      <DynamicGithubCorner
        href="https://github.com/aluc-io/pretty-text-generator"
        position="top-right"
        bgColor="black"
        size={scale === 1 ? 100 : 64}
        ariaLabel="Check my project"
        openInNewTab={true}
      />

      <div className='main'>
        <div className='title'>Pretty Text Generator</div>
        { detect().name === 'ie' && <div>Not Support Browser. Please use <b>Google Chrome</b> browser!</div> }
        { detect().name !== 'ie' && <DynamicComponent />}
      </div>

      <style jsx global>{`
        body {
          padding: 0px;
          margin: 0px;
        }
      `}</style>
      <style jsx>{`
        .title {
          text-align: center;
          font-size: 48px;
          font-family: sans-serif;
          font-weight: 700;
          margin: 40px auto 40px auto;
        }
        .main {
          padding: 0px;
          width: ${scale === 1 ? '512px' : '100%'};
          margin: 0px auto 40px auto;
        }
        @media (max-width: 512px) {
          .title {
            font-size: 24px;
          }
        }

      `}</style>
    </div>
  )
}

export default Home
