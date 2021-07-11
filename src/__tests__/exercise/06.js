// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {
  render,
  screen,
  act,
  waitForElementToBeRemoved,
  queryByLabelText,
} from '@testing-library/react'
import Location from '../../examples/location'
import {fake} from '@jackfranklin/test-data-bot'

import {useCurrentPosition} from 'react-use-geolocation'

jest.mock('react-use-geolocation')

const fakePosition = {
  coords: {
    latitude: 10,
    longitude: 1000,
  },
}

let setReturnValue

beforeEach(() => {
  const useMockCurrentPosition = () => {
    const state = React.useState([])
    setReturnValue = state[1]
    return state[0]
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition)
})

test('displays the users current location', async () => {
  render(<Location />)

  expect(screen.queryByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([fakePosition])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays error message when useGeolocation fails', () => {
  render(<Location />)

  expect(screen.queryByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue([null, {message: 'uh no'}])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(`"uh no"`)
})

/*
    eslint
    no-unused-vars: "off",
    */
