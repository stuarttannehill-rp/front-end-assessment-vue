<template>
<div>
  <div class="table-actions">
    <button class="refresh" type="button">Refresh</button>
    <p class="notification">Updated</p>
    <form class="filters">
      <label class="custom-checkbox">
        <input type="checkbox" value="launch_success">Land Success
        <span class="checkmark"></span>
        </label>
        <label class="custom-checkbox">
          <input type="checkbox" value="reused">Reused
          <span class="checkmark"></span>
          </label>
          <label class="custom-checkbox">
            <input type="checkbox" value="reddit">With Reddit
            <span class="checkmark"></span>
            </label>
            </form>
            <p class="showing">{{this.results.length}} launches</p>
            </div>
    <table class="launch-table">
        <thead>
          <th>Badge</th>
          <th>Rocket Name</th>
          <th>Rocket Type</th>
          <th class="launch-date" :class="sortorder" @click="sorter">Launch Date</th>
          <th>Details</th>
          <th>ID</th>
          <th>Article</th>
        </thead>
        <tbody v-for="(result, key) in results" :key="key">
          <tr>
            <td class="badge"><img :src="result.links.mission_patch"></td>
            <td>{{result.rocket.rocket_name}}</td>
            <td>{{result.rocket.rocket_type}}</td>
            <td class="launch-date">{{result.launch_date_local | formatDate}}</td>
            <td class="details">{{result.details | trimString}}<span v-if="result.details" class="tooltip">{{result.details}}</span></td>
            <td>{{result.flight_number}}</td>
            <td class="article"><a v-if="result.links.article_link" class="link" :href="result.links.article_link"></a></td>
          </tr>
        </tbody>
    </table>
  <div class="rocket"></div>
</div>
</template>

<script>
import axios from 'axios'
import orderBy from 'lodash/orderBy'

export default {
  name: 'Launches',
  data () {
    return {
      results: [],
      error: [],
      sortorder: 'asc'
    }
  },
  methods: {
    sorter: function (input) {
      if (input.target.classList.contains('desc')) {
        this.results = orderBy(this.results, 'launch_date_unix', 'asc')
        this.sortorder = 'asc'
      } else {
        this.results = orderBy(this.results, 'launch_date_unix', 'desc')
        this.sortorder = 'desc'
      }

      return this.results
    }
  },
  created () {
    axios.get('https://api.spacexdata.com/v2/launches')
      .then(res => {
        this.results = res.data
        console.log('data says: ', this.results)
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../assets/scss/_launches.scss'
</style>
