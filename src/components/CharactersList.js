import React, { useState, useEffect } from "react";
import axios from "axios";
import noImage from '../img/no-img.jpeg';
import Error from '../components/Error'
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	makeStyles,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useParams } from "react-router-dom";

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '5px',
		borderRadius: 5,
		border: '1px solid #e23636',
		boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
	},
	titleHead: {
		fontWeight: 'bold',
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row',
	},
	media: {
		height: '100%',
		width: '100%',
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12,
	},
	pagination: {
		display: 'flex',
		justifyContent: 'left',
		margin: '10px 20px 20px 20px',
	},
});

const CharactersList = () => {
    const classes = useStyles();
    const [charactersList, setCharactersList] = useState([])
    const [loading, setLoading] = useState(true)
    const [resData, setResData] = useState(undefined)
    let card = null
	const {page} = useParams()

    useEffect(() =>{
        console.log("on load useeffect");
		console.log(page)

        async function fetchData(){
            let pageNum = page //props.match.params.page;

            if (parseInt(pageNum) < 0 || pageNum.match(/^[0-9]+$/) == null) {
				setCharactersList([]);
				setLoading(false);
			} else{
                try{
                    setLoading(true)
                    const getUrl = getData()
                    const { data } = await axios.get(getUrl)
                    setCharactersList(data.data.results)
					console.log(charactersList)

                    setResData(data.data)
					console.log(resData)
                    setLoading(false)
                } catch(e) {
                    console.log(e);
                }
            }
        }
        fetchData()

		// eslint-disable-next-line
    }, [page]);

    const getData = () =>{
        const md5 = require('blueimp-md5');
		const publickey = '014c256b3600e6187838d7c30d15040a';
        const privatekey = 'bc3b02ca5b5a02776d78a84481a5d9bcd6679ba9';
        const ts = new Date().getTime();
        const stringToHash = ts + privatekey + publickey;
        const hash = md5(stringToHash);
        const baseUrl = 'https://gateway.marvel.com/v1/public/characters';
		let url = '';
		let pageNum = page//props.match.params.page;
		let offset = parseInt(pageNum) * 20;

        if(pageNum === '0'){
            url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
        }
        else{
            url =
				baseUrl +'?limit=20&offset=' +offset +'&ts=' +ts +'&apikey=' +publickey +'&hash=' +hash;
        }
        return url;
    };

	const pagination = () =>{
		let pageNumber = page//props.match.params.page
		let lastPage1 = parseInt(resData.total)/20
		let lastPage = Math.floor(lastPage1)
		if(lastPage1 - lastPage <=0){
			lastPage = lastPage-1
		}

		if(pageNumber === '0'){
			return(
				<div className={classes.pagination}>
					<Link
					 	to={`/characters/page/${parseInt(page) + 1}`} 
						className="pageBtns nextBtn">
						Next
					</Link>
				</div>
			)
		} else if(parseInt(pageNumber) === lastPage){
			return(
				<div className={classes.pagination}>
					<Link
					 	to={`/characters/page/${parseInt(page) - 1}`} 
						className="pageBtns nextBtn">
						Previous
					</Link>
				</div>
			)
		}
		else{
			return(
				<div className={classes.pagination}>
					<Link
						to={`/characters/page/${parseInt(page) - 1}`} 
						className="pageBtns nextBtn">
						Previous
					</Link>
					<Link
						to={`/characters/page/${parseInt(page) + 1}`} 
						className="pageBtns nextBtn">
						Next
					</Link>
				</div>
			)
		}
	}

	const buildCard = (character) => {
		let charImgUrl = '';

		if (character.thumbnail.path && character.thumbnail.extension) {
			charImgUrl =
				character.thumbnail.path +
				'/standard_xlarge.' +
				character.thumbnail.extension;
		}

		return (
			<Grid item xs={12} sm={10} md={4} lg={3} xl={2} key={character.id}>
				<Card className={classes.card} variant="outlined">
					<CardActionArea>
						<Link to={`/characters/${character.id}`}>
							<CardMedia
								className={classes.media}
								component="img"
								image={charImgUrl ? charImgUrl : noImage}
								title={character.name + ' image'}
							/>

							<CardContent>
								<Typography
									className={classes.titleHead}
									gutterBottom
									variant="h6"
									component="h2"
								>
									{character.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	}
	if (charactersList) {
		card =
			charactersList &&
			charactersList.map((character) => {
				return buildCard(character);
			});
	}
	if (loading) {
		return (
			<div>
				<CircularProgress />
				<h1>Characters are loading...</h1>
			</div>
		);	
	}else if (charactersList.length === 0) {
		return (
			<div>
				<Error></Error>
			</div>
		)}
	 else {
		return (
			<div>
				{pagination()}
				<Grid container className={classes.grid} spacing={3}>
					{card}
				</Grid>
			</div>
		);
	}
  
}

export default CharactersList