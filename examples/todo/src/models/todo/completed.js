import tuku from 'tuku'
import { delay, takeEvery } from 'tuku/saga'
import { fork, call, put } from 'tuku/saga/effects'
import entity from '../entity'
import schemas from '../../schemas'
import without from 'lodash/without'

const model = tuku.model({
  namespace: 'todo::completed',
  state: {
    ids: [],
  },
})

model.apiAction('fetch', () => ({
  method: 'get',
  endpoint: '/todos/completed',
  schema: schemas.TODO_ARRAY,
}))

model.apiAction('uncomplete', todo => ({
  method: 'put',
  endpoint: `/todos/${todo.id}`,
  body: { ...todo, completed: false },
  schema: schemas.TODO,
}))

model.action('remove')

model.reducer(on => {
  on(model.fetch.success, (state, payload) => ({
    ids: payload.result,
  }))

  on(model.remove, (state, payload) => ({
    ids: without(state.ids, payload),
  }))
})

const uncomplete = function* () {
  yield* takeEvery(model.uncomplete.request, function* ({ payload }) {
    yield put(entity.update('todo', payload.body.id, payload.body))
    yield put(model.remove(payload.body.id))
  })
}

model.effect(function* () {
  yield [
    fork(uncomplete),
  ]
})

export default model