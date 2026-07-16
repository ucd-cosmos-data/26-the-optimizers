---
title: "California Real Estate Market Segmentation Using K-Means Clustering"
date: 2026-07-15
author: "The Optimizers"
description: "This project applies K-means clustering to the California Housing dataset to identify distinct real-estate market regions based on geographic location and median house value."
---

# **Methodology**

## **Purpose of K-Means Clustering**

The purpose of K-means clustering in this analysis is to automatically group California block groups into distinct real-estate regions. By looking at both geographic coordinates (latitude and longitude) and home values, the algorithm uncovers natural boundaries where geography and market value overlap, helping us map out the state's distinct regional economies.

## **Data Structure**

The algorithm operates on a numerical matrix of shape $N \times D$:

- $N$ represents the 20,640 census block groups (neighborhoods) in the dataset.
- $D$ represents the three features we are clustering on—Longitude, Latitude, and Median House Value—all of which are standard-scaled.

## **Formulation of the Minimization Problem**

To find the best groups, K-Means tries to minimize the distance between each data point and the center of its assigned cluster. This total distance is called **inertia**.

Mathematically, if we partition our data into K separate clusters, $C = \\{C_1, C_2, \dots, C_k\\}$, the algorithm solves this optimization problem:

$$\arg\min_{\mathbf{C}} \sum_{i=1}^{K} \sum_{\mathbf{x} \in C_i} \Vert{}\mathbf{x} - \boldsymbol{\mu}_i\Vert{}^2$$

where:

- $\mathbf{x}$ is a 3D coordinate representing a block's location and price.
- $\boldsymbol{\mu}_i$ is the center (mean vector) of cluster $C_i$
- $\Vert{}\mathbf{x} - \boldsymbol{\mu}_i\Vert{}^2$ is the squared Euclidean distance from the point to its cluster center.

## **The Optimization Algorithm**