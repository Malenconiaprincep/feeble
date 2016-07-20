import test from 'ava'
import model from 'model'

const counter = model({
  namespace: 'counter',
  state: 0,
})

test('create model', t => {
  t.is(counter.getNamespace(), 'counter')
})

test('create action creator', t => {
  const increment = counter.action('increment')

  t.deepEqual(increment(), { type: 'counter::increment' })
})

test('create reducer', t => {
  const reducer = counter.reducer(on => {
    on('counter::increment', state => state + 1)
  })

  t.is(counter.getReducer(), reducer)
  t.is(reducer(undefined, { type: 'counter::increment' }), 1)
})
