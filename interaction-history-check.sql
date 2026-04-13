-- Check whether a set of subscriber refs has any historical interaction events
-- Purpose:
-- Used to validate whether profiles have recorded any meaningful engagement
-- or delivery history within the platform.

SELECT
    ref_id,
    COUNT(*) AS qualifying_events,
    MIN(event_timestamp) AS first_event_at,
    MAX(event_timestamp) AS last_event_at
FROM subscriber_event
WHERE event_ref IN ('s', 'o', 'c', 'b', 'u', 'p')
  AND ref_id IN ('REF001', 'REF002', 'REF003')
GROUP BY ref_id
ORDER BY qualifying_events DESC;
