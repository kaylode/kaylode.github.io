'use client'

import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function PageLayout({ children }) {
  return (
    <div className="App">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
