// import React from 'react';

// export default class Pagination extends React.Component{
//     state={
//         pageNumbers: [],
//     }

//     // componentDidMount(){
//     //     // let pageNumbers = [];
//     //     const pageNumber = [...Array(totalPokemnos).keys()];
//     //     // => [0, 1, 2, 3, 4]

//     //     this.setState({pageNumbers})
//     // }
//     // next() {
//     //     this.paginate(this.currentpage + 1)
//     // }

//     // previous() {
//     //     this.paginate(this.currentpage - 1)
//     // }

//     render(){
//         return(
//             <nav aria-label="Page navigation pages">
//                 <ul className="pagination justify-content-center">
//                     {this.state.pageNumbers.map(number => {
//                         return(
//                         <li key={number} className="page-item">
//                             <button onClick={() => this.props.paginate(number)} className="page-link">{number}</button>
//                         </li>)
//                     })}    
//                 </ul>
//             </nav>
//         )
//     }
// }