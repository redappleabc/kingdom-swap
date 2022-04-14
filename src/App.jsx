import { Navbar, Welcome, Footer, Services, Transactions, Loader } from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-welcome">
        <Navbar />
        <Welcome />
        <Services />
      </div>
      
          {/* <Transactions />
          <Footer /> */}
    </div>
  )
}

export default App
