---
title: "Statistical Analysis—Did COSMOS UC Davis Use Roommate Surveys?"
date: 2026-07-09
author: "Shreyas"
description: "An analysis of whether COSMOS UC Davis used roommate survey responses when assigning roommates. Conducted by Shreyas, Sonia, Sahil, Advait, and Ashley"
math: true
---

## Roommate Surveys Were Taken Into Consideration at COSMOS UC Davis

### Methodology

Our study was conducted on the members of the 2026 COSMOS Cluster 11 at UC Davis. We claim that UC Davis COSMOS assigned students with roommates from another cluster, implying that none of the members of our study are roommates with each other. The questions on our survey were all directly asked on the COSMOS Roommate survey. Our data was acquired and cleaned manually.

### Data 


The following table shows the cleaned survey data used in our analysis.

| Roommate Cluster | Same Grade | Similar Sleep Schedule | Roommate Rating | Shared Interest |
| --- | --- | --- | --- | --- |
| 14 | True | True | 9 | Sports |
| 4 | True | True | 8 | Sports |
| 11 | False | True | 6 | No shared interest |
| 3 | True | True | 8 | Sports |
| 13 | True | True | 8 | Sports |
| 5 | True | True | 8 | Sports |
| 4 | False | True | 7 | No shared interest |
| 13 | True | True | 9 | Arts |
| 2 | True | True | 9 | Academics |
| 13 | False | False | 5 | No shared interest |
| 11 | True | True | 8 | Sports |
| 7 | True | True | 5 | No shared interest |
| 12 | True | True | 8 | Academics |
| 5 | True | False | 8 | Academics |
| 12 | True | True | 7 | Sports |
| 3 | True | True | 8 | Sports |
| 1 | True | True | 6 | Academics |
| 10 | True | True | 6 | No shared interest |
| 8 | True | False | 7 | Academics |
| 1 | True | True | 4 | Academics |
| 13 | True | True | 8 | Arts |


<figure id="roommate_rating_histogram" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/project/group_survey/roommate_rating_histogram.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 1 - Roommate Rating Distribution
    </figcaption>
</figure>

<figure id="roommate_shared_interests" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/project/group_survey/roommate_shared_interests.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 2 - Roommate Shared Interests
    </figcaption>
</figure>

### Analysis

Qualities such as being in the same grade, sharing common interests, sharing the same sleep schedule, and satisfaction with the roommate (all of which were considered in our study), provide an insight into whether COSMOS UC Davis considered the survey or not. 

#### Evidence of Intentional Assignment

Assuming three categories of sleep cycles (early birds, night owls, and intermediate), with people equally split between them, the probability that any two people share the same sleep cycle is $\frac{1}{3}.$ If COSMOS randomly assigned roommates, we would expect $21 * \frac{1}{3} = 7$ of the members to have matching sleep schedules with their roommate. However, we observed $18$ people who reported that they shared the same sleep schedule, which is statistically significant.

Additionally, people with roommates in the same grade and/or similar interests, and/or the same schedule reported a higher level of satisfaction with their roommates than those who didn’t, showing that COSMOS effectively assigned roommates.

<figure id="roommate_rating_comparison" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/project/group_survey/roommate_rating_comparison.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 3 - Roommate Rating Comparison by Shared Characteristics
    </figcaption>
</figure>
