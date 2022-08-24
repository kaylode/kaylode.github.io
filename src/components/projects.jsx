import React from 'react'
import {project_list} from '../data/projects'
import Grid from './reusable/grid'

function Projects() {
  return (
    <div
      name="projects"
      className="bg-gray-800 w-full py-5 px-5 flex flex-col justify-center">
      <div className="px-5 container">
        <div className="px-5  text-white">

          <div className="justify-center text-center">
            <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
              Projects
            </p>
            <p className="py-6">These are the personal projects that I did in free time</p>
          </div>
          
          <Grid list={project_list} />

        </div>
      </div>
    </div>
  )
}

export default Projects