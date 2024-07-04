import Image from 'next/image'
import React from 'react'
import logo from "../public/logo.png"
function Logo() {
  return (
    <div className='flex justify-center'>
      <Image src={logo} alt="logo" width={200} className=' '/>
    </div>
  )
}

export default Logo
