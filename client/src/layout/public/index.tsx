import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PublicLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-40"
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open('https://zalo.me/0123456789')}
                    className="bg-white text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
                >
                    <img src="/images/icon/zalo-icon.svg" alt="Cart" className="w-6 h-6" />
                </motion.button>
            </motion.div>
            <Footer />
        </div>
    )
}
