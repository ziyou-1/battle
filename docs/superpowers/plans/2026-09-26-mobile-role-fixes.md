# Mobile Role Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close the confirmed role-permission, order-payment, account-state, and mobile robustness defects found during the mobile role audit.

**Architecture:** Keep the existing Flask route and Vue hash-router structure. Add authorization at the existing API boundary, validate server-owned order state before creating orders, and harden the existing mobile API/rendering helpers without changing the customer-only mobile product boundary.

**Tech Stack:** Flask/Python, SQLite document store, Vue 3 CDN, vanilla CSS, Playwright smoke checks.

**Spec:** Mobile role audit results from the current task.

## Global Constraints

- Do not expose customer phone, WeChat, or QQ values from public blacklist search responses.
- Staff roles must be rejected by customer login; customer records remain isolated by customerId.
- Only `balance` and `offline` are valid client payment methods.
- Unpaid orders must not increase cumulative consumption.
- Customer content must not execute arbitrary HTML scripts.
- Preserve the existing customer-only mobile app boundary.

---

### Task 1: Backend authorization and order/account validation

**Files:**
- Modify: `api/client_ext.py`
- Modify: `api/client.py`
- Modify: `api/guards.py` only if the shared guard helper needs a new rule
- Test: isolated Flask test client and existing client API scripts

- [x] Add role checks to client review, after-sale, and client-setting endpoints.
- [x] Reject disabled customers during login before creating a customer session.
- [x] Validate active shop items, game/project ownership, and payment method enum.
- [x] Count cumulative consumption only after a successful balance payment.
- [x] Return business errors for malformed circle IDs and redact public blacklist contact fields.
- [x] Run targeted permission and order regression checks.

### Task 2: Mobile routing, error states, and security hardening

**Files:**
- Modify: `static/app/app.js`
- Modify: `static/app/api.js`
- Modify: `static/app/pages.js`
- Modify: `static/app/pages2.js`
- Modify: `static/app/app.css`

- [x] Keep public circle listing accessible to guests while protecting publish/mine actions.
- [x] Make registration consent opt-in and make guest points actions explain the login requirement.
- [x] Sanitize rich content before rendering it with `v-html`.
- [x] Guard empty API data and display retryable error states on affected pages.
- [x] Add request timeout/HTTP error handling and prevent startup from remaining blank indefinitely.
- [x] Add narrow-screen wrapping, scrolling, and safe-area handling.
- [x] Run JavaScript syntax checks and 390px/320px route smoke tests.

### Task 3: Delivery regression review

- [x] Confirm source diff is limited to the two task groups and the plan.
- [x] Run customer API suites, staff role permission checks, and mobile Playwright flows.
- [x] Verify no 404/500 responses remain in the exercised mobile routes except intentionally unavailable external integrations.
- [x] Report any remaining environment-dependent work separately.
