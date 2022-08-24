import React from 'react'
import avatar from '../assets/avatar.png'

function Home() {
  return (
    <div 
        name="home"
        className="bg-gray-900 w-full h-screen py-5 px-5 flex flex-col justify-center">
        <div className="px-5 container">
            <div className="px-5  row align-items-center">
                <div className="px-5 text-white col-sm-6">
                    <h1 className="font-bold text-4xl">Hi there 🖐</h1>
                    <br/>
                    <p>Welcome to my page. My real name is <strong>Minh-Khoi Pham</strong>, but I prefer to be
                        called Kay. </p>
                    <br/>
                    <div className="text-center">
                    <a className="svg hover:scale-105 duration-500" target="_blank" rel="noreferrer" href="https://www.facebook.com/Kaylode"> 
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                                className="bi bi-facebook" viewBox="0 0 16 16">
                                <path fill="#ffffff"
                                    d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                            </svg>
                        </span>
                    </a>
                    
                    &nbsp;

                    <a className="svg hover:scale-105 duration-500" target="_blank" rel="noreferrer" href="https://github.com/kaylode"> 
                        <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                            className="bi bi-github" viewBox="0 0 16 16">
                            <path fill="#ffffff"
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                        </span>
                    </a>
                    
                    &nbsp;

                    <a className="svg hover:scale-105 duration-500" target="_blank" rel="noreferrer" href="https://linkedin.com/in/kaylode/"> 
                        <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
                            className="bi bi-linkedin" viewBox="0 0 16 16">
                            <path fill="#ffffff"
                                d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                        </svg>
                        </span>
                    </a>

                    &nbsp;

                    <a className="svg hover:scale-105 duration-500" target="_blank" rel="noreferrer" href="https://discordapp.com/users/326944513396441089"> 
                        <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor"
                            className="bi bi-linkedin" viewBox="0 0 16 16">
                            <path fill="#ffffff"
                                d="M6.552 6.712c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888.008-.488-.36-.888-.816-.888zm2.92 0c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888s-.36-.888-.816-.888z" />
                            <path fill="#ffffff"
                                d="M13.36 0H2.64C1.736 0 1 .736 1 1.648v10.816c0 .912.736 1.648 1.64 1.648h9.072l-.424-1.48 1.024.952.968.896L15 16V1.648C15 .736 14.264 0 13.36 0zm-3.088 10.448s-.288-.344-.528-.648c1.048-.296 1.448-.952 1.448-.952-.328.216-.64.368-.92.472-.4.168-.784.28-1.16.344a5.604 5.604 0 0 1-2.072-.008 6.716 6.716 0 0 1-1.176-.344 4.688 4.688 0 0 1-.584-.272c-.024-.016-.048-.024-.072-.04-.016-.008-.024-.016-.032-.024-.144-.08-.224-.136-.224-.136s.384.64 1.4.944c-.24.304-.536.664-.536.664-1.768-.056-2.44-1.216-2.44-1.216 0-2.576 1.152-4.664 1.152-4.664 1.152-.864 2.248-.84 2.248-.84l.08.096c-1.44.416-2.104 1.048-2.104 1.048s.176-.096.472-.232c.856-.376 1.536-.48 1.816-.504.048-.008.088-.016.136-.016a6.521 6.521 0 0 1 4.024.752s-.632-.6-1.992-1.016l.112-.128s1.096-.024 2.248.84c0 0 1.152 2.088 1.152 4.664 0 0-.68 1.16-2.448 1.216z" />
                        </svg> 
                        </span>
                    </a>

                    </div>
                </div>
                <div className="col-sm-6 text-center">
                    <div className="flex-col flex items-center justify-center">
                      <img className="img-fluid my-3 card-image" width="250" height="250"
                          src={avatar} alt="profile of kaylode" />
                    </div>
                    <div className="py-2">
                      <a className="btn btn-primary my-1 mx-3 hover:scale-105 duration-500"
                          href="https://drive.google.com/file/d/1BXvBd6wiMftJgpn4cJBTQ2fUt2JaYnG0/view?usp=sharing">Resumé</a>
                      <a className="btn btn-primary my-1 mx-3 hover:scale-105 duration-500" href="mailto:pmkhoi@selab.hcmus.edu.vn">Email</a>
                    </div>
                </div>


                <div className="px-5 py-5 text-white">
                    <div className="justify-center text-center">
                        <p className="text-4xl font-bold border-b-4 border-gray-500 p-2 inline">
                            About me
                        </p>
                    </div>
                    <div className='text-xl'>
                        <p className="pt-4">I&#x27;m an AI researcher and engineer from Viet Nam - country known for its long-standing
                            culture and customs.</p>
                        <p className="py-2">I am currently a 4th year Computer Science student of Honors Program of <a
                            href="https://www.hcmus.edu.vn/">University of Science</a>, Ho Chi Minh city, Viet Nam. My
                            major is mainly about Artificial Intelligence, Machine Learning and Deep Learning.</p>
                        <p className="py-2">I&#x27;m interested in finding new thing, new method, state-of-the-art models and trying to apply
                            it or even reimplement it. Technology is growing everyday, so I spend effort trying as many new
                            things as possible. All my code are opensource on my personal Github account for education
                            purpose - and for other researchers, developers to refer to. </p>
                        <p className="py-2">During my time in college, I improved myself with experience by studying and working on many
                            projects using different technologies such as Android, Web Server and Game development. </p>
                        <p className="py-2">When I&#x27;m not programming, I focus on other hobbies which are: playing games 🎮 and reading Marvel
                            comics 📕 .</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Home