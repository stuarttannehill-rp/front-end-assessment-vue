import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY')
  }
})

Vue.filter('trimString', function (value) {
  if (value && value.length > 30) {
    value = value.substring(0, 30) + '...'
  }

  return value
})
