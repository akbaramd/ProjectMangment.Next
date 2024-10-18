import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import Loading from '@/components/shared/Loading'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import PreLoginLayout from '@/components/layouts/PreLoginLayout'
import { Suspense } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { TenantProvider, useTenant } from '@/tenant/TenantContext'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { user, authenticated } = useAuth()
    const layoutType = useThemeStore((state) => state.layout.type)
    const { tenant, loading: tenantLoading } = useTenant()

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            <Routes>
                {/* Public Routes - accessible to everyone */}
                <Route path="/" element={<PreLoginLayout />}>
                    {publicRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <AppRoute
                                    routeKey={route.key}
                                    component={route.component}
                                    {...route.meta}
                                />
                            }
                        />
                    ))}
                </Route>
                {authenticated && (
                    <Route path="/" element={<PostLoginLayout layoutType={layoutType} />}>
                        <Route
                            path="/"
                            element={<Navigate replace to={authenticatedEntryPath} />}
                        />
                        {protectedRoutes.map((route, index) => {
                            const hasTenantAccess = route.tenantAccess
                                ? tenant?.currentUserRole != null && route.tenantAccess.includes(tenant.currentUserRole)
                                : true; // If no tenantAccess defined, allow access
                            return (
                                <Route
                                    key={route.key + index}
                                    path={route.path}
                                    element={
                                        <AuthorityGuard
                                            userAuthority={user.authority}
                                            authority={route.authority}
                                        >
                                            {hasTenantAccess ? (
                                                <PageContainer {...props} {...route.meta}>
                                                    <AppRoute
                                                        routeKey={route.key}
                                                        component={route.component}
                                                        {...route.meta}
                                                    />
                                                </PageContainer>
                                            ) : (
                                                <Navigate replace to="/no-access" />
                                            )}
                                        </AuthorityGuard>
                                    }
                                />
                            );
                        })}
                        <Route path="*" element={<Navigate replace to="/home" />} />
                    </Route>
                )}

                {!authenticated && (
                    <Route path="*" element={<Navigate replace to="/sign-in" />} />
                )}
            </Routes>
        </Suspense>
    );
};

export default AllRoutes;
