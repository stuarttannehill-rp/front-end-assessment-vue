import Vue from 'vue'
import moment from 'moment'

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
})

Vue.filter('trimString', function (value) {
  if (value && value.length > 50) {
    value = value.substring(0, 50) + '...'
  }

  return value
})
