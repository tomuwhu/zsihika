<template>
  <div id="app">
    <br>
    <h1 class="eh">Archívum - kulcsszavazás</h1>
    <br>
    <br>
    <div class="columns">
      <div class="column">
        <b-input  placeholder="Dokumentum keresésée"
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
    {{adocs}}
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
#app {
  margin:20px;
}
h1.eh {
   font-size: 40px;
   text-align: center;
   font-family: 'Offside', cursive;
   text-shadow: 1px 1px 4px #0038b8;
   color: #0038b8;
}
</style>
