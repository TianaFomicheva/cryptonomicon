<template>
        <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                type="text"
                name="wallet"
                id="wallet"
                class="
                  block
                  w-full
                  pr-10
                  border-gray-300
                  text-gray-900
                  focus:outline-none
                  focus:ring-gray-500
                  focus:border-gray-500
                  sm:text-sm
                  rounded-md
                "
                placeholder="Например DOGE"
                @keydown.enter="add(ticker)"
                @input="
                  suggession = [];
                  $emit('input', $event.target.value);
                  autocomplete($event.target.value);
                "
              />
            </div>
            <div
              v-if="suggession.length > 0"
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="item in suggession"
                :key="item.name"
                class="
                  inline-flex
                  items-center
                  px-2
                  m-1
                  rounded-md
                  text-xs
                  font-medium
                  bg-gray-300
                  text-gray-800
                  cursor-pointer
                "
                @click="
                  ticker = item;
                  add(item);
                "
              >
                {{ item }}
              </span>
            </div>
            <div v-if="tickerAdded(ticker)" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="add(ticker)"
          class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          "
        >
          <!-- Heroicon name: solid/mail -->
<plus-icon/>
          Добавить
        </button>
      </section>
</template>
<script>
import PlusIcon from './PlusIcon.vue'
export default {
  name: "App",
  data() {
    return {
      ticker: "",
      tickers: [],         
      suggession: [],     
    };
  },
  components:{
    PlusIcon
  },
  methods:{
      add(tickerName){
          (this.$emit('add-ticker', tickerName))
          },
     autocomplete() {
      fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?summary=true&api_key=2b11aeffa3a34bd561a11da94505ea7da894741067f079001d98ae550de065a7`
      )
        .then((r) => r.json())
        .then((rawData) => {
          Object.values(rawData.Data)
            .filter((t) => t.Symbol.includes(this.ticker))
            .map((t) => {
              if (this.suggession.length < 4 && this.ticker.length > 1) {
                this.suggession.push(t.Symbol);
              }
            });
        });
    },
     tickerAdded(tickerName) {
      return (
        tickerName !== "" &&
        this.tickers.filter((t) => t.name === tickerName).length > 0
      );
    },     
  }
}
</script>
