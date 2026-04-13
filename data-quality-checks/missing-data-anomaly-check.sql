-- Investigation: missing data / anomaly check
--
-- Typical use:
-- A dashboard or stakeholder report shows a sudden drop in daily event volume,
-- and we need to work out whether this is a genuine behaviour change or a data issue.
--
-- Investigation goal:
-- 1. Compare recent daily volume to a short historical baseline
-- 2. Look for missing days, sharp drops, or suspicious spikes
-- 3. Give a simple operational interpretation so triage can move quickly
--
-- Notes:
-- - The baseline window here is short on purpose; during investigations, recent
--   operational history is usually more useful than long-range averages
-- - If weekends behave differently in your environment, segment by weekday next

WITH daily_event_counts AS (
    SELECT
        CAST(se.event_timestamp AS DATE) AS event_date,
        COUNT(*) AS event_count
    FROM subscriber_event se
    WHERE se.event_timestamp >= CURRENT_DATE - INTERVAL '14 days'
      AND se.event_ref IN ('sent', 'delivered', 'open', 'click')
    GROUP BY CAST(se.event_timestamp AS DATE)
),
baseline AS (
    SELECT
        AVG(event_count) AS avg_event_count,
        MIN(event_count) AS min_event_count,
        MAX(event_count) AS max_event_count
    FROM daily_event_counts
    WHERE event_date >= CURRENT_DATE - INTERVAL '14 days'
      AND event_date < CURRENT_DATE - INTERVAL '3 days'
),
scored_days AS (
    SELECT
        dec.event_date,
        dec.event_count,
        b.avg_event_count,
        ROUND(100.0 * dec.event_count / NULLIF(b.avg_event_count, 0), 2) AS pct_of_baseline
    FROM daily_event_counts dec
    CROSS JOIN baseline b
)
SELECT
    event_date,
    event_count,
    avg_event_count,
    pct_of_baseline,
    CASE
        WHEN event_count = 0 THEN 'No events recorded'
        WHEN pct_of_baseline < 50 THEN 'Material drop vs baseline'
        WHEN pct_of_baseline > 150 THEN 'Material spike vs baseline'
        ELSE 'Within normal range'
    END AS anomaly_flag
FROM scored_days
ORDER BY event_date DESC;

-- Why this is useful:
-- When a chart looks wrong, this check gives a quick signal on whether the issue
-- is likely to be ingestion, delayed processing, or a genuine change in usage.
--
-- If a day is flagged, the next move is usually to break the same volume down by:
-- - source table
-- - event type
-- - customer segment
-- - ingestion or processing hour
