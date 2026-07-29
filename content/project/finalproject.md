---
title: "Patient-Specific EEG Electrode Selection for Reduced-Channel Seizure Prediction"
date: 2026-08-01
author: "The Optimizers"
description: "Investigating whether personalized EEG electrode subsets can maintain seizure prediction performance while reducing the number of sensors required."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

## **Introduction and Motivation**

Electroencephalograms (EEGs) are widely used for seizure detection because they measure brain activity with high temporal resolution. Predicting seizures before they occur can improve patient safety and quality of life by providing early warnings. However, conventional EEG systems require many electrodes, making long-term monitoring uncomfortable and limiting their use in wearable or home-based devices.

Most seizure prediction methods use the same fixed set of EEG sensors for every patient, despite large differences in seizure patterns between individuals. As a result, sensors that are informative for one patient may contribute little for another. This study investigates whether patient-specific electrode selection can improve seizure prediction using a reduced number of EEG channels. We compare personalized electrode subsets with generalized electrode selections shared across patients to evaluate the trade-off between personalization and generalization.

Specifically, we address three questions:

1. How many EEG electrodes are needed to preserve seizure prediction performance?
2. Do patient-specific electrode selections outperform generalized selections?
3. Are certain electrodes consistently selected across patients?

Answering these questions can support the development of more practical and comfortable EEG systems for long-term seizure monitoring.

## **Dataset and Preprocessing**

We used scalp EEG recordings from the Siena Scalp EEG Database, which contains 41 EDF recordings from 14 patients, including 47 annotated seizures and approximately 128 hours of EEG. For patient-specific training specifically, we restricted the analysis to the eight patients with at least three usable seizures (PN00, PN05, PN06, PN09, PN10, PN12, PN13, and PN14), yielding 37 seizures in total.

For each seizure, we extracted the five-minute preictal period immediately preceding seizure onset and paired it with a five-minute interictal segment from the same patient. Interictal segments were selected from seizure-free EEG and required to remain at least five minutes away from any annotated seizure to avoid contamination by preictal activity.

The model operated at five-second prediction landmarks. At each landmark, only the preceding 120 seconds of EEG were used as input, ensuring a causal prediction setting with no future information. The prediction target was whether a seizure would begin within the following five minutes. This prediction horizon was represented as 60 consecutive five-second onset bins plus a separate "no seizure within five minutes" class, producing 60 training observations from each preictal or interictal episode.

Only EEG channels were retained, while auxiliary signals such as EKG were discarded. Channel labels were standardized, and only electrodes present in every recording for a given patient were considered eligible to ensure consistent sensor availability across training and testing.

EEG signals were downsampled from 512 Hz to 128 Hz, linearly detrended, and divided into non-overlapping five-second windows. Channels with non-finite values, nearly flat signals, or extreme amplitudes or variability were marked as unusable. Physiological features from these channels were treated as missing, while channel usability itself was retained as a feature. Each channel was processed independently so that excluded electrodes could not influence reduced-channel models.

Features were computed independently for each electrode, including relative power in the delta, theta, alpha, beta, and low-gamma bands, root-mean-square amplitude, line length, and channel usability. Within each two-minute context, features from the 24 five-second windows were summarized by their mean, most recent value, and temporal slope, resulting in 24 features per electrode while preserving electrode identity for channel selection.

For patient-specific models, seizures were ordered chronologically, and approximately the final 20% of seizures (with at least one seizure per patient) were reserved for testing.

## **Determining the Optimal Number of EEG Sensors**

- Motivation for reducing the number of EEG sensors
- Approach for determining the value of k (number of sensors)
- Criteria used to evaluate whether a sensor subset sufficiently represents the data
- Trade-off between fewer sensors and prediction performance
- Selection of the final sensor count used for subsequent analyses

## **Patient-Specific Sensor Selection**

- Method for selecting the optimal combination of k sensors for each subject
- Description of personalized model development
- How each patient obtains their own optimized sensor subset
- Evaluation strategy for within-patient optimization
- Summary of the variability between patients’ optimal sensor configurations

## **Generalized Sensor Selection Across Patients**

- Motivation for comparing personalized models against a one-size-fits-all approach
- 14-Fold Validation strategy across subjects (e.g., leave-one-patient-out validation)
- Process for generating generalized sensor configurations
- How training patients differ from testing patients
- Number of generalized models created and their purpose

## **Comparison of Personalized and Generalized Models**

- Comparison framework between patient-specific and generalized models
- Performance metrics used for evaluation
- Analysis of improvements or limitations of personalized approaches
- Patient-level differences in model performance
- Discussion of when personalization provides the greatest benefit

## **Identification of Shared Optimal EEG Sensors**

- Method for finding intersections among personalized sensor selections
- Analysis of sensors consistently selected across subjects
- Comparison between individualized sensors and shared sensors
- Potential implications for designing reduced-channel EEG systems
- Balance between personalization and practicality

## **Discussion**

- Main findings regarding sensor reduction and personalization
- Implications for real-world EEG monitoring systems
- Why personalized models may outperform generalized approaches (if observed)
- Whether a hybrid approach (shared + patient-specific sensors) may be useful
- Limitations of the current approach
- Future directions

## **Conclusion**

- Answer to the central research question
- Key findings about reduced-sensor seizure prediction
- Importance of personalized sensor selection
- Overall impact on future EEG-based seizure prediction systems

</div>
