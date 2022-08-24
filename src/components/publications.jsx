import React from 'react'
import {publications_list} from '../data/publications'
import AuthorNames from "./utils/text";

function Publications() {

    return (
        <div 
            name="publications"
            className="bg-gray-900 w-full py-5 px-5 flex flex-col justify-center">
            <div className="px-5 container">
                <div className="px-5 text-white">

                    <div className="justify-center text-center">
                        <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
                            Publications
                        </p>
                        <p className="py-6">These are the papers that got accepted</p>
                    </div>
                    <div className="px-5 py-5">
 
                        {Object.entries(publications_list).map( ([key, value]) => (
                            <>
                            <h2 className="text-5xl font-semibold text-lime-700 text-center">{key}</h2> 
                            {value.map((link) => (
                            <div className="wrapper py-3" key={link.id} >
                                <div class="grid grid-cols-4 gap-2">
                                    <a href={link.link} className="text-yellow-400 col-span-3 text-2xl"> {link.name} </a>
                                    <p className="text-right text-lg"> {link.site} </p>
                                </div>
                                <br></br>
                                <div className="text-xl">
                                    <AuthorNames text={link.authors} shouldBeBold='Minh-Khoi Pham' />
                                    <p> {link.description} </p>
                                </div>
                            </div>
                            ))}
                            </>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Publications