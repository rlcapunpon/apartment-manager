import Vue from 'vue'
import Vuex from 'vuex'

import { alert } from './alert.module'
import { account } from './account.module'
import { users } from './users.module'
import { apartments } from './apartment.module'
import { tenants } from './tenant.module'
import { bills } from './bills.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    alert,
    account,
    users,
    apartments,
    tenants,
    bills
  }
})
