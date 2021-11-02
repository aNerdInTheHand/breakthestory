/**
 * @jest-environment jsdom
 */

import Prestart from '../src/Prestart.svelte'
import { render, fireEvent } from '@testing-library/svelte'

it('works', async () => {
  const { getByTestId } = render(Prestart)

  const title = getByTestId('prestart-title')

  // await fireEvent.click(increment)
  // await fireEvent.click(increment)
  // await fireEvent.click(increment)
  // await fireEvent.click(decrement)

  expect(title.textContent).toBe('Break The Story')

  // with jest-dom
  // expect(title).toHaveTextContent('Break The Story')
})