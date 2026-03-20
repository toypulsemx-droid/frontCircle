import React from 'react'
import { Navbar } from '../Components/Common/Navbar/Navbar'
import { Footer } from '../Components/Common/Footer/Footer'

export const MainLayout = ({children}) => {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}
