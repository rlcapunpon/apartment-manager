import { authHeader } from '../helpers'

export const billService = {
  // login,
  // logout,
  add,
  getAll,
  changeStatus,
  getByApartment,
  // update,
  delete: _delete
}

const apiUrl = 'http://localhost:4000'

function add (bill) {
  console.log('adding bill')
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(bill)
  }
  return fetch(`${apiUrl}/bills/add`, requestOptions).then(handleResponse)
}

function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  console.log('fetching all bills from server')
  return fetch(`${apiUrl}/bills`, requestOptions).then(handleResponse)
}

function getByApartment (apartmentId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  console.log('fetching all bills for apartment' + apartmentId + ' from server')
  return fetch(`${apiUrl}/bills/apartment/${apartmentId}`, requestOptions).then(handleResponse)
}

function changeStatus (id) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/bills/status/${id}`, requestOptions).then(handleResponse)
}

function _delete (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/bills/${id}`, requestOptions).then(handleResponse)
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
