# Diagnose Drift from Artifacts, Not Request Labels

Butterfly Effect diagnoses trajectory drift from the history of a user-intended Task Artifact. Drift exists only when a produced Artifact Version had to be reworked because it missed the expected outcome or applicable constraints; classifying each later message as a correction or new requirement is too subjective and creates false positives.

Requirements added before an Artifact Version exists, normal evolution after an accepted artifact, repeated explanations, and context-management messages do not establish drift. Once artifact drift is established, later relevant requests may be retained as Continuation Constraints even when they are not themselves evidence of drift. The rewind point is then traced to the earliest Agent action whose replacement would have prevented the artifact rework.

This makes the default result a no-op when no artifact drift occurred. It also means evaluators must identify the Task Artifact and its versions before interpreting later requests; a conversational answer counts only when that answer is itself the requested deliverable.
