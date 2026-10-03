# Every API endpoint requires an authenticated Member; membership is by Invitation only

There is no anonymous access, including reading Published Rules, and no open registration. Detection costs money (headless browsers, LLM calls), and keeping the whole surface closed is simpler to secure than a public read path with rate limiting. Members log in through `apps/web`, which hands a token to the extension (via `externally_connectable` or `chrome.identity.launchWebAuthFlow`); auth is built on the existing NestJS auth libraries.

## Consequences

- A logged-out extension still Declines CMP Consent Banners via autoconsent's bundled rules ([ADR-0003](./0003-autoconsent-for-cmps.md)), but applies no Site Rules.
- Detection requests are quota-limited per Member.
- Opening the extension to the public later means adding an anonymous read path for Published Rules; the write side stays closed.
