import React from 'react'

function Footer() {
  return (
    <footer className="text-white bg-gray-900 text-center py-2 px-5">
        <div className="container text-muted ">
            <small>
                <a className="text-white"> © 2022 </a>
                <a className="text-white" href="https://github.com/kaylode">Written by Kaylode using ReactJS and TailwindCSS</a>
                <a className="text-white">. Open sourced with love under MIT License</a>
            </small>
        </div>
    </footer>
  )
}

export default Footer