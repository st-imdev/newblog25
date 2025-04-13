---
layout: page
title: Writing
permalink: /writing
---

<div class="wrap">
  <h1>Writing</h1>
  
  <p>All my notes, essays, and articles in chronological order:</p>
  
  <ul class="list-plain tabular-nums">
    {% assign sorted_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
    {% for note in sorted_notes %}
      <li>
        <a href="{{ site.baseurl }}{{ note.url }}" class="internal-link plain">
          <flex class="align-baseline">
            <span class="muted ppr flex-shrink small mh nowrap font-ui">{{ note.last_modified_at | date: "%Y · %m" }}</span>
            <u>{{ note.title }}</u>
          </flex>
        </a>
      </li>
    {% endfor %}
  </ul>
</div> 