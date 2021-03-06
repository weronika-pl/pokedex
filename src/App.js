import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, Router } from 'react-router-dom'
import HomePage from './components/HomePage';
import PokemonList from './components/PokemonList';
import Pokemon from './components/Pokemon';

export default class App extends React.Component{
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/' component={HomePage} exact />
          <Route path='/main' component={PokemonList} />
          <Route path='/pokemon/:id/:type' component={Pokemon} />
        </Switch>
      </div>
    );
  }
}
