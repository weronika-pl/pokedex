import React from 'react';
import Logo from './logo.png';
import { Link } from 'react-router-dom'

export default class Navbar extends React.Component{
  render() {
    return (
        <nav className='navbar navbar-light bg-light justify-content-between'>
          <Link to='/main'><a className='navbar-brand'>
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
            Pokédex
          </a>
          </Link>
          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" disabled={!this.props.isLoaded} onChange={this.props.filtering}/>
          </form>
        </nav>
    );
  }
}