import React from 'react'
import Header from './Header'
import HomePage from '../../../pages/website/HomePage'
import Footer from './Footer'

const LayoutWebsite = () => {
  return (
    <div>
         <Header />
      <HomePage/>
      <Footer/>
    </div>
  )
}

export default LayoutWebsite