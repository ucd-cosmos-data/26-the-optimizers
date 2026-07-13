---
title: "The Effect of Rain on Depression Rates in California"
date: 2026-07-09
author: "The Optimizers"
description: "A short analysis on the relationship between precipitation and depression rates across California counties."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

We examined annual precipitation and depression rates across California’s 58 counties using choropleth maps. We then constructed a scatterplot to assess the association between the two variables.

## Guiding Question
> *What is the correlation between depression rates and precipitation in California?*

## Hypothesis
We hypothesized that counties with greater annual precipitation totals would tend to have higher rates of depression. This hypothesis was based on the idea that prolonged periods of rainfall and reduced sunlight may be associated with lower mood and higher rates of depression.

## Data Acquisition
In order to compare these two factors (precipitation and depression), we sourced data from two websites:
- [Data.CDC.gov](https://data.cdc.gov/500-Cities-Places/PLACES-County-Data-GIS-Friendly-Format-2025-releas/i46a-9kgh/about_data)
- [National Centers for Environmental Information](https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/county)

## Data Cleaning
To prepare the data for analysis, we combined the two datasets—one containing county-level depression rates and the other containing annual precipitation values—into a single dataset. The datasets were matched using the California county names and state abbreviations to ensure that each county's precipitation data corresponded to its depression rate. The final cleaned dataset contained four variables: **State Abbreviation**, **County Name**, **Depression Rate**, and **Annual Precipitation**. This standardized dataset was then used to create the choropleth maps and scatterplot for our analysis.

## County Visualization
<figure id="precipitation_map" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff;">
    <iframe src="/26-the-optimizers/projects/miniproject1/precipitation_choropleth.html"
    style="width: 100%; height: 600px; border: none; border-radius: 6px;"
    scrolling="no">
    </iframe>
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666"; margin-top: 0.5rem;>
        Figure 1 - Precipitation Choropleth
    </figcaption>
</figure>

<figure id="depression_map" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff;">
    <iframe src="/26-the-optimizers/projects/miniproject1/depression_choropleth.html"
    style="width: 100%; height: 600px; border: none; border-radius: 6px;"
    scrolling="no">
    </iframe>
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 2 - Depression Choropleth
    </figcaption>
</figure>

## Annual Precipitation vs Depression Rate
<figure id="scatterplot" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/miniproject1/scatter_plot.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 3 - Annual Precipitation vs Depression Rate
    </figcaption>
</figure>

## Analysis
The choropleth maps reveal that counties with the highest annual precipitation are generally concentrated in Northern California and along mountainous regions, while drier counties are more common in the southern and inland parts of the state. A similar geographic pattern appears in the depression-rate map, where several counties with higher precipitation also exhibit relatively high depression rates.

The scatterplot provides a clearer view of this relationship. The upward trend in the regression line indicates a positive association between annual precipitation and depression rates, meaning that counties receiving more rainfall tend to report higher levels of depression. However, the data points are spread out around the trend line, suggesting that the relationship is not perfect. Some counties have higher or lower depression rates than would be expected based on precipitation alone, indicating that other factors such as income, healthcare access, population density, climate, and demographics may also play important roles.

Overall, the visualizations support our hypothesis by showing a positive relationship between precipitation and depression rates, although precipitation alone does not fully explain differences in depression prevalence across California counties.

## Conclusion
Our findings support the hypothesis that California counties with higher annual precipitation generally have higher depression rates. While the relationship is positive, the variability in the data suggests that precipitation is only one of many factors influencing depression prevalence. Further research incorporating additional variables could provide a more complete understanding of the factors associated with depression.

</div>
