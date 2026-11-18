/**
 * Open/closed state for a disclosure such as the mobile menu. It closes on
 * Escape (returning focus to the toggle), on every route change, including
 * a jump to an anchor on the same page, and when `closeQuery` starts to
 * match, e.g. when the viewport grows past the breakpoint that hides it.
 *
 * Listeners are only added in the browser and are removed on unmount.
 *
 * @param closeQuery Media query that closes the disclosure when it matches.
 */
export function useDisclosure(closeQuery: string) {
  const open = ref(false);
  const toggle = ref<HTMLElement | null>(null);
  const route = useRoute();

  function close(returnFocus = false) {
    open.value = false;
    if (returnFocus) {
      toggle.value?.focus();
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (open.value && event.key === 'Escape') {
      close(true);
    }
  }

  function onQueryChange(event: MediaQueryListEvent) {
    if (event.matches) {
      close();
    }
  }

  watch(() => route.fullPath, () => close());

  let query: MediaQueryList | undefined;

  onMounted(() => {
    query = window.matchMedia(closeQuery);
    query.addEventListener('change', onQueryChange);
    document.addEventListener('keydown', onKeydown);
  });

  onBeforeUnmount(() => {
    query?.removeEventListener('change', onQueryChange);
    document.removeEventListener('keydown', onKeydown);
  });

  return {
    open,
    toggle,
    close
  };
}
