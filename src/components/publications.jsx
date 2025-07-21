import React, { useState, useEffect } from 'react'
import AuthorNames from "./utils/text";

function Publications() {
    const [publications, setPublications] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const response = await fetch('/api/publications');
                const data = await response.json();
                setPublications(data);
            } catch (error) {
                console.error('Failed to fetch publications:', error);
                // Fallback to static data
                try {
                    const { publications_list } = await import('../data/publications');
                    setPublications(publications_list);
                } catch (fallbackError) {
                    console.error('Failed to load fallback data:', fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPublications();
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-900 w-full py-5 px-5 flex flex-col justify-center">
                <div className="px-5 container">
                    <div className="px-5 text-white text-center">
                        <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
                            Publications
                        </p>
                        <p className="py-6">Loading publications...</p>
                    </div>
                </div>
            </div>
        );
    }

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
 
                        {Object.entries(publications).map( ([key, value]) => (
                            <div key={key}>
                            <h2 className="text-5xl font-semibold text-lime-700 text-center">{key}</h2> 
                            {value.map((link) => (
                            <div className="wrapper py-3" key={link.id} >
                                <div className="grid grid-cols-4 gap-2">
                                    <a href={link.pdfUrl || link.link} className="text-yellow-400 col-span-3 text-2xl"> {link.title || link.name} </a>
                                    <p className="text-right text-lg"> {link.venue || link.site} </p>
                                </div>
                                <br></br>
                                <div className="text-xl">
                                    <AuthorNames text={Array.isArray(link.authors) ? link.authors.join(', ') : link.authors} shouldBeBold='Minh-Khoi Pham' />
                                    <p> {link.abstract || link.description} </p>
                                </div>
                            </div>
                            ))}
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Publications