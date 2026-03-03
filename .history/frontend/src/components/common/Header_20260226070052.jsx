import React, { useContext } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'   // ✅ adjust path if needed

const Header = () => {
  const { user } = useContext(AuthContext)

  const role = user?.user?.role

  const accountLink =
    role === "student"
      ? "/account/student/dashboard"
      : role === "instructor"
      ? "/account/instructor/dashboard"
      : role === "admin"
      ? "/account/admin/dashboard"
      : "/account/login"

  return (
    <Navbar expand="md" className="bg-white shadow-lg header py-3">
      <Container>
        <Navbar.Brand as={Link} to="/"><strong>Smart Learning</strong></Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={Link} to="/courses">All Courses</Nav.Link>
          </Nav>

          <Link to={accountLink} className="btn btn-primary">
            My Account
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header