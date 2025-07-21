import React from 'react'

export default function PrimarySection({ id, title, children }) {
  return (
    <React.Fragment>
      <div className='bg-gradient-to-b from-gray-800 to-black w-full h-screen py-5 px-5 flex flex-col justify-center' id={id}>
          {children}
      </div>
    </React.Fragment>
  )
}

export function SecondarySection({ id, title, children }) {
  return (
    <React.Fragment>
      <section className='resume-section' id={id}>
        <div className='resume-section-content'>
          {title && <h2 className='mb-5'>{title}</h2>}
          {children}
        </div>
      </section>
      <hr className='m-0' />
    </React.Fragment>
  )
}