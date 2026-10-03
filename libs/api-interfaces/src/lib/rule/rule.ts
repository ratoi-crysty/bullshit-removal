import type { Step } from './step.js';

/**
 * Version of the Rule protocol this library describes. Bump it whenever a Step
 * type or field is added, so older extensions can skip Rules they cannot run.
 */
export const RULE_PROTOCOL_VERSION = 1;

/**
 * Host pattern: either an exact hostname (`medium.com`) or a subdomain wildcard
 * (`*.medium.com`, which does not match the apex `medium.com`).
 */
export type HostPattern = string;

/** Which top-level pages a Rule applies to. */
export interface RuleMatch {
  hosts: HostPattern[];
  /** Path prefixes (`/p/`, `/@user`). Absent means every path. */
  paths?: string[];
}

/** The content of one Revision: what to match and the Steps to run, in order. */
export interface RuleDefinition {
  /** Protocol version the Steps were written against; see RULE_PROTOCOL_VERSION. */
  protocol: number;
  match: RuleMatch;
  steps: Step[];
}

/** A Published Revision, as delivered to extensions. */
export interface PublishedRule extends RuleDefinition {
  id: string;
  revision: number;
}
