import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';

//establish link to GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
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
        <Header></Header>
        <main>
          <Home></Home>
        </main>
        <Footer></Footer>
      </div>
    </ApolloProvider>

  );
}

export default App;
