// localStorage.clear();

Date.prototype.format=function(format='yyyy-MM-dd'){
	let o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	};

	if(+this === 0){
		return '尚无时间';
	}

	if(/(y+)/.test(format))
		format=format.replace(RegExp.$1,(this.getFullYear()+'').substr(4- RegExp.$1.length));

	for(let k in o)
		if(new RegExp("("+ k +")").test(format))
			format=format.replace(RegExp.$1,RegExp.$1.length===1?o[k]:("00"+ o[k]).substr((""+ o[k]).length));

	return format;
};


const dateFormat=(unix,format)=>{
	if(String(unix).length===10){
		unix=unix*1000;
	}
	return new Date(unix).format(format);//toLocaleString();
};

const requestCache = {};
const request = (method,uri,data,callback,nocache)=>{

	let body = null;
	if(data) body = JSON.stringify(data);

	let key = 'r-'+md5([
		method,
		uri,
		data
	].join('|'))

	if(!nocache && localStorage[key]){
		let data = localStorage[key];
		try{
			data = JSON.parse(data);
		}catch(e){

		}
		
		return callback(data);
	}

	fetch(uri,{
		method,
		mode: 'cors',
		body,
		credentials: 'include',
		headers: {
			'content-type': 'application/json'
		}
	}).then(res => res.json()).then(data => {
		localStorage[key] = JSON.stringify(data)
		callback(data)
	}).catch(error => console.error(error))
};


const requestText = (method,uri,data,callback)=>{
	let body = null;
	if(data){
		body = JSON.stringify(data);
	}
	fetch(uri,{
		method,
		mode: 'cors',
		body,
		credentials: 'include',
	}).then(res => res.text()).then(data => callback(data)).catch(error => console.error(error))
};

const proxy = (uri,callback)=>{
	request('GET',`https://lab.magiconch.com/api/fetch?uri=${encodeURIComponent(uri)}`,null,callback)
}

const proxyHTML = (uri,callback)=>{
	requestText('GET',`https://lab.magiconch.com/api/fetch?uri=${encodeURIComponent(uri)}`,null,callback)
}


const deepCopy = o=>JSON.parse(JSON.stringify(o));


const text = `Connected to =[A:1:1314370570:19971]:0
hostname: Valve CS:GO Hong Kong Server (srcds2009-hkg1.142.19)
version : 1.38.2.4 secure
os : Linux
type : official dedicated
map : dz_blacksite
players : 17 humans, 0 bots (16/17 max) (not hibernating)

# userid name uniqueid connected ping loss state rate
# 3 2 "CrayZ" STEAM_1:1:518125952 01:16 42 0 active 196608
# 4 3 "✈乱了夏末蓝了海 ✡" STEAM_1:0:576810884 01:15 13184 81 spawning 196608
# 5 4 "KAI_YANG" STEAM_1:1:30355188 01:15 74 0 active 327680
# 6 5 "Floth" STEAM_1:0:33001152 01:15 164 0 active 196608
# 7 6 "Little Monkey" STEAM_1:0:523392319 01:15 106 0 active 196608
# 8 7 "CurseRed" STEAM_1:0:55968383 01:15 72 0 active 786432
# 9 8 "Parsifal" STEAM_1:0:2523045 01:15 162 0 active 786432
# 10 9 "蒙面叔叔" STEAM_1:0:33258646 01:15 179 0 active 786432
# 11 10 "chenf1912" STEAM_1:0:417569018 01:15 95 0 active 786432
# 12 11 "不2不叫周淑怡" STEAM_1:0:530971387 01:15 80 0 active 196608
# 13 12 "Orange" STEAM_1:1:207139600 01:15 108 0 active 196608
# 14 13 "NOOB" STEAM_1:0:537625663 01:15 76 0 active 196608
# 15 14 "Ben丶" STEAM_1:1:635986018 01:15 122 0 active 196608
# 16 15 "Txlcgx" STEAM_1:0:533188657 01:15 105 0 active 786432
# 17 16 "SuperSuB!" STEAM_1:0:162908932 01:13 88 0 active 196608
# 18 17 "ghosterhk" STEAM_1:1:522784576 01:13 32 0 active 196608
# 19 18 "莳余" STEAM_1:1:495596568 01:10 124 0 active 196608
#end`;

const logNameRegex = /^\w+$/;
const localStorageLogNameKey = 'csgo-last-log-name';
let logName = localStorage.getItem(localStorageLogNameKey)||'test';

const data = {
	text,
	info:null,
	runing:false,
	h:12,
	Logs:{},
	sortKey:null,
	sortType:1,
	logName
};

const getLog = ()=>{
	const _Logs = {};
	request('get',`https://lab.magiconch.com/api/csgo/user-log/${app.logName}`,null,logs=>{
		if(logs){
			logs.forEach(log=>{
				_Logs[log.id64] = log
				// app.$set(app.Logs,log.id64,log)
			})
		}
		app.Logs = _Logs;
	},'nocache')
}
const log = (id64,color)=>{
	request('post',`https://lab.magiconch.com/api/csgo/user-log/${app.logName}/${id64}`,{
		color
	},log=>{
		// app.$set(Logs,id64,log)
	},'nocache');

	app.$set(app.Logs,id64,{
		color,
		unix:Math.floor(new Date()/1000)
	})
}

const serverInfoKey = [
	'hostname',
	'version',
	'os',
	'type',
	'map',
	'players'
];

const userInfokey = [
	'userid',
	'name',
	'uniqueid',
	'connected',
	'ping',
	'loss',
	'state',
	'rate', //带宽
]


const isConnectRegex = /^connected to\s?=\s?(.+?)$/i
const isServerInfoRegex = new RegExp(`^(${serverInfoKey.join('|')})\\s?:\\s?(.+?)$`,'i')

// STEAM_1:0:587628593 01:41 47 0
const isUserinfoRegex = /^# {0,}(\d+) ?(\d+)? "(.+?)"\s(?:(BOT)|(STEAM_\d:\d:\d+?) ([\d:]+) (\d+) (\d+)) (.+?) (\d+)$/i
// 1 userid  2 id  3 name  4 bot  5 uniqueid  6 connected  7 ping  8 loss  9 state  10 rate



const PatternSteamID32Regex = /^STEAM_([0-9]):([0-9]):([0-9]+)$/

const SID64_S = Number(1197960265728);
const SID64_1 = "7656";
function Sid32toSid64(id32){
	const id32Match = PatternSteamID32Regex.exec(id32)
	if(!id32Match) return

	let SID32_1 = Number(id32Match[1]);
	let SID32_2 = Number(id32Match[2]);
	let SID32_3 = Number(id32Match[3]);
	let S3ID_3 = SID32_3 * 2 + SID32_2;
	let SID64_2 = S3ID_3 + SID64_S;
	return SID64_1 + SID64_2;
};

const key = '45696DEC3D074506B7203C0CA93E4CB1';
const Users = {};


const GetRecentlyPlayed = (id64,callback)=>{
	proxy(`https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${id64}`,r=>{
		try{

			if(!r.response.games){
				// console.log(id64,/GetRecentlyPlayedGames/,/r/,r)
				return callback();
			}


			const Games = {};
			r.response.games.forEach(game=>{
				Games[game.appid] = game;
			})
	
			const game = Games[730];

			if(!game){
				// console.log(id64,/GetRecentlyPlayedGames/,/r/,r)
				return callback();
			}

			//playtime_2weeks
			//playtime_forever
			callback(game);

		}catch(e){
			console.log(id64,e)
			callback();
		}
	})
}

const getLevel = (id64,callback)=>{
	proxy(`https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${key}&steamid=${id64}`,r=>{
		try{
			if(!r.response.player_level){
				console.log(id64,/GetSteamLevel/,null)
				return;
			}
			callback(r.response.player_level)
		}catch(e){
			console.log(id64,/GetSteamLevel/,r)
			callback()
		}
	})
}

const SortKeyTypes = {
	userId:'number',
	id:'number',
	level:'number',
	ping:'number',
	playtime_2weeks:'number',
	timecreated:'number',
	name:'string',
	logUnix(a,b,type){
		if(!app.Logs[a.id64]) return 1;
		if(!app.Logs[b.id64]) return -1;

		const _a = app.Logs[a.id64].unix
		const _b = app.Logs[b.id64].unix
		return (_a - _b) * type
	}
}
const app = new Vue({
	el:'.app',
	data,
	methods:{
		refactor(){
			let lines = this.text.split(/\n/g);

			// console.log(lines)
			const info = {
				users:[]
			}
			const id64s = []


			lines.forEach(line=>{
				line = line.trim()
				if(!line) return;
				if(line === '#end')return;

				const userMatch = line.match(isUserinfoRegex)


				if(userMatch){
					const id32 = userMatch[5]
					const id64 = Sid32toSid64(id32)

					const user = {
						userId:userMatch[1],
						id:userMatch[2],
						name:userMatch[3],
						bot:userMatch[4]?true:undefined,
						id32,
						id64,
						connected:userMatch[6],
						ping:userMatch[7],
						loss:userMatch[8],
						state:userMatch[9],
						rate:userMatch[10],
					};


					info.users.push(user)

					if(id64){
						Users[id64] = user;
						id64s.push(id64)

						/*
						proxyHTML(`https://steamcommunity.com/profiles/${id64}`,html=>{
							console.log(html)
							//等级
							'.friendPlayerLevel .friendPlayerLevelNum'

							//游戏数
							'a[href*="/games/?tab=all"] .profile_count_link_total'

							//徽章
							'a[href$="/badges/"] .profile_count_link_total'

							//在线
							'.profile_in_game.online'
						})
						*/

						// proxyHTML(`https://steamrep.com/search?q=${id64}`,html=>{
	
						// 	const tmRegex = /g_TimeStamp = '(\d+)'/
						// 	const tmMatch = html.match(tmRegex)
						// 	if(!tmMatch) return
	
						// 	const tm = tmMatch[1];
						// 	proxy(`https://steamrep.com/util.php?op=getSteamProfileInfo&id=${id64}&tm=${tm}`,r=>{
						// 		if(r.error)return console.log(r.error,r);
						// 		// user.rep = r;
						// 		app.$set(user,'rep',r)
						// 	})
						// })

						GetRecentlyPlayed(id64,r=>{
							if(!r) return;
							app.$set(user,'playtime_2weeks',r.playtime_2weeks);
							app.$set(user,'playtime_forever',r.playtime_forever);
						})

						getLevel(id64,level=>{
							app.$set(user,'level',level);
						})
					}
					return
				}

				
				const serverMatch = line.match(isServerInfoRegex)

				if(serverMatch){
					info[serverMatch[1]] = serverMatch[2]
					return
				}

				const connectedMatch = line.match(isConnectRegex)
				if(connectedMatch){
					info.ip = connectedMatch[1]
				}
			})


			proxy(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${key}&steamids=${id64s.join(',')}`,r=>{
				// console.log(r)
				r.players.forEach(bans=>{
					// console.log(bans.SteamId,Users[bans.SteamId])
					if(Users[bans.SteamId]){
						app.$set(Users[bans.SteamId],'bans',bans)
					}
				})
			})

			proxy(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${id64s.join(',')}`,r=>{
				r.response.players.forEach(summarie=>{
					if(Users[summarie.steamid]){
						app.$set(Users[summarie.steamid],'summarie',summarie)
						app.$set(Users[summarie.steamid],'avatar',summarie.avatarmedium)
						app.$set(Users[summarie.steamid],'timecreated',summarie.timecreated)
					}
				})
			})
			

			this.info = info
		},
		sortBy(key,type = 1){
			this.sortKey = key
			this.sortType = type
		},
	},
	watch:{
		text(){
			this.refactor();
		},
		logName(val){
			localStorage[localStorageLogNameKey] = val;
			getLog()
		}
	},
	computed:{
		users(){
			if(!this.info) return [];
			if(!this.info.users) return [];

			let key = this.sortKey;
			let type = this.sortType;
			if(!key) return this.info.users;

			let keyType = SortKeyTypes[key]||String;

			if(keyType instanceof Function){
				return this.info.users.sort((a,b)=>keyType(a,b,type));
			}

			if(keyType === 'number'){
				return this.info.users.sort((a,b)=>{
					const aString = Number(a[key])||0;
					const bString = Number(b[key])||0;
					return (aString - bString) * type;
				});
			}

			return this.info.users.sort((a,b)=>{
				const aString = String(a[key]);
				const bString = String(b[key]);
				return aString.localeCompare(bString) * type;
			})
		}
	}
})


// proxy(`https://steamcommunity.com/inventory/76561198374544929/730/2?l=schinese&count=1000`,r=>{
// 	console.log(/库存/,r)
// })


app.refactor();
getLog();


const loadScript = (src,el) =>{
	el = document.createElement('script');
	el.src = src;
	document.body.appendChild(el);
};

window._hmt = [];
window.dataLayer = [
    ['js', new Date()],
    ['config', 'G-13BQC1VDD8']
];
window.gtag = function(){dataLayer.push(arguments)};
setTimeout(_=>{
	loadScript('//hm.baidu.com/hm.js?f4e477c61adf5c145ce938a05611d5f0');
	loadScript('//www.googletagmanager.com/gtag/js?id=G-13BQC1VDD8');
},400);