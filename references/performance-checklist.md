# Performance checklist

Use this reference when a change has latency, rendering, build, or query-shape risk.

## First questions

- What is slow or likely to become slow?
- Do we have a measurement, or only a suspicion?
- Is the bottleneck rendering, network, compute, storage, or serialization?

## Minimum checks

- Confirm the hotspot before optimizing
- Look for obvious over-fetching, N+1 access, or duplicate work
- Keep loading states explicit so latency does not become UX ambiguity
- Verify that caching, memoization, or batching is actually helping

## Frontend review targets

- unnecessary rerenders
- large client payloads
- avoidable client-side fetching
- oversized images or lists without virtualization

## Backend review targets

- N+1 queries
- broad object hydration
- missing pagination
- repeated serialization or retries

## Red flags

- Optimizing without measuring
- Adding caching where correctness semantics are still unclear
- Accepting slower correctness-critical paths without naming the tradeoff
