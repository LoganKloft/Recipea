import {React, useState, useEffect} from 'react';
import Helmet from 'react-helmet'
import Header from '../../components/Header/Header'
import Card from '../../components/Card/Card'
import './Home.scss';

function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function getCards() {
      let response = await fetch('http://localhost:3001/api/recipes', {
        method: 'GET',
        credentials: 'include'
      })
      const recipes = await response.json()

      const cards = []
      for (let recipe of recipes) {
        response = await fetch(`http://localhost:3001/api/profiles/${recipe.userid}`, {
          method: 'GET',
          credentials: 'include'
          })
        const user = await response.json()
        cards.push(<Card recipe={recipe} user={user} />)
      }

      setCards(cards)
    }
    getCards()
  }, [])

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Recipea</title>
        <meta name="description" content="Recipea Web Application" />
      </Helmet>
      <Header/>
      <div className="flex">
        {cards}
      </div>
    </div>
  )
}

export default Home;