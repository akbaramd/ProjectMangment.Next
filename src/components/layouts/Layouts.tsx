import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'
import { useThemeStore } from '@/store/themeStore'
import PostLoginLayout from './PostLoginLayout'
import PreLoginLayout from './PreLoginLayout'
import useDirection from '@/utils/hooks/useDirection'

const Layout = ({ children }: CommonProps) => {


    const { authenticated } = useAuth()
    const [direction, setDirection] = useDirection()

    setDirection('rtl')
    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {children}
        </Suspense>
    )
}

export default Layout
