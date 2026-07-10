---
title: "Statistical Analysis—Did COSMOS UC Davis Use Roommate Survey Responses?"
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

Assuming three categories of sleep cycles (early birds, night owls, and intermediate) and that people are equally distributed among them, the probability that two randomly selected people share the same sleep cycle is $\frac{1}{3}$. Under random roommate assignment, we would therefore expect about $21 \times \frac{1}{3} = 7$ participants to report having the same sleep schedule as their roommate. Instead, $18$ of the $21$ participants reported sharing the same sleep schedule with their roommate. A binomial test comparing the observed proportion to the expected probability under random assignment yielded a statistically significant result ($p < 0.001$), indicating that the observed number of matching sleep schedules is far greater than would be expected by chance alone.


<figure id="desmos_analysis" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/photos/desmos.png"
        style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
<figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 3 - Desmos Binomial Distribution Analysis
    </figcaption>
</figure>

Additionally, participants who reported being in the same grade, having similar interests, and/or sharing the same sleep schedule with their roommate also reported higher levels of roommate satisfaction than those who did not as shown in [Figure 4](#roommate_rating_comparison). Together, these findings suggest that COSMOS' roommate assignments were associated with characteristics that contribute to positive roommate experiences, rather than appearing to be random.

<figure id="roommate_rating_comparison" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/project/group_survey/roommate_rating_comparison.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 4 - Roommate Rating Comparison by Shared Characteristics
    </figcaption>
</figure>

### Conclusion
In conclusion, the statistically significant results for sleep schedule compatibility, along with the high rates of shared interests and roommate satisfaction, suggest that COSMOS UC Davis effectively used roommate survey responses in its roommate pairing process.