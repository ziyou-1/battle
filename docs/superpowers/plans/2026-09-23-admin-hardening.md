# Admin Hardening Implementation Plan

> **For agentic workers:** Work inline in this authorized session. Steps use checkbox syntax for tracking.

**Goal:** Close the confirmed order authorization gap and repair misleading or broken admin screens before public use.

**Architecture:** Check order access on the server for both pages and Ajax actions. Keep external messaging unavailable until configured, with explicit feedback. Fix the template builder and current generated files together.

**Tech Stack:** Flask, SQLite, Jinja, layui, JavaScript.

**Spec:** User approved the findings reported in this task on 2026-09-23.

## Global Constraints

- Do not write test data to `data/app.db`.
- Preserve current admin workflows and existing demo data.
- Do not claim SMS or email delivery without a configured provider.

---

### Task 1: Order access

**Files:** `api/order.py`, `api/__init__.py`, `pages.py`, `app.py`

- [x] Add `can_view_order(order, user)` using the same visibility rule as order lists.
- [x] Reject an unauthorized order ID at the API dispatch boundary and on order detail pages.
- [x] Require `order/orderlist` menu permission for administrative order actions such as deletion.
- [x] Verify an unassigned worker receives 403 for detail and deletion in an isolated database; admin remains authorized.

### Task 2: API and settings correctness

**Files:** `api/__init__.py`, `tools/patch_templates.py`, six affected `templates/System/*.html`, `static/JS2019/GameAccounts/accountlist.js`

- [x] Make unknown Ajax actions return a 404 error instead of success.
- [x] Prevent `bind_text` from nesting an existing `[[ ... ]]` default; remove existing nested output.
- [x] Show an empty date when a game account has no sale time.
- [x] Check rendered settings values and unknown action response.

### Task 3: Messaging status

**Files:** `api/sms.py`, `api/login.py`, `templates/Login/index.html`, `templates/System/smssetting.html`, `README.md`

- [x] Prevent activation of unsent SMS automation, and show a visible local-only notice.
- [x] Stop printing recovery codes to server logs; report unavailable delivery until SMTP is configured.
- [x] Document required provider setup and limits of the local clone.

### Task 4: Review

- [x] Run existing isolated test flows and targeted authorization checks.
- [x] Review changed files and live page output; report remaining provider credentials and deployment setup.

