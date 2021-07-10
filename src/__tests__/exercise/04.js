// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from 'faker'
import {build, fake} from '@jackfranklin/test-data-bot'

const userBuilder = optionalData => {
  const userData = build('User', {
    fields: {
      username: fake(f => f.internet.userName()),
      password: fake(f => f.internet.password()),
      ...optionalData,
    },
  })
  return userData()
}

test('submitting the form calls onSubmit with username and password', () => {
  const handleSubmit = jest.fn()

  render(<Login onSubmit={handleSubmit} />)

  const usernameInput = screen.getByLabelText(/username/i)
  const passwordInput = screen.getByLabelText(/password/i)

  const {username, password} = userBuilder({password: 'abc'})

  const inputData = {
    username,
    password,
  }

  userEvent.type(usernameInput, inputData.username)
  userEvent.type(passwordInput, inputData.password)
  userEvent.click(screen.getByText(/submit/i))

  expect(handleSubmit).toHaveBeenCalledWith(inputData)
})

/*
eslint
  no-unused-vars: "off",
*/
