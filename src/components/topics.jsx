import React from 'react'

function Topics() {
  return (
    <div id="topics" className="bg-secondary py-5 px-5">
        <div className="container">
            <h1 className="text-primary fw-bold">Research topics</h1>
            <div className="d-flex flex-row flex-wrap justify-content-center">
                <div className="card py-3 px-3 mx-sm-4 my-4 card-work" style="width:20rem">
                    <h4 className="text-primary"><strong>Computer Vision </strong> 🖼 </h4>
                    <p className="text-dark">I study about Classification, Segmentation, Detection, Tracking and
                        Generative models. Using Python/Pytorch</p>
                    <div className="text-end"></div>
                </div>
                <div className="card py-3 px-3 mx-sm-4 my-4 card-work" style="width:20rem">
                    <h4 className="text-primary"> <strong> Natural Language Processing </strong> 📑</h4>
                    <p className="text-dark">I do language generation tasks such as Translation, Captioning, Question
                        Answering.</p>
                    <div className="text-end"></div>
                </div>
                <div className="card py-3 px-3 mx-sm-4 my-4 card-work" style="width:20rem">
                    <h4 className="text-primary"> <strong> Deep Learning Techniques </strong> 📑</h4>
                    <p className="text-dark">I research about DL techniques such as adversarial attack, semi-supervised
                        learning.
                    </p>
                    <div className="text-end"></div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topics