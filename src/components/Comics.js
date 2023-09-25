import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/no-img.jpeg';
import Error from './Error';
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	makeStyles,
	CardHeader,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
	card: {
		maxWidth: '75vw',
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: '40px',
		borderRadius: 5,
		border: '1px solid #e23636',
		boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
	},
	cardContent: {
		textAlign: 'left',
	},
	title: {
		marginTop: '3px',
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row',
	},
	media: {
		height: '100%',
		width: '100%',
		objectFit: 'cover',
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12,
	},
});

const Comics = () => {
	const classes = useStyles();
	const [comicData, setComicData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [apidata, setApiData] = useState(false)

  const {id} = useParams()
	const getData = () => {
		let characterId = id//props.match.params.id;

		const md5 = require('blueimp-md5');
		const publickey = '014c256b3600e6187838d7c30d15040a';
		const privatekey = 'bc3b02ca5b5a02776d78a84481a5d9bcd6679ba9';
		const ts = new Date().getTime();
		const stringToHash = ts + privatekey + publickey;
		const hash = md5(stringToHash);
		const baseUrl = 'https://gateway.marvel.com/v1/public/comics/';
		let url = '';
		url =
			baseUrl +
			characterId +
			'?ts=' +
			ts +
			'&apikey=' +
			publickey +
			'&hash=' +
			hash;

		return url;
	};

	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			let characterId = id//props.match.params.id;

			if (parseInt(characterId) < 0 || characterId.match(/^[0-9]+$/) == null) {
				setComicData([]);
				setLoading(false);
			} else {
				try {
					setLoading(true);
					const getUrl = getData();
					const { data } = await axios.get(getUrl);
					setComicData(data.data.results[0]);
					setLoading(false);
				} catch (e) {
					console.log(e);
					setApiData(true)
				}
			}
		}
		fetchData();
		// eslint-disable-next-line
	}, []);

	if (apidata) {
		return (
			<div>
				<Error></Error>
			</div>
	)} 
	if (loading) {
		return (
			<div>
				<CircularProgress />
			</div>
		);
	} else {
		let charImgUrl = '';
		charImgUrl =
			comicData.thumbnail.path +
			'/landscape_incredible.' +
			comicData.thumbnail.extension;

		return (
			<div>
				<Card className={classes.card} variant="outlined">
					<CardHeader
						className={classes.titleHead}
						title={comicData.title}
					/>
					<CardMedia
						className={classes.media}
						component="img"
						image={charImgUrl ? charImgUrl : noImage}
						title={comicData.title + ' image'}
					/>

					<CardContent className="textLeft">
						<Typography variant="body2" color="textSecondary" component="span">
							<dl>
								<p>
									<dt className="title">Description: </dt>
									<dd>
										{comicData.description
											? comicData.description
											: 'No description available.'}
									</dd>
								</p>
								<p>
									<dt className="title">Page Count: </dt>
									<dd>
										{comicData.pageCount
											? comicData.pageCount
											: 'Page Count not available.'}
									</dd>
								</p>
                                <p>
									<dt className="title">Series: </dt>
									<dd>{comicData.series.name}</dd>
								</p>
								<p>
									<dt className="title">Variants: </dt>
									<dd>
										{comicData.variants.length >0
											? comicData.variants.length
											: 'No variants available.'}
									</dd>
									<ol>
										{comicData.variants.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
								<p>
									<dt className="title">Creators: </dt>
									<dd>
										{comicData.creators.available > 0
											? comicData.creators.available
											: 'No creators available.'}
									</dd>
									<ol>
										{comicData.creators.items.map((item, index) => (
											<li key={index}>
												{item.name} - ({item.role})
											</li>
										))}
									</ol>
								</p>
                                <p>
									<dt className="title">Characters: </dt>
									<dd>
										{comicData.characters.available > 0
											? comicData.characters.available
											: 'No characters available.'}
									</dd>
									<ol>
										{comicData.characters.items.map((item, index) => (
											<li key={index}>{item.name}</li>
										))}
									</ol>
								</p>
							</dl>
							<div className="alignCenter">
								<Link to="/comics/page/0" className="backBtn">
									Comics list
								</Link>
							</div>
						</Typography>
					</CardContent>
				</Card>
			</div>
		);
	}
};

export default Comics;