# System shape: extension, API, admin web, shared rule protocol

The system is four Nx projects. `apps/extension` (MV3) applies Rules in the browser and produces Recordings and Captures. `apps/api` (NestJS) stores Rules, serves them to extensions, runs Detection and Verification as queued jobs (Playwright + LLM), and owns auth. `apps/web` is the Admin panel: browse and edit Rules, review Drafts with their Verification Reports, trigger Detection for a Site, manage Invitations. `libs/api-interfaces` holds the Rule protocol (types, Step vocabulary, safety checks) and is the only place it is defined. The Step executor and Match logic will live in a separate lib, not yet created, that the extension bundles and Verification injects.

## Consequences

- Verification runs the **same executor bundle** the extension ships, injected into the Playwright page. A Rule that passes Verification goes through the identical code path in Members' browsers; we never maintain a second "server-side" interpretation of Steps.
- The API validates every Revision against the protocol from `libs/api-interfaces` before storing it, regardless of whether a human, a Recording, or Detection produced it.
- Detection and Verification take tens of seconds, so they are asynchronous jobs, not request/response endpoints.
