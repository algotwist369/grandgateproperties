import React, { useEffect } from 'react'

const CookiePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen pt-24 pb-12 bg-[#0B0D10] text-gray-100'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                        Cookie <span className='text-[#D3A188]'>Policy</span>
                    </h1>
                    <p className='text-gray-400'>Last updated: December 29, 2024</p>
                </div>

                {/* Content */}
                <div className='space-y-8 text-gray-300'>
                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>1. What Are Cookies</h2>
                        <p className='leading-relaxed'>
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>2. How We Use Cookies</h2>
                        <p className='leading-relaxed mb-4'>
                            Grand Gate Properties uses cookies to enhance your experience on our website, understand how you use our services, and improve our offerings.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>3. Types of Cookies We Use</h2>

                        <div className='space-y-6'>
                            <div className='bg-[#111] p-6 rounded-lg border border-[#D3A188]/20'>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-3'>Essential Cookies</h3>
                                <p className='leading-relaxed mb-2'>
                                    These cookies are necessary for the website to function properly. They enable core functionality such as:
                                </p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Security and authentication</li>
                                    <li>Session management</li>
                                    <li>Load balancing</li>
                                </ul>
                            </div>

                            <div className='bg-[#111] p-6 rounded-lg border border-[#D3A188]/20'>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-3'>Performance Cookies</h3>
                                <p className='leading-relaxed mb-2'>
                                    These cookies help us understand how visitors interact with our website by collecting information such as:
                                </p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Pages visited most frequently</li>
                                    <li>Time spent on each page</li>
                                    <li>Error messages received</li>
                                    <li>User navigation patterns</li>
                                </ul>
                            </div>

                            <div className='bg-[#111] p-6 rounded-lg border border-[#D3A188]/20'>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-3'>Functionality Cookies</h3>
                                <p className='leading-relaxed mb-2'>
                                    These cookies allow the website to remember choices you make and provide enhanced features:
                                </p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Language preferences</li>
                                    <li>Property search filters</li>
                                    <li>Saved property listings</li>
                                    <li>Location settings</li>
                                </ul>
                            </div>

                            <div className='bg-[#111] p-6 rounded-lg border border-[#D3A188]/20'>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-3'>Targeting/Advertising Cookies</h3>
                                <p className='leading-relaxed mb-2'>
                                    These cookies are used to deliver relevant advertisements and track ad campaign performance:
                                </p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Personalized property recommendations</li>
                                    <li>Retargeting campaigns</li>
                                    <li>Social media integration</li>
                                    <li>Ad effectiveness measurement</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>4. Third-Party Cookies</h2>
                        <p className='leading-relaxed mb-2'>
                            We may also use third-party cookies from trusted partners for:
                        </p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Google Analytics for website analytics</li>
                            <li>Social media platforms (Facebook, Instagram, LinkedIn)</li>
                            <li>Marketing and advertising partners</li>
                            <li>Payment processing services</li>
                        </ul>
                        <p className='leading-relaxed mt-4'>
                            These third parties may collect information about your online activities across different websites.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>5. Managing Cookies</h2>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Browser Settings</h3>
                                <p className='leading-relaxed'>
                                    Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies. However, blocking or deleting cookies may impact your experience on our website.
                                </p>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Cookie Preferences</h3>
                                <p className='leading-relaxed'>
                                    You can manage your cookie preferences at any time by accessing the cookie settings on our website. Note that essential cookies cannot be disabled as they are necessary for the website to function.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>6. How to Delete Cookies</h2>
                        <p className='leading-relaxed mb-2'>
                            To delete cookies from your browser:
                        </p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li><span className='font-semibold text-white'>Chrome:</span> Settings → Privacy and security → Clear browsing data</li>
                            <li><span className='font-semibold text-white'>Firefox:</span> Options → Privacy & Security → Cookies and Site Data</li>
                            <li><span className='font-semibold text-white'>Safari:</span> Preferences → Privacy → Manage Website Data</li>
                            <li><span className='font-semibold text-white'>Edge:</span> Settings → Privacy, search, and services → Clear browsing data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>7. Cookie Duration</h2>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Session Cookies</h3>
                                <p className='leading-relaxed'>
                                    These cookies are temporary and are deleted when you close your browser.
                                </p>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Persistent Cookies</h3>
                                <p className='leading-relaxed'>
                                    These cookies remain on your device until they expire or are manually deleted. They help us recognize you when you return to our website.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>8. Updates to This Policy</h2>
                        <p className='leading-relaxed'>
                            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting the updated policy on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>9. Contact Us</h2>
                        <p className='leading-relaxed mb-2'>
                            If you have any questions about our use of cookies, please contact us:
                        </p>
                        <div className='bg-[#111] p-6 rounded-lg border border-[#D3A188]/20 mt-4'>
                            <p className='mb-2'><span className='font-semibold text-white'>Email:</span> grandgatepropertiesllc@gmail.com</p>
                            <p className='mb-2'><span className='font-semibold text-white'>Phone:</span> +971 5 544 22553 (Dubai)</p>
                            <p><span className='font-semibold text-white'>Address:</span> 9B Zaa'beel St - Al Karama - Dubai - United Arab Emirates, Dubai, United Arab Emirates</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CookiePage
