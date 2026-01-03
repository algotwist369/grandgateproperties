import React, { useEffect } from 'react'

const TermsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='min-h-screen pt-24 pb-12 bg-[#0B0D10] text-gray-100'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-12'>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
                        Terms of <span className='text-[#BD9B5F]'>Service</span>
                    </h1>
                    <p className='text-gray-400'>Last updated: December 29, 2024</p>
                </div>

                {/* Content */}
                <div className='space-y-8 text-gray-300'>
                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>1. Agreement to Terms</h2>
                        <p className='leading-relaxed'>
                            By accessing or using the Grand Gate Properties website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>2. Services Description</h2>
                        <p className='leading-relaxed mb-2'>
                            Grand Gate Properties provides real estate services including:
                        </p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Property buying and selling assistance</li>
                            <li>Property rental services</li>
                            <li>Real estate investment advisory</li>
                            <li>Property management services</li>
                            <li>Market research and property valuations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>3. User Responsibilities</h2>
                        <div className='space-y-4'>
                            <div>
                                <h3 className='text-xl font-semibold text-[#BD9B5F] mb-2'>Account Registration</h3>
                                <p className='leading-relaxed'>
                                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                </p>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold text-[#BD9B5F] mb-2'>Accurate Information</h3>
                                <p className='leading-relaxed'>
                                    You agree to provide accurate, current, and complete information when using our services and to update such information as necessary.
                                </p>
                            </div>
                            <div>
                                <h3 className='text-xl font-semibold text-[#BD9B5F] mb-2'>Prohibited Activities</h3>
                                <p className='leading-relaxed mb-2'>You agree not to:</p>
                                <ul className='list-disc list-inside space-y-1 ml-4'>
                                    <li>Use our services for any illegal purpose</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Interfere with or disrupt our services</li>
                                    <li>Post false, misleading, or fraudulent content</li>
                                    <li>Violate any applicable laws or regulations</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>4. Property Listings</h2>
                        <p className='leading-relaxed'>
                            Property information on our website is provided for informational purposes only. While we strive for accuracy, we do not guarantee that all property details, pricing, and availability are current or error-free. Property conditions, features, and amenities should be independently verified.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>5. Fees and Payments</h2>
                        <p className='leading-relaxed mb-2'>
                            Fees for our services vary based on the type of service and property. All fees will be clearly communicated before any transaction. Payment terms include:
                        </p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Commission fees for property sales</li>
                            <li>Service fees for property management</li>
                            <li>Consultation fees for advisory services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>6. Intellectual Property</h2>
                        <p className='leading-relaxed'>
                            All content on the Grand Gate Properties website, including text, graphics, logos, and images, is the property of Grand Gate Properties and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>7. Limitation of Liability</h2>
                        <p className='leading-relaxed'>
                            Grand Gate Properties shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services. Our total liability shall not exceed the amount of fees paid by you for the specific service giving rise to the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>8. Indemnification</h2>
                        <p className='leading-relaxed'>
                            You agree to indemnify and hold harmless Grand Gate Properties, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of your use of our services or violation of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>9. Termination</h2>
                        <p className='leading-relaxed'>
                            We reserve the right to terminate or suspend your access to our services immediately, without prior notice, for any breach of these Terms or for any other reason at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>10. Governing Law</h2>
                        <p className='leading-relaxed'>
                            These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>11. Changes to Terms</h2>
                        <p className='leading-relaxed'>
                            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of our services after such changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-2xl font-bold text-white mb-4'>12. Contact Information</h2>
                        <p className='leading-relaxed mb-2'>
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className='bg-[#111] p-6 rounded-lg border border-[#BD9B5F]/20 mt-4'>
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

export default TermsPage
