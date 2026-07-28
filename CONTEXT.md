# Butterfly Effect

Butterfly Effect diagnoses whether an AI-assisted task produced a work product that later had to be repaired, then recommends where a better continuation could begin.

## Language

**Task Artifact**:
A user-intended, independently evaluable work product such as code, a document, a design, a plan, or a final analysis. Status updates, context management, unfinished responses, and ordinary conversation are not Task Artifacts unless the response itself is the requested deliverable.
_Avoid_: output, response

**Artifact Version**:
A produced state of a Task Artifact that can be evaluated or used and may later be retained, extended, or reworked. A partial response still being generated is not an Artifact Version.
_Avoid_: turn, message

**Trajectory Drift**:
A condition where an Artifact Version must be reworked because it missed the expected outcome or applicable constraints. Additional requests alone do not establish Trajectory Drift.
_Avoid_: correction, change, follow-up

**Continuation Constraint**:
A later requirement that belongs in the desired Task Artifact after Trajectory Drift is established. It may guide reconstruction without being evidence that drift occurred.
_Avoid_: correction

**Rewind Point**:
The earliest supported Agent action whose replacement would have prevented the Artifact Version from requiring rework.
_Avoid_: first correction
