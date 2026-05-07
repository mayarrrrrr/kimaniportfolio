import about from '../assets/heroimage1.png'

const About = ({darkMode}) => {
  return (
    <section id="about" className={`min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}  `}>
        <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <figure
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-wrap justify-center gap-4 relative order-2 lg:order-1">
                <div className="relative w-75 h-75 lg:w-96 lg:h-96">
                    {/* image */}
                    <div
                        className="star-shape absolute -inset-10 lg:-inset-20 bg-linear-to-r from-[#f97316] via-[#fb923c] to-[#f59e0b] rotate-12 z-0"
                        data-aos="fade-up"
                        data-aos-delay="300"
                        >
                    </div>
                    <img 
                    src={about}
                    alt="About image"
                    className='absolute inset-0 w-full h-full object-cover z-10 transition-all duration-300'
                    data-aos="zoom-in"
                    data-aos-delay="400"
                    />
                </div>

            </figure>
            <article
            data-aos="fade-left"
            data-aos-delay="300"
            className='text-center lg:text-left relative order-1 lg:oreder-2'>
                <header>
                    <h1 className='text-3xl sm:text-4xl lg:text:text-5xl xl:text-6xl font-bold wb-4 sm:mb-6 text-transparent bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text'
                    data-aos="fade-up"
                    data-aos-delay="400">
                        About Me
                    </h1>
                </header>
                <p className={`text-sm sm:text-base lg:text-lg xl:text-xl mb-6 sm:mb-8 leading-relaxed bg-linear-to-r from-orange-900/10 to-orange-900/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm ${darkMode ? 'text-gray-300':'text-gray-700'}`
                    }
                    data-aos="fade-up"
                    data-aos-delay="500">
                        Alongside my technical work, I also have a background in <span className='text-orange-700'>Public Relations and Communications</span>, where I worked on clear messaging, community engagement, and shaping how ideas are presented across different audiences. I’ve also been involved in article writing,editing, photography/videography,  coordinating communication materials, and supporting outreach efforts that require clarity and strategic thinking. 
                    </p>
                    <div
                    className='flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8'>
                        <div
                        className='text-center'
                        data-aos="zoom-in"
                        data-aos-delay="600"
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400">10+</div>
                            
                            <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-300':'text-gray-600'}`}>PR Engagements</div>
                        </div>
                         <div
                        className='text-center'
                        data-aos="zoom-in"
                        data-aos-delay="600"
                        >
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400">2+</div>
                            
                            <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-300':'text-gray-600'}`}>Years of Tech Experience</div>
                        </div>

                    </div>
                    <button className={`w-full  border-2 border-orange-500 inline-flex items-center justify-center  py-2 px-4 sm:px-8 hover:shadow-[0_0_40px_rgb(255,165,0,0.7)] rounded-full text-base sm:text-lg font-semibold transition-all duration-300 transform ${darkMode ? 'text-white bg-orange-500/10':'text-gray-800 bg-white/90'}`}
                    data-aos="fade-up"
                    data-aos-delay="800">
                               
                                Learn More
                            </button>

            </article>
        </div>

    </section>
  )
}

export default About;