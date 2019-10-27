import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Nav from '../components/nav'
const DynamicComponent = dynamic(
  () => import('../components/Photo'),
  { loading: () => <p>...</p>, ssr: false }
)

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <div className='main'>
      <DynamicComponent />
    </div>

    <style jsx global>{`
      body {
        padding: 0px;
        margin: 0px;
      }
    `}</style>
    <style jsx>{`
      .main {
        padding: 0px;
        width: 512px;
        margin: 0px auto 100px auto;
      }
    `}</style>
  </div>
)

export default Home
