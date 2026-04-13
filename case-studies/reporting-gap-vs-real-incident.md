# Case Study: Reporting Gap vs Real Incident

## Issue

A campaign looked underdelivered in reporting not long after launch, and the first reaction was that sending had failed or stopped early.

## Why this mattered

This kind of issue gets noisy fast. If the campaign is genuinely failing, it needs escalation. If reporting is just incomplete, escalating too early wastes time and makes everyone less confident in the numbers.

## What I checked

1. Campaign status, scheduled time, and activation timing
2. Expected audience size vs current send count
3. First and latest subscriber send events
4. Whether send counts were still increasing
5. Whether downstream events were missing only for this campaign or more broadly

## What I was trying to work out

The real question was not just "is the number low?"

It was:

- is sending actually broken?
- is processing still catching up?
- or is reporting being interpreted as final too early?

## What I ruled out

- a campaign that never activated
- a targeting issue that reduced the expected audience
- a complete send failure
- a one-off content issue being mistaken for a delivery issue

## What the investigation showed

The send event stream was active and still moving. So this was not a hard send failure. The gap was between how complete the reporting looked and how complete the underlying event data actually was at that point.

## Decision

Do not treat the case as a failed send.

Instead:

- communicate that sending is in progress
- keep monitoring event progression
- avoid using early reporting snapshots as final performance numbers

## Product / Ops takeaway

This type of issue is usually a visibility problem as much as a sending problem.

If users can see a campaign state but cannot tell whether reporting is still settling, they will treat uncertainty as failure. That usually means the platform needs better freshness signals or better send-progress visibility.
