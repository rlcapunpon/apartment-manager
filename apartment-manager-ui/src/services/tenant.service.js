import { authHeader } from '../helpers'

export const tenantService = {
  add,
  getAll,
  getByApartment,
  changeStatus,
  // update,
  delete: _delete
}

const apiUrl = 'http://localhost:4000'

function add (tenant) {
  console.log('adding tenant')
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(tenant)
  }
  return fetch(`${apiUrl}/tenant/add`, requestOptions).then(handleResponse)
}

function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  console.log('fetching all tenants from server')
  return fetch(`${apiUrl}/tenant`, requestOptions).then(handleResponse)
}

function getByApartment (apartmentId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  console.log('fetching all tenants from server')
  return fetch(`${apiUrl}/tenant/apartment/${apartmentId}`, requestOptions).then(handleResponse)
}

function changeStatus (id) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/tenant/status/${id}`, requestOptions).then(handleResponse)
}

function _delete (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/tenant/${id}`, requestOptions).then(handleResponse)
}

function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    console.log('request finished.')
    return data
  })
}
