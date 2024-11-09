// style react quill

import 'react-quill/dist/quill.snow.css'

import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context'
import { LanguageProvider } from './contexts/language-context'
import routes from './routes'
import { useAppSelector } from './stores/hooks'
import { RootState } from './stores/store'

function App() {
  const { language } = useAppSelector((state: RootState) => state.language)
  const { accessToken } = useAppSelector((state: RootState) => state.auth)

  console.log('Access Token from Redux:', accessToken)
  return (
    <LanguageProvider languageLocal={language}>
      <AuthProvider token={accessToken}>
        <RouterProvider router={routes} />
      </AuthProvider>
    </LanguageProvider>
  )
}
export default App
