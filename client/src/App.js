import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Show from './pages/Show';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';

//establish link to GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

//use ApolloClient() constructor to instantiate the Apollo Client instance/create connection to API endpoint
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

function App() {

  return (
    <ApolloProvider client={client}>
      <div>
        <Router>
          <div>
          <Header>
            <div>
              <Routes>
                <Route
                  path="/"
                  element={<Home />}
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/profile"
                  element={<Profile />}
                />
                <Route
                  path="/show"
                  element={<Show />}
                />
              </Routes>
            </div>
          </Header>
          </div>
        </Router>
        
        <main>
          <Home></Home>
        </main>
        <Footer />
      </div>
    </ApolloProvider>

  );
}

export default App;
