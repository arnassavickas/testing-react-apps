// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {renderHook, act} from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

const Component = () => {
  const {count, increment, decrement} = useCounter()
  return (
    <>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
      <div>count:{count}</div>
    </>
  )
}

test('hook works as expected', () => {
  const {result} = renderHook(useCounter)
  console.log(result)

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(1)

  act(() => {
    result.current.decrement()
    result.current.decrement()
  })

  expect(result.current.count).toBe(-1)
})
/* eslint no-unused-vars:0 */
it('allows customization of the initial count', () => {
  const {result} = renderHook(useCounter, {initialProps: {initialCount: 10}})

  expect(result.current.count).toBe(10)
})

it('allows customization of the step', () => {
  const {result} = renderHook(useCounter, {initialProps: {step: 50}})

  expect(result.current.count).toBe(0)

  act(() => {
    result.current.increment()
  })

  expect(result.current.count).toBe(50)

  act(() => {
    result.current.decrement()
    result.current.decrement()
  })

  expect(result.current.count).toBe(-50)
})
