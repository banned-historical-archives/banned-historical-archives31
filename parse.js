const { JSDOM } = require('jsdom');
const fs = require('fs-extra')

const dom = new JSDOM(fs.readFileSync('html/438.html').toString())
const doc = dom.window.document;
const title = doc.querySelector('.show_text h3').textContent.trim()
const author = doc.querySelector('strong').textContent.trim()
const date_raw = doc.querySelector('.show_text .info').textContent.trim()
const date_str = date_raw.match(/\d{4}-\d{2}-\d{2}/)[0];
const content = Array.from(doc.querySelectorAll('.article-content p')).map(i => i.textContent.trim()).filter(i => i)
console.log({
    title,
    author,
    dates: [{
        year: parseInt(date_str.split('-')[0]),
        month: parseInt(date_str.split('-')[1]),
        day: parseInt(date_str.split('-')[2]),
    }],
    content,
})