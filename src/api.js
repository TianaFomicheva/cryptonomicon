const API_KEY = '2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7'

const tickersHandler =  new Map()

export const loadTicker = (tickers)=>{
 const data = fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(',')}&api_key=${API_KEY}`
      ).then((r)=>r.json()).then(rawData=>{
        const res = Object.fromEntries(Object.entries(rawData).map(([key, val]) => [key, 1/val]))
        Object.entries(res).forEach(([currency, newPrice])=>{
          const handlers = tickersHandler.get(currency) ?? [];
          if(handlers.length>0){
          handlers.forEach(fn => fn(newPrice))
          }
        })
     return  res
      })
      
  

      return data     
}
export const subscribeToTicker = (ticker, cb)=>{
const subscribers = tickersHandler.get(ticker) || []
tickersHandler.set(ticker, [...subscribers, cb])
}

export const unSubscribeFromTicker = (ticker, cb)=>{
const subscribers = tickersHandler.get(ticker) || []
tickersHandler.set(ticker, [...subscribers, cb])
}

window.showtickers = tickersHandler