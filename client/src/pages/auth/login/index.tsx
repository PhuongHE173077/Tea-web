import React from 'react'
import { LoginForm } from './components/login-form'
import { GalleryVerticalEnd } from "lucide-react"

export default function Login() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className=" text-primary-foreground flex items-center justify-center rounded-md">
                    <img src="/logo.png" alt="Trà Việt" className="h-40 w-50 object-cover object-center" />
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
