import React from 'react'
import { LoginForm } from './components/login-form'
import { GalleryVerticalEnd } from "lucide-react"

export default function Login() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <a href="#" className="flex items-center justify-center mb-5 gap-2 self-center font-medium">
                    <div className=" text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <img src="/logo.png" alt="Trà Việt" className="h-6 w-6" />
                    </div>
                    {import.meta.env.VITE_APP_NAME}
                </a>
                <LoginForm />
            </div>
        </div>
    )
}
