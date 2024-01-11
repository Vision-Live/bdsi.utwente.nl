---
title: Data Science Grant Q4 2023 - Winners
authors:
 - Anna Machens
 - Karel Kroeze
frontpage: true
tags: [data science grant, data science grant 2023, winners]
---

Of the many high-quality applications we received for the December 1st deadline of the Data Science Grant, we had the difficult task of selecting a handful of the most innovative and impactful proposals. After thoughtful consideration, we were left with four proposals to support - two in full, two as a more limited pilot.

It was our pleasure to inform the winning applicants just before the holidays, and we are now ready to announce the results to the BDSi community. So, without further ado, here are the winning applicants, and their proposals. 

{% assign _projects = site.projects | where_exp: "project", "project.tags contains 'data science grant 2023'" %}
{% for project in _projects %}
    {% include profile-widget-generic.html name=project.authors.first affiliation=project.title affiliation_url=project.url description=project.introduction %}
{% endfor %}

