import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'

import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'

import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BoardList from './pages/BoardList'
import BoardView from './pages/BoardView'
import BoardWrite from './pages/BoardWrite'
import Boardedit from './pages/Boardedit'


const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/board" element={<BoardList />} />
            <Route path="/board" element={<BoardView />} />
            <Route path="/boardwrite" element={<BoardWrite />} />
            <Route path="/boardedit/:id" element={<Boardedit />} />
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App