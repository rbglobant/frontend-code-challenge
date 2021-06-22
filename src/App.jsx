import React, { useEffect, useState } from 'react';
import './App.css';

const URL_PATH = "https://gist.githubusercontent.com/bar0191/fae6084225b608f25e98b733864a102b/raw/dea83ea9cf4a8a6022bfc89a8ae8df5ab05b6dcc/pokemon.json";

export default function App(){
    const [pokemons, setPokemons] = useState([]);
    const [results, setResults] = useState([]);
    const [currentSearch, setCurrentSearch] = useState(null);
    const [orderByMaxCp, setOrderByMaxCP] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        pullData();
    }, [])

    useEffect(() => {
        filterItems();
    }, [currentSearch, orderByMaxCp])

    const pullData = () => {
        fetch(URL_PATH)
        .then(res => res.json())
        .then(response => {
            setPokemons(response);
            setIsLoading(false);
        })
    }
    
    const getHighlightedText = pokemon => {
        const parts = pokemon.split(new RegExp(`(${currentSearch})`, 'gi'));
        return <span> { parts.map((part, index) => 
            <span key={index} style={part.toLowerCase() === currentSearch.toLowerCase() ? { 'backgroundColor': '#845d0d' } : {} }>
                { part }
            </span>)
        } </span>;
    }

    const toggleMaxCP = () => {
        setOrderByMaxCP(!orderByMaxCp);
    }

    const handleKeyPress = e => {
        setCurrentSearch(e.target.value);
    }

    const filterItems = () => {
        if (!currentSearch) {
            setResults([]);
            return
        }
        const namedSearch = 
            pokemons
            .filter(pokemon => pokemon.Name.toLowerCase().indexOf(currentSearch.toLowerCase()) > -1)
        
        const typeSearch = 
            pokemons
            .filter(pokemon => pokemon.Types.includes(currentSearch))
        const result = namedSearch.concat(typeSearch);

        if (orderByMaxCp) {
            result.sort((a, b) => {
                var cpA = a.MaxCP;
                var cpB = b.MaxCP;
                if (cpA > cpB) {
                  return -1;
                }
                if (cpA < cpB) {
                  return 1;
                }
                return 0;
              });
        }
        setResults(result.splice(0,4));
    }

    return ( 
        <React.Fragment>
            <label htmlFor="maxCP" className="max-cp">
                <input type="checkbox" id="maxCP" checked={orderByMaxCp} onChange={toggleMaxCP}/>
                <small>
                    Maximum Combat Points
                </small>
            </label>
            <input type="text" className="input"  placeholder="Pokemon or type" onChange={handleKeyPress} />
            {isLoading && <div className="loader"></div>}
            <ul className="suggestions">
                {results && results.map(pokemon => {
                    return (
                        <li key={pokemon.Number}>
                            <img src={pokemon.img} alt="" />
                            <div className="info">
                                <h1><span className="hl">{getHighlightedText(pokemon.Name)}</span></h1>
                                {pokemon.Types.map(type => {
                                    return(
                                        <span className={`type ${type.toLowerCase()}`}>{type}</span>
                                    )
                                })}
                            </div>
                        </li>
                    )
                })}
                {!results.length && !isLoading && 
                    <li>
                        <img src="https://cyndiquil721.files.wordpress.com/2014/02/missingno.png" alt="" />
                        <div className="info">
                            <h1 className="no-results">
                                No results
                            </h1>
                        </div>
                    </li> 
                }
            </ul>
        </React.Fragment> 
    );
}
