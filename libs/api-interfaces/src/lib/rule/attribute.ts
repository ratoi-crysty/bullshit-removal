/**
 * Attributes `attr.set` / `attr.remove` may not touch: anything that can run
 * code or load a resource, plus `style` and `class`, which have their own ops.
 */
const FORBIDDEN_ATTRIBUTES: readonly string[] = [
  'style',
  'class',
  'src',
  'srcset',
  'srcdoc',
  'href',
  'xlink:href',
  'action',
  'formaction',
  'data',
  'poster',
  'background',
];

export function isAllowedAttributeName(name: string): boolean {
  const normalized: string = name.trim().toLowerCase();

  // Inline event handlers (`onclick`, `onload`, …) are code.
  return !normalized.startsWith('on') && !FORBIDDEN_ATTRIBUTES.includes(normalized);
}
