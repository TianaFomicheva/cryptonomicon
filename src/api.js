//найти инфу по преобразованию форматов
const API_KEY = '2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7'

const tickersHandler = new Map()
const tickersHandlerToBTC = new Map()
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

const AGGR_INDEX = "5"
const AGGR_INDEX_NONEXISTPAIR = "500"

let BTCPrice = 0;
socket.addEventListener('message', (e) => {

  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER: parameter, TOSYMBOL: toCurrency } = JSON.parse(e.data)
  BTCPrice = currency == 'BTC' ? newPrice : BTCPrice
  if (type !== AGGR_INDEX) {
    return
  }
  if (type === AGGR_INDEX_NONEXISTPAIR) {

    const curr = parameter.split("~")[2]
    const toCurr = parameter.split("~")[3]
    unsubscribeFromTickerOnWs(curr, toCurr)
    return
  }
  if (newPrice) {
    if (toCurrency == 'USD') {

      const handlers = tickersHandler.get(currency) ?? [];
      handlers.forEach(fn => { fn(newPrice) })

    } else {
      const handlersToBTC = tickersHandlerToBTC.get(currency) ?? [];
      const numToDelete = newPrice.toString().split('e-')[0]
      const numToMultiply = newPrice.toString().split('e+')[0]
      let priceInBTC 
      if(numToDelete){
        priceInBTC = parseFloat(newPrice.toString().split('e')[0])/Math.pow(10, newPrice.toString().split('e-')[1])
      }
      else if(numToMultiply){
        priceInBTC = parseFloat(newPrice.toString().split('e')[0])*Math.pow(10, newPrice.toString().split('e-')[1])
      }else{
        priceInBTC = parseFloat(newPrice)
      }
      handlersToBTC.forEach(fn => fn(priceInBTC*BTCPrice))

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


function subscribeToTickerOnWs(ticker, toCurrency) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`]
  });

}

function unsubscribeFromTickerOnWs(ticker, toCurrency) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~${toCurrency}`]
  });
}





export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandler.get(ticker) || []
  tickersHandler.set(ticker, [...subscribers, cb])
  const subscribersToBTC = tickersHandlerToBTC.get(ticker) || []
  tickersHandlerToBTC.set(ticker, [...subscribersToBTC, cb])
  subscribeToTickerOnWs(ticker, 'USD')
  subscribeToTickerOnWs(ticker, 'BTC')
}

export const unSubscribeFromTicker = ticker => {
  tickersHandler.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};


window.showtickers = tickersHandler
window.state = socket.readyState
window.isopen = WebSocket.OPEN