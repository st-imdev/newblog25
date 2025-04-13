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
  
  <div class="newsletter-form">
    <form action="https://buttondown.email/api/emails/embed-subscribe/{{ site.buttondown_username }}" method="post" target="popupwindow" onsubmit="window.open('https://buttondown.email/{{ site.buttondown_username }}','popupwindow')" class="embeddable-buttondown-form">
      <input type="email" name="email" id="bd-email" placeholder="Enter your email" class="email-input">
      <input type="hidden" value="1" name="embed">
      <input type="hidden" name="tag" value="via-subscribe">
      <input type="submit" value="Sign up" class="submit-button">
    </form>
  </div>
  
  <h2>Other ways to follow</h2>
  <ul class="follow-list">
    <li><a href="{{ site.baseurl }}/feed.xml" class="follow-link">RSS Feed</a> - Follow using your favorite feed reader</li>
    <li><a href="https://twitter.com/{{ site.twitter_username }}" target="_blank" rel="noopener noreferrer" class="follow-link">Twitter</a> - Occasional updates and links</li>
    <li><a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener noreferrer" class="follow-link">GitHub</a> - Follow my code projects</li>
  </ul>
</div>

<style>
  .newsletter-form {
    margin: 2rem 0;
  }
  
  .email-input {
    width: var(--input-width);
    padding: 0.8rem;
    margin-right: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid var(--color-ui-normal);
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-family: var(--font-ui);
    background: var(--color-bg-primary);
    color: var(--color-tx-normal);
  }
  
  .email-input:focus {
    outline: none;
    border-color: var(--color-action);
    box-shadow: 0 0 0 2px var(--color-bg-hover);
  }
  
  .submit-button {
    padding: 0.8rem 1.2rem;
    background-color: var(--color-action);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-family: var(--font-ui);
    cursor: pointer;
  }
  
  .submit-button:hover {
    opacity: 0.9;
  }
  
  .follow-list {
    padding-left: 1.2rem;
    line-height: 1.8;
  }
  
  .follow-link {
    font-weight: 500;
    text-decoration: underline;
  }
  
  @media (max-width: 600px) {
    .email-input, .submit-button {
      width: 100%;
      margin-right: 0;
    }
  }
</style> 