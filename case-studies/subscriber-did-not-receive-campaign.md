# Case Study: Subscriber Did Not Receive Campaign

## Issue

A customer-facing team raised a very common but important question: why did a specific subscriber not receive a campaign they were expected to get?

## Why this mattered

These cases look small, but they are often where bigger platform issues show up first. They can reveal audience logic gaps, identifier problems, suppression behaviour, or just a mismatch between what people assumed happened and what the system actually did.

## What I checked

1. Whether the subscriber record was valid and contactable
2. Whether any relevant interaction history existed
3. Whether the subscriber appeared in the targeted audience or qualifying list
4. Whether send, bounce, unsubscribe, or exclusion events existed
5. Whether the issue was isolated to one subscriber or part of a wider pattern

## What I was trying to work out

The first goal was to separate:

- genuinely not sent
- sent but not noticed
- excluded for a valid reason
- affected by a wider workflow or data issue

## What I ruled out

- "the system never touched this subscriber" when activity history existed
- assuming a send issue before checking suppression or eligibility
- treating a single-profile issue as a platform incident without evidence

## What the investigation helped decide

This kind of check usually leads to one of three outcomes:

- confirm expected exclusion and explain it clearly
- identify an actual workflow or data problem
- prove the issue is not isolated and should be escalated further

## Product / Ops takeaway

If teams repeatedly need SQL to answer a basic subscriber question, that is usually a tooling gap.

The useful question is not just how to solve the one case. It is whether support or account teams should have a safer way to validate subscriber state without needing manual investigation every time.
