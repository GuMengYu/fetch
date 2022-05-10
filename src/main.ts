import yo from './yofetch'
// import axios from 'redaxios'

interface personalized {
  category: number;
  code: number;
  result: [];
  hasTaste: boolean
}
yo.post<personalized>('/api/personalized', null, { params: { timestramp: +new Date().getTime() }}).then(({ data }) => {
  const { result } = data
  console.log(result)
})

// yo.get('/get').then(r => {
//   console.log(r)
// })
