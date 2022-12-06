import React from 'react';
import { Link } from 'react-router-dom';
import { CoinsType } from './MainApp';

const CoinTable = ({ coins }: { coins: CoinsType[] }) => {
	return (
		<div className="coin-table">
			<table className="table  table-hover table-striped table-borderless" >
				<thead>
					<tr style={{
						padding: '1rem',
						fontWeight: '700',
						fontSize: '18px',
						textAlign: 'center',
						marginRight: '15px',
						whiteSpace : 'nowrap',
						overflow : 'hidden',
						textOverflow : 'ellipsis'
					}}>
						<th className="headCol rankCol">순위</th>
						<th className="headCol nameCol">종목</th>
						<th>기호</th>
						<th>가격(KRW)</th>
						<th>ㅤㅤ총 시가</th>
						<th>ㅤ거래량(24H)</th>
						<th>ㅤ변동(24H)</th>
						<th>ㅤ변동(7D)</th>
					</tr>
				</thead>
				<tbody style={{textAlign: 'left'}}>
					{coins.map((coin: CoinsType) => (
						<tr key={coin.id}>
							<td className="headCol rankCol align-right" style={{textAlign: 'center'}}>{coin.rank}</td>
							<td className="headCol nameCol" >{coin.name}</td>
							<td style={{textAlign: 'center'}}>{coin.symbol}</td>
							<td className="align-right" style={{textAlign: 'left'}} >
								₩
								{Number(
									coin.quotes.KRW.price.toFixed(1)
								).toLocaleString()}
							</td>
							<td className="align-right" style={{textAlign: 'right'}}>
								{(
									coin.quotes.KRW.market_cap / 1000000000000
								).toFixed(2)}
								조
							</td>
							<td className="align-right" style={{textAlign: 'right'}}>
								{(
									coin.quotes.KRW.volume_24h / 1000000000000
								).toFixed(2)}
								조
							</td>
							<td className="align-right" style={{
								textAlign: 'right',
								color: (coin.quotes.KRW.percent_change_24h) > 0 ? '#FA8072' : '#1E90FF' }}>
								{coin.quotes.KRW.percent_change_24h.toFixed(2)}%
							</td>
							<td className="align-right" style={{
								textAlign: 'right',
								color: (coin.quotes.KRW.percent_change_7d) > 0 ? '#FA8072' : '#1E90FF'}}>
								{coin.quotes.KRW.percent_change_7d.toFixed(2)}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default CoinTable