# Investigation Framework

This is the simple framework I use when I need to debug a system issue without overcomplicating it.

## 1. Start with the symptom, not the suspected cause

When an issue comes in, the first version is often already framed as a diagnosis.

Examples:

- "the campaign did not send"
- "the data pipeline is broken"
- "tracking is missing"

I try to rewrite that into a neutral symptom first:

- expected send activity is lower than expected
- no subscriber events are visible for a known time window
- dashboard totals do not match source-level counts

That matters because it keeps the investigation grounded in evidence instead of jumping straight into explanation.

## 2. Define what should have happened

Before querying anything, I usually write down:

- what record or event should exist
- where it should exist
- roughly when it should appear
- what "normal" would look like for this case

If I cannot describe expected behaviour clearly, I am usually not ready to investigate properly yet.

## 3. Reduce the scope early

A good investigation normally starts small:

- one campaign
- one account
- one customer segment
- one event type
- one time window

Wide queries are useful later. Early on, they just make it harder to see the real break in the chain.

## 4. Follow the path the system should have taken

I usually work stage by stage:

1. Was the source record created?
2. Was it eligible for the next step?
3. Did the next system action happen?
4. Was that action logged correctly?
5. Did downstream reporting receive the same data?

This is the most useful habit in investigation work. It turns a vague issue into a series of smaller checks.

## 5. Separate missing data from delayed data

This is one of the most important distinctions.

Missing data means the expected record never appears.

Delayed data means the expected record appears later than normal, often causing temporary reporting gaps or misleading comparisons.

A lot of operational confusion comes from treating delayed data as if it were missing data.

## 6. Compare counts across stages

When I am unsure where the issue starts, I compare counts at each step:

- audience selected
- messages queued
- sends recorded
- deliveries recorded
- engagement events recorded

The point is not just to find a bad number. The point is to find where the numbers stop making sense relative to each other.

## 7. Treat anomalies as signals, not conclusions

A sudden drop, spike, or mismatch is a clue.

It does not automatically tell you whether the issue is:

- user behaviour
- configuration
- timing
- duplication
- ingestion failure
- a reporting bug

The follow-up question is always: what else would I expect to see if this explanation were true?

## 8. Validate before escalating

Before I present a finding, I try to validate it in at least one other way:

- compare against a second table
- check a narrower and wider time range
- review a known-good example
- test whether the counts are still changing
- confirm whether the issue affects more than one case

This helps avoid turning a partial observation into a confident but wrong conclusion.

## 9. Be explicit about certainty

When I write up findings, I try to separate:

- what is confirmed
- what is likely
- what is still unknown

That makes investigations more useful for product, support, engineering, and leadership because people can see how strong the evidence actually is.

## 10. Leave a trail someone else can follow

A useful investigation note should make it easy for another person to understand:

- what triggered the work
- what data was checked
- what was ruled out
- what conclusion was reached
- what next action was recommended

That is often more valuable than the SQL itself.

## Practical reminder

The job is usually not to write the smartest query.

The job is to reduce uncertainty, avoid false conclusions, and get the issue to the right next step with enough evidence behind it.
