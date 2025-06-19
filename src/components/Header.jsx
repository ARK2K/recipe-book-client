import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" className="px-3">
        <Container fluid className="justify-content-between">
          <Navbar.Brand href="/">Recipe Book</Navbar.Brand>
          <Nav className="ms-auto">
            {user ? (
              <NavDropdown title={user?.name || 'Account'} id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/recipes/new">
                  <NavDropdown.Item>Add Recipe</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              !isLoginPage && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;