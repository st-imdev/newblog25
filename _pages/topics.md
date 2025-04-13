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
      <ul>
        {% for note in site.notes %}
          {% if note.tags contains tag %}
            <li>
              <a href="{{ site.baseurl }}{{ note.url }}" class="internal-link">{{ note.title }}</a>
              <span class="muted small">
                {{ note.last_modified_at | date: "%B %e, %Y" }}
              </span>
            </li>
          {% endif %}
        {% endfor %}
      </ul>
    {% endfor %}
  </div>
</div> 