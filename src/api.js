const API_KEY = '2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7'

export const loadTicker = (tickers)=>{
const data =    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(',')}&api_key=${API_KEY}`
      ).then((r)=>r.json())
      return data
}