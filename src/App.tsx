import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { TenantProvider } from '@/tenant/TenantContext'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <TenantProvider>
                        <Layout>
                            <Views />
                        </Layout>
                    </TenantProvider>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
