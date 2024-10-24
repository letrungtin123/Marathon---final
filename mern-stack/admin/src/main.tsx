import './i18next.ts'
import './styles/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistor, store } from './stores/store.tsx'

import App from './App.tsx'
import { ConfigProvider } from 'antd'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './styles/them-antd.ts'

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfigProvider theme={theme}>
            <App />
          </ConfigProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
