import yo from './yofetch'
import axios from 'redaxios'

axios.get<{
  name: string
}>('/get').then(res => {
  console.log(res)
})

// yo.get('/get').then(r => {
//   console.log(r)
// })
