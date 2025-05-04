---
layout: page
title: Home
id: home
permalink: /
---

<div class="wrap">
  <p><a href="/notes/latest" class="muted font-ui">Latest</a></p>

  {% assign latest_note = site.notes | sort: "date" | reverse | first %}
  {% if latest_note %}
  <div>
    <a href="{{ site.baseurl }}{{ latest_note.url }}" class="plain">
      <h2>{{ latest_note.title }}</h2>
      <div class="metadata muted small pb font-ui">
        <time datetime="{{ latest_note.date }}">{{ latest_note.date | date: "%B %e, %Y" }}</time> · <span class="reading-time" title="Estimated read time">{% assign words = latest_note.content | number_of_words %}{% if words < 360 %}1 minute{% else %}{{ words | divided_by:180 }} minutes{% endif %} read</span>
      </div>
      <div class="small muted">
        {{ latest_note.content | strip_html | truncatewords: 30 }} Keep reading →
      </div>  
    </a>
  </div>
  {% endif %}

  <hr class="mn2 ms2">

  <p><a href="/topics" class="muted internal-link font-ui">Topics</a></p>

  <div class="line-height-loose">
    {% assign all_tags = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.tags.size > 0 %}
        {% for tag in note.tags %}
          {% assign all_tags = all_tags | push: tag %}
        {% endfor %}
      {% endif %}
    {% endfor %}
    {% assign unique_tags = all_tags | uniq | sort %}
    {% for tag in unique_tags %}
      <a href="/topics/{{ tag | slugify }}" class="internal-link">{{ tag }}</a>{% unless forloop.last %}<span class="muted">,</span>{% endunless %}
    {% endfor %}
  </div>

  <hr class="mn2 ms2">

  <p class="muted font-ui"><a href="/writing" class="muted internal-link">Writing</a></p>

  <ul class="list-plain tabular-nums">
    {% assign sorted_notes = site.notes | sort: "date" | reverse %}
    {% for note in sorted_notes %}
      <li>
        <a href="{{ site.baseurl }}{{ note.url }}" class="internal-link plain">
          <flex class="align-baseline">
            <span class="muted ppr flex-shrink small mh nowrap font-ui">{{ note.date | date: "%Y · %m" }}</span>
            <u>{{ note.title }}</u>
          </flex>
        </a>
      </li>
    {% endfor %}
  </ul>

  <hr class="mn2 ms2">

  <p class="muted font-ui"><a href="/fleeting" class="muted internal-link">Fleeting&nbsp;Notes</a></p>

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

  <hr class="mn2 ms2">
</div>

<style>
  .wrapper {
    max-width: 46em;
  }
  
  .list-plain {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .mn2 {
    margin: 2rem 0;
  }
  
  .ms2 {
    margin-left: 2rem;
    margin-right: 2rem;
  }
  
  .ppr {
    padding-right: 1rem;
  }
  
  .pb {
    padding-bottom: 0.5rem;
  }
  
  .mh {
    margin-right: 0.5rem;
  }
  
  flex, .flex {
    display: flex;
  }
  
  .align-baseline {
    align-items: baseline;
  }
  
  .flex-shrink {
    flex-shrink: 1;
  }
  
  u {
    text-decoration: none;
    border-bottom: 1px solid var(--color-tx-muted);
  }
  
  a.plain:hover u {
    border-color: var(--color-tx-normal);
  }
</style>
