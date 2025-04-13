---
layout: page
title: Subscribe
permalink: /subscribe
---

<div class="wrap">
  <h1>Receive my updates</h1>
  
  <p>Stay up to date with my latest writing and projects.</p>
  
  <h2>Newsletter</h2>
  <p>The best way to follow my work is through email. I send occasional updates when I publish new content.</p>
  
  <div class="mn2">
    <form action="https://buttondown.email/api/emails/embed-subscribe/{{ site.buttondown_username }}" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.email/{{ site.buttondown_username }}','popupwindow')" class="embeddable-buttondown-form">
      <input type="email" name="email" id="bd-email" placeholder="Enter your email">
      <input type="hidden" value="1" name="embed">
      <input type="hidden" name="tag" value="via-subscribe">
      <input type="submit" value="Sign up">
    </form>
  </div>
  
  <h2>Other ways to follow</h2>
  <ul>
    <li><a href="{{ site.baseurl }}/feed.xml">RSS Feed</a> - Follow using your favorite feed reader</li>
    <li><a href="https://twitter.com/{{ site.twitter_username }}" target="_blank" rel="noopener noreferrer">Twitter</a> - Occasional updates and links</li>
    <li><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener noreferrer">GitHub</a> - Follow my code projects</li>
  </ul>
</div> 