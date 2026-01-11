import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import './locales'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const client = new QueryClient()
function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={client}>
                    <ReactQueryDevtools initialIsOpen={false} />

                    <BrowserRouter>
                        <Theme>
                            <Layout />
                        </Theme>
                    </BrowserRouter>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}

export default App
