const API_KEY = '2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7'

const tickersHandler =  new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const AGGR_INDEX = "5"
socket.addEventListener('message', e=>{
  const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data)
  console.log(e.data)
  if(type !== AGGR_INDEX){
    return
  }

  const handlers = tickersHandler.get(currency) ?? [];
          if(handlers.length>0){
            console.log("handlers")
          handlers.forEach(fn => fn(newPrice))
          }
  })

  function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);
  
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(stringifiedMessage);
      return;
    }
  
    socket.addEventListener(
      "open",
      () => {
        console.log(234)
        socket.send(stringifiedMessage);
      },
      { once: true }
    );
  }
  

 function subscribeToTickerOnWs(ticker){
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });

}
function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}


export const subscribeToTicker = (ticker, cb)=>{
  console.log(ticker)
const subscribers = tickersHandler.get(ticker) || []
tickersHandler.set(ticker, [...subscribers, cb])
subscribeToTickerOnWs(ticker)
}

export const unSubscribeFromTicker = (ticker, cb)=>{
const subscribers = tickersHandler.get(ticker) || []
tickersHandler.set(ticker, [...subscribers, cb])
unsubscribeFromTickerOnWs(ticker)
}

window.showtickers = tickersHandler
window.state = socket.readyState 
window.isopen = WebSocket.OPEN 