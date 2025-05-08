---
layout: page
title: Fleeting Notes
permalink: /fleeting
---

<div class="wrap">
  <p class="muted font-ui" style="margin-bottom: 1.5rem;">Recent fleeting notes (past 10&nbsp;days)</p>
  
  {% include fleeting_calendar.html %}
  <p class="small muted font-ui" style="margin-top:2rem;">Older fleeting notes are not listed publicly.</p>
</div>

<style>
  .fleeting-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
  .fleeting-card {
    display: block;
    padding: 1rem;
    background: rgba(var(--color-tx-normal-rgb), 0.05);
    border: 1px solid var(--color-ui-normal);
    border-radius: var(--border-radius);
    text-decoration: none;
    transition: background 0.2s;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  .fleeting-card:hover {
    background: rgba(var(--color-tx-normal-rgb), 0.1);
  }
  .fleeting-card .date {
    font-weight: 600;
    display: block;
    margin-bottom: .25rem;
    color: var(--color-tx-normal);
  }
  .fleeting-card .excerpt {
    color: var(--color-tx-muted);
    font-size: var(--font-small);
    word-break: break-word;
    overflow-wrap: anywhere;
  }
</style> 