import React, { useEffect, useState } from 'react';
import './App.css';

const URL_PATH = "https://raw.githubusercontent.com/joseluisq/pokemons/master/pokemons.json";

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
            setPokemons(response.results);
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

    const deleteItem = id => {
        let updatedPokemons = pokemons;
        let index = updatedPokemons.findIndex((pokemon) => {
            return pokemon.national_number == id;
        })
        updatedPokemons.splice(index, 1);
        setPokemons(updatedPokemons);
        filterItems(); 
    }

    const filterItems = () => {
        if (!currentSearch) {
            setResults([]);
            return
        }
        const namedSearch = 
            pokemons
            .filter(pokemon => pokemon.name.toLowerCase().indexOf(currentSearch.toLowerCase()) > -1)
        
        const typeSearch = 
            pokemons
            .filter(pokemon => pokemon.type.includes(currentSearch))
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
                {results && results.map((pokemon, index) => {
                    return (
                        <li key={index}>
                            <div data-national_number={pokemon.national_number} onClick={() => {deleteItem(pokemon.national_number)}}>X</div>
                            <img src={pokemon.sprites.normal} alt="" />
                            <div className="info">
                                <h1><span className="hl">{getHighlightedText(pokemon.name)}</span></h1>
                                {pokemon.type.map((type, index ) => {
                                    return(
                                        <span key={index} className={`type ${type.toLowerCase()}`}>{type}</span>
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
