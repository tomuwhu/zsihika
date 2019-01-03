<template>
  <div id="app">
    <div class="columns">
      <div class="column" style="width: 40px;">
      </div>
      <div class="column is-narrow">
        <Header :msg="feliratok.get('szzsak')[currlang]"/>
      </div>
      <div class="column" style="width: 40px; text-align:right;">
        <img class="li" @click="currlang='hu'" src="./assets/hun.jpg" />
        <img class="li" @click="currlang='en'" src="./assets/eng.jpg" />
      </div>
    </div>
    <br>
    <div>
      <div class="columns">
        <div class="column is-narrow">
          <div class="box" style="width: 400px;">
            <b-input :placeholder="feliratok.get('kulcsszo_h_a')[currlang]"
                      type="search"
                      icon-pack="fas"
                      icon="search"
                      v-model="kk"
                      @keyup.native.enter="addk()">
            </b-input>
            <br>
            <span :key="kszo.id" 
                  v-for="kszo in klsz"
                  class="kszg">
              <span class="nowrap ksz" @click="addksz(kszo)">
                <span v-if="kszo.ktip">{{kszo.ktip}}:</span> {{kszo.kulcsszo}}
              </span> &nbsp;<span> </span>
            </span>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <p class="title is-5">{{feliratok.get('kiv_ksz')[currlang]}}</p>
            <span :key="kszo.id" 
                  v-for="kszo in kivk"
                  class="kszg"
                  @click="remksz(kszo.id)">
              <span class="nowrap ksz">
                <span v-if="kszo.ktip">{{kszo.ktip}}:</span> {{kszo.kulcsszo}}
              </span> &nbsp;<span> </span>
              <b-icon
                class="red"
                icon="delete"
                size="is-small">
              </b-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div v-if="kivk.length" style="text-align:center;">
      <span v-if="docs.length">
        <div :kex="i" 
              v-for="(doc,i) in docs"
              class="docs">
          {{doc.dname}}
        </div>
      </span>
      <span v-else>
        {{feliratok.get('kiv_nincst')[currlang]}}
      </span>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
document.title="Kereső"
let fif = new Map() 
fif.set('szzsak', { 
  hu: 'Szegedi Zsidó Archívum - Keresés',
  en: 'Szeged Jewish Archive - Searching'
})
fif.set('kulcsszo_h_a', { 
  hu: 'Kulcsszó hozzáadása a kereséshez...',
  en: 'Add keyword to searching...'
})
fif.set('kiv_ksz', { 
  hu: 'Kiválasztott kulcsszavak:',
  en: 'Selected keywords:'
})
fif.set('kiv_nincst', { 
  hu: 'Nincs találat, szűkítse a kulcsszólistát!',
  en: 'No results, narrow your keyword list!'
})
let backend="http://www.inf.u-szeged.hu/u/tnemeth/"
//let backend="http://localhost:3000"
export default {
  name: 'app',
  data: () => ({
    feliratok: fif,
    currlang: 'hu',
    kk: '',
    kl: [],
    kivk: [],
    docs: []
  }),
  methods: {
    addk() {
      if (this.klsz.length===1) {
        this.kivk.push(this.klsz[0])
        this.kk=''
      }
    },
    addksz(kszo) {
      this.kivk
          .filter( v => 
            v.id===kszo.id 
          )
          .length ? 1 : this.kivk.push(kszo)
      this.kk=''
      this.axios
        .post(`${ backend }/docsszurve`,{ kszol: this.kivk })
        .then( resp => {
          this.docs = resp.data
        })
    },
    remksz(id) {
      this.kivk = this.kivk.filter(v => v.id!==id)
      this.axios
        .post(`${ backend }/docsszurve`,{ kszol: this.kivk })
        .then( resp => {
          this.docs = resp.data
        })
    }
  },
  mounted() {
    this.axios
        .get(`${ backend }/kulcsszavak`)
        .then( resp => {
          this.kl = resp.data
        })
  },
  components: {
    Header
  },
  computed: {
    klsz() {
      let szk = this .kl
                  .filter( v => RegExp(this.kk,'i').test(v.kulcsszo) )
                  .filter( v => !this.kivk.find( q => q.id===v.id ) )
      return  szk.length<10 ? szk : []
    }
  }
}
</script>

<style>
/*
font-family: 'Patrick Hand', cursive;
font-family: 'Kaushan Script', cursive;
font-family: 'Kodchasan', sans-serif;
font-family: 'Parisienne', cursive;
font-family: 'Berkshire Swash', cursive;
font-family: 'Aclonica', sans-serif;
font-family: 'Itim', cursive;
font-family: 'Annie Use Your Telescope', cursive;
font-family: 'Six Caps', sans-serif;
font-family: 'Offside', cursive;
*/
@import url('https://fonts.googleapis.com/css?family=Aclonica|Annie+Use+Your+Telescope|Berkshire+Swash|Itim|Kaushan+Script|Kodchasan|Parisienne|Patrick+Hand|Six+Caps');
#app {
  margin:20px;
  font-family: 'Parisienne', cursive;
}
.ksz {
  font-family: 'Aclonica', sans-serif;
}
div.docs {
  margin: 10px;
  padding: 10px;
  box-shadow: 1px 1px 4px #2e4b8f;
  background-color: antiquewhite;
  border-radius: 12px;
  border: solid 1px brown;
}
.button.is-primary {
  background-color: #2c56b9!important;
  box-shadow: 1px 1px 3px #031133;
}
.button.is-primary:hover {
  background-color: #2e4b8f!important;
  box-shadow: 1px 1px 3px #031133;
}
.input, .button, select {
  font-family: 'Itim', cursive;
}
.input:focus, .select select:focus, .button:focus {
  box-shadow: 1px 1px 3px #1a2a52!important;
  border-color: #345097!important;
}
.li {
  cursor:pointer ;
}
.li:hover {
  box-shadow: 0px 0px 3px black;
}
span.kszg {
  margin: 8px;
  padding:4px;
  cursor: pointer;
}
span.kszg:hover {
  text-shadow: 1px 1px 3px black;
}
span.nowrap {
  white-space: nowrap;
}
.red {
  color:red;
}
</style>
