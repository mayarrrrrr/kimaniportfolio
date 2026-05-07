import React from 'react'

const Contact = ({darkMode}) => {
  return (
    <section
    id='contact'
    style={{
        backgroundColor:darkMode ? "#111827":"#f9fafb"
    }}
    className='py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden'>
        <div className="container mx-auto px-4 sm:px-6lg:px-8" >
            <div className="text-center mb-8 sm:mb-10 md:mb-12" data-aos="fade-up">
                <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3'
                style={{
                    color:darkMode ? 'white': '#1f2937'
                }}>
                    Get In<span>Touch</span>
                </h2>
            </div>
        </div>

    </section>
  )
}

export default Contact