// localStorage.clear();

const htmlEncode = function(str){  
	return src.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;").replace(/\'/g,"&#39;").replace(/\"/g,"&quot;");
};


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

	const clearCache = _=>{
		console.log(/强制清除缓存/,uri,key);
		localStorage.removeItem(key);
	};
	// console.log(/nocache/,nocache);

	if(!nocache){
		let data = localStorage[key];
		if(data){
			try{
				// console.log(/缓存的数据/,data);
				data = JSON.parse(data);
				return setTimeout(callback.bind(null,data,clearCache));
			}catch(e){
				
			}
		}
	}

	// console.log(/发起请求/,uri);
	fetch(uri,{
		method,
		mode: 'cors',
		credentials: 'include',
		body,
		headers: {
			'content-type': 'application/json'
		}
	}).then(res => res.json()).then(data => {
		if(!nocache){
			localStorage[key] = JSON.stringify(data);
		}
		callback(data,clearCache);
	}).catch(error => console.error(error))
};

const baseAPI = 'https://lab.magiconch.com/api/';
const steamBaseAPI = 'api/';
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

const deepCopy = o=>JSON.parse(JSON.stringify(o));


const text = localStorage['csgoLastStatusText']||'';

/*
`Connected to =[A:1:3561541640:19979]:0
hostname: Valve CS:GO Hong Kong Server (srcds2055-hkg1.142.42)
version : 1.38.2.4 secure
os : Linux
type : official dedicated
map : dz_sirocco
players : 17 humans, 0 bots (16/17 max) (not hibernating)

# userid name uniqueid connected ping loss state rate
# 3 2 "人老又菜又爱玩" STEAM_1:0:448183897 00:20 39 0 active 196608
# 4 3 "十二楼五城" STEAM_1:0:572920645 00:20 83 0 active 196608
# 5 4 "Giang" STEAM_1:0:549226724 00:20 55 0 active 196608
# 6 5 "狙神阿鑫." STEAM_1:0:503590605 00:20 93 66 spawning 196608
# 7 6 "lishuvai酷哦" STEAM_1:1:514931287 00:20 141 73 spawning 196608
# 8 7 "at88" STEAM_1:0:540928738 00:20 101 0 active 786432
# 9 8 "CurseRed" STEAM_1:0:55968383 00:20 74 0 active 786432
# 10 9 "一生一世永爱UMP45" STEAM_1:0:436743442 00:20 63 56 spawning 786432
# 11 10 "Orange" STEAM_1:1:207139600 00:20 104 0 active 196608
# 12 11 "Star Fox" STEAM_1:1:96579395 00:20 77 56 spawning 131072
# 13 12 "xi the pooh" STEAM_1:1:128895246 00:20 88 0 active 786432
# 14 13 "like" STEAM_1:1:631677446 00:20 83 0 active 196608
# 15 14 "DarkwinG" STEAM_1:0:526223612 00:20 124 66 spawning 196608
# 16 15 "Heracles" STEAM_1:1:449076373 00:20 398 86 spawning 196608
# 17 16 "我菜别说我" STEAM_1:1:622464804 00:20 77 56 spawning 196608
# 18 17 "Stranger" STEAM_1:0:171506710 00:17 121 66 spawning 786432
# 19 18 "坠入虚空飞向你" STEAM_1:0:644594952 00:14 237 72 spawning 196608
#end`;
*/

const logNameRegex = /^\w+$/;
const localStorageLogNameKey = 'csgo-last-log-name';
const localStorageContentKey = 'csgo-content';
let logName = localStorage.getItem(localStorageLogNameKey)||'test';

const data = {
	text,
	user:undefined,
	authURL:null,
	info:null,
	runing:false,
	h:12,
	Logs:{},
	sortKey:null,
	sortType:1,
	logName,
	debug:false,
	content:!localStorage.getItem(localStorageContentKey),
	callvoteKick:false,
	disconnect:false,
};

const getLog = ()=>{
	const _Logs = {};
	request('get',`${baseAPI}csgo/user-log/${app.logName}`,null,logs=>{
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
	request('post',`${baseAPI}csgo/user-log/${app.logName}/${id64}`,{
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


const clear = _=>{
	localStorage.clear()
	location.reload()
}

const SortKeyTypes = {
	userId:'number',
	id:'number',
	level:'number',
	ping:'number',
	csgo_playtime_2weeks:'number',
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
const nocache = false;
const app = new Vue({
	el:'.app',
	data,
	methods:{
		refactor(){
			if(!this.text){
				this.info = null;
				return;
			}
			let lines = this.text.split(/\n/g);

			if(!lines.length){
				this.info = null;
				return;
			}

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

			if(id64s.length){
				request('get',`${steamBaseAPI}users?id64s=${id64s.join(',')}`,null,r=>{
					const users = r.users;
					users.forEach(user=>{
						const id64 = user.id64;
						if(Users[id64]){
							for(let key in user){
								app.$set(Users[id64],key,user[key]);
							}
						}
					});
					app.info.users.forEach(user=>{
						if(user.timecreated && !user.detail){
							const { id64 } = user;
							request('get',`${steamBaseAPI}detail?id64=${id64}`,null,r=>{
								for(k in r){
									const v = r[k]
									app.$set(user,k,v);
								}
							})
						}
					});
				});
			}

			this.info = info
		},
		sortBy(key){
			if(key !== this.sortKey){
				this.sortType = 1
			}else{
				this.sortType = -this.sortType
			}
			this.sortKey = key
		},
		clear,
		copy(text){
			let inputEl= document.createElement('input');
			inputEl.value= text;
			document.body.appendChild(inputEl);
			inputEl.select();
			document.execCommand('Copy'); 
			inputEl.remove()
		}
	},
	watch:{
		text(val){
			clearTimeout(this.T);
			this.T = setTimeout(_=>{
				this.sortKey = null;
				this.sortType = 1;
				localStorage['csgoLastStatusText'] = val;
				this.refactor();
			},300);
		},
		logName(val){
			if(!val) val = 'test';
			localStorage[localStorageLogNameKey] = val;
			getLog()
		},
		content(val){
			if(val){
				localStorage.removeItem(localStorageContentKey);
			}else{
				localStorage.setItem(localStorageContentKey,1);
			}
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
					let _a = a[key];
					let _b = b[key];
					if(_a === undefined)_a = -1
					if(_b === undefined)_b = -1
					return (_a - _b) * type;
				});
			}

			return this.info.users.sort((a,b)=>{
				const aString = String(a[key]);
				const bString = String(b[key]);
				return aString.localeCompare(bString) * type;
			})
		},
		hackers(){
			return this.users.filter(user=>this.Logs[user.id64] && this.Logs[user.id64].color==='red')
		}
	}
})

// request('get',`${baseAPI}steam/info`,null,(r,clearCache)=>{
// 	app.user = r.user || null;
// 	app.authURL = r.authURL;
// 	// console.log(/123/,r,clearCache);
// 	if(r.user){
// 		app.refactor();
// 		getLog();
// 	}else{
// 		clearCache();
// 	}
// },nocache);


window.addEventListener('paste',e=>{
	const item = e.clipboardData.items[0];
	if(!item) return;
	item.getAsString(text=>{
		app.text = text
	})
})

window._hmt = [];
window.dataLayer = [
    ['js', new Date()],
    ['config', 'G-13BQC1VDD8']
];
window.gtag = function(){dataLayer.push(arguments)};

const headEl = document.querySelector('head');
const loadScript = (src,cb=_=>{},el) =>{
	el = document.createElement('script');
	el.src = src;
	el.onload=cb;
	headEl.appendChild(el);
};

setTimeout(_=>{
	('//hm.baidu.com/hm.js?f4e477c61adf5c145ce938a05611d5f0');
	loadScript('//www.googletagmanager.com/gtag/js?id=G-13BQC1VDD8');
},400);