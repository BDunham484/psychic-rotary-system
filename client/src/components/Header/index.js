import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <h1>NZBX</h1>
      </Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/profile">Profile</Link>
    </header>
  );
};

export default Header;
