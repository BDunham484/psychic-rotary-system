import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Show from './pages/Show';
import Profile from './pages/Profile';
import NoMatch from './pages/NoMatch';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import { ConcertProvider } from './utils/GlobalState';




//establish link to GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

//middleware function that retrieves token and combines with exiisting HTTP Link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//use ApolloClient() constructor to instantiate the Apollo Client instance/create connection to API endpoint
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {



  return (
    <ApolloProvider client={client}>
      <ConcertProvider>
        <Router>
          <div>
            <div>
              <Header />
              <main>
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
                  <Route path="/profile">
                    <Route path=":username" element={<Profile />} />
                    <Route path="" element={<Profile />} />
                  </Route>
                  <Route path="/show/:artists" element={<Show />} />
                  <Route
                    path="*"
                    element={<NoMatch />}
                  />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </ConcertProvider>
    </ApolloProvider>
  );
}

export default App;
