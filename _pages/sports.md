---
layout: profile
kind: sports
title: "Sports"
permalink: /sports/
description: "Hao Ma beyond research: badminton, running, and half-marathon memories."
---
<div class="sports-intro"><div><p class="eyebrow">LIFE BEYOND RESEARCH</p><h1>Beyond the desk.</h1><p class="sports-lead">Badminton and running keep me moving. Moments from the court, the road, and the finish line.</p></div><nav class="sports-shortcuts" aria-label="Sports sections"><a href="#badminton">Badminton ↓</a><a href="#running">Running ↓</a></nav></div>
<section class="sports-section" id="badminton" aria-labelledby="badminton-title">
  <div class="section-heading"><div><p class="eyebrow">ON THE COURT</p><h2 id="badminton-title">BADMINTON</h2></div><time class="event-date" datetime="{{ site.data.sports.badminton.date_iso }}">{{ site.data.sports.badminton.date }}</time></div>
  {% include event-photo-row.html event=site.data.sports.badminton %}
</section>
<section class="sports-section" id="running" aria-labelledby="running-title">
  <div class="section-heading"><div><p class="eyebrow">OUT ON THE ROAD</p><h2 id="running-title">Running</h2></div></div>
  {% for event in site.data.sports.running %}
  <article class="race-album">
    <div class="album-heading"><h3>{{ event.name }}</h3><time class="event-date" datetime="{{ event.date_iso }}">{{ event.date }}</time></div>
    {% include event-photo-row.html event=event %}
  </article>
  {% endfor %}
</section>
<div class="sports-outro">A change of pace does a world of good.<a href="{{ '/#publications' | relative_url }}">Back to research ↗</a></div>
