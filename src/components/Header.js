import React from 'react';
import { Grid, Navbar, Nav } from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <Navbar inverse fixedTop>
            <Grid>
                <Navbar.Header>
                <Navbar.Brand>
                    Naruto Blazing Summon Simulator
                </Navbar.Brand>
                <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                <Nav pullRight>
                    Created by Coenl, Assets and Stats by Anton
                </Nav>
                </Navbar.Collapse>
            </Grid>
            </Navbar>
        )
    }
}

export default Header;
