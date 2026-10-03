/** One CSS declaration, kept structured so a Rule can never smuggle in raw CSS text. */
export interface CssDeclaration {
  property: string;
  value: string;
  important?: boolean;
}

/** Properties a Rule may set, via `style.set` or `css.inject`. */
export const CSS_PROPERTY_ALLOW_LIST: readonly string[] = [
  'display',
  'visibility',
  'opacity',
  'pointer-events',
  'overflow',
  'overflow-x',
  'overflow-y',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'height',
  'max-height',
  'width',
  'max-width',
  'z-index',
  'filter',
  'transform',
];

/**
 * Rejected anywhere in a value: CSS escapes (`\75rl(`), at-rules, block and
 * declaration delimiters, comments, and anything that can make the page fetch.
 */
const FORBIDDEN_CSS_VALUE = /[\\@{};]|\/\*|url\(|image-set\(|image\(|src\(|expression\(/i;

export function isAllowedCssDeclaration(declaration: CssDeclaration): boolean {
  return (
    CSS_PROPERTY_ALLOW_LIST.includes(declaration.property.toLowerCase()) &&
    !FORBIDDEN_CSS_VALUE.test(declaration.value)
  );
}
