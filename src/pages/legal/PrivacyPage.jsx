import React, { useEffect } from 'react'

const PrivacyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen pt-24 pb-12 bg-[#0B0D10] text-gray-100'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                        Privacy <span className='text-[#D3A188]'>Policy</span>
                    </h1>
                    <p className='text-gray-400'>Last updated: December 29, 2024</p>
                </div>

                {/* Content */}
                <div className='space-y-8 text-gray-300'>
                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>1. Introduction</h2>
                        <p className='leading-relaxed'>
                            Grand Gate Properties ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>2. Information We Collect</h2>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Personal Information</h3>
                                <p className='leading-relaxed'>
                                    We may collect personal information that you voluntarily provide to us, including:
                                </p>
                                <ul className='list-disc list-inside mt-2 space-y-1 ml-4'>
                                    <li>Name and contact information (email, phone number, address)</li>
                                    <li>Property preferences and search criteria</li>
                                    <li>Financial information for property transactions</li>
                                    <li>Communication preferences</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold text-[#D3A188] mb-2'>Automated Information</h3>
                                <p className='leading-relaxed'>
                                    When you visit our website, we automatically collect certain information about your device, including:
                                </p>
                                <ul className='list-disc list-inside mt-2 space-y-1 ml-4'>
                                    <li>IP address and browser type</li>
                                    <li>Operating system and device information</li>
                                    <li>Pages viewed and time spent on our website</li>
                                    <li>Referring website addresses</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>3. How We Use Your Information</h2>
                        <p className='leading-relaxed mb-2'>We use the information we collect to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Provide and maintain our services</li>
                            <li>Process property inquiries and transactions</li>
                            <li>Send you property listings and updates</li>
                            <li>Improve our website and user experience</li>
                            <li>Communicate with you about our services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>4. Information Sharing</h2>
                        <p className='leading-relaxed mb-2'>
                            We may share your information with:
                        </p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Property owners and developers</li>
                            <li>Service providers and business partners</li>
                            <li>Legal and regulatory authorities when required</li>
                            <li>Affiliated companies within our corporate group</li>
                        </ul>
                        <p className='leading-relaxed mt-4'>
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>5. Data Security</h2>
                        <p className='leading-relaxed'>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>6. Your Rights</h2>
                        <p className='leading-relaxed mb-2'>You have the right to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Access and receive a copy of your personal data</li>
                            <li>Correct inaccurate or incomplete information</li>
                            <li>Request deletion of your personal data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to processing of your personal data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>7. Cookies and Tracking</h2>
                        <p className='leading-relaxed'>
                            We use cookies and similar tracking technologies to enhance your experience on our website. For more information, please see our Cookie Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>8. Children's Privacy</h2>
                        <p className='leading-relaxed'>
                            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>9. Changes to This Policy</h2>
                        <p className='leading-relaxed'>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>10. Contact Us</h2>
                        <p className='leading-relaxed mb-2'>
                            If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPage
