import React from 'react'

const AgentHeaders = () => {
    return (
        <div>
            {/* hero section */}
            <section>
                <div className="relative w-full h-[85vh] overflow-hidden bg-black">

                    {/* Background Image */}
                    <img
                        src="https://images.all-free-download.com/images/graphiclarge/digital_marketing_agency_advertising_banner_template_elegant_office_staffs_realistic_design_6921409.jpg"
                        alt="Agents"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                    {/* Bottom Text */}
                    <div className="absolute bottom-10 w-full flex flex-col items-center px-4">

                        <h1 className="text-gray-400 text-4xl md:text-5xl font-light tracking-wide text-center">
                            REAL ESTATE AGENTS IN DUBAI
                        </h1>

                        <p className="text-gray-400 mt-3 text-lg text-center">
                            Team of real estate experts
                        </p>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default AgentHeaders