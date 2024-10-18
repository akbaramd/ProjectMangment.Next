import authRoute from '@/configs/routes.config/authRoute'
import { Outlet, useLocation } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import type { CommonProps } from '@/@types/common'

const PreLoginLayout = () => {
    const location = useLocation()

    const { pathname } = location

    const isAuthPath = authRoute.some((route) => route.path === pathname)

    return (
        <div className="flex flex-auto flex-col h-[100vh]">
            {isAuthPath ? <AuthLayout><Outlet/></AuthLayout> : <Outlet/>}
        </div>
    )
}

export default PreLoginLayout
