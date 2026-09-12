import {
  useEffect,
} from 'react'

import type {
  RefObject,
} from 'react'

type UseDialogFocusOptions = {
  rootRef: RefObject<HTMLElement | null>
  initialFocusRef: RefObject<HTMLElement | null>
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function focusWithoutScroll(
  element: HTMLElement,
) {
  element.focus({
    preventScroll: true,
  })
}

function getFocusableElements(
  root: HTMLElement,
) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      focusableSelector,
    ),
  ).filter(
    (element) =>
      element.getClientRects().length > 0,
  )
}

function useDialogFocus({
  rootRef,
  initialFocusRef,
}: UseDialogFocusOptions) {
  useEffect(() => {
    const root =
      rootRef.current

    if (!root) return

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

    const initialFocus =
      initialFocusRef.current

    if (initialFocus) {
      focusWithoutScroll(initialFocus)
    } else {
      focusWithoutScroll(root)
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== 'Tab') return

      const focusableElements =
        getFocusableElements(root)

      if (focusableElements.length === 0) {
        event.preventDefault()
        focusWithoutScroll(root)
        return
      }

      const firstElement =
        focusableElements[0]

      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ]

      const activeElement =
        document.activeElement

      if (
        event.shiftKey &&
        (activeElement === firstElement ||
          activeElement === root ||
          !root.contains(activeElement))
      ) {
        event.preventDefault()
        focusWithoutScroll(lastElement)
      }

      if (
        !event.shiftKey &&
        (activeElement === lastElement ||
          activeElement === root ||
          !root.contains(activeElement))
      ) {
        event.preventDefault()
        focusWithoutScroll(firstElement)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )

      if (
        previouslyFocusedElement?.isConnected
      ) {
        focusWithoutScroll(
          previouslyFocusedElement,
        )
      }
    }
  }, [
    initialFocusRef,
    rootRef,
  ])
}

export default useDialogFocus
