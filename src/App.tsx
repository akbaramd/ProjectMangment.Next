import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { TenantProvider } from '@/tenant/TenantContext'
import { Provider } from 'react-redux'
import { store } from './store/configureStore'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
   
    return (
        <Provider store={store}>
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
        </Provider>
    )
}

export default App
