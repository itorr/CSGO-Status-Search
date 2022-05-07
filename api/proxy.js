import axios from 'axios'
export default async function handler(req, res) {
    const query = req.query;
	const url = query['url'];

	if(!/^https:\/\/steamcdn-a\.akamaihd\.net\//.test(url)) return res.status(404);

	const imageBuffer = await axios(url,{
        responseType:'arraybuffer',
    });
    res.setHeader('content-type','image/jpeg');
	res.status(200).send(imageBuffer);
}