import Footer from '@/components/landing/Footer'
import Header from '@/components/landing/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}
