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

1. **Initialization:** The algorithm places $K$ initial cluster centers. We used the **k-means++** strategy, which spaces these starting points out across the data to speed up convergence and avoid poor cluster layouts.

2. **Assignment:** The algorithm calculates the Euclidean distance from every single data point to all $K$ centers. Each data point is assigned to its nearest center.

3. **Update:** The algorithm recalculates the position of each center by taking the average of all data points assigned to that cluster.

4. **Convergence:** Steps 2 and 3 repeat until the centers stop moving or hit a maximum iteration limit (ours was 500).

## **Hyperparameters**

The primary hyperparameter is the number of clusters ($K$). To select the ideal $K$, we balanced 2 methods: **The Elbow Method** and **Silhouette Score.**

- **The Elbow Method:** We plot the inertia for different values of $K$. As $K$ increases, inertia naturally drops. We look for the "elbow"—the point where the drop starts to level off and adding more clusters becomes insignificant. For this data, that point is around $K = 4$.

- **Silhouette Score:** This measures how how closely data points within the same cluster are grouped together compared to points in neighboring clusters.
    - $K = 2$ and $K = 3$ yield slightly higher scores (≈ 0.54 and 0.53) because they keep clusters large and far apart.
    - $K = 4$ maintains a solid score (0.49) while providing a much more useful regional breakdown by isolating both major coastal metros (Bay Area and Los Angeles) from inland regions.

<figure id="elbow_and_silhouette" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/miniproject2/elbow_and_silhouette.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

## **Why Scaling is Required**

Because K-Means clustering relies on **Euclidean distance**, variables with much larger numerical ranges will overwhelm variables with smaller ranges.

In our raw data, **Latitude** and **Longitude** only span a range of about 10 miles (e.g., 32 to 42 for Latitude). At the same time, **Median House Value** spans hundreds of thousands of dollars.

If we don't scale the data, the algorithm will essentially ignore location and cluster the blocks almost entirely by house value. We applied a StandardScaler to give all three features a mean of 0 and a standard deviation of 1, ensuring location and price carry equal weight in the distance calculations.

# Results and Interpretation

## Final Cluster Map

Below is the spatial representation of our four clusters across California. The geographic borders cleanly align with the state's natural economic divisions.

<figure id="cluster_scatterplot" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/miniproject2/cluster_scatterplot.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

*(Note: The full Python code to generate this scatterplot is provided in the Appendix)*

## Region Summary Table

<table style="width:100%; border-collapse: collapse; font-family: sans-serif;">
  <thead>
    <tr style="background-color: #1a2332; color: white; border-bottom: 2px solid #30363d;">
      <th style="padding: 12px; text-align: center;">Cluster</th>
      <th style="padding: 12px; text-align: left;">Identified Region</th>
      <th style="padding: 12px; text-align: right;">Mean House Value</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #30363d;">
      <td style="padding: 12px; text-align: center;">1</td>
      <td style="padding: 12px;">Region 1: Inland Northern & Central CA</td>
      <td style="padding: 12px; text-align: right;">$124,204</td>
    </tr>
    <tr style="background-color: #161b22; border-bottom: 1px solid #30363d;">
      <td style="padding: 12px; text-align: center;">2</td>
      <td style="padding: 12px;">Region 2: Inland/Rural Southern CA</td>
      <td style="padding: 12px; text-align: right;">$163,581</td>
    </tr>
    <tr style="border-bottom: 1px solid #30363d;">
      <td style="padding: 12px; text-align: center;">3</td>
      <td style="padding: 12px;">Region 3: San Francisco Bay Area</td>
      <td style="padding: 12px; text-align: right;">$331,013</td>
    </tr>
    <tr style="background-color: #161b22; border-bottom: 1px solid #30363d;">
      <td style="padding: 12px; text-align: center;">4</td>
      <td style="padding: 12px;">Region 4: Coastal Southern CA</td>
      <td style="padding: 12px; text-align: right;">$385,886</td>
    </tr>
  </tbody>
</table>

## **Interpretation**

The model successfuly divides California along two primary axes: **North vs. South** and **Coast vs. Inland**.

The algorithm successfuly isolated the state's two economic powerhouses. **Region 3** maps directly to the San Francisco Bay Area, showing a high average home value of **$331,013**. **Region 4** captures the premium coastal strip spanning Los Angeles down to San Diego, commanding the highest average home value in the state at **$385,886**.

In contrast, the inland regions represent more affordable agricultural and desert areas. **Region 1** (Inland North/Central Valley) is the most affordable at **$124,204**. **Region 2** (Inland South) is slightly more expensive at **$163,581**, capturing desert suburbs and the Inland Empire.

## **Conclusion**

Geography alone does not define California's real estate market. Instead, the algorithm shows that home values are driven by a proximity gradient: the closer a neighborhood is to the coast and major employment hubs, the more its value multiplies relative to inland areas.

# **Appendix**

```python
# Import the libraries used for data preparation, clustering, evaluation, and plotting.
from pathlib import Path

import matplotlib.pyplot as plt
from matplotlib.patches import Patch
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.datasets import fetch_california_housing
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

# Make results reproducible and plots consistent.
RANDOM_STATE = 42
plt.style.use("seaborn-v0_8-whitegrid")

# Locate the mini2 project whether the notebook starts in the repository root
# or in the notebooks directory.
working_directory = Path.cwd().resolve()
if (working_directory / "mini2").is_dir():
    PROJECT_DIR = working_directory / "mini2"
else:
    PROJECT_DIR = next(
        (path for path in (working_directory, *working_directory.parents) if path.name == "mini2"),
        None,
    )

if PROJECT_DIR is None:
    raise FileNotFoundError("Run this notebook from the repository or mini2 directory.")

DATA_CACHE_DIR = PROJECT_DIR / "data" / "raw" / "sklearn"
FIGURES_DIR = PROJECT_DIR / "results" / "figures"
DATA_CACHE_DIR.mkdir(parents=True, exist_ok=True)
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

# Download the California Housing dataset and keep its complete data frame.
housing = fetch_california_housing(
    as_frame=True,
    data_home=DATA_CACHE_DIR,
)
df = housing.frame.copy()

# Display the dataset description and a small preview for a basic data check.
print(housing.DESCR)
display(df.head())
print(f"Dataset shape: {df.shape[0]:,} rows x {df.shape[1]} columns")

# Use only the three features required by the project instructions.
FEATURES = ["Longitude", "Latitude", "MedHouseVal"]
X = df.loc[:, FEATURES].copy()

# Confirm that K-means will not receive missing or non-finite values.
if X.isna().any().any() or not np.isfinite(X.to_numpy()).all():
    raise ValueError("The clustering features contain missing or non-finite values.")

# Standardize each feature so its units and numeric range do not dominate
# the Euclidean distances used by K-means.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

scaling_check = pd.DataFrame(X_scaled, columns=FEATURES).agg(["mean", "std"])
display(scaling_check.round(3))

# Compare a small, interpretable range of cluster counts. Inertia measures
# within-cluster variation, while silhouette score measures separation.
candidate_k = range(2, 11)
model_selection_rows = []

for k in candidate_k:
    candidate_model = KMeans(
        n_clusters=k,
        init="k-means++",
        n_init=20,
        max_iter=500,
        random_state=RANDOM_STATE,
    )
    candidate_labels = candidate_model.fit_predict(X_scaled)
    score = silhouette_score(
        X_scaled,
        candidate_labels,
        sample_size=min(5_000, len(X_scaled)),
        random_state=RANDOM_STATE,
    )
    model_selection_rows.append(
        {"k": k, "inertia": candidate_model.inertia_, "silhouette_score": score}
    )

model_selection = pd.DataFrame(model_selection_rows)
BEST_K = 4
display(model_selection.round(4))
print(f"Selected number of clusters: K = {BEST_K}")

# Plot both diagnostics so the automatic silhouette choice can also be
# checked against the elbow in the inertia curve.
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

axes[0].plot(model_selection["k"], model_selection["inertia"], marker="o")
axes[0].set(title="Elbow Method", xlabel="Number of clusters (K)", ylabel="Inertia")

axes[1].plot(
    model_selection["k"],
    model_selection["silhouette_score"],
    marker="o",
    color="darkorange",
)
axes[1].axvline(BEST_K, color="gray", linestyle="--", label=f"Selected K = {BEST_K}")
axes[1].set(
    title="Silhouette Analysis",
    xlabel="Number of clusters (K)",
    ylabel="Silhouette score",
)
axes[1].legend()

fig.tight_layout()
plt.show()

# Refit K-means with the selected K and attach each observation's region label.
final_model = KMeans(
    n_clusters=BEST_K,
    init="k-means++",
    n_init=50,
    max_iter=500,
    random_state=RANDOM_STATE,
)
df["Cluster"] = final_model.fit_predict(X_scaled) + 1
df["Region"] = "Region " + df["Cluster"].astype(str)

print(f"Final model converged in {final_model.n_iter_} iterations.")
print(f"Final inertia: {final_model.inertia_:,.2f}")

# MedHouseVal is recorded in units of $100,000; convert it to dollars before
# reporting each region's mean house value.
region_summary = (
    df.groupby(["Cluster", "Region"], as_index=False)
    .agg(
        observations=("MedHouseVal", "size"),
        mean_longitude=("Longitude", "mean"),
        mean_latitude=("Latitude", "mean"),
        mean_house_value=("MedHouseVal", lambda values: values.mean() * 100_000),
    )
    .sort_values("Cluster")
)

region_summary_display = region_summary.copy()
region_summary_display["mean_house_value"] = region_summary_display["mean_house_value"].map(
    lambda value: f"${value:,.0f}"
)
display(region_summary_display)

# Load California county polygons and keep a local copy for future runs.
# Shared county edges are removed below, leaving only the California border.
import json
from collections import Counter
from matplotlib.collections import LineCollection

COUNTY_GEOJSON_PATH = PROJECT_DIR / "data" / "interim" / "ca_counties.geojson"

with COUNTY_GEOJSON_PATH.open(encoding="utf-8") as geojson_file:
    county_geojson = json.load(geojson_file)

# Count every California county-boundary segment. Segments shared by two
# counties occur twice; segments occurring once form the state border.
edge_counts = Counter()
for feature in county_geojson["features"]:
    geometry = feature["geometry"]
    polygons = (
        [geometry["coordinates"]]
        if geometry["type"] == "Polygon"
        else geometry["coordinates"]
    )
    for polygon in polygons:
        for ring in polygon:
            for start, end in zip(ring, ring[1:]):
                edge = tuple(sorted((tuple(start), tuple(end))))
                edge_counts[edge] += 1

california_border = [list(edge) for edge, count in edge_counts.items() if count == 1]

# Plot every housing observation at its geographic coordinates and color it
# by its assigned real-estate market region.
fig, ax = plt.subplots(figsize=(10, 10))
cluster_cmap = plt.get_cmap("tab10", BEST_K)
scatter = ax.scatter(
    df["Longitude"],
    df["Latitude"],
    c=df["Cluster"] - 1,
    cmap=cluster_cmap,
    vmin=-0.5,
    vmax=BEST_K - 0.5,
    s=8,
    alpha=0.55,
    linewidths=0,
    zorder=2,
)

# Draw the California state border over the clustered observations.
border_collection = LineCollection(
    california_border,
    colors="black",
    linewidths=1.4,
    zorder=3,
)
ax.add_collection(border_collection)

legend_handles = [
    Patch(facecolor=cluster_cmap(cluster - 1), label=f"Region {cluster}")
    for cluster in range(1, BEST_K + 1)
]
ax.legend(
    handles=legend_handles,
    title="K-means cluster",
    loc="best",
    frameon=True,
)
ax.set(
    title=f"California Real-Estate Market Regions (K = {BEST_K})",
    xlabel="Longitude",
    ylabel="Latitude",
)
ax.set_aspect("equal", adjustable="box")
fig.tight_layout()

# Save the required final map at publication quality.
MAP_PATH = FIGURES_DIR / "california_housing_kmeans_regions.png"
fig.savefig(MAP_PATH, dpi=300, bbox_inches="tight")
plt.show()
print(f"Saved final map to: {MAP_PATH}")
```