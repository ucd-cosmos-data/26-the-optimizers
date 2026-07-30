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

We used scalp EEG recordings from the Siena Scalp EEG Database, which contains 41 EDF recordings from 14 patients, including 47 annotated seizures and approximately 128 hours of EEG. For patient-specific and generalized training, we restricted the analysis to the five patients with at least four usable seizures: Patients 0, 6, 10, 12, and 14. These patients had 28 usable seizures in total.

For each seizure, we extracted the five-minute preictal period immediately before seizure onset. Each preictal period was paired with a five-minute interictal segment from the same patient. Interictal segments were selected from seizure-free EEG and were required to remain at least five minutes away from any annotated seizure. This reduced the risk of including preictal activity in the interictal data.

The model operated at five-second prediction landmarks. At each landmark, the model used only the preceding 120 seconds of EEG, ensuring that no future information was included. The prediction target indicated whether a seizure would begin within the following five minutes. This prediction period was divided into 60 consecutive five-second onset bins, along with a separate “no seizure within five minutes” class. This produced 60 training observations from each preictal or interictal episode.
Only EEG channels were retained, while auxiliary signals such as EKG were excluded. Channel labels were standardized, and only electrodes available in every recording for a given patient were considered eligible. This ensured consistent sensor availability across training and testing.

EEG signals were cleaned at their original sampling rate of 512 Hz before being downsampled to 128 Hz and divided into non-overlapping five-second windows. Within each window, slow shifts in the signal’s baseline were removed. Channels that were flat, contained invalid values, or frequently reached the recording equipment’s limits were marked as unusable. We then reduced noise shared across the remaining channels and filtered out 60 Hz electrical interference. Values still above +500 µV were capped at +500 µV, while values below −500 µV were capped at −500 µV. Features from unusable channels were treated as missing, while channel usability was retained as a feature. The original EDF files were not changed.

Features were calculated separately for each electrode. These included relative power in the delta, theta, alpha, beta, and low-gamma frequency bands, as well as root-mean-square amplitude, line length, and channel usability. Within each two-minute context, features from the 24 five-second windows were summarized using their mean, most recent value, and change over time. This produced 24 features per electrode while preserving electrode identity for channel selection.

For the patient-specific models, seizures were ordered chronologically. Approximately the final 20% of seizures were reserved for testing, with at least one test seizure selected for each patient.

## **Determining the Optimal Number of EEG Sensors**

Reducing the number of EEG sensors could make seizure-monitoring systems more comfortable, portable, and practical for long-term use. Conventional scalp EEG systems require many electrodes, which increases setup time, hardware complexity, computational requirements, and the need for careful placement. A smaller sensor set could simplify data collection and support wearable or home-based monitoring while retaining the information needed for seizure prediction.

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
