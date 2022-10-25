import React from 'react'
import { techs_list } from '../data/techs';

function Techstack() {
      return (
        <div
          name="techstack"
          className="bg-gray-800 w-full py-5 px-5 h-screen flex flex-col justify-center"
        >
          <div className="max-w-screen-lg mx-auto p-4 flex flex-col justify-center w-full text-white">
            <div className="justify-center text-center">
              <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
                Technology Stack
              </p>
              <p className="py-6">These are the technologies I've worked with</p>
            </div>
    
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-8 text-center py-8 px-12 sm:px-0">
              {techs_list.map(({ id, src, title, style }) => (
                <div
                  key={id}
                  className={`shadow-md hover:scale-105 duration-500 py-2 rounded-lg ${style}`}
                >
                  <img src={src} alt="" className="w-20 mx-auto" />
                  <p className="mt-4">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}

export default Techstack