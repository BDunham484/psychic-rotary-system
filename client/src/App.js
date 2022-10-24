import './App.css';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {

  return (
      <div>
        <Header></Header>
        <main> 
          <Home></Home>
        </main>
        <Footer></Footer>
      </div> 
  );
}

export default App;
