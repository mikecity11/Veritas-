# Veritas MVP decisions

## Evidence, not automated truth

The product returns traceable research leads and makes their source links prominent. A hash can show that a particular input/source set was recorded; it cannot prove that an underlying claim is true.

## Free-first search

Wikipedia supplies accessible topic context and Crossref supplies scholarly bibliographic leads. Both are public services, so production use needs caching, error budgets, attribution/terms review, and additional curated sources.

## Database later

No database is needed to run this MVP. Add SQLite behind a `ResearchRepository` boundary when saved briefs, accounts, an anchor history, or an audit trail becomes a product requirement.

## Contract boundary

The browser never signs a blockchain transaction. The UI exposes the anchor-ready hash; an authorized wallet/client submits it to the contract. This avoids bundling credentials and leaves room for a user-wallet workflow.
