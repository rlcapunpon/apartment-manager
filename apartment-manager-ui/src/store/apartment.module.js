import { apartmentService } from '../services'
import { router } from '../router/index'

const state = {
  all: {}, status: {}
}

const actions = {
  addApartment ({ dispatch, commit }, apartment) {
    commit('addRequest', apartment)
    apartmentService.add(apartment)
      .then(
        apartment => {
          commit('addSuccess', apartment)
          router.push('/')
          setTimeout(() => {
            // display success message after route change completes
            dispatch('alert/success', 'Apartment Addition successful', { root: true })
          })
        },
        error => {
          console.log(error)
          commit('addFailure', 'Addition Failure.')
          dispatch('alert/error', 'Addition Failure.', { root: true })
        }
      )
  },
  getAll ({ commit }) {
    commit('getAllRequest')

    apartmentService.getAll()
      .then(
        apartments => commit('getAllSuccess', apartments),
        error => commit('getAllFailure', error.toString())
      )
  },
  changeStatus ({ commit }, id) {
    commit('changeStatusRequest')
    apartmentService.changeStatus(id)
      .then(
        apartment => commit('changeStatusSuccess', { id, apartment }),
        error => commit('changeStatusFailure', { id, error: error.toString() })
      )
  },
  delete ({ commit }, id) {
    commit('deleteRequest', id)
    router.push('/')
    apartmentService.delete(id)
      .then(
        user => commit('deleteSuccess', id),
        error => commit('deleteSuccess', { id, error: error.toString() })
      )
  }
}

const mutations = {
  addRequest (state, apartment) {
    state.status = { registering: true }
  },
  addSuccess (state, apartment) {
    state.status = {}
  },
  addFailure (state, error) {
    state.status = {}
  },
  getAllRequest (state) {
    console.log('mutation for get apartment request committed.')
    state.all = { loading: true }
  },
  getAllSuccess (state, apartments) {
    console.log('mutation for get apartment success committed.')
    state.all = { items: apartments }
  },
  getAllFailure (state, error) {
    console.log('mutation for get apartment failure committed.')
    state.all = { error }
  },
  changeStatusRequest (state, id) {
    console.log('mutation for change status request committed.')
    state.all.items = state.all.items.map(apartment =>
      apartment.id === id
        ? { ...apartment, updating: true }
        : apartment
    )
  },
  changeStatusSuccess (state, id, update) {
    console.log('mutation for change status success committed.')
    state.all.items = state.all.items.map(apartment =>
      apartment.id === id
        ? update
        : apartment
    )
  },
  changeStatusFailure (state, { id, error }) {
    console.log('mutation for change status failure committed.')
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(apartment => {
      if (apartment.id === id) {
        // make copy of user without 'deleting:true' property
        const { updating, ...apartmentCopy } = apartment
        // return copy of user with 'deleteError:[error]' property
        return { ...apartmentCopy, statusUpdate: error }
      }

      return apartment
    })
  },
  deleteRequest (state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map(apartment =>
      apartment.id === id
        ? { ...apartment, deleting: true }
        : apartment
    )
  },
  deleteSuccess (state, id) {
    console.log('delete successful')
    // remove deleted user from state
    state.all.items = state.all.items.filter(apartment => apartment.id !== id)
  },
  deleteFailure (state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(apartment => {
      if (apartment.id === id) {
        // make copy of user without 'deleting:true' property
        const { deleting, ...apartmentCopy } = apartment
        // return copy of user with 'deleteError:[error]' property
        return { ...apartmentCopy, deleteError: error }
      }

      return apartment
    })
  }
}

export const apartments = {
  namespaced: true,
  state,
  actions,
  mutations
}
