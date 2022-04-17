import React from 'react';
import { Navbar, Welcome, Footer, Services, Transactions, Loader, Staking1, Staking2 } from './components';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



const Home = () => {
  return (
    <>
      <Welcome />
      <Services />
    </>
  )
}


const App = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-welcome">
        <Navbar />
        <Router>
          <Routes>
            <Route exact path='/' element={< Home />}></Route>
            <Route exact path='/staking1' element={< Staking1 />}></Route>
            <Route exact path='/staking2' element={< Staking2 />}></Route>
            {/* <Route exact path='/contact' element={< Contact />}></Route> */}
          </Routes>
        </Router>
      </div>
      
          {/* <Transactions />
          <Footer /> */}
    </div>
  )
}

export default App
