import React from 'react';
import { Grid, Navbar, Nav, NavItem } from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <Navbar inverse fixedTop>
            <Grid>
                <Navbar.Header>
                <Navbar.Brand>
                    <a href="/">Naruto Blazing Summon Simulator</a>
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem href="/">Created by Coenl, Assets and Stats by Anton</NavItem>
                </Nav>
                </Navbar.Collapse>
            </Grid>
            </Navbar>
        )
    }
}

export default Header;