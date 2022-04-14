<template>
  <div class="container-fluid">
    <div class="content-section">
      <v-row class="row p-2">
        <v-col>
          <button class="btn btn-primary btn-lg" @click="generate" :disabled="buttonDisabled">Generate</button>
        </v-col>
      </v-row>
      <v-row class="row p-2">
        <v-col class="mt-16" v-if="fileName!==''" style="font-size: 20px">
          Link: <a :href="downloadUrl" download>{{fileName}}</a>
        </v-col>
      </v-row>
      <v-row class="row p-2">
        <v-col>
          <button class="btn btn-success btn-lg" @click="report">Report</button>
        </v-col>
      </v-row>
      <v-row class="row p-2">
        <v-col class="col" style="font-size: 20px" v-if="integers!==0||strings!==0||reals!==0||alphaNumerics!==0">
          <p>Alphabetical string: {{strings}}</p>
          <p class="mt-3">Real numbers: {{reals}}</p>
          <p class="mt-3">Integers: {{integers}}</p>
          <p class="mt-3">Alphanumerics: {{alphaNumerics}}</p>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import GeneratorService from "@/service/GeneratorService";

export default {
  name: 'MainView',
  data() {
    return {
      alphaNumerics: 0,
      strings: 0,
      reals: 0,
      integers: 0,
      fileName: '',
      downloadUrl: '',
      buttonDisabled: false,
    }
  },
  methods: {
    generate(){
      console.log("clicked");
      this.buttonDisabled=true;
      GeneratorService.generate().then(res => {
        this.fileName=res.data.fileName;
        this.downloadUrl=res.data.url;
        this.buttonDisabled=false;
        // console.log(this.fileName);
      });
    },

    report(){
      GeneratorService.report().then(res => {
        var data=res.data;
        // console.log(data);
        this.alphaNumerics=data.alpha;
        this.strings=data.str;
        this.reals=data.real;
        this.integers=data.int;
      });
    }
  },
  mounted() {
    this.buttonDisabled=false
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.content-section {
  margin-top: 100px;
  /*-webkit-box-shadow: 0px 2px 6px -2px rgba(24, 39, 75, 0.12), 0px 4px 8px -4px rgba(24, 39, 75, 0.08);*/
  /*box-shadow: 0px 2px 6px -2px rgba(24, 39, 75, 0.12), 0px 4px 8px -4px rgba(24, 39, 75, 0.08);*/
  /*border-radius: 12px;*/
  background: #fff;
}

</style>
