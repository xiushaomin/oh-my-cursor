# Accessibility checklist

Use this reference when UI changes need deeper accessibility review.

## Core checks

- Can the flow be completed with keyboard only?
- Are labels, roles, and names explicit?
- Are loading, empty, success, and error states understandable?
- Is the visual design still usable under common contrast constraints?

## Review targets

- focus order and focus visibility
- button and input naming
- form error association
- dialog and menu escape behavior
- semantic structure and landmarks

## Mobile-specific reminders

- touch targets should be comfortably tappable
- safe areas and zoom settings should not hide critical controls
- platform accessibility settings should not break core flows

## Red flags

- clickable elements without accessible names
- color alone carrying meaning
- custom widgets with no keyboard or screen-reader strategy
