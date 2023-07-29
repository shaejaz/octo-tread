import { Experimental_CssVarsProvider } from '@mui/material'
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'
import { theme } from '../theme'

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
})

afterEach(() => {
  cleanup()
})

function TestingThemeProvider({ children }: { children: React.ReactNode }) {
  return <Experimental_CssVarsProvider theme={theme}>{children}</Experimental_CssVarsProvider>
}

function Providers({ children }: { children: React.ReactNode }) {
  return <TestingThemeProvider>{children}</TestingThemeProvider>
}

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => <Providers>{children}</Providers>,
    // wrapper: ({ children }) => children,
    ...options,
  })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
