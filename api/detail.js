import axios from 'axios'

const apiKey = '45696DEC3D074506B7203C0CA93E4CB1';


const timeout = 4000;

const get = async uri =>{
	try{
		const res = await axios.get(uri,{
			timeout,
			responseType:'text',
			headers:{
				// 'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
				'referer':uri,
				'Accept-Language': 'zh-CN,zh;q=0.9'
			}
		});
		let data = res.data;
		try{
			data = JSON.parse(data);
		}catch(e){

		}
		// if(typeof data === 'object'){
			
		// }
		return data;
	}catch(e){
		console.log(/gete/,e);
		return null;
	}
}



const id64Regex = /^7656[0-9]{12,14}$/;

const steamAPIBaseURL = 'https://api.steampowered.com/';


const GetUserRecentlyPlayed = async id64 =>{
	const uri = `${steamAPIBaseURL}IPlayerService/GetRecentlyPlayedGames/v1/?key=${apiKey}&steamid=${id64}`;
	try{
		const r = await get(uri);
		const games = r.response['games'];
		if(!games) return null;

		const Games = {};
		games.forEach(game => {
			Games[game.appid] = game;
		});
		const game = Games[730];
		return game;
	}catch(e){
		console.log(/获取game time出错/,e,id64,uri);
		return null;
	}
};
const getUserLevel = async id64 =>{
	const uri = `${steamAPIBaseURL}IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${id64}`;
	try{
		const r = await get(uri);
		return r.response['player_level'];
	}catch(e){
		console.log(/获取level出错/,e,id64,uri);
		return null;
	}
};

const getUserDetailCallback = async id64 =>{
	const user = {};
	
	const game = await GetUserRecentlyPlayed(id64);
	if(game){
		user.csgo_playtime_2weeks = game.playtime_2weeks;
		user.csgo_playtime_forever = game.playtime_forever;
	}
	
	const level = await getUserLevel(id64);
	if(level){
		user.level = level;
	}

	return user;
};
//76561198374544929
export default async function handler(req, res) {
    const query = req.query;

	const id64 = query['id64'];
	
	if(!id64Regex.test(id64)) return res.status(200).json({});

    const user = await getUserDetailCallback(id64);
	res.status(200).json(user);
}