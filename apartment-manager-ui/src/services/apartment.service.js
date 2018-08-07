import { authHeader } from '../helpers'

export const apartmentService = {
  // login,
  // logout,
  add,
  getAll,
  changeStatus,
  // update,
  delete: _delete
}

const apiUrl = 'http://localhost:4000'

function add (apartment) {
  console.log('adding apartment')
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(apartment)
  }
  return fetch(`${apiUrl}/apartment/add`, requestOptions).then(handleResponse)
}

function getAll () {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  }
  console.log('fetching all apartments from server')
  return fetch(`${apiUrl}/apartment`, requestOptions).then(handleResponse)
}

function changeStatus (id) {
  const requestOptions = {
    method: 'PUT',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/apartment/status/${id}`, requestOptions).then(handleResponse)
}

function _delete (id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader()
  }

  return fetch(`${apiUrl}/apartment/${id}`, requestOptions).then(handleResponse)
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
