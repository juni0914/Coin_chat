import React, { useEffect, useState } from 'react';
import {IoMdRefresh} from 'react-icons/io'
import { ImCoinDollar } from 'react-icons/im';
import CoinTable from './CoinTable.tsx';



export interface CoinsType {
	id: string
	rank: number
	name: string
	symbol: string
	quotes: { 
		KRW: { 
			price: number
			market_cap: number
			volume_24h: number
			percent_change_24h: number
			percent_change_7d: number
		}
	},
}




function MainApp(): JSX.Element {
	const [loading, setLoading] = useState(true);
	const [coins, setCoins] = useState([]);

	const refreshPage = ()=>{
		window.location.reload();
	}
	
	useEffect(() => {
		fetch("https://api.coinpaprika.com/v1/tickers?quotes=KRW")
		.then(response => response.json())
		.then(json => {
			setCoins(json.slice(0, 100));
			setLoading(false);
		})
		.catch((error) => {
			console.log(error);
			// 에러 넘버를 확인
			console.log(error.response.status);
		})
	}, [])

	return (
		<div className="App" style={{
			width: '100%',
			height: '880px',
			border: '.2rem solid #ececec',
			borderRadius: '20px',
			padding: '1rem',
			marginTop: '2rem',
			marginBottom: '1rem',
			overflowY: 'auto'
		}}>
			<section className="coin-tracker">
				<div className="title flex-grid flex-grid--center">
					<h1><ImCoinDollar style={{marginBottom: "10px", marginRight: "15px"}}/>암호화폐 실시간 TOP 100
						<button onClick={ refreshPage } style={{
							border: 'none',
							backgroundColor: 'transparent',
							marginLeft: '15px',
							cursor:'pointer'
						}}>🔄</button></h1>
					<div className="btn">
						
					</div>
				</div>
				<div className="result">
				{
					loading
					? <span className="loader">Loading...</span> 
					: (
						<CoinTable coins={ coins }/>
					)
				}
				</div>
			</section>
		</div>
	);
}

export default MainApp