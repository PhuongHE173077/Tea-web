import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCompanyInfoByIdAPIs, fetchCompanyInfosAPIs } from '@/apis/company-info.apis'

export default function PublicLayout() {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>();

    useEffect(() => {
        fetchCompanyInfosAPIs().then((res) => {
            setCompanyInfo(res.data[0])
        })
    }, [])

    return (
        <div>
            <Header />
            <Outlet />
            {
                companyInfo &&
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                    className="fixed bottom-8 right-8 z-40"
                >

                    {companyInfo.company_shopee?.isActive && <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(companyInfo.company_shopee.url)}
                        className="bg-white text-white p-4 px-5 rounded-full shadow-2xl flex items-center justify-center mb-1"
                    >
                        <img src="/icon/shopee.png" alt="Cart" className="w-4 h-6" />
                    </motion.button>}

                    {companyInfo.company_zalo?.isActive && <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(companyInfo.company_zalo.url)}
                        className="bg-white text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
                    >
                        <img src="/images/icon/zalo-icon.svg" alt="Cart" className="w-6 h-6" />
                    </motion.button>}
                </motion.div>}
            {companyInfo && <Footer companyInfo={companyInfo} />}
        </div>
    )
}
