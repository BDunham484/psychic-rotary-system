import { Link } from "react-router-dom";
import Auth from '../../utils/auth';

const Header = () => {
  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };


  return (
    <header>
      <Link to="/">
        <h1>NZBX</h1>
      </Link>
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
  );
};

export default Header;
