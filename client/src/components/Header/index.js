import { useContext } from "react";
import { Link } from "react-router-dom";
import Auth from '../../utils/auth';
import { CubeAlt } from '@styled-icons/boxicons-regular';
import { ConcertContext } from '../../utils/GlobalState'


const Header = () => {
  const { today, setDate, setSortOrSearch } = useContext(ConcertContext);

  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  const clickHandler = () => {
    setDate(today);
    setSortOrSearch('venue')
  }

  return (
    <>
      <header>

        <div className="display-flex title-wrapper">
          <Link to="/">
            <h1 onClick={clickHandler} id="title">NOISEBX</h1>
            <h1 onClick={clickHandler} id="title-mobile">NBX</h1>
          </Link>
          <CubeAlt id="cube-icon" />

        </div>

        <nav id="navigation">
          {Auth.loggedIn() ? (
            <ul>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/" onClick={logout}>
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </ul>
          )}

        </nav>
      </header>
    </>

  );
};

export default Header;
