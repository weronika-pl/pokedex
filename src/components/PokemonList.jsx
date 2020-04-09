import React from 'react';
import PokemonCard from './PokemonCard'
import Navbar from './Navbar';
import axios from 'axios';
import Pokeball from './pokeball.gif'
import Pagination from './Pagination';
import Filters from './Filters';
import { types } from '../Data'

export default class PokemonList extends React.Component{
    state = {
        url: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=807"',
        pokemonList: null,
        currentPage: 1,
        idPerPage: 30,
        currentListOfPokemon: null,
        filterByTypes: [],
        filterByName: [],
        types: types,
        names: null
    }

    paginate = pageNumber => {
        let currentPage = pageNumber;
        const idOfLastPokemon = currentPage * this.state.idPerPage;
        const idOfFirstPokemon = idOfLastPokemon - this.state.idPerPage;
        const currentListOfPokemon = this.state.pokemonList.slice(idOfFirstPokemon, idOfLastPokemon);
        this.setState({currentPage, currentListOfPokemon})
    }

    filtering = e =>{
        let filter = e.target.value.toLowerCase();
        console.log(filter)
        let types = this.state.types;
        let names = this.state.names;
        let filterByTypes = this.state.filterByTypes;
        let filterByName = this.state.filterByName;
        if (Object.keys(types).some(type => type === filter)){
            types[filter] = !types[filter];
            if (types[filter]){
                filterByTypes.push(filter)
            } else {
                filterByTypes = filterByTypes.filter(type => type !== filter) 
            }
        } else {
            if (filter){
                filterByName = names.filter(name => name.includes(filter));
            } else {
                filterByName = [];
            }
        }
        console.log(filterByName)
        console.log(filterByName.length, filterByTypes.length)
        if (filterByTypes.length && filterByName.length){
            const filteredPokemonByType = this.state.pokemonList.filter(pokemon => 
                filterByTypes.some(filteredType => pokemon.types.includes(filteredType)));
            console.log(filteredPokemonByType)
            const filteredByAll = filteredPokemonByType.filter(pokemon =>
                filterByName.some(filteredName => filteredName === pokemon.name));
            console.log(filteredByAll)
            return this.setState({filterByTypes, filterByName, currentListOfPokemon: filteredByAll})
        } else if (!filterByTypes.length && !filterByName.length){
            let currentPage = this.state.currentPage;
            const idOfLastPokemon = currentPage * this.state.idPerPage;
            const idOfFirstPokemon = idOfLastPokemon - this.state.idPerPage;
            const currentListOfPokemon = this.state.pokemonList.slice(idOfFirstPokemon, idOfLastPokemon);
            return this.setState({filterByTypes, filterByName, currentListOfPokemon})
        } else {
            const activeFilters = filterByTypes.length ? filterByTypes : filterByName;
            const filteredListByOneFilter = this.state.pokemonList.filter(pokemon => 
                activeFilters.some(activeFilter => 
                    filterByTypes.length ? pokemon.types.includes(activeFilter) : activeFilter === pokemon.name));
            return this.setState({filterByTypes, filterByName, currentListOfPokemon: filteredListByOneFilter})
        }
    }

    async componentDidMount(){
        const respond = await axios.get(this.state.url)
        let pokemonList = respond.data['results']
        for (let pokemon of pokemonList){
            pokemon.id = pokemon.url.split('/')[pokemon.url.split('/').length - 2];
            pokemon.infoUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`;
            const pokemonRespond = await axios.get(pokemon.infoUrl);
            pokemon.types = pokemonRespond.data.types.map(type => type.type.name);
            pokemon.mainType = pokemonRespond.data.types.find(type => type.slot === 1).type.name
        }
        const names = pokemonList.map(pokemon => pokemon.name);
        const idOfLastPokemon = this.state.currentPage * this.state.idPerPage;
        const idOfFirstPokemon = idOfLastPokemon - this.state.idPerPage;
        const currentListOfPokemon = pokemonList.slice(idOfFirstPokemon, idOfLastPokemon);
        this.timerId = setTimeout(()=> this.setState({pokemonList, currentListOfPokemon, names}), 3000)
    }

    componentWillUnmount(){
        clearTimeout(this.timerId)
    }

    render(){
        return(
            <React.Fragment>
            <Navbar filtering={this.filtering} />
            <Filters types={this.state.types} filtering={this.filtering} />
            <div className="card-deck">
                {this.state.currentListOfPokemon 
                    ? this.state.currentListOfPokemon.map(pokemon => 
                            <PokemonCard
                                key={pokemon.name}
                                id={pokemon.id}
                                name={pokemon.name}
                                url={pokemon.url}
                                types={pokemon.types}
                                mainType={pokemon.mainType}
                            />
                        )
                    : <div className='pokeball'>
                        <img className='loading' src={Pokeball} alt=''/>
                    </div>
                }
            </div>
            {this.state.pokemonList
            ? <Pagination idPerPage={this.state.idPerPage} totalPokemon={this.state.pokemonList.length} paginate={this.paginate} />
            : <div></div>}
            </React.Fragment>
        )
    }
}