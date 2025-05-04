---
layout: page
title: Fleeting Notes
permalink: /fleeting
---

<div class="wrap">
  <p class="muted font-ui">Recent fleeting notes (past 7&nbsp;days)</p>
  
  <ul class="list-plain tabular-nums">
    {% assign recent_fleeting = site.fleeting | sort: "date" | reverse %}
    {% for fleeting in recent_fleeting limit:7 %}
      <li>
        <a href="{{ site.baseurl }}{{ fleeting.url }}" class="internal-link plain">
          <flex class="align-baseline">
            <span class="muted ppr flex-shrink small mh nowrap font-ui">{{ fleeting.date | date: "%Y · %m · %d" }}</span>
            <u>{{ fleeting.title | default: "Fleeting note" }}</u>
          </flex>
        </a>
      </li>
    {% endfor %}
  </ul>
  <p class="small muted font-ui" style="margin-top:2rem;">Older fleeting notes are not listed publicly.</p>
</div> 