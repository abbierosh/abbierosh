# SQL Investigation Playbooks

I work in Product Operations / Technical Operations, mostly in the space where product behaviour, customer issues, data, and platform reality all collide.

That usually means I am not just writing SQL. I am trying to answer questions like:

- what actually happened in the system?
- is this a bug, bad data, timing, configuration, or expected behaviour?
- what does this mean for customers and internal teams?
- what should we fix so the same issue is easier to detect or easier to prevent next time?

This repo is meant to show that way of working.

It is built around the kind of operational investigation I do day to day: campaign issues, event-level debugging, reporting gaps, workflow edge cases, data quality checks, and the follow-up thinking that turns a one-off investigation into a better product or process.

## What This Repo Covers

- `playbooks/`: repeatable investigation checks I come back to often
- `campaign-event-analysis/`: campaign and event validation work
- `data-quality-checks/`: checks for missing, delayed, duplicated, or suspicious data
- `troubleshooting-notes/`: how I frame, narrow, and document live issues
- `framework/`: the investigation mindset behind the queries
- `improvements/`: examples of how investigation work turns into monitoring, tooling, and product improvements

## How I Work

The query is rarely the starting point.

I usually start by trying to pin down three things:

- what the system was supposed to do
- what the customer or internal team experienced
- where the smallest reliable evidence sits

From there, SQL is one tool in a bigger workflow:

- validate whether the underlying records exist
- compare counts across stages of the system
- check timestamps, ordering, and completeness
- work out whether the issue is isolated or systemic
- separate confirmed facts from assumptions
- decide what needs to happen next

Sometimes the next step is a fix. Sometimes it is a product change. Sometimes it is better monitoring, clearer tooling, or a process update so the issue is easier to spot earlier.

## Why i enjoy it

This kind of work sits between product, support, engineering, and data.

You need enough product understanding to know what should happen, enough system understanding to trace where it broke, and enough operational judgement to turn findings into something useful. That might be a customer answer, an engineering handoff, a monitoring recommendation, or a workflow improvement for internal teams.

That is the lens I wanted this repo to reflect.

## How This Translates To Product Ops

- Debugging becomes product insight when repeated issue patterns show where the product is confusing, fragile, or missing visibility.
- Investigation becomes system improvement when one-off issues turn into better alerts, better tooling, or better workflows.
- Data checks become decision-making when they help teams distinguish between a real problem, a timing issue, and a reporting artefact.

## Notes

- Everything here is generic and anonymised
- The patterns are based on real operational work, but sensitive detail has been removed
- The comments explain investigation intent and decision-making, not just SQL syntax
- The goal is to show how I think through platform issues, not to build a tutorial repo

## Starting Points

1. Read [`framework/investigation-framework.md`](framework/investigation-framework.md)
2. Look at [`playbooks/interaction-history-check.sql`](playbooks/interaction-history-check.sql)
3. Review [`troubleshooting-notes/send-delay-triage-notes.md`](troubleshooting-notes/send-delay-triage-notes.md)
4. Read the improvement notes to see how investigation work can lead to better operations and product decisions
