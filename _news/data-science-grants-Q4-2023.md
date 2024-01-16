---
title: Data Science Grant Q4 2023 - Winners
authors:
 - Anna Machens
 - Karel Kroeze
frontpage: true
image: "/assets/images/news/UTIMG40941_00b4b.jpg"
tags: [data science grant, data science grant 2023, winners]
---

Of the many high-quality applications we received for the December 1st deadline of the Data Science Grant, we selected the most innovative and impactful proposals. After thoughtful consideration, we were left with four proposals to support - two in full, two as a more limited pilot. We're excited about starting these new projects, and look forward to collaborating with the great teams behind them.

## BDSi Data Science grant
The BDSi Data Science Grants are decided twice yearly, generally at the end of Q2 and Q4. The grants are open for all BMS faculty that are looking to include data science in their research or education. We take on a limited number of high-potential projects both big and small, often creating a proof-of-concept for further research and grant applications. 

<a class="button" href="/data-science-grant">More information</a>

## Winning proposals
It was our pleasure to inform the winning applicants just before the holidays, and we are now ready to announce the results to the BDSi community. So, without further ado, here are the winning proposals.

{% assign _projects = site.projects | where_exp: "project", "project.tags contains 'data science grant 2023'" | sort: "project.title" %}
{% for project in _projects %}
{% assign contributors=project.authors | slice: 1, 99 %}

### {{project.title}}
{% include author-list.html authors=project.authors.first header="h4" %}
{% include author-list.html authors=contributors header="h6" %}
{{project.introduction}}

<a class="button" href="{{site.baseUrl}}{{project.url}}">Read more</a>
{% endfor %}
