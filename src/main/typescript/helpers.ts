/**
 * Find the first parent of the given element, that matches the given selector.
 */
export function parent(
  element: HTMLElement,
  parentSelector: string
): HTMLElement | null {
  for (
    let target: ParentNode | null = element;
    target instanceof HTMLElement;
    target = target.parentNode
  ) {
    if (target.matches(parentSelector)) {
      return target;
    }
  }
  return null;
}

/** Find the parents of the given element, that match the given selector. */
export function parents(
  element: HTMLElement,
  parentSelector: string
): HTMLElement[] {
  const parents = [];
  for (
    let target: ParentNode | null = element;
    target instanceof HTMLElement;
    target = target.parentNode
  ) {
    if (target.matches(parentSelector)) {
      parents.push(target);
    }
  }
  return parents;
}
