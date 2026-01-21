
import './App.css'
import { Footer } from './components/layout/footer/Footer'
import { Header } from './components/layout/header/Header'
import { Main } from './components/layout/main/Main'
import { GlobalContextProvider } from './context/GlobalContext'

function App() {
  return (
    <div className='layout'>
      <GlobalContextProvider>
        <Header />
        <Main />
        <Footer />
      </GlobalContextProvider>
    </div>
  )
}

export default App
