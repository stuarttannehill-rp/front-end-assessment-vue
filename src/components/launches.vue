<template>
<div>
  <div class='table-actions'>
    <button class='refresh' type='button'>Refresh</button>
    <p class='notification'>Updated</p>
    <form class='filters'>
      <label class='custom-checkbox' v-for='(list, key) in this.filterOptions' :key='key'>
        <input v-on:change='updateFilters($event, list)' type='checkbox' :value=list.value>{{list.name}}
        <span class='checkmark'></span>
      </label>
      <!-- <label class='custom-checkbox'>
        <input v-on:change='filterSuccess = filterSuccess === false ? true : false' type='checkbox' value='launch_success'>Land Success
        <span class='checkmark'></span>
      </label>
      <label class='custom-checkbox'>
        <input v-on:change='filterReuse = filterReuse === false ? true : false' type='checkbox' value='reused'>Reused
        <span class='checkmark'></span>
      </label>
      <label class='custom-checkbox'>
        <input type='checkbox' value='reddit'>With Reddit
        <span class='checkmark'></span>
      </label>
      <label class='custom-checkbox'>
        <input v-on:change='filterTesla = filterTesla === false ? true : false' type='checkbox' value='launch_tesla'>Can haz Tesla?
        <span class='checkmark'></span>
      </label> -->
    </form>
    <p class='showing'>{{filteredLaunches.length}} launch<span v-if='filteredLaunches.length >= 2'>es</span> of {{this.results.length}}</p>
  </div>
  <div class='loading' v-if='isLoading'>
    <img src='../assets/images/loading-rocket.png' >
    <h2>...Loading</h2>
    </div>
  <table v-else class='launch-table'>
      <thead>
        <th>Badge</th>
        <th>Rocket Name</th>
        <th>Rocket Type</th>
        <th class='launch-date' :class='sortorder' @click='sorter'>Launch Date</th>
        <th>Details</th>
        <th>ID</th>
        <th>Article</th>
      </thead>
      <tbody v-for='(result, key) in filteredLaunches' :key='key'>
        <tr>
          <td class='badge'><img :src='result.links.mission_patch'></td>
          <td>{{result.rocket.rocket_name}}</td>
          <td>{{result.rocket.rocket_type}}</td>
          <td class='launch-date'>{{result.launch_date_local | formatDate}}</td>
          <td class='details'>{{result.details | trimString}}<span v-if='result.details' class='tooltip'>{{result.details}}</span></td>
          <td>{{result.flight_number}}</td>
          <td class='article'><a v-if='result.links.article_link' class='link' :href='result.links.article_link'></a></td>
        </tr>
      </tbody>
  </table>
  <div class='rocket'></div>
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
      sortorder: 'asc',
      isLoading: true,
      checkedFilters: [],
      filterOptions: [
        {
          name: 'Land Success',
          value: 'launch_success'
        },
        {
          name: 'Reused',
          value: 'reused'
        },
        {
          name: 'With Reddit',
          value: 'reddit'
        }
      ]
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
    },
    updateFilters (event, option) {
      if (event.target.checked) {
        this.checkedFilters.push(option.value)
      } else {
        this.filterOptions.forEach((item, index) => {
          if (this.checkedFilters[index] === option.value) {
            this.checkedFilters.splice(index, 1)
          }
        })
      }
    }
  },
  computed: {
    filteredLaunches () {
      if (this.checkedFilters.length) {
        return this.results.filter(launch => {
          let matches = []

          for (let filter of this.checkedFilters) {
            if (filter === 'launch_success') {
              if (launch.launch_success) {
                matches.push(true)
              }
            }

            if (filter === 'reused') {
              if (Object.values(launch.reuse).includes(true)) {
                matches.push(true)
              }
            }

            if (filter === 'reddit') {
              // convert links object keys into an array
              const links = Object.keys(launch.links)
              let match

              // set match to true if launch has at least one reddit link prop that isn't null
              for (let link of links) {
                if (link.search(/reddit/i) === 0) {
                  if (launch.links[link] != null) {
                    match = true
                  }
                }
              }

              if (match) {
                matches.push(true)
              }
            }
          }

          return matches.length === this.checkedFilters.length
        })
      } else {
        return this.results
      }
    }
  },
  created () {
    axios
      .get('https://api.spacexdata.com/v2/launches')
      .then(res => {
        this.results = res.data
        this.isLoading = false
      })
      .catch(e => {
        this.isLoading = false
        this.errors.push(e)
      })
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='scss' scoped>
@import '../assets/scss/_launches.scss'
</style>
