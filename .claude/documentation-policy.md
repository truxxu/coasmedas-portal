# Documentation & Memory Management Policy

**Version**: 1.1
**Purpose**: Scalable documentation management optimized for Claude Code memory system

---

## 🎯 Core Principles

### 1. Documentation IS Memory

In Claude Code, all documentation serves as memory for AI context:

- Memory files guide AI behavior
- Documentation informs AI about architecture
- **They are the same thing** - manage them together

### 2. Progressive Complexity

Start simple, grow as needed:

- **Early Stage** (current): Lightweight memory in `.claude/`
- **Growth Stage**: Add knowledge directory when needed
- **Mature Stage**: Full hierarchical structure with progress tracking

### 3. Single Source of Truth

- All memory/docs centralized under `.claude/`
- Use `@path/to/file` imports to compose memory
- No duplicate information across files

---

## 📁 Structure (Scalable)

### Phase 1: Early Stage (← YOU ARE HERE)

```
.claude/
├── coding-standards.md      # Style guidelines
├── workflows.md             # Development processes
├── documentation-policy.md  # This file
├── architecture.md          # System architecture (when needed)
└── decisions.md             # Architecture decision records (when needed)
```

**Rules**:

- Keep it simple - 3-5 files max
- Add files only when you have content
- Import into CLAUDE.md using `@.claude/filename.md`

### Phase 2: Growth Stage

```
.claude/
├── coding-standards.md
├── workflows.md
├── documentation-policy.md
├── architecture.md
├── decisions.md
├── knowledge/               # NEW: Detailed documentation
│   ├── features/           # Feature specs with references
│   │   └── {feature-name}/
│   │       ├── spec.md
│   │       ├── references.md
│   │       └── attachments/
│   └── api/                # API documentation
└── reference/              # NEW: Quick reference guides
    └── commands.md
```

**Triggers to add `/knowledge`**:

- 3+ major features documented
- Complex business logic requiring detailed specs
- Multiple team members needing shared context

### Phase 3: Mature Stage

```
.claude/
├── coding-standards.md
├── workflows.md
├── documentation-policy.md
├── architecture.md
├── decisions.md
├── knowledge/
│   ├── core/              # Core specifications
│   ├── features/          # Feature documentation
│   │   └── {feature-name}/
│   │       ├── spec.md
│   │       ├── references.md
│   │       ├── api.md
│   │       └── attachments/
│   │           ├── wireframes/
│   │           ├── designs/
│   │           ├── diagrams/
│   │           ├── docs/
│   │           └── data/
│   ├── api/               # API specs
│   └── database/          # Schema & migrations
├── progress/              # Implementation tracking
│   ├── epics/             # Epic specifications & plans
│   ├── phases/            # Phase summaries
│   ├── bugs/              # Bug documentation
│   └── status/            # Overall status tracking
└── reference/             # Quick lookups
    ├── commands.md
    └── troubleshooting.md
```

**Triggers to add `/progress`**:

- Multi-week development cycles
- Epic/sprint planning with multiple phases
- Bug tracking becomes complex
- Need to track progress across features

---

## 📝 Naming Conventions

### Current Phase (Early Stage):

```
lowercase-with-hyphens.md        # Simple, readable
```

### Growth/Mature Phase:

```
# Core/Knowledge
knowledge/core/UPPERCASE_CORE_DOCS.md
knowledge/features/feature-name.md
knowledge/features/{feature-name}/attachments/wireframes/login-flow.png

# Progress Tracking
progress/epics/epic-{version}-{name}.md         # Epic spec
progress/epics/plan-{version}.md                # Implementation plan
progress/epics/progress-{version}.md            # Epic progress tracking
progress/phases/phase-{N}-{epic-version}.md     # Phase summary
progress/bugs/bug-{date}-{desc}.md              # Bug documentation
progress/status/status-{module}.md              # Overall module status
```

---

## 📊 Epic & Phase Tracking Structure

### Epic Progress Files

Each epic has three related files:

```
progress/epics/
├── epic-1.1-products.md          # What: Epic specification
├── plan-1.1.md                   # How: Implementation plan with phases
└── progress-1.1.md               # Status: Progress tracking
```

### Phase Summaries

Each completed phase gets a summary:

```
progress/phases/
├── phase-1-epic-1.1.md           # Phase 1 of Epic 1.1 summary
├── phase-2-epic-1.1.md           # Phase 2 of Epic 1.1 summary
└── phase-3-epic-1.1.md           # Phase 3 of Epic 1.1 summary
```

### Relationship:

```
Epic 1.1: Products Feature
│
├─ plan-1.1.md
│  ├─ Phase 1: Data models (3 days)
│  ├─ Phase 2: API endpoints (5 days)
│  └─ Phase 3: UI components (7 days)
│
├─ progress-1.1.md
│  ├─ Phase 1: ✅ Complete
│  ├─ Phase 2: 🔄 In Progress (60%)
│  └─ Phase 3: ⏳ Pending
│
└─ phases/
   ├─ phase-1-epic-1.1.md (summary after completion)
   └─ phase-2-epic-1.1.md (created when phase completes)
```

---

## 📎 Feature References & Attachments

### Structure for Feature-Specific Documentation

```
.claude/knowledge/features/{feature-name}/
├── spec.md              # Feature specification
├── references.md        # Links to external resources
├── api.md              # API documentation (if applicable)
└── attachments/        # Local files
    ├── wireframes/     # UI mockups, wireframes
    ├── designs/        # Final designs (exported)
    ├── diagrams/       # Architecture diagrams, flowcharts
    ├── docs/           # PDFs, technical specs
    └── data/           # Sample data, schemas, JSON
```

### Reference Types

#### 1. External Links (Figma, Google Docs, etc.)

Store links in a `references.md` file:

```markdown
# References - {Feature Name}

## UI/UX Design

- **Figma Design**: [Design System](https://figma.com/file/...)
- **Wireframes**: [Wireframes v1](https://figma.com/file/...)
- **Prototype**: [Interactive Prototype](https://figma.com/proto/...)

## Documentation

- **Product Spec**: [Google Doc](https://docs.google.com/...)
- **User Stories**: [Jira Epic](https://jira.company.com/...)
- **API Contract**: [Swagger/OpenAPI](https://api.company.com/docs)

## Technical Resources

- **Library Docs**: [React Hook Form](https://react-hook-form.com)
- **Tutorial**: [Implementation Guide](https://...)

## Meeting Notes

- **Kickoff Meeting**: [Notes](https://...)
- **Design Review**: [Notes](https://...)

---

**Last Updated**: YYYY-MM-DD
```

#### 2. Local Files (Images, PDFs, etc.)

Store in `attachments/` subdirectory with organized folders.

#### 3. Inline References in Feature Spec

Reference materials directly in the feature spec:

```markdown
# Feature: User Authentication

## UI Design

See designs in `attachments/designs/`:

- Desktop: ![Login Desktop](./attachments/designs/login-screen-desktop.png)
- Mobile: ![Login Mobile](./attachments/designs/login-screen-mobile.png)

External design: [Figma - Auth Flows](https://figma.com/file/...)

## API Documentation

See [API Spec](./api.md) for detailed endpoint documentation.

## External References

See [references.md](./references.md) for complete list of links.
```

### Decision Tree: Where to Store This Reference?

```
New reference material?
│
├─ Is it a link to external resource (Figma, Google Docs, etc.)?
│  └─ → Add to features/{feature-name}/references.md
│
├─ Is it a UI design/wireframe?
│  ├─ External (Figma, Sketch)?
│  │  └─ → Link in references.md
│  └─ Exported image/PDF?
│     └─ → Store in attachments/designs/ or attachments/wireframes/
│
├─ Is it technical documentation (PDF, Word)?
│  └─ → Store in attachments/docs/
│
├─ Is it a diagram (architecture, flowchart)?
│  ├─ External (Lucidchart, Draw.io link)?
│  │  └─ → Link in references.md
│  └─ Exported image?
│     └─ → Store in attachments/diagrams/
│
├─ Is it sample data or schema?
│  └─ → Store in attachments/data/
│
└─ Is it API documentation?
   ├─ External API?
   │  └─ → Link in references.md
   └─ Our API?
      └─ → Create features/{feature-name}/api.md
```

---

## 🔄 Documentation Workflow

### Starting a New Epic (Mature Stage)

```
1. Create epic spec: progress/epics/epic-{version}-{name}.md
2. Create implementation plan: progress/epics/plan-{version}.md
   - Break down into phases
   - Estimate each phase
3. Create progress tracker: progress/epics/progress-{version}.md
4. Start Phase 1
```

### During a Phase

```
1. Update progress/epics/progress-{version}.md at start of session
2. Use TodoWrite tool for task tracking within session
3. Update progress after each major task
4. Document bugs in progress/bugs/ as they occur
```

### Completing a Phase

```
1. Create progress/phases/phase-{N}-epic-{version}.md
   - Summary of what was completed
   - Files created/modified
   - Key decisions made
   - Metrics (time, story points, etc.)
2. Update progress/epics/progress-{version}.md
   - Mark phase complete
   - Update overall epic progress
3. Start next phase
```

### Completing an Epic

```
1. Finalize progress/epics/progress-{version}.md
   - Mark epic complete
   - Summary of all phases
   - Total metrics
2. Update progress/status/status-{module}.md
3. Update reference/CLAUDE.md if major milestone
4. Archive or keep for reference
```

### Adding Guidelines (Early/Growth Stage)

```
Use `#` command:
# Always use server components by default

OR use `/memory` to edit directly
```

### Adding Feature References

```
1. Create feature directory: .claude/knowledge/features/{feature-name}/
2. Create spec.md with feature specification
3. Create references.md with external links
4. Create attachments/ subdirectory for local files
5. Organize attachments by type (wireframes/, designs/, etc.)
6. Reference attachments in spec.md
```

---

## 🎯 Decision Tree: Where Does This Go?

```
New information to document?
│
├─ Is it a coding preference/standard?
│  └─ → .claude/coding-standards.md
│
├─ Is it a workflow/process?
│  └─ → .claude/workflows.md
│
├─ Is it an architectural decision?
│  ├─ Early stage?
│  │  └─ → .claude/architecture.md
│  └─ Mature stage with many decisions?
│     └─ → .claude/decisions.md (ADR format)
│
├─ Is it a feature specification? (Growth+ phase)
│  └─ → .claude/knowledge/features/{feature-name}/spec.md
│
├─ Is it a feature reference (design, doc, diagram)?
│  ├─ External link?
│  │  └─ → .claude/knowledge/features/{feature-name}/references.md
│  └─ Local file?
│     └─ → .claude/knowledge/features/{feature-name}/attachments/{type}/
│
├─ Is it an epic specification? (Mature phase)
│  └─ → .claude/progress/epics/epic-{version}-{name}.md
│
├─ Is it an epic implementation plan? (Mature phase)
│  └─ → .claude/progress/epics/plan-{version}.md
│
├─ Is it epic progress tracking? (Mature phase)
│  └─ → .claude/progress/epics/progress-{version}.md
│
├─ Is it a phase summary? (Mature phase)
│  └─ → .claude/progress/phases/phase-{N}-epic-{version}.md
│
├─ Is it a bug documentation? (Growth+ phase)
│  └─ → .claude/progress/bugs/bug-{date}-{desc}.md
│
└─ Is it a quick command reference?
   └─ → .claude/workflows.md (early) or .claude/reference/commands.md (mature)
```

---

## 📋 Templates

### Epic Specification (Mature Stage)

```markdown
# Epic {VERSION}: {Name}

**Story Points**: N
**Duration**: N weeks
**Status**: Planning | In Progress | Complete

## Objectives

- Objective 1
- Objective 2

## User Stories

- As a {role}, I want {capability}, so that {benefit}

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Technical Approach

- Architecture decisions
- Technologies
- Dependencies

## References

- Links to core docs
- Related epics
```

### Implementation Plan (Mature Stage)

```markdown
# Implementation Plan - Epic {VERSION}

**Total Duration**: N days
**Story Points**: N SP

## Phase Breakdown

### Phase 1: {Name} (Days 1-N)

**Duration**: N days
**Story Points**: N SP

**Deliverables**:

- Deliverable 1
- Deliverable 2

**Tasks**:

1. Task 1 (N hrs)
2. Task 2 (N hrs)

**Files to Create/Modify**:

- `path/to/file1.ts`
- `path/to/file2.ts`

### Phase 2: {Name} (Days N-M)

...

## Dependencies

- External dependency 1
- Epic dependency 2

## Risks

- Risk 1: Mitigation strategy
- Risk 2: Mitigation strategy
```

### Progress Tracker (Mature Stage)

```markdown
# Progress - Epic {VERSION}: {Name}

**Started**: YYYY-MM-DD
**Status**: In Progress | Complete
**Current Phase**: N of M

## Phase Status

### Phase 1: {Name} ✅

- **Status**: Complete
- **Duration**: N days (planned) / M days (actual)
- **Completed**: YYYY-MM-DD
- **Summary**: Link to progress/phases/phase-1-epic-{version}.md

### Phase 2: {Name} 🔄

- **Status**: In Progress (60%)
- **Started**: YYYY-MM-DD
- **Progress**:
  - ✅ Task 1
  - ✅ Task 2
  - 🔄 Task 3 (in progress)
  - ⏳ Task 4

### Phase 3: {Name} ⏳

- **Status**: Pending
- **Planned Start**: YYYY-MM-DD

## Overall Metrics

- **Story Points**: N/M complete (X%)
- **Time**: N/M days (X%)
- **Files Created**: N files
- **Files Modified**: M files

## Blockers

- None | Blocker description

## Next Steps

1. Complete Task 3
2. Start Task 4

---

**Last Updated**: YYYY-MM-DD HH:MM
```

### Phase Summary (Mature Stage)

```markdown
# Phase {N} Summary - Epic {VERSION}

**Completed**: YYYY-MM-DD
**Duration**: N days (planned) / M days (actual)
**Story Points**: N SP

## Objectives

What this phase aimed to accomplish

## Completed Tasks

- ✅ Task 1: Description
- ✅ Task 2: Description
- ✅ Task 3: Description

## Files Created

- `path/to/file1.ts` - Description
- `path/to/file2.ts` - Description

## Files Modified

- `path/to/file3.ts` - Changes made
- `path/to/file4.ts` - Changes made

## Key Decisions

- Decision 1: Why we chose this approach
- Decision 2: Trade-offs considered

## Challenges & Solutions

- Challenge 1: How we solved it
- Challenge 2: How we solved it

## Metrics

- **Lines of Code**: +N/-M
- **Components Created**: N
- **Tests Added**: N
- **Time**: N hours

## Learnings

- Learning 1
- Learning 2

## Next Phase

Brief preview of Phase {N+1}

---

**Phase**: {N} of {M}
**Epic**: {VERSION}
```

### Feature Specification (Growth+ Stage)

```markdown
# Feature: {Name}

**Status**: Planning | In Progress | Complete
**Owner**: Team/Person
**Last Updated**: YYYY-MM-DD

## Overview

What does this feature do?

## UI Design

See designs in `attachments/designs/`:

- Desktop: ![Desktop](./attachments/designs/desktop.png)
- Mobile: ![Mobile](./attachments/designs/mobile.png)

External design: [Figma](https://figma.com/file/...)

## User Stories

- As a {role}, I want {capability}, so that {benefit}

## Technical Approach

- Architecture decisions
- Key components
- Dependencies

## API

See [api.md](./api.md) for endpoint documentation.

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## References

See [references.md](./references.md) for all external resources.

---

**Feature Directory**: `.claude/knowledge/features/{feature-name}/`
```

### Feature References (Growth+ Stage)

```markdown
# References - {Feature Name}

**Feature**: {Feature Name}
**Last Updated**: YYYY-MM-DD

---

## Design Resources

### UI/UX Design

- **Figma Design System**: [Link](https://figma.com/...)
  - Last updated: YYYY-MM-DD
  - Owner: Designer Name
- **Wireframes**: [Link](https://figma.com/...)
- **Prototype**: [Link](https://figma.com/...)

### Design Tokens

- Location: `attachments/designs/design-tokens.json`
- Colors, spacing, typography defined

---

## Product Documentation

### Specifications

- **Product Spec**: [Google Doc](https://docs.google.com/...)
- **User Stories**: [Jira](https://jira.company.com/...)

---

## Technical Resources

### API Documentation

- **External API**: [Stripe Docs](https://stripe.com/docs)
- **Internal API**: See [api.md](./api.md)

### Libraries & Frameworks

- **React Hook Form**: https://react-hook-form.com
- **Zod Validation**: https://zod.dev

---

## Architecture & Diagrams

### System Diagrams

- **Architecture Diagram**: `attachments/diagrams/architecture.png`
- **Database Schema**: `attachments/diagrams/db-schema.png`

---

## Meeting Notes & Decisions

### Meetings

- **Kickoff Meeting** (YYYY-MM-DD): [Notes](https://...)
- **Design Review** (YYYY-MM-DD): [Notes](https://...)

### Decision Records

- **ADR 1 - Auth Strategy**: See `.claude/decisions.md#adr-1`

---

## Related Features

- [Feature: User Profile](../user-profile/spec.md)

---

## Notes

- All Figma designs require company account access
- Design tokens auto-sync from Figma plugin
```

### Feature API Documentation (Growth+ Stage)

````markdown
# API Documentation - {Feature Name}

**Feature**: {Feature Name}
**Version**: 1.0
**Last Updated**: YYYY-MM-DD

---

## Endpoints

### GET /api/{resource}

**Description**: Retrieve {resource} data

**Authentication**: Required

**Query Parameters**:

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response**:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```
````

**Example**:

```bash
curl -H "Authorization: Bearer {token}" \
  https://api.example.com/api/resource?page=1&limit=10
```

---

### POST /api/{resource}

**Description**: Create new {resource}

**Authentication**: Required

**Request Body**:

```json
{
  "name": "string",
  "description": "string"
}
```

**Response**:

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "createdAt": "timestamp"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [...]
}
```

---

## External APIs

### Stripe Payment API

- **Documentation**: [Stripe API Docs](https://stripe.com/docs/api)
- **Version**: 2024-11-20
- **Endpoints Used**:
  - `POST /v1/payment_intents`

---

## Related Files

- Implementation: `app/api/{resource}/route.ts`
- Types: `src/types/{resource}.ts`

````

### Bug Documentation
```markdown
# Bug: {Short Description}

**Date**: YYYY-MM-DD
**Severity**: Critical | High | Medium | Low
**Status**: Open | Fixed | Verified
**Epic/Phase**: {VERSION} - Phase {N}

## Issue
What was broken?

## Root Cause
Why did it happen?

## Solution
How was it fixed?

## Files Modified
- `path/to/file.ts`

## Prevention
How to avoid in the future?

## Time Impact
- Time to fix: N hours
- Phase delay: N days (if any)
````

### Architecture Decision Record (ADR)

```markdown
# ADR {N}: {Title}

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded

## Context

What is the issue we're trying to solve?

## Decision

What did we decide to do?

## Consequences

- **Positive**: Benefits
- **Negative**: Trade-offs
- **Risks**: What could go wrong?

## Alternatives Considered

- Alternative 1: Why not chosen
- Alternative 2: Why not chosen
```

---

## ✅ Best Practices

### DO:

- ✅ Use `@imports` to compose CLAUDE.md from modular files
- ✅ Keep early-stage docs simple and actionable
- ✅ Add structure only when complexity demands it
- ✅ Update epic progress at start/end of session
- ✅ Create phase summaries immediately after completion
- ✅ Use TodoWrite for within-session task tracking
- ✅ Document bugs as they occur
- ✅ Use `#` command for quick captures
- ✅ Use `/memory` for comprehensive edits
- ✅ Link between docs rather than duplicate
- ✅ Keep references.md updated with external links
- ✅ Include "last updated" dates for external resources
- ✅ Store exported designs locally when finalized
- ✅ Use relative paths for local attachments
- ✅ Organize attachments by type

### DON'T:

- ❌ Create elaborate structure before you need it
- ❌ Duplicate information across files
- ❌ Mix epic spec with progress tracking
- ❌ Forget to create phase summaries
- ❌ Skip updating progress tracker
- ❌ Create files "just in case"
- ❌ Mix multiple concerns in one file
- ❌ Forget to import new files into CLAUDE.md
- ❌ Create docs outside `.claude/` directory
- ❌ Store large video files in git (link instead)
- ❌ Include API keys or secrets in reference files
- ❌ Store working files (link to Figma/Sketch instead)
- ❌ Mix references for different features in one file

---

## 🔧 Lifecycle Management

### When to Archive

- Epic completed and reviewed
- Feature deprecated/removed
- Old decisions superseded
- Outdated patterns no longer used

### How to Archive

```
.claude/archive/
└── YYYY/
    ├── epics/
    ├── phases/
    ├── bugs/
    └── features/
```

### When to Update

- At start of each session (progress tracker)
- After completing each phase (create summary)
- After completing epic (finalize tracker)
- When patterns change (update standards)
- After major refactoring (update architecture)
- When external links change (update references.md)

---

## 📊 Benefits

### For AI (Claude Code)

- Fast context building (centralized location)
- Predictable structure (knows where to look)
- Reduced token usage (no duplicate reads)
- Better caching (stable file paths)
- Clear phase boundaries for context switching
- Easy access to designs and references

### For Developers

- Easy to find guidelines
- Clear source of truth
- Quick onboarding
- Track progress at epic and phase level
- Historical record of decisions
- Reduced decision fatigue
- All feature materials in one place

---

## 🚀 Migration Path (Current Project)

### Now (Early Stage):

```
✅ CLAUDE.md - imports coding-standards.md, workflows.md, documentation-policy.md
✅ Keep it simple - add files only when needed
✅ No epic/phase tracking yet (project just starting)
```

### When to Add Knowledge (5-10 features):

```
1. Create .claude/knowledge/ directory
2. Create knowledge/features/ subdirectory
3. For each feature:
   - Create features/{feature-name}/ directory
   - Create spec.md
   - Create references.md (if external links exist)
   - Create attachments/ (if local files exist)
4. Update CLAUDE.md imports
```

### When to Add Progress Tracking (First Epic):

```
1. Create .claude/progress/ directory
2. Create epics/ subdirectory
3. Create first epic spec, plan, and progress files
4. Create phases/ subdirectory when first phase completes
```

### When to Add Bug Tracking (As Needed):

```
1. Create .claude/progress/bugs/ directory
2. Document bugs using template
3. Reference bugs in phase summaries
```

---

## 🎓 Examples

### Early Stage (Current):

```bash
# Quick guideline
# Use Zod for all form validation

# Or edit directly
/memory
```

### Growth Stage with Features:

```bash
# Create feature with references
.claude/knowledge/features/authentication/
├── spec.md
├── references.md         # Figma, docs, etc.
└── attachments/
    ├── wireframes/
    │   └── login-flow.png
    └── designs/
        └── login-screen.png

# Import in CLAUDE.md or feature spec
See [references](./references.md) for designs
```

### Mature Stage with Epic Tracking:

```bash
# Starting Epic 1.1
.claude/progress/epics/epic-1.1-products.md      # Spec
.claude/progress/epics/plan-1.1.md               # Plan (3 phases)
.claude/progress/epics/progress-1.1.md           # Tracker

# After Phase 1 completes
.claude/progress/phases/phase-1-epic-1.1.md      # Summary

# Feature with full references
.claude/knowledge/features/products/
├── spec.md
├── references.md
├── api.md
└── attachments/
    ├── wireframes/
    ├── designs/
    ├── diagrams/
    └── docs/
```

---

## 📖 Quick Reference

**I need to...**

| Task                  | Action                      | File Location                                             |
| --------------------- | --------------------------- | --------------------------------------------------------- |
| Add quick guideline   | Use `#` command             | `.claude/*.md`                                            |
| Edit existing memory  | Use `/memory` command       | `.claude/`                                                |
| Start new epic        | Create spec, plan, progress | `.claude/progress/epics/`                                 |
| Track epic progress   | Update progress file        | `.claude/progress/epics/progress-{version}.md`            |
| Complete a phase      | Create phase summary        | `.claude/progress/phases/phase-{N}-epic-{version}.md`     |
| Document bug          | Create bug file             | `.claude/progress/bugs/`                                  |
| Create feature spec   | Create feature directory    | `.claude/knowledge/features/{name}/`                      |
| Link to Figma design  | Add to references.md        | `.claude/knowledge/features/{name}/references.md`         |
| Store exported design | Save to attachments         | `.claude/knowledge/features/{name}/attachments/designs/`  |
| Document API          | Create api.md               | `.claude/knowledge/features/{name}/api.md`                |
| Store diagram         | Save to attachments         | `.claude/knowledge/features/{name}/attachments/diagrams/` |
| Document architecture | Create/update file          | `.claude/architecture.md`                                 |
| Find all guidelines   | Read CLAUDE.md              | `CLAUDE.md`                                               |

---

**Version**: 1.1
**Last Updated**: 2025-11-26
**Project Stage**: Early (Phase 1)
**Next Review**: When first epic begins or 3+ features implemented
