import type { CssDeclaration } from './css.js';
import type { HostPattern } from './rule.js';

export enum StepOp {
  StorageSet = 'storage.set',
  StorageRemove = 'storage.remove',
  CookieSet = 'cookie.set',
  CookieRemove = 'cookie.remove',
  WaitFor = 'waitFor',
  Click = 'click',
  Remove = 'remove',
  AttrSet = 'attr.set',
  AttrRemove = 'attr.remove',
  ClassAdd = 'class.add',
  ClassRemove = 'class.remove',
  StyleSet = 'style.set',
  StyleRemove = 'style.remove',
  CssInject = 'css.inject',
}

export enum StorageArea {
  Local = 'local',
  Session = 'session',
}

export enum CookieSameSite {
  Lax = 'lax',
  Strict = 'strict',
  None = 'no_restriction',
}

/**
 * CSS selectors resolved one after another: each entry after the first is
 * queried inside the shadow root of the element the previous entry matched.
 * `['#usercentrics-root', 'button[data-testid=uc-deny-all-button]']`
 */
export type SelectorPath = string[];

/** Frames, other than the top-level page, a Step runs in. */
export interface FrameTarget {
  /** Hosts of the frame's own document, e.g. a CMP's iframe origin. */
  hosts: HostPattern[];
}

interface StepBase {
  op: StepOp;
  /** Absent means the top-level page. */
  frame?: FrameTarget;
}

/** Steps that act on elements apply to every match, except `click` (first match only). */
interface ElementStepBase extends StepBase {
  selector: SelectorPath;
}

export interface StorageSetStep extends StepBase {
  op: StepOp.StorageSet;
  area: StorageArea;
  key: string;
  value: string;
}

export interface StorageRemoveStep extends StepBase {
  op: StepOp.StorageRemove;
  area: StorageArea;
  key: string;
}

export interface CookieSetStep extends StepBase {
  op: StepOp.CookieSet;
  name: string;
  value: string;
  /** Defaults to the frame's host. */
  domain?: string;
  /** Defaults to `/`. */
  path?: string;
  /** Lifetime from the moment the Step runs. Absent means a session cookie. */
  maxAgeSeconds?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: CookieSameSite;
}

export interface CookieRemoveStep extends StepBase {
  op: StepOp.CookieRemove;
  name: string;
  domain?: string;
  path?: string;
}

/**
 * Waits until the selector matches. On timeout the rest of the Rule is skipped
 * without error: the Obstruction did not appear, so there is nothing to do.
 */
export interface WaitForStep extends ElementStepBase {
  op: StepOp.WaitFor;
  timeoutMs: number;
}

export interface ClickStep extends ElementStepBase {
  op: StepOp.Click;
}

export interface RemoveStep extends ElementStepBase {
  op: StepOp.Remove;
}

/** `name` must pass isAllowedAttributeName. */
export interface AttrSetStep extends ElementStepBase {
  op: StepOp.AttrSet;
  name: string;
  value: string;
}

export interface AttrRemoveStep extends ElementStepBase {
  op: StepOp.AttrRemove;
  name: string;
}

export interface ClassAddStep extends ElementStepBase {
  op: StepOp.ClassAdd;
  className: string;
}

export interface ClassRemoveStep extends ElementStepBase {
  op: StepOp.ClassRemove;
  className: string;
}

/** Sets one property in the element's `style` attribute; must pass isAllowedCssDeclaration. */
export interface StyleSetStep extends ElementStepBase {
  op: StepOp.StyleSet;
  declaration: CssDeclaration;
}

export interface StyleRemoveStep extends ElementStepBase {
  op: StepOp.StyleRemove;
  property: string;
}

/**
 * Adds a user-origin stylesheet rule (`chrome.scripting.insertCSS`). Applies to
 * current and future matches, but cannot reach inside shadow roots, so the
 * selector is a plain CSS selector rather than a SelectorPath.
 */
export interface CssInjectStep extends StepBase {
  op: StepOp.CssInject;
  selector: string;
  declarations: CssDeclaration[];
}

export type Step =
  | StorageSetStep
  | StorageRemoveStep
  | CookieSetStep
  | CookieRemoveStep
  | WaitForStep
  | ClickStep
  | RemoveStep
  | AttrSetStep
  | AttrRemoveStep
  | ClassAddStep
  | ClassRemoveStep
  | StyleSetStep
  | StyleRemoveStep
  | CssInjectStep;
