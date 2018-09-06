import { tenantService } from '../services'
import { router } from '../router/index'

const state = {
  all: {}, status: {}
}

const actions = {
  addTenant ({ dispatch, commit }, tenant) {
    commit('addRequest', tenant)
    tenantService.add(tenant)
      .then(
        tenant => {
          commit('addSuccess', tenant)
          setTimeout(() => {
            // display success message after route change completes
            dispatch('alert/success', 'Tenant Addition successful', { root: true })
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

    tenantService.getAll()
      .then(
        tenants => commit('getAllSuccess', tenants),
        error => commit('getAllFailure', error.toString())
      )
  },
  getByApartmentId ({ commit }, apartmentId) {
    commit('getByApartmentRequest')

    tenantService.getByApartment(apartmentId)
      .then(
        tenants => commit('getByApartmentSuccess', tenants),
        error => commit('getByApartmentFailure', error.toString())
      )
  },
  changeStatus ({ commit }, id) {
    commit('changeStatusRequest')
    tenantService.changeStatus(id)
      .then(
        tenant => commit('changeStatusSuccess', { id, tenant }),
        error => commit('changeStatusFailure', { id, error: error.toString() })
      )
  },
  delete ({ commit }, id) {
    commit('deleteRequest', id)
    router.push('/')
    tenantService.delete(id)
      .then(
        tenant => commit('deleteSuccess', id),
        error => commit('deleteSuccess', { id, error: error.toString() })
      )
  }
}

const mutations = {
  addRequest (state, tenant) {
    state.status = { registering: true }
  },
  addSuccess (state, tenant) {
    state.status = {}
  },
  addFailure (state, error) {
    state.status = {}
  },
  getAllRequest (state) {
    console.log('mutation for get tenant request committed.')
    state.all = { loading: true }
  },
  getAllSuccess (state, tenants) {
    console.log('mutation for get tenant success committed.')
    state.all = { items: tenants }
  },
  getAllFailure (state, error) {
    console.log('mutation for get tenant failure committed.')
    state.all = { error }
  },
  getByApartmentRequest (state) {
    console.log('mutation for get tenant request committed.')
    state.all = { loading: true }
  },
  getByApartmentSuccess (state, tenants) {
    console.log('mutation for get tenant success committed.')
    state.all = { items: tenants }
  },
  getByApartmentFailure (state, error) {
    console.log('mutation for get tenant failure committed.')
    state.all = { error }
  },
  changeStatusRequest (state, id) {
    console.log('mutation for change status request committed.')
    state.all.items = state.all.items.map(tenant =>
      tenant.id === id
        ? { ...tenant, updating: true }
        : tenant
    )
  },
  changeStatusSuccess (state, id, update) {
    console.log('mutation for change status success committed.')
    state.all.items = state.all.items.map(tenant =>
      tenant.id === id
        ? update
        : tenant
    )
  },
  changeStatusFailure (state, { id, error }) {
    console.log('mutation for change status failure committed.')
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(tenant => {
      if (tenant.id === id) {
        // make copy of user without 'deleting:true' property
        const { updating, ...tenantCopy } = tenant
        // return copy of user with 'deleteError:[error]' property
        return { ...tenantCopy, statusUpdate: error }
      }

      return tenant
    })
  },
  deleteRequest (state, id) {
    // add 'deleting:true' property to user being deleted
    state.all.items = state.all.items.map(tenant =>
      tenant.id === id
        ? { ...tenant, deleting: true }
        : tenant
    )
  },
  deleteSuccess (state, id) {
    console.log('delete successful')
    // remove deleted user from state
    state.all.items = state.all.items.filter(tenant => tenant.id !== id)
  },
  deleteFailure (state, { id, error }) {
    // remove 'deleting:true' property and add 'deleteError:[error]' property to user
    state.all.items = state.items.map(tenant => {
      if (tenant.id === id) {
        // make copy of user without 'deleting:true' property
        const { deleting, ...tenantCopy } = tenant
        // return copy of user with 'deleteError:[error]' property
        return { ...tenantCopy, deleteError: error }
      }

      return tenant
    })
  }
}

export const tenants = {
  namespaced: true,
  state,
  actions,
  mutations
}
