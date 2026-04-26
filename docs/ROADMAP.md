# Roadmap

> Future improvements and feature ideas.

This document outlines potential enhancements, organized by priority and complexity.

---

## Current State (v1.0)

✅ Entry experience with visitor type selection  
✅ Adaptive content paths (Developer, Recruiter, Student, Explorer)  
✅ Dark/light mode with system preference detection  
✅ Anonymous analytics with public dashboard  
✅ Contact form with Supabase integration  
✅ Fully responsive design  
✅ Accessibility (keyboard navigation, focus states, screen reader support)

---

## Short Term (v1.1)

### Enhanced Analytics Dashboard

**Current:** Simple count of visitors by type  
**Improvement:** Visual dashboard with charts

```
┌─────────────────────────────────────────────┐
│  Visitor Insights (Public)                  │
├─────────────────────────────────────────────┤
│  This Month                                 │
│  ████████████████████ 42 Developers         │
│  ████████ 18 Recruiters                     │
│  ██████████ 27 Students                     │
│  ████████████████████████ 63 Explorers      │
│                                             │
│  Top Countries: 🇺🇸 🇬🇧 🇩🇪 🇮🇳 🇨🇦              │
│  Avg. Time: 4m 12s                          │
└─────────────────────────────────────────────┘
```

**Effort:** Medium  
**Impact:** High (social proof)

### GitHub Stats Integration

**Current:** Static project information  
**Improvement:** Live GitHub API data

```typescript
// Fetch real stats
const stats = await getGitHubStats('yourusername');
// stars, forks, contributions, recent activity
```

**Effort:** Low  
**Impact:** Medium (credibility)

### Keyboard Shortcuts

**Current:** Basic tab navigation  
**Improvement:** Vim-style navigation

```
j/↓ - Next section
k/↑ - Previous section
/ - Search (future)
? - Show shortcuts
```

**Effort:** Low  
**Impact:** Medium (developer audience loves this)

### Improved Entry Animation

**Current:** Simple fade transitions  
**Improvement:** More memorable entry

Idea: Typing effect that reveals the greeting character by character, then morphs into the question.

**Effort:** Medium  
**Impact:** Medium (first impression)

---

## Medium Term (v1.2)

### Interactive Project Demos

**Current:** Links to live demos  
**Improvement:** Embedded mini-demos

```
┌─────────────────────────────────────────────┐
│  Project: CLI Tool                          │
├─────────────────────────────────────────────┤
│  $ try-it-now                               │
│  │                                          │
│  ▌ Interactive terminal here                │
│                                             │
└─────────────────────────────────────────────┘
```

Use WebContainers or embedded terminals for live code demos.

**Effort:** High  
**Impact:** Very High (memorable)

### Content Personalization

**Current:** Fixed content per visitor type  
**Improvement:** Learn and adapt within a session

```typescript
// Track engagement
if (visitorSpentMoreTimeOn('architecture')) {
  showMore('technical-depth');
}

if (visitorSkipped('business-outcomes')) {
  hideFrom('future-sections');
}
```

**Effort:** High  
**Impact:** Medium (more relevant experience)

### Offline Support

**Current:** Requires internet  
**Improvement:** Service worker for return visits

```typescript
// Cache on first visit
caches.open('not-a-portfolio-v1').then((cache) => {
  cache.addAll(['/static/...']);
});
```

**Effort:** Medium  
**Impact:** Low (nice-to-have)

### Internationalization

**Current:** English only  
**Improvement:** Multiple languages

Priority languages:

1. English (default)
2. Spanish
3. Mandarin
4. Hindi

**Effort:** High  
**Impact:** Medium (broader reach)

---

## Long Term (v2.0)

### AI-Powered Q&A

**Current:** Static FAQ  
**Improvement:** Chat with an AI trained on your content

```
User: "What's your experience with microservices?"

AI: "I've built microservices architectures at [Company],
handling 10K+ RPS. The key lesson was that monoliths
aren't bad—premature microservices are. Here's a project
where I made that mistake and learned from it..."
```

**Effort:** Very High  
**Impact:** Very High (unique differentiator)

### Visitor CRM

**Current:** Anonymous one-way messages  
**Improvement:** Opt-in conversation threads

```
Visitor (recruiter): "Interested in discussing a role"
You: Response via dashboard
Thread continues...
```

**Effort:** High  
**Impact:** High (better engagement)

### A/B Testing Framework

**Current:** Fixed entry experience  
**Improvement:** Test different approaches

```typescript
// 50/50 split
const variant = useExperiment('entry-question', ['a', 'b']);

// Variant A: "Who are you?"
// Variant B: "What brings you here?"

// Track which converts better
```

**Effort:** Medium  
**Impact:** Medium (data-driven optimization)

### Portfolio-as-Code API

**Current:** Content in config file  
**Improvement:** API for updating content

```bash
# Update from CLI
nap update --project "New Project" --title "..."

# Sync from Notion
nap sync --source notion --database-id ...
```

**Effort:** High  
**Impact:** Low (developer convenience)

---

## Ideas Backlog

These are interesting but not prioritized:

- **Audio mode**: Hear the content read aloud
- **Print stylesheet**: Clean printable version
- **RSS feed**: For content updates
- **Web3 verification**: Prove identity without revealing it
- **Time-based themes**: Subtle changes by time of day
- **Seasonal touches**: Very subtle holiday acknowledgments
- **Reading progress**: "You've explored 60% of this site"
- **Social sharing cards**: Dynamic OG images per section

---

## Technical Debt

### Current Issues

- [ ] Animation performance on low-end devices
- [ ] Supabase client initialization runs even when not configured
- [ ] Some components have mixed concerns (display + state)
- [ ] Test coverage is minimal

### Planned Improvements

- [ ] Add Playwright E2E tests for critical paths
- [ ] Extract hooks into separate files (currently all in index.ts)
- [ ] Add Storybook for component documentation
- [ ] Implement proper error boundaries
- [ ] Add bundle analysis to CI

---

## Contributing Ideas

Have an idea not listed here?

1. Check if similar idea exists
2. Open an issue with:
   - Clear description
   - Expected impact
   - Rough effort estimate
3. Discussion happens in the issue

Good ideas will be added to this roadmap.

---

## Version History

| Version | Date | Highlights      |
| ------- | ---- | --------------- |
| 1.0.0   | TBD  | Initial release |

---

## Principles for Future Work

1. **Don't add features just to add features**  
   Every addition should serve the core mission: a meaningful conversation.

2. **Maintain the calm**  
   New features shouldn't disrupt the minimal, focused experience.

3. **Performance is a feature**  
   If it slows things down, it's not worth it.

4. **Privacy by default**  
   Any new data collection must be opt-in and transparent.

5. **Accessibility is non-negotiable**  
   Every new feature must work for everyone.
