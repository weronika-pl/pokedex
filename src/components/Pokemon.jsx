import React from 'react';
import Navbar from './Navbar';
import axios from 'axios';

export default class Pokemon extends React.Component{
  state = {
    id: null,
    mainType: '',
    name: '',
    types: [],
    moves: [],
    description: '',
    statTitleWidth: 3,
    statBarWidth: 6,
    stats: {
      hp: '',
      attack: '',
      defense: '',
      speed: '',
      specialAttack: '',
      specialDefense: ''
    },
    height: '',
    weight: '',
    eggGroups: '',
    catchRate: '',
    abilities: '',
    genderRatioMale: '',
    genderRatioFemale: '',
    evs: '',
    hatchSteps: '',
  }

    async componentDidMount(){
      const { params } = this.props.match
      const id = params.id
      const mainType = params.type
      const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${params.id}/`
      const pokemonInfoUrl = `https://pokeapi.co/api/v2/pokemon/${params.id}/`
      const pokemonRespond = await axios.get(pokemonInfoUrl)
      const name = pokemonRespond.data.name;
      let { hp, attack, defense, speed, specialAttack, specialDefense } = '';
      const moves = pokemonRespond.data.moves.map(move => {
        return move.move.name
        .toLowerCase()
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
        });
      pokemonRespond.data.stats.map(stat => {
      switch (stat.stat.name) {
          case 'hp':
          hp = stat['base_stat'];
          break;
          case 'attack':
          attack = stat['base_stat'];
          break;
          case 'defense':
          defense = stat['base_stat'];
          break;
          case 'speed':
          speed = stat['base_stat'];
          break;
          case 'special-attack':
          specialAttack = stat['base_stat'];
          break;
          case 'special-defense':
          specialDefense = stat['base_stat'];
          break;
          default:
          break;
        }
      });
      const total = hp+attack+defense+specialAttack+specialDefense+speed;
      const height = pokemonRespond.data.height / 10;
      const weight = pokemonRespond.data.weight / 10;
      const types = pokemonRespond.data.types.map(type => type.type.name);
      const abilities = pokemonRespond.data.abilities.map(ability => {
        return ability.ability.name
          .toLowerCase()
          .split('-')
          .map(s => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
      }).join(', ');

      const evs = pokemonRespond.data.stats
        .filter(stat => {
          if (stat.effort > 0) {
            return true;
          }
          return false;
        })
        .map(stat => {
          return `${stat.effort} ${stat.stat.name
            .toLowerCase()
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')}`;
        })
        .join(', ');

      await axios.get(pokemonSpeciesUrl).then(res => {
        let description = '';
        res.data.flavor_text_entries.some(flavor => {
          if (flavor.language.name === 'en') {
            description = flavor.flavor_text;
            return;
          }
        });
        const femaleRate = res.data['gender_rate'];
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 12.5 * (8 - femaleRate);
        const catchRate = Math.round((100 / 255) * res.data['capture_rate']);
        const eggGroups = res.data['egg_groups']
          .map(group => {
            return group.name
             .toLowerCase()
              .split(' ')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
          })
          .join(', ');
        const hatchSteps = 255 * (res.data['hatch_counter'] + 1);
        this.setState({
          description,
          genderRatioFemale,
          genderRatioMale,
          catchRate,
          eggGroups,
          hatchSteps,
        });
      });

    this.setState({
      id,
      mainType,
      name,
      types,
      stats: {
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
        total
      },
      height,
      weight,
      abilities,
      evs,
      moves
    });
  }  

    render(){
        return(
            <React.Fragment>
                <Navbar />
                <div className={`${this.state.mainType}`}>
                  <h3>{this.state.name.charAt(0).toUpperCase()+this.state.name.substring(1)}</h3>
                  <img
                      className="card-img-big" 
                      src={ `https://pokeres.bastionbot.org/images/pokemon/${this.state.id}.png` }
                      alt={this.state.name} 
                  />
                </div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" id="about-tab" data-toggle="tab" href="#about" role="tab" aria-controls="about" aria-selected="true">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="basic-stats-tab" data-toggle="tab" href="#basic-stats" role="tab" aria-controls="basic-stats" aria-selected="false">Base Stats</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="moves-tab" data-toggle="tab" href="#moves" role="tab" aria-controls="moves" aria-selected="false">Moves</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="about" role="tabpanel" aria-labelledby="about-tab">
                      <h4>Bio</h4>
                        <p>{this.state.description.replace(/\f/, ' ')}</p>
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th className='title' scope="row">Height</th>
                            <td className='data'>{this.state.height}m</td>
                          </tr>
                          <tr>
                            <th className='title' scope="row">Weight</th>
                            <td className='data'>{this.state.weight}m</td>
                          </tr>
                          <tr>
                            <th className='title' scope="row">Abilities</th>
                            <td className='data'>{this.state.abilities}</td>
                          </tr>
                        </tbody>
                      </table>
                      <h4>Breeding</h4>
                      <table class="table table-borderless">
                        <tbody>
                          <tr>
                            <th className='title' scope="row">Gender</th>
                            <td className='data'>
                              <i className="fas fa-mars"></i>{this.state.genderRatioMale}
                              <i className="fas fa-venus"></i>{this.state.genderRatioFemale}
                            </td>
                          </tr>
                          <tr>
                            <th className='title' scope="row">Egg groups</th>
                            <td className='data'>{this.state.eggGroups}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="tab-pane fade" id="basic-stats" role="tabpanel" aria-labelledby="basic-stats-tab">
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          HP
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.hp}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.hp}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Attack
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.attack}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.attack}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Defense
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.defense}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.defense}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Special Attack
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.specialAttack}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.specialAttack}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Special Defense
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.specialDefense}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.specialDefense}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Speed
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.speed}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.speed}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className={`col col-md-${this.state.statTitleWidth}`}>
                          Total
                        </div>
                        <div className={`col col-md-${this.state.statBarWidth}`}>
                          <div className="progress">
                            <div
                              className={`progress-bar ${this.state.mainType}`}
                              role="progressbar"
                              style={{
                                width: `${this.state.stats.total/6}%`
                              }}
                              aria-valuenow="25"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <small>{this.state.stats.total}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="moves" role="tabpanel" aria-labelledby="moves-tab">
                      <table class="table table-borderless ">
                            <thead>
                              <tr>
                                <th className='title' scope="col">#</th>
                                <th className='data' scope="col">Move</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.moves.map((move, index) => {
                                return(
                                <tr key={index}>
                                  <th className='title' scope="row">{index+1}</th>
                                  <td className='data'>{move}</td>
                                </tr>
                                )
                                })
                              }
                          </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}