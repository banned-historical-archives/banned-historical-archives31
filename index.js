const axios = require('axios');
const { HttpsProxyAgent } =require('https-proxy-agent');

const { JSDOM } = require('jsdom');
const fs = require('fs-extra')

const proxyUrl = 'http://localhost:8081';
const agent = new HttpsProxyAgent(proxyUrl);

async function get(url) {
    while (true) {
        try{
            const res = await axios.get(url, {httpsAgent: agent, timeout: 15000})
            return res;
        }catch(e) {
           // console.log(e)
            console.log('retry', url);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}
async function download(url) {
    const p = 'html/'+url.substring(url.lastIndexOf('/')+1);
    if (fs.existsSync(p)) return;
    const res = await get(url)
    await fs.writeFile(p, res.data);
    await new Promise(resolve => setTimeout(resolve, 3000));
}
async function get_dom(url) {
    const res = await get(url)
    const dom = new JSDOM(res.data);
    return dom;
}
async function get_total_pages(url) {
    const dom = await get_dom(url);
    const document = dom.window.document;
    const n = parseInt(document.querySelector('.list_page li:nth-last-child(2)').textContent)
    return n;
}

async function from_list(url) {
    const dom = await get_dom(url);
    const res = [];
    for (const i of Array.from(dom.window.document.querySelectorAll('.article-title'))) {
        res.push(i.querySelector('a:nth-last-child(1)').getAttribute('href'));
    }
    return res;
}

async function wengezhuanti() {
    const total_page = await get_total_pages('https://www.aisixiang.com/data/search?column=150')
    console.log('total_page', total_page)
    
    for (let i = 1; i <= total_page; ++i) {
        console.log(i);
        const candidates = await from_list('https://www.aisixiang.com/data/search?column=150&page='+i);
        for (const j of candidates) {
            console.log(
                '-'
            )
            await download('https://www.aisixiang.com' + j);
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    console.log('done')
}

async function hongweibing() {
    const total_page = await get_total_pages('https://www.aisixiang.com/zhuanti/125.html')

    console.log('total_page', total_page)
    
    for (let i = 1; i <= total_page; ++i) {
        console.log(i);
        const candidates = await from_list('https://www.aisixiang.com/zhuanti/125.html?page='+i);
        for (const j of candidates) {
            console.log(
                '-'
            )
            await download('https://www.aisixiang.com' + j);
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    console.log('done')
}
async function wengekeyword() {
    const total_page = await get_total_pages('https://www.aisixiang.com/data/search?searchfield=keywords&keywords=%e6%96%87%e9%9d%a9&page=1')

    console.log('total_page', total_page)
    
    for (let i = 1; i <= total_page; ++i) {
        console.log(i);
        const candidates = await from_list('https://www.aisixiang.com/data/search?searchfield=keywords&keywords=%e6%96%87%e9%9d%a9&page='+i);
        for (const j of candidates) {
            console.log(
                '-'
            )
            await download('https://www.aisixiang.com' + j);
        }
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
    console.log('done')
}
(async () => {
    // await wengezhuanti();
    // await hongweibing();
    await wengekeyword();
})();
