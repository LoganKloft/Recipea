import {React, useState, useEffect} from 'react';
import Header from '../../components/Header/Header'
import CardContainer from '../../components/CardContainer/CardContainer';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import './Search.scss';
import useRefresh from '../../hooks/refreshHook'

const Filters = [
    {
      value: 'userid',
      label: 'User',
    },
    {
      value: 'title',
      label: 'Title',
    },
    {
      value: 'ingredients',
      label: 'Ingredients',
    },
    {
      value: 'tags',
      label: 'Tags',
    },
];

function Search() {
    const [refresh, forceRefresh] = useRefresh()
    const [searchField, setSearchField] = useState('');
    const [input, setInput] = useState('');
    const [recipes, setRecipes] = useState([])

    const fetchRecipeData = () => {
        fetch("http://localhost:3001/api/recipes")
        .then(response => {
            return response.json()
        })
        .then(data => {
            setRecipes(data)
        })
    }

    const [profiles, setProfiles] = useState([])

    const fetchProfileData = () => {
        fetch("http://localhost:3001/api/profiles")
        .then(response => {
            return response.json()
        })
        .then(data => {
            setProfiles(data)
        })
    }

    useEffect(() => {
        fetchRecipeData();
        fetchProfileData();
    }, [refresh])

    const [filteredList, setFilteredList] = useState([]);
    const [renderList, setRenderList] = useState([]);

    function handleSearchFieldChange(e) {
        setSearchField(e.target.value);
        let nextId = 0;
        let tempRecipes = [];
        let broke = false;  
        for (let recipe of recipes)
        {
            const recipeIngredients = recipe['ingredients'].split(":");
            var found = false;
            console.log(e.target.value);
            for(var i = 0; i < tempRecipes.length; i++) {
                console.log(e.target.value);
                if (e.target.value === 'userid')
                {
                    console.log("Here1");
                    for (let profile of profiles)
                    {
                        if (profile[e.target.value] === recipe[e.target.value])
                        {
                            if (tempRecipes[i].Name === profile.username) {
                                found = true;
                                broke = true;
                                break;
                            }
                        }
                    }
                    if (broke)
                        break;
                }
                else if (e.target.value === 'ingredients' || e.target.value === 'tags')
                {
                    console.log("Here");
                    for(var i = 0; i < recipeIngredients.length; i++) {
                        if (!(tempRecipes[i].Name === recipeIngredients[i])) {
                            tempRecipes = [...tempRecipes, { Id: nextId++, Name: recipeIngredients[i] }];
                        }
                    }
                    console.log(tempRecipes)
                }
                else
                {
                    if (tempRecipes[i].Name === recipe[e.target.value]) {
                        found = true;
                        break;
                    }
                }
            }
            if (found === false)
            {
                if (e.target.value === 'userid')
                {
                    outer:for (let profile of profiles)
                    {
                        for(var i = 0; i < tempRecipes.length; i++) {
                            if (tempRecipes[i].Name === profile.username)
                                continue outer;
                        }

                        if (profile[e.target.value] === recipe[e.target.value])
                        {
                            tempRecipes = [...tempRecipes, { Id: nextId++, Name: profile.username }];
                        }
                    }
                }
                else if (e.target.value === 'ingredients' || e.target.value === 'tags')
                {

                }
                else
                {
                    tempRecipes = [...tempRecipes, { Id: nextId++, Name: recipe[e.target.value] }];
                }
            }
        }
        setFilteredList(tempRecipes);
    }

    function handleButtonClick() {
        let tempRecipes = [];
        let broke = false;
        for (let recipe of recipes)
        {
            var found = false;
            for(var i = 0; i < tempRecipes.length; i++) {
                if (searchField === 'userid')
                {
                    for (let profile of profiles)
                    {
                        if (profile[searchField] === recipe[searchField])
                        {
                            if (tempRecipes[i][input] === recipe[searchField]) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (broke)
                        break;
                }
                else
                {
                    if (tempRecipes[i][input] === recipe[searchField]) {
                        found = true;
                        break;
                    }
                }
                
                if (tempRecipes[i][input] === recipe[searchField]) {
                    found = true;
                    break;
                }
            }
            if (searchField === 'userid')
            {
                for (let profile of profiles)
                    {
                        if (profile.username === input.Name)
                        {
                            if (found === false && recipe[searchField] === profile[searchField])
                            {
                                tempRecipes = [...tempRecipes, recipe];
                            }
                        }
                    }
            }
            else
            {
                if (found === false && recipe[searchField] === input.Name)
                {
                    tempRecipes = [...tempRecipes, recipe];
                }
            }
        }
        
        setRenderList(tempRecipes)
    }
  
    return (
      <div className="Search">
        <Header/>
        <div style = {{display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px', flexWrap: 'wrap', gap: '40px'}}>
            <TextField
                id="outlined-select-filterType"
                select
                label="Search By"
                defaultValue={'User Id'}
                helperText="Please select your Search By Filter"
                onChange={handleSearchFieldChange}
            >
            {Filters.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
            </TextField>
            <Autocomplete 
                id="autocompleteFilter"
                onChange={(e,v) => setInput(v)}
                getOptionLabel={(filteredList) =>
                    filteredList.Name
                }
                options={filteredList}
                sx={{width: 300}}
                isOptionEqualToValue={(option, value) =>
                    option[searchField] === value[searchField]
                }
                noOptionsText = "Nothing available to search for..."
                renderOption={(props, filteredList) => (
                    <Box component="li" {...props} key={filteredList.Id}>
                        {filteredList.Name}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField {...params} label="Search For" helperText={`Please select your ${searchField}`} onChange={({ target }) => setInput(target.value[searchField])}/>
                )}
            />
            <Button
                variant="outlined" 
                size="medium"
                onClick={() => {
                    handleButtonClick();
                }}
            >
                Search
            </Button>
        </div>
        
        <CardContainer forceRefresh={forceRefresh} recipes={renderList} />
      </div>
    )
}

export default Search;