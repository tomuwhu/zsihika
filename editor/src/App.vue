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
            v-if="szd.length>1"
            @change.native="sc(1)">
        <option selected></option>
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
      <span class="columns">
        <div class="column">
          <button class="button" @click="newdocname=newdocname?'':adocs.dname.split('_').map((v,i)=>i===6?Number(v)+1:v).join('_')">
            {{adocs.dname}}
          </button> &nbsp;
          <span v-if="adocs.osz>1">
            <span :key="oldal" 
                  v-for="oldal in Array(adocs.osz).fill().map( (v,k) => k+1 )">
              <button class="button is-primary" @click="sc(aold===oldal?false:aold=oldal)">
                {{oldal}}. oldal
              </button> &nbsp;
            </span>
          </span>
          <button class="button is-danger" @click="oldalha()" title="Új oldal">
              +
          </button> &nbsp;
        </div>
          <div class="column" v-if="newdocname">
            Új dokumentum: <b-input type="text" v-model="newdocname" /><br>
            Oldalszám: <b-input type="number" v-model="ndosz" /><br>
            <button class="button is-danger" @click="newdoc()">Létrehoz</button> &nbsp;
            <button class="button" @click="newdocname=''">Mégse</button>
          </div>
      </span>
      <hr>
      <div>
        <div class="columns">
          <div class="column is-narrow">
            <div class="box" style="width: 400px;">
              <b-input placeholder="Kulcsszó hozzáadása"
                        type="search"
                        icon-pack="fas"
                        icon="search"
                        v-model="kk"
                        @keyup.native.enter="addk()">
              </b-input>
              <br>
              <div v-if="kk && !kl.filter( v => RegExp(kk,'i').test(v.kulcsszo) ).length" style="text-align:center;">
                <b>Kulcsszó felvétele mint új:</b>
                <br><br>
                <span v-if="!Number(kk) && kk[0].toUpperCase()===kk[0] && kk.length>2">
                <button @click="uksz('név')" class="button uksz">név</button>&nbsp;</span>
                <span v-if="Number(kk)>1800 && Number(kk)<=2020">
                <button @click="uksz('év')" class="button uksz">év</button>&nbsp;</span>
                <button @click="uksz('törzsszám')" class="button uksz">törzsszám</button>&nbsp;
                <span v-if="!Number(kk) && kk[0].toUpperCase()===kk[0] && kk.length>2">
                <button @click="uksz('helység')" class="button uksz">helység</button>&nbsp;</span>
                <button @click="uksz('')" class="button uksz">.nd.</button>&nbsp;
              </div>
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
              <p class="title is-5">
                {{adocs.dname}}<span v-if="adocs.osz>1" class="red">, {{aold}}. oldal</span> kulcsszavai:
              </p>
              <button 
                    v-if="aold===adocs.osz && !kivk.length" 
                    class="button is-danger"
                    @click="oldaltorl()">Oldal törlése</button>
              <span :key="kszo.id" 
                    v-for="kszo in kivk"
                    class="kszg"
                    @click="delksz(kszo.id)">
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

    </span>
  </div>
</template>

<script>
document.title="Kulcsszavazó"
let backend="http://www.inf.u-szeged.hu/u/tnemeth/"
//let backend="http://localhost:3000"
let backend=":3000/"
export default {
  name: 'app',
  data: () => ({
    docs: [{did:0}],
    kk: '',
    kivk: [],
    kl: [],
    adocs: {did:0},
    aold: 1,
    dk: '',
    newdocname: '',
    ndosz: 1
  }),
  methods: {
    uksz(type) {
      this.axios
          .post(`${ backend }/ujksz`, { kulcsszo: this.kk, ktip: type }  )
          .then( resp => {  
            let ujkszo = { id: resp.data.insertedId, kulcsszo: this.kk, ktip: type }   
            this.addksz( ujkszo )
          })
    },
    oldaltorl() {
      this.axios
          .post(`${ backend }/removeujold`, this.adocs  )
          .then( resp => {     
            this.sc(this.aold=--this.adocs.osz)
          })
    },
    oldalha() {
      this.axios
          .post(`${ backend }/addujold`, this.adocs  )
          .then( resp => {
            this.aold=++this.adocs.osz
            this.kivk=[]
          })
    },
    newdoc() {
      let year=this.newdocname.split('_')[5]
      this.axios
          .post(`${ backend }/newdoc`, {dname: this.newdocname, osz: this.ndosz, year })
          .then( resp => {
            this.docs.push({ did: resp.body.insertedId, dname: this.newdocname, osz: this.ndosz, year })
            this.newdocname=''
          })
    },
    delksz(kszid) {
      this.axios
          .post(`${ backend }/delksz`, {docs: this.adocs.did, osz: this.aold, ksz: kszid })
          .then( resp => {
            this.kivk = this.kivk.filter(v => v.id!==kszid)
            this.kivk = this.kivk.sort( (a,b) => (a.kulcsszo.localeCompare(b.kulcsszo)) )
            this.kk=''
          })
    },
    sc(x) {
      if (x) {
        this.axios
          .post(`${ backend }/kszl`, {docs: this.adocs.did, osz: x})
          .then( resp => {
            this.kivk = resp.data.sort( (a,b) => (a.kulcsszo.localeCompare(b.kulcsszo)) )
            this.aold = x
          })
      }
    },
    addk() {
      if (this.klsz.length===1) {
        this.addksz(this.klsz[0])
      }
    },
    addksz(kszo) {
      this.axios
          .post(`${ backend }/addksz`, {docs: this.adocs.did, osz: this.aold, ksz: kszo.id })
          .then( resp => {
            this.kivk
                .filter( v => 
                  v.id===kszo.id 
                )
                .length ? 1 : this.kivk.push(kszo)
            this.kivk = this.kivk.sort( (a,b) => (a.kulcsszo.localeCompare(b.kulcsszo)) )
            this.kk=''
          })
    },
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
    this.axios
        .get(`${ backend }/kulcsszavak`)
        .then( resp => {
          this.kl = resp.data
        })
  },
  computed: {
    klsz() {
      let szk = this .kl
                  .filter( v => RegExp(this.kk,'i').test(v.kulcsszo) )
                  .filter( v => !this.kivk.find( q => q.id===v.id ) )
      return  szk.length<10 ? szk : []
    },
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
.ksz {
  font-family: 'Aclonica', sans-serif;
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
.button.uksz {
  background-color: #435283!important;
  box-shadow: 1px 1px 3px #46578f;
  padding:4px;
  color: white;
}
.button.uksz:hover {
  background-color: #bdc97d!important;
  box-shadow: 1px 1px 3px #363b8b;
}
.button.uksz:focus {
  color: white;
}
.button.is-danger {
  background-color: #9e386b!important;
  box-shadow: 1px 1px 3px #a02c40;
}
.button.is-danger:hover {
  background-color: #b469aa!important;
  box-shadow: 0px 0px 3px #8f2a2a;
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
h3.eh {
   font-size: 20px;
   text-align: center;
   font-family: 'Offside', cursive;
   text-shadow: 1px 1px 4px #0038b8;
   color: #0038b8;
}
span.red {
  text-shadow: 1px 1px 4px #b34888;
  color: #b33d3e;
}
</style>
