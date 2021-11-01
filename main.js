(()=>{
	
	const	begin				= 0,
			end				= 1700,
			
			GAME_ID			= '521',
			LIMITTER			= 2000,
			
			x = new XMLHttpRequest(),
			pid = location.href.slice(location.href.lastIndexOf('/') + 1),
			data = {
				serviceName: 'game',
				serviceProductId: GAME_ID,
				frontendId: 9,
				frontendVersion: '297.0.0',
				expectedGrade: 0
			},
			Q = [
				{
					url: `https://api.spi.nicovideo.jp/v1/ichibas/${pid}/products`,
					method: 'POST',
					header: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					data: JSON.stringify(data)
				},
				{
					url: `https://lapi.spi.nicovideo.jp/v1/services/game/contents/${pid}?frontendId=${data.frontendId}&frontendVersion=${data.frontendVersion}&serviceProductId=${data.serviceProductId}`,
					method: 'POST',
					header: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					data: JSON.stringify(data)
				},
				{
					url: `https://lapi.spi.nicovideo.jp/v1/services/game/contents/${pid}`,
					method: 'DELETE',
					header: { Accept: 'application/json' }
				}
			],
			request = (stops, i = begin, l = end, d = Date.now(), q = [ ...Q ], currentQ = q.shift()) => {
				
				let k;
				
				x.open(currentQ.method || 'GET', currentQ.url);
				
				for (k in currentQ.header) x.setRequestHeader(k, currentQ.header[k]);
				
				x.withCredentials = true,
				x.onreadystatechange = () =>
					x.readyState === x.DONE && x.status >= 200 && x.status < 400 && (
							x.onreadystatechange = null,
							!stops && q.length ? setTimeout(() => request(stops,i,l,d, q), LIMITTER || 1000) :
								(console.info(`${++i} / ${l}`), i < l) ?
									request(stops, i,l,d) : 
									(
										d = (Date.now() - d) / 1000,
										alert(`ちょろい (リクエスト数: ${end - begin}回, かかった時間: ${parseInt(d / 60)}分${parseInt(d = d - parseInt(d / 60) * 60)}${(d = ''+d).slice(d.indexOf('.')).slice(0,4)}秒)`)
									)
						),
				x.send(currentQ?.data);
				
			};
	
	request();
	
})();
