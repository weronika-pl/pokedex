import React from 'react';
import PokemonCard from './PokemonCard'
import Navbar from './Navbar';
import axios from 'axios';
import Pokeball from './pokeball.gif'
import Filters from './Filters';
import { types } from '../Data';
import ReactPaginate from 'react-paginate'

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
        names: null,
        initialyLoaded: false,
        fullLoaded: false,
        allPokemon: null,
        filteredList: null,
    }

    paginate = e => {
        let currentPage = e.selected+1;
        const idOfLastPokemon = currentPage * this.state.idPerPage;
        const idOfFirstPokemon = idOfLastPokemon - this.state.idPerPage;
        const currentListOfPokemon = (this.state.filteredList ? this.state.filteredList : this.state.allPokemon).slice(idOfFirstPokemon, idOfLastPokemon);
        this.setState({currentPage, currentListOfPokemon})
    }

    addingTypeFilters = e => {
        const filter = e.target.value;
        const types = this.state.types;
        let currentFiltersByTypes = this.state.filterByTypes;
        
        if (Object.keys(types).some(type => type === filter)){
            types[filter] = !types[filter];
            if (types[filter]){
                currentFiltersByTypes.push(filter);
            } else {
                currentFiltersByTypes = currentFiltersByTypes.filter(type => type !== filter);
            }
        }

        return currentFiltersByTypes;
    }

    addingNameFilters = e => {
        const filter = e.target.value.toLowerCase();
        const types = this.state.types;
        const names = this.state.names;
        let currentFiltersByName = this.state.filterByName;

        if (Object.keys(types).some(type => type === filter)){
            return currentFiltersByName
        } else if (filter) {
            currentFiltersByName = names.filter(name => name.includes(filter))
        } else {
            currentFiltersByName = [];
        }

        return currentFiltersByName
    }

    filterByType = (pokemonList, resultFilters) => {
        const filteredPokemonByType = pokemonList.filter(pokemon => 
            resultFilters.some(filteredType => pokemon.types.includes(filteredType)));
        return filteredPokemonByType
    }

    filterByName = (pokemonList, resultFilters) => {
        const filteredPokemonsByName = pokemonList.filter(pokemon =>
            resultFilters.some(filteredName => filteredName === pokemon.name));
        return filteredPokemonsByName
    }

    filtering = e =>{
        const resultTypeFilters = this.addingTypeFilters(e);
        const resultNameFilters = this.addingNameFilters(e);
        const allPokemonList = this.state.allPokemon;

        const filteredPokemonsByTypes = resultTypeFilters.length 
        ? this.filterByType(allPokemonList, resultTypeFilters) 
        : allPokemonList;

        const filteredPokemonsByName = resultNameFilters.length 
        ? this.filterByName(filteredPokemonsByTypes, resultNameFilters)
        : filteredPokemonsByTypes

        const firstPagePokemon = filteredPokemonsByName.slice(0, this.state.idPerPage)

        this.setState({ 
            filteredList: filteredPokemonsByName, 
            currentListOfPokemon: firstPagePokemon,
            filterByTypes: resultTypeFilters,
            filterByName: resultNameFilters,
            currentPage: 1
        })
    }

    async componentDidMount(){
        const respond = await axios.get(this.state.url);
        let pokemonList = respond.data['results'];
        pokemonList.forEach(function(pokemon){
            pokemon.id = pokemon.url.split('/')[pokemon.url.split('/').length - 2];
        })

        const names = pokemonList.map(pokemon => pokemon.name);
        const idOfLastPokemon = this.state.currentPage * this.state.idPerPage;
        const idOfFirstPokemon = idOfLastPokemon - this.state.idPerPage;
        const firstPagePokemon = pokemonList.slice(0, this.state.idPerPage);
        
        const detailsOfFirstPage = await Promise.all(firstPagePokemon.map(pokemon => {
            return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        }))

        firstPagePokemon.forEach(function(pokemon){
            pokemon.types = detailsOfFirstPage[pokemon.id-1].data.types.map(type => type.type.name)
            pokemon.mainType = detailsOfFirstPage[pokemon.id-1].data.types.find(type => type.slot === 1).type.name
        })

        this.setState({ initialyLoaded: true, currentListOfPokemon: firstPagePokemon })

        const remainingPokemon = pokemonList.slice(this.state.idPerPage);
        const detailedRemainings = await Promise.all(remainingPokemon.map(pokemon => {
            return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
        }))

        remainingPokemon.forEach(function(pokemon){
            pokemon.types = detailedRemainings[pokemon.id-31].data.types.map(type => type.type.name)
            pokemon.mainType = detailedRemainings[pokemon.id-31].data.types.find(type => type.slot === 1).type.name
        })

        const allPokemon = firstPagePokemon.concat(remainingPokemon)
        this.setState({ fullLoaded: true, allPokemon })

        const currentListOfPokemon = allPokemon.slice(idOfFirstPokemon, idOfLastPokemon);
        this.setState({pokemonList, currentListOfPokemon, names})
    }

    render(){
        return(
            <React.Fragment>
            <Navbar filtering={this.filtering} isLoaded={this.state.fullLoaded} />
            <Filters types={this.state.types} filtering={this.filtering} isLoaded={this.state.fullLoaded} />
            <div className="card-deck">
                {this.state.initialyLoaded 
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
            {this.state.fullLoaded
            ? <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={(this.state.filteredList ? this.state.filteredList.length : this.state.allPokemon.length)/this.state.idPerPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={this.paginate}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                forcePage={this.state.currentPage-1}/>
            : <div></div>}
            </React.Fragment>
        )
    }
}