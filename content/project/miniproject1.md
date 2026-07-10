---
title: "The Effect of Rain on Depression Rates in California"
date: 2026-07-09
author: "The Optimizers"
description: "A short analysis on the relationship between precipitation and depression rates across California counties."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

We examined annual precipitation and depression rates across California’s 58 counties using choropleth maps. We then constructed a scatterplot to assess the association between the two variables.

## **County maps** 

<figure id="precipitation_map" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff;">
    <iframe src="/26-the-optimizers/project/miniproject1/precipitation_choropleth.html"
    style="width: 100%; height: 600px; border: none; border-radius: 6px;"
    scrolling="no">
    </iframe>
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666"; margin-top: 0.5rem;>
        Figure 1 - Precipitation Choropleth
    </figcaption>
</figure>

<figure id="depression_map" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff;">
    <iframe src="/26-the-optimizers/project/miniproject1/depression_choropleth.html"
    style="width: 100%; height: 600px; border: none; border-radius: 6px;"
    scrolling="no">
    </iframe>
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 2 - Depression Choropleth
    </figcaption>
</figure>

## **Annual Precipitation vs Depression Rate** 

<figure id="scatterplot" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/project/miniproject1/scatter_plot.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
    <figcaption style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
        Figure 3 - Annual Precipitation vs Depression Rate
    </figcaption>
</figure>

## **Conclusion** 

Our analysis found a moderate-to-strong positive relationship between annual precipitation and depression rates across California counties. The scatterplot and regression line suggest that counties with higher precipitation tend to have higher depression rates, although there is considerable variability, indicating that precipitation is only one of many factors that may influence depression.

</div>