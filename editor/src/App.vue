<template>
  <div id="app">
    <br>
    <h1 class="eh">Archívum - kulcsszavazás</h1>
    <b-select placeholder="Select a name">
                <option
                    v-for="option in docs"
                    :value="option.did"
                    :key="option.did">
                    {{ option.user.first_name }}
                </option>
            </b-select>
  </div>
</template>

<script>
let backend="http://localhost:3000"
export default {
  name: 'app',
  data: () => ({
    docs: []
  }),
  mounted() {
    this.axios
        .get(`${ backend }/docs`)
        .then( resp => {
          this.docs = resp.data
        })
  },
  computed: {
    szd() {
      return this .docs
                  //.filter( v => )
    }
  }
}
</script>

<style>
#app {
  
}
h1.eh {
   font-size: 40px;
   text-align: center;
   font-family: 'Offside', cursive;
   text-shadow: 1px 1px 4px #0038b8;
   color: #0038b8;
}
</style>
