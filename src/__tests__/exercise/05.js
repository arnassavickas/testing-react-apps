// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import {setupServer} from 'msw/node'
import {rest} from 'msw'
import Login from '../../components/login-submission'
import {handlers} from 'test/server-handlers'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(handlers[0])

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

afterEach(() => {
  server.resetHandlers()
})

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  const loading = screen.getByLabelText(/loading/i)

  await waitForElementToBeRemoved(loading)

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('logging with empty imputs render an error', async () => {
  render(<Login />)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  expect(await screen.findByText(/password required/i)).toBeInTheDocument()
})

test('logging with empty inputs render an error (snapshots)', async () => {
  render(<Login />)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  const loading = screen.getByLabelText(/loading/i)

  await waitForElementToBeRemoved(loading)

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test('renders an error if login server is down', async () => {
  const testErrorMessage = 'error'

  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({message: testErrorMessage}))
      },
    ),
  )

  render(<Login />)

  userEvent.click(screen.getByRole('button', {name: /submit/i}))

  const loading = screen.getByLabelText(/loading/i)

  await waitForElementToBeRemoved(loading)

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})
