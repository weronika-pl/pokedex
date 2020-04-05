import React from 'react';
import Logo from './logo.png';

export default class Navbar extends React.Component{
  render() {
    return (
        <nav className='navbar navbar-light bg-light justify-content-between'>
          <a className='navbar-brand'>
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
            Pokédex
          </a>
          <form className="form-inline">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </nav>
    );
  }
}