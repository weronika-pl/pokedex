import React from 'react';

export default class Pagination extends React.Component{
    state={
        pageNumbers: [],
    }

    componentDidMount(){
        let pageNumbers = [];
        for (let i=1; i <= Math.ceil(this.props.totalPokemon / this.props.idPerPage); i++ ){
            pageNumbers.push(i); 
        }
        this.setState({pageNumbers})
    }

    render(){
        return(
            <nav aria-label="Page navigation pages">
                <ul className="pagination justify-content-center">
                    {this.state.pageNumbers.map(number => {
                        return(
                        <li key={number} className="page-item">
                            <button onClick={() => this.props.paginate(number)} className="page-link">{number}</button>
                        </li>)
                    })}    
                </ul>
            </nav>
        )
    }
}