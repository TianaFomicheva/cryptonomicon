const API_KEY = '2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7'

const tickersHandler = new Map()
const tickersHandlerToBTC = new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const AGGR_INDEX = "5"
const AGGR_INDEX_NONEXISTPAIR = "500"
let curCb = null
socket.addEventListener('message', e => {

  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER: parameter } = JSON.parse(e.data)

  if (type !== AGGR_INDEX && type !== AGGR_INDEX_NONEXISTPAIR) {
    return
  }
  if (type === AGGR_INDEX_NONEXISTPAIR) {
    const handlersToBTC = tickersHandlerToBTC.get(currency) ?? [];
    if (type === AGGR_INDEX_NONEXISTPAIR) {
      const curr = parameter.split("~")[2]
      unsubscribeFromTickerOnWs(curr)
      if (parameter.split("~")[3] !== "BTC") {
        if (!tickersHandlerToBTC.get(curr)) {
          subscribeToTicker(curr, null, true)
        }
        if (handlersToBTC.length > 0) {

          handlersToBTC.forEach(fn => fn(newPrice))
        } 
      }else{
        handlersToBTC.forEach(fn => fn(-1))
      }
    }

  
    
  } else {
    const handlers = tickersHandler.get(currency) ?? [];
    if (handlers.length > 0) {
      handlers.forEach(fn =>  fn(newPrice))
    }
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
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}


function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });

}

function subscribeToTickerOnWsToBTC(ticker) {
  console.log(typeof(ticker))
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~BTC`]
  });

}
function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}
// function unsubscribeFromTickerOnWsToBTC(ticker) {
//   sendToWebSocket({
//     action: "SubRemove",
//     subs: [`5~CCCAGG~${ticker}~BTC`]
//   });
// }



export const subscribeToTicker = (ticker, cb, toBTC) => {
  if (cb !== null && curCb == null) {
    curCb = cb
  }
  console.log(curCb)
  if (!toBTC && ticker !== 'LTCX') {
    const subscribers = tickersHandler.get(ticker) || []
    tickersHandler.set(ticker, [...subscribers, cb])
    subscribeToTickerOnWs(ticker)
  } else {
    if (curCb) {
      if (ticker !== undefined && ticker !== "undefined") {

        const subscribers = tickersHandlerToBTC.get(ticker) || []

        tickersHandlerToBTC.set(ticker, [...subscribers, curCb])

        console.log(tickersHandlerToBTC)
        subscribeToTickerOnWsToBTC(ticker)
      }
    }
  }
}

export const unSubscribeFromTicker = (ticker, cb) => {
  const subscribers = tickersHandler.get(ticker) || []
  tickersHandler.set(ticker, [...subscribers, cb])
  unsubscribeFromTickerOnWs(ticker)
}

window.showtickers = tickersHandler
window.state = socket.readyState
window.isopen = WebSocket.OPEN