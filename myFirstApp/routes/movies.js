
//TP realise avec OSCAR MARZE TD2B

var express = require('express');
var router = express.Router();

var _ = require('lodash');
var axios = require('axios');

const API_KEY = '34831a91';
const API_URL = 'http://www.omdbapi.com/';


let movies = [{
	id: "0",
	movie: "Harry Potter",
	yearOfRelease: 2001,
	duration: 120 , // en minutes,
	actors: ["Daniel Radcliffe", "Emma Watson", "Ruper Grint"],
	poster: "https://images-na.ssl-images-amazon.com/images/I/71dtmwLA3ML._AC_SL1191_.jpg", // lien image d'affiche,
	boxOffice: 930000000, // en USD$,
	rottenTomatoesScore: 10
},

{
	id: "1",
	movie: "Titanic",
	yearOfRelease: 1997,
	duration: 194 , // en minutes,
	actors: ["Leonardo DiCaprio", "Kate Winslet"],
	poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg?fbclid=IwAR17nGJyhXbmcsxyaPIWmvMEhVfwt5TZmpQ0ofkpPjPVAWRjBmhEp-RpiHM", // lien vers une image d'affiche,
	boxOffice: 123456789, // en USD$,
	rottenTomatoesScore: 79
},

{
	id: "2",
	movie: "Star Wars:Episode IV - A New Hope",
	yearOfRelease: 1997,
	duration: 121, // en minutes,
	actors: ["Mark Hamill, Harrison Ford, Carrie Fisher, Peter Cushing"],
	poster: "https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", // lien vers une image d'affiche,
	boxOffice: 156248616, // en USD$,
	rottenTomatoesScore: 90
},

];

/*GET movies listing. */
router.get('/', (req, res) => {
	//GEt List of movie and return JSON
  res.status(200).json({movies});
});

/*GET one movie.*/
router.get('/:id', (req, res) => {
	// Get id in params
	const { id } = req.params;
	// Find movie in DB
	const movie = _.find(movies, ["id", id]);
	// Return user
	res.status(200).json({
		message: "Movie found !",
		movie
	});
}); 

/* PUT new movie */
/*router.put('/', (req, res) => 
{
	//Get the data from request
	const { movie } = req.body;
	//Create new unique id
	const id = _.uniqueId();
	//Insert it in array
	movies.push({ movie, id });
	//return message
	res.json({
		message: Just added ${id},
		//movie: { movie, id }
	});
});*/


// PUT avec librairie axios
router.put('/', async(req, res) => {
	const {movie} = req.body;
	
	await axios.get(API_URL, {
		params:{
			t:movie,
			apikey:API_KEY,
		}
		
		})
		.then((response) => {

			const data = response.data;
			let info = {
				id: movies.length,
				movie: data.Title,
				yearOfRelease: data.Year,
				duration: data.Runtime,
				actors: data.Actors.split(","),
				poster: data.Poster,
				boxOffice: data.BoxOffice,
				rottenTomatoesScore: parseInt(data.Ratings[1].Value),
			}

			movies.push(info);
			res.send(movies)
		})
		.catch(function (error){
			res.send("Film introuvable !");
		});
});

		 

/* UPDATE movie. */
router.post('/:id', (req, res) => {
	// Get the :id of the movie we want to update from the params of the request
	const { id } = req.params; 

	// Get the new data of the movie we want to update from the body of the request
	const { movie } = req.body;

	//Find in DB
	const movieToUpdate = _.find(movies, ["id", id]);
	//Update data with new data (js is by adress)
	movieToUpdate.movie = movie;


	//return message
	res.json({
		message: "Just updated ${id} with ${movie}"
	});
});

/* DELETE movie. */
router.delete('/:id', (req, res) => {
	//get the id of the movie we want to delete from the params of the request
	const { id } = req.params;

	//Remove from "DB"
	_.remove(movies, ["id", id]);

	// Return message
	res.json({
		message: "just removed ${id}"
	});
});

module.exports = router;