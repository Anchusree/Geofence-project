import React from 'react'
import {Navbar, Nav, Container} from 'react-bootstrap'

function Header() {
  return (
    <header>
        <Navbar bg="light" expand ="lg">
            <Container>
                <Navbar.Brand href="/">Geofence</Navbar.Brand>
                <Navbar.Toggle aria-controls ="basic-navbar-nav"></Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/viewAllMaps">View All Maps</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>


        </Navbar>
    </header>
  )
}

export default Header