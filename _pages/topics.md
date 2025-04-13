---
layout: page
title: Topics
permalink: /topics
---

<div class="wrap">
  <h1>Topics</h1>
  
  <p>Browse my notes by topic:</p>
  
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
      <h3 id="{{ tag | slugify }}">{{ tag }}</h3>
      <ul class="list-plain">
        {% assign tag_notes = site.notes | where_exp: "note", "note.tags contains tag" | sort: "date" | reverse %}
        {% for note in tag_notes %}
          <li class="mt-4">
            <a href="{{ site.baseurl }}{{ note.url }}" class="internal-link">{{ note.title }}</a>
            <div class="muted small">
              {{ note.date | date: "%B %e, %Y" }}
            </div>
          </li>
        {% endfor %}
      </ul>
    {% endfor %}
  </div>
</div>

<style>
  .list-plain {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
  }
  
  .mt-4 {
    margin-top: 1rem;
  }
</style> 