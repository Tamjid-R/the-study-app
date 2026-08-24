# TODO / Ideas not yet implemented

Everything in the "Recently completed" list below is done and shipped in
this build. Everything after that is optional future work — nothing here
blocks using the app today.

## Recently completed (this round)

- [x] Expanded Articulate topic bank to 300+ entries across mythology,
      movies, opinions/controversial opinions, one-word prompts, one-liners,
      internet culture, ethics, life, fashion & style, career, tech/CSE/AI,
      and math
- [x] "Don't repeat until exhausted" shuffle-bag for topic selection
- [x] Session name autocomplete (recent names suggested while typing)
- [x] Sound chime + browser notifications when a session/break ends
- [x] Session tags (Work/Study/Reading/Writing/Coding/Other) + tag
      breakdown chart
- [x] Daily goal setting + progress ring on the Pomodoro page
- [x] GitHub-style yearly focus heatmap
- [x] "Best time of day" productivity insight
- [x] Combined Pomodoro + Articulate "Overview" dashboard tab in Analytics
- [x] Non-persistent sidebar (overlay drawer on all screen sizes)
- [x] 7 new themes: Noir Orchid, Blue Hour, Neobrutalist, Panel Pop, Dark
      Fantasy, Vintage Vibe, Level Up Academy (11 themes total)
- [x] Subtle page-turn transition between sections

## Not yet implemented — worth considering next

### Quick wins
- [ ] **Streak tracking** — consecutive days with at least one completed
      Pomodoro, shown as a stat/badge.
- [ ] **Keyboard shortcuts** — spacebar to start/pause the active timer, `R`
      to reset, `N` for a new Articulate topic. Needs a global key-listener
      that's smart enough not to fire while typing in a text field.
- [ ] **Undo toast** after deleting/clearing data ("Session deleted, undo?")
      instead of the current permanent confirm-and-delete flow.
- [ ] **Custom Articulate topic lists** — let the user add their own topics
      (e.g. for interview prep) that get mixed into the shuffle bag.

### Pomodoro / focus
- [ ] **Weekly goals** in addition to the current daily goal.
- [ ] **Focus mode** — a layout variant that hides the sidebar/topbar
      entirely while a focus session is running, to minimize on-screen
      distraction.
- [ ] **Session editing/deletion** — currently the history is append-only;
      there's no way to fix a mis-tagged or accidentally-long session after
      the fact.

### Articulate
- [ ] **Topic category filter** — let the user restrict "Generate Topic" to
      one or more categories (e.g. "only Ethics and Philosophy today").
- [ ] **Self-rating after each attempt** — a quick 1–5 star tag added to
      each Speaking History entry.

### Analytics
- [ ] **Weekly/monthly heatmap zoom** — currently the heatmap is always a
      full year; a way to jump to a specific past year would help once
      there's multi-year history.
- [ ] **Exportable weekly report** — a nicely formatted printable/PDF
      summary of the week, good for reflection.

### Technical / reliability
- [ ] **PWA support** — add a web manifest + service worker so the app can
      be "installed" to a home screen/desktop and works fully offline from
      first load (right now it needs one online load to fetch the Google
      Fonts and JS/CSS bundles).
- [ ] **Periodic backup reminder** — a gentle, dismissible banner every N
      weeks nudging the user to use Settings → Export, since data is
      device-local with no sync.
- [ ] **Automated tests** — there's currently no test suite (unit tests for
      the stats/time utilities and the timer hook would be the highest-value
      place to start).

### Polish
- [ ] **Custom color picker** in addition to the 11 preset themes.
- [ ] **More Articulate topics** — the shuffle bag makes repeats far less
      frequent, but the bank could keep growing over time.
