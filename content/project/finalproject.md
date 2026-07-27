---
title: "Preictal Scalp-EEG Relative Power Before Seizure Onset"
date: 2026-07-26
author: "The Optimizers"
description: "A within-patient analysis of timing, magnitude, and consistency of delta, theta, alpha, beta, and gamma relative-power changes during the 60 seconds before scalp-EEG seizure onset."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

## Abstract

This project investigates whether the spectral composition of scalp electroencephalography (EEG) changes reliably in the minute before electrographic seizure onset. We will measure delta, theta, alpha, beta, and gamma **relative power** in the final 60 seconds before each annotated seizure and compare those values with patient-matched interictal EEG. The analysis focuses on three properties of each band: when its change begins, how large the change is, and how consistently its direction and timing recur across seizures and patients. In particular, we test whether beta- and gamma-band changes are more consistent preictal markers than lower-frequency changes.

## Background and Motivation

Seizures can be preceded by shifts in neural synchrony that are reflected in the EEG power spectrum. A spectral feature is useful only if it is distinguishable from ordinary interictal variation and if it generalizes beyond a small number of seizures. Because scalp-EEG power differs substantially among patients, channels, recording sessions, and states of wakefulness, each seizure will be compared with interictal EEG from the same patient.

Relative power expresses the contribution of a frequency band to total spectral power. It reduces the influence of overall amplitude differences between recordings while preserving changes in spectral composition.

## Study Question

> What is the temporal ordering and magnitude of changes in alpha, beta, delta, gamma, and theta relative power during the final 60 seconds before scalp-EEG seizure onset in comparison to these measures in interictal periods, and are beta- and gamma-band changes more consistent across seizures and patients than lower-frequency-band changes?

## Objectives and Hypotheses

### Objectives

1. Quantify time-resolved relative power in five EEG frequency bands during the final 60 seconds before seizure onset.
2. Compare preictal trajectories with patient-matched interictal trajectories.
3. Estimate the onset time, direction, and magnitude of each band’s preictal change.
4. Measure whether beta and gamma changes are more reproducible across seizures and patients than delta, theta, and alpha changes.

### Hypotheses

- **H1 — Preictal change:** At least one band’s relative power differs from patient-matched interictal activity during the final 60 seconds before seizure onset.
- **H2 — Temporal ordering:** The estimated onset time of spectral change differs among the five frequency bands.
- **H3 — High-frequency consistency:** Beta- and gamma-band changes show greater consistency in direction, timing, and effect size across seizures and patients than lower-frequency-band changes.

The analysis is two-sided for the direction of change: a band may increase or decrease, and the direction will be estimated from the data rather than assumed in advance.

## Study Design and Cohort

This is a retrospective, observational, within-patient EEG study. The analytic structure is hierarchical: EEG epochs are nested within seizures, and seizures are nested within patients. Time is indexed relative to the clinician-annotated electrographic seizure onset, where \(t = 0\).

### Inclusion Criteria

- Scalp-EEG recordings with documented channel labels and sampling rate.
- An expert or clinical annotation of electrographic seizure onset.
- At least 60 seconds of usable EEG before the annotated onset.
- Sufficient artifact-screened interictal EEG from the same patient.
- Electrode coverage that can be harmonized to the prespecified common montage or regional summaries.

### Exclusion Criteria

- Missing or unreliable onset annotation.
- Preictal EEG overlapping an earlier ictal or postictal interval.
- Pervasive artifact, amplifier saturation, or unrecoverable channel failure.
- Channel configurations that cannot be included in the common analysis montage.

Every inclusion and exclusion decision will be logged by patient and seizure.

## Data Windows and Variables

### Time Windows

- **Preictal period:** \([-60, 0)\) seconds relative to seizure onset.
- **Seizure onset:** \(t = 0\), the annotated scalp-EEG onset; it is not included in the preictal window.
- **Interictal period:** artifact-screened non-seizure EEG from the same patient. The primary comparison uses intervals at least two hours from any seizure when available.
- **Epoching:** the primary analysis uses 2-second windows with 50% overlap. A 1-second non-overlapping analysis will be used as a sensitivity check.

### Frequency Bands

| Band | Frequency range |
| --- | --- |
| Delta | 1–4 Hz |
| Theta | 4–8 Hz |
| Alpha | 8–13 Hz |
| Beta | 13–30 Hz |
| Gamma | 30–80 Hz |

The gamma upper limit will be lowered only when sampling rate, line-noise harmonics, or hardware limitations prevent reliable estimation. Any adjustment will be documented and applied consistently within affected recordings.

### Relative Power

For frequency band \(b\), epoch \(e\), seizure \(s\), and patient \(p\), relative power is

$$
RP_{b,e,s,p} = \frac{P_{b,e,s,p}}{\sum_{f=1}^{80}P_{f,e,s,p}},
$$

where \(P_b\) is the estimated band power and the denominator is total analyzed power after excluded frequencies are removed. The primary outcomes are the preictal–interictal difference, the magnitude of the final preictal change, the time at which a sustained change begins, and the consistency of those measures across seizures and patients.

## EEG Preprocessing

The same scripted, version-controlled preprocessing pipeline will be applied to preictal and interictal EEG.

1. Verify sampling rate, channel labels, recording duration, and seizure annotations.
2. Harmonize channel names and retain the documented common set of scalp electrodes.
3. Re-reference EEG using the primary reference strategy; an alternative reference will be used as a sensitivity analysis where feasible.
4. Identify bad channels and artifact-contaminated epochs with automated criteria followed by visual quality control.
5. Apply a band-pass filter appropriate to the analyzed range and notch filtering for mains frequency and harmonics when necessary.
6. Estimate power spectral density for each retained epoch using a documented Welch or multitaper method.
7. Calculate band power and relative power by channel, then aggregate across the prespecified montage or scalp regions. Channel-level values will be retained for secondary topographic analysis.

Gamma-band results will receive additional quality control because muscle activity, movement, and line noise can inflate high-frequency power.

## Interictal Matching and Baseline

Interictal EEG will be selected from the same patient and, where metadata allow, matched by recording session, state of wakefulness or sleep, and time of day. Interictal epochs will be sampled to match the number and duration of preictal epochs within each patient. Multiple matched samples will be drawn so that conclusions do not depend on a single baseline selection.

For each patient and band, the primary standardized score will use the robust interictal median and median absolute deviation (MAD):

$$
Z_{b,e,s,p} = \frac{RP_{b,e,s,p} - \operatorname{median}(RP^{\mathrm{interictal}}_{b,p})}{\operatorname{MAD}(RP^{\mathrm{interictal}}_{b,p})}.
$$

A mean-and-standard-deviation standardization will be reported as a sensitivity analysis.

## Statistical Analysis Plan

### Descriptive Analysis

We will report the number of patients, seizures, included epochs, rejected epochs, and available interictal duration overall and by patient. For every band, plots will show raw relative-power and standardized relative-power trajectories from \(-60\) to \(0\) seconds.

### Preictal Versus Interictal Comparison

For each band, a mixed-effects model will include time before onset, condition (preictal or interictal), and their interaction. Random intercepts for patient and seizure nested within patient will account for repeated observations. The time-by-condition interaction tests whether the preictal trajectory differs from the matched interictal trajectory.

If the relationship with time is nonlinear, time will be modeled with restricted cubic splines or a generalized additive mixed model. The final report will include model diagnostics, estimated marginal trajectories, effect sizes, 95% confidence intervals, and adjusted *p*-values.

### Temporal Ordering and Magnitude

For each band, change-onset time will be the earliest time bin at which the patient-adjusted preictal estimate shows a sustained difference from the interictal confidence boundary for a prespecified consecutive duration. A segmented-regression analysis will serve as a sensitivity check. Bands will be ordered by their median seizure-level change-onset times, with uncertainty quantified by patient-level cluster bootstrap.

Magnitude will be summarized by the time-resolved preictal–interictal difference, the mean difference in the final 10 seconds, a standardized effect size, and the area under the standardized preictal trajectory over the final minute.

### Consistency Across Seizures and Patients

Beta and gamma will be compared with delta, theta, and alpha using three separate measures:

1. **Direction consistency:** proportion of seizures and patients with the same signed preictal change.
2. **Timing consistency:** robust dispersion of seizure-level change-onset times.
3. **Effect-size consistency:** between-seizure and between-patient variance components and intraclass correlation coefficients from the hierarchical model.

A band will be considered more consistent when it has a higher same-direction proportion, smaller timing dispersion, and less unexplained variation in effect size. These measures will be reported separately rather than merged into a single score.

### Multiple Testing and Sensitivity Analyses

The five primary band-level comparisons will use Benjamini–Hochberg false-discovery-rate control. Missing or rejected epochs will not be imputed; their number and reason will be reported. Sensitivity analyses will vary epoch length, reference, interictal buffer, artifact threshold, spectral estimator, and gamma upper limit. Results will also be stratified by seizure type or physiological state if sample size permits.

## Planned Results Displays

| Item | Content |
| --- | --- |
| Figure 1 | Cohort and preprocessing flow diagram |
| Figure 2 | Time-resolved relative-power trajectories for all five bands |
| Figure 3 | Patient- and seizure-level trajectory panels |
| Figure 4 | Change-onset times with confidence intervals, ordered by band |
| Figure 5 | Scalp topographies of preictal–interictal power change |
| Table 1 | Cohort, recording, and seizure characteristics |
| Table 2 | Band-specific onset times, effect sizes, and adjusted tests |
| Table 3 | Direction, timing, and effect-size consistency metrics |

## Interpretation, Limitations, and Ethics

Statistical significance alone will not establish a useful preictal marker. We will interpret a band as promising only if its effect is temporally plausible, sufficiently large, robust to preprocessing choices, and reasonably consistent across seizures and patients.

Scalp EEG has limited sensitivity to deep or focal sources, and annotated scalp onset may occur after the underlying physiological onset. Relative power is also compositional: a change in one band can alter another band’s relative value even if its absolute power does not change. Medication, sleep state, seizure type, age, montage, and recording hardware may introduce heterogeneity. Gamma is particularly vulnerable to non-neural artifact.

The analysis will use de-identified retrospective EEG data and follow applicable data-use requirements. All preprocessing parameters, exclusions, random seeds, software versions, and statistical-model specifications will be preserved in the analysis repository so the derived results can be reproduced.

## Conclusion

This study will determine whether the final minute before scalp-EEG seizure onset contains band-specific relative-power changes that are distinguishable from interictal activity. By evaluating timing, magnitude, and consistency separately—and by matching seizures to interictal EEG within patient—the project can identify whether beta and gamma provide more stable preictal markers than lower-frequency bands.

## References

The completed report will cite the EEG dataset, seizure annotations, preprocessing software, spectral-estimation method, and statistical methods used in the final analysis.

</div>
