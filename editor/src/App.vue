<template>
  <div id="app">
    <h1 class="eh">Szegedi Zsidó Archívum - Kulcsszavazó</h1>
    <br>
    <br>
    <div class="columns">
      <div class="column">
        <b-input  placeholder="Dokumentum keresése"
                  type="search"
                  icon-pack="fas"
                  icon="search"
                  v-model="dk"
                  @keyup.native.enter="wd()">
        </b-input>
      </div>
      <div class="column">
      <b-select 
            placeholder="Dokumentum kiválasztása" 
            v-model="seld"
            v-if="szd.length>1">
        <option
            v-for="option in szd"
            :value="option.did"
            :key="option.did">
            {{ option.dname }}
        </option>
      </b-select>
      <button class="button" 
              @click="setad(szd[0])"
              v-if="szd.length===1">
          {{ szd[0].dname }}
          </button>
      </div>
      <div class="column" style="text-align:right;">
        <span v-if="szd.length===1"> 
          &nbsp; 
          <button class="button is-primary" 
                  @click="adocs=szd[0]">Szerkeszt</button>
        </span>  
      </div>
    </div>
    <hr>
    <span v-if="adocs.dname">
      <button class="button">
        {{adocs.dname}}
      </button> &nbsp;
      <span :key="oldal" 
              v-for="oldal in Array(adocs.osz).fill().map( (v,k) => k+1 )">
      <button class="button is-primary">
        {{oldal}}. oldal
      </button> &nbsp;
      </span>
    </span>
  </div>
</template>

<script>
let backend="http://localhost:3000"
export default {
  name: 'app',
  data: () => ({
    docs: [{did:0}],
    adocs: {did:0},
    dk: ''
  }),
  methods: {
    wd() {
      if (this.szd.length===1) {
        this.adocs=this.szd[0]
        this.loadall()
      }
    },
    setad(doc) {
      this.adocs=doc
      this.loadall()
    },
    loadall() {
      this.dk=''
    }
  },
  mounted() {
    this.axios
        .get(`${ backend }/docs`)
        .then( resp => {
          this.docs = resp.data
        })
  },
  computed: {
    seld: {
      get() {
        return this.adocs.did
      },
      set(nw) {
        this.adocs = this.docs.find( v => v.did === nw )
        this.loadall()
      }
    },
    szd() {
      return this .docs
                  .filter( v => {
                    let ulv = true
                    this.dk.split(' ').forEach( u => {
                      if ( !RegExp(u,'i').test(v.dname) )  ulv = false
                    }) 
                    return ulv
                  })
                  .slice(0,20)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Aclonica|Annie+Use+Your+Telescope|Berkshire+Swash|Itim|Kaushan+Script|Kodchasan|Offside|Parisienne|Patrick+Hand|Six+Caps');
#app {
  margin:20px;
}
.button.is-primary {
  background-color: #2c56b9!important;
  box-shadow: 1px 1px 3px #031133;
}
.button.is-primary:hover {
  background-color: #2e4b8f!important;
  box-shadow: 0px 0px 3px #031133;
}
.button.is-primary:focus {
  background-color: #455d8f!important;
  box-shadow: -1px -1px 3px #031133;
}
.button.is-primary:active {
  background-color: #491812!important;
  box-shadow: 0px 0px 1px #773d35;
}
.input:focus, .select select:focus, .button:focus {
  box-shadow: 1px 1px 3px #1a2a52!important;
  border-color: #345097!important;
}
.input, .button, select {
  font-family: 'Itim', cursive;
}
h1.eh {
   font-size: 35px;
   text-align: center;
   font-family: 'Offside', cursive;
   text-shadow: 1px 1px 4px #0038b8;
   color: #0038b8;
}
</style>
