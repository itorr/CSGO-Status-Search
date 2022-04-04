// import qs from 'querystringify';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import fs, { copyFile } from 'fs';


const agent = new SocksProxyAgent({
	hostname: '0.0.0.0',
	port: 1086
});


let ms = 10000;
const qs = {
	stringify(o){
		const r = [];
		for(let key in o) r.push(`${encodeURIComponent(key)}=${encodeURIComponent(o[key])}`)
		
		return r.join('&')
	}
}

let total = 200;
let start = 0;
let assets = [];

start = 6200;

let defaultQuerys = {
	query:'',
	search_descriptions:0,
	sort_column:'name',
	sort_dir:'asc',
	appid:'730',
	norender:1,
	count:100,
}


const one = async _=>{
	console.log(/进度/,start,total)

	let querys = qs.stringify({
		...defaultQuerys,
		start,
	})
	
	const uri = `https://steamcommunity.com/market/search/render/?${querys}`
	console.log(uri)
	
	try{
		const response = await fetch(uri, {
			// agent,
			headers:{
				'Accept-Language': 'zh-CN,zh;q=0.9',
				'Content-Type': 'application/json',
			}
		})
		const r = await response.json();
		if(!r.success) return console.log(/出错了/,r);
		console.log(r.success,r.results.length)
		
		const length = r.results.length;
		r.results.map(asset =>{
			const _asset = {
				hash_name: asset.hash_name,
				name: asset.name,
				name_color: asset.asset_description.name_color,
				name_color: asset.asset_description.background_color,
				icon_url: asset.asset_description.icon_url,
				type: asset.asset_description.type,
				classid: asset.asset_description.classid,
				instanceid: asset.asset_description.instanceid,

				sale_price_text: asset.sale_price_text,
				sell_price: asset.sell_price,
				sell_price_text: asset.sell_price_text,
			}

			assets.push(_asset)
			return _asset
		})

		total = r.total_count

		// fs.writeFileSync('assets.json',JSON.stringify(assets,0,2),'utf-8');

		if(start+length < total){
			start += length
			setTimeout(await one,ms)
		}else{
			console.log(/完成/)
		}

	}catch(e){
		console.log(/出错了/,e);
	}
	
}

await one()

// copy(JSON.stringify(assets,0,2))

//一会要把取来的数据补充上来