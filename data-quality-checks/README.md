# Data Quality Checks

This folder covers the checks I use when something feels off in the data.

Usually that feeling starts with a symptom:

- counts suddenly drop
- a dashboard is missing yesterday's data
- one customer segment looks far smaller than normal
- events exist in one table but not where they should downstream

At that point I am not trying to prove a theory yet. I am trying to work out whether the issue is real, where it starts, and whether the gap is stable, delayed, or inconsistent.

These queries are built for that kind of first-principles checking.
