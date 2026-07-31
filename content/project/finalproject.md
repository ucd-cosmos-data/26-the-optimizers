---
title: "Choosing the Best EEG Sensors for Each Patient to Predict Seizures"
date: 2026-08-01
author: "The Optimizers"
description: "Exploring whether using a small, personalized set of EEG sensors for each patient can predict seizures as accurately as using many sensors."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

## Introduction and Motivation

Before a seizure happens, changes in brain activity can often be detected using electroencephalograms (EEGs). Predicting seizures early can give patients time to prepare and improve their safety and quality of life. However, standard EEG systems use many electrodes, making them uncomfortable for long-term or wearable use.

Most seizure prediction methods use the same EEG electrodes for every patient, even though seizure patterns vary from person to person. This means some electrodes may be useful for one patient but not for another. In this study, we test whether choosing EEG electrodes for each individual patient can maintain prediction accuracy while using fewer sensors.

We focus on three questions:

1. How few EEG electrodes can be used without reducing seizure prediction performance?
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone?
3. Are there any electrodes that are consistently useful across different patients for predicting seizures?

## Dataset and Preprocessing

We used EEG recordings from the Siena Scalp EEG Database, which contains data from 14 patients and includes 47 recorded seizures.

Only EEG signals were used. Other recorded signals, such as heart activity (EKG), were removed. The EEG data were cleaned to reduce noise and recording errors while preserving the original recordings.

<figure id="artifact_cleanup" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/04_artifact_cleaning.png"
    alt="EEG recording before and after artifact cleaning"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Example of the EEG artifact-cleaning process used before feature extraction.</figcaption>
</figure>

For each EEG electrode, we extracted features describing brain activity, including power across different frequency bands and measures of signal strength and quality. These features summarized the previous 2 minutes of EEG data and enabled the model to evaluate the importance of each electrode.

To test patient-specific models, seizures were ordered by time. Earlier seizures were used for training, while the most recent seizures (about 20%) were kept for testing.

<figure id="dataset_coverage" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/00_dataset_coverage.png"
    alt="Dataset coverage across 14 patients and 47 seizures"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Dataset coverage and seizure counts used in this study.</figcaption>
</figure>

## Gen-1 Model

The Gen-1 model uses the preceding 2 minutes of EEG data to estimate whether a seizure will begin during the following 5 minutes. It also estimates when within that window the onset is most likely to occur.

Gen-1 uses L2-regularized logistic regression for each EEG channel ($C=0.1$). Each channel produces an estimate of whether the patient is in a pre-seizure state; the selected-channel estimates are then averaged and calibrated. We chose this deliberately simple and stable architecture so that comparisons between different sensor subsets would not be confounded by a more complex model.

The model updates its prediction every 5 seconds. At prediction time $t$, it uses EEG data from the preceding 2 minutes, $[t-2, t)$, and predicts seizure onset during the next 5 minutes, $[t, t+5]$.

The 5-minute prediction window is divided into 60 5-second intervals. For each prediction, the model provides a probability that a seizure will start in each of the 60 future intervals, as well as a probability that no seizure will occur within the next 5 minutes. When the next 5-second boundary is reached, the model updates its prediction window using the newest available EEG data.

The model can show the future interval with the highest predicted seizure probability as a simple summary. However, it keeps and uses the full set of 60 probabilities, rather than relying only on the single highest-probability interval. 

## Determining the Optimal Number of EEG Sensors

Using fewer EEG sensors could make seizure-monitoring systems more comfortable, portable, and practical for home or wearable use. It could also reduce setup time while retaining information that would otherwise require a full scalp montage.

### K-Finder
K-Finder estimates the smallest number of EEG sensors needed for seizure prediction. It used 14 subjects, 29 EEG channels common to every subject, and 14,100 time-window examples. Each channel was represented by 21 predefined signal features. Those 21 features are the relative power of alpha, beta, delta, and theta waves, log RMS amplitude, log line length, and usable channel indicator. For each of these, we record the mean, the most recent value, and the temporal slope (change in the feature over time).

It performs leave-one-out testing across all 14 patients: 13 patients form the training set and the remaining patient is held out for testing. The training patients are divided into four folds of three or four patients each. Three folds are used for training and one for validation. K-Finder then adds the channels that produce the best validation score, maximizing macro-patient AUPRC, defined as $\frac{1}{N}\sum_{i=1}^{N} \mathrm{AUPRC}_i$.
AUPRC is defined as the Area Under Precision-Recall Curve where $\text{Precision}=\frac{\text{True Seizure}}{\text{Total Seizure Predictions}}$ and $\text{Recall}=\frac{\text{Seizures Windows Correctly Identified}}{\text{Total Seizure Windows}}$. Precision calculates “What percent of seizure warnings from the model were actually seizures,” and Recall answers “How many true seizures were correctly labeled as seizures.” In general, a model with a high AUPRC is more accurate. Here, AUPRC is useful for prediction since seizure windows are relatively uncommon. Out of all $101,520$ 5-second intervals, $949$ of them contain seizure activity, making our random baseline AUPRC $0.00935$.

Our $K$-Finder algorithm was designed to find the value of $k$ for which an optimal configuration of $k$ sensors yields a worst-case AUPRC loss of $0.02$ across all patients. 
This effectively ranks the channels by predictive ability for each training patient. Running the algorithm with a $95%$ confidence interval resulted in $k=16$.

<figure id="k_finder" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/01_k_finder.png"
    alt="K-Finder results showing model performance as the number of sensors increases"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">K-Finder identifies 16 sensors as the smallest configuration meeting the performance criterion.</figcaption>
</figure>

## Determining the Exact $16$ Sensors

K-Finder determines the optimal number of sensors. K-Suiter then identifies the specific sensors that form the best configuration of that size.

### $K$-Suiter Algorithm

The algorithm starts by iteratively selecting channels to minimize binary cross-entropy. It uses cross-entropy to optimize since it “rewards” correct predictions and “penalizes” incorrect predictions. At every step, it averages the seizure-risk values across all active channels, yielding the seizure risk. This procedure selects and ranks the sensors. 

The binary cross-entropy function is defined as $L=-[y\log(p)+(1-y)\log(1-p)]$ where $L$ is the loss, $p$ is the probability of classifying it as a seizure, and $y$ is the true outcome represented in binary data ($1$ represents a true seizure and $0$ represents no seizure). Testing a few numbers reveals that confident correct predictions are rewarded, while confident incorrect predictions are penalized.

## $P$ Models

Let $P_i$ denote the patient-specific model trained and tested on patient $i$. To ensure enough data for both stages, we include only patients with more than four seizures and reserve $\max(0.2s, 2)$ seizures for testing, where $s$ is the patient's total number of seizures. Each $P_i$ model uses the same regularized logistic-regression architecture as Gen-1. K-Suiter selects its 16-sensor configuration, after which the model is trained using data from that patient alone.

## $G$ Models

We use generalized models, $G_i$, to compare the patient-specific approach with a cross-patient approach. For each $G_i$, we leave out patient $i$ during training and evaluate the resulting model on that patient. Only five of the 14 patients had more than three reported seizures, so we trained five $G_i$ models to compare with the corresponding five $P_i$ models. Each model uses the same regularized logistic-regression architecture, isolating the effect of the training strategy.

## Model Results

### Comparison of $P$ and $G$ Models

The Gen-$1$, $P_i$, and $G_i$ models all use the same architecture. We compare $P$ and $G$ primarily with cross-entropy loss, and also report AUPRC, AUROC, and Brier score on the same held-out seizure sessions. The Brier score is $B=\frac{1}{N}\sum_{i=1}^{N}(p_i-y_i)^2$, where $p_i$ is the predicted seizure probability and $y_i$ is the true outcome. Like cross-entropy, it penalizes confident incorrect predictions. Patient-specific models provided the greatest benefit when more training data were available: $P_i$ had lower loss than $G_i$ for PN00, PN06, and PN10, each of which had five or more seizures.

<figure id="p_vs_g" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/02_personalized_vs_generalized.png"
    alt="Comparison of personalized and generalized model performance by patient"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Personalized and generalized model performance compared on the same held-out patient sessions.</figcaption>
</figure>
 
#### $G_i$ Model

The $G_i$ Model achieved a mean AUPRC of 0.277, compared with a baseline mean patient positive rate of 0.233. Although this represents a modest average improvement, performance varied substantially across patients. The model clearly exceeded the baseline for $G_12$ and $G_14$, performed approximately at baseline for $G_0$, and fell below the baseline for $G_6$ and $G_10$. In addition, the mean AUROC of 0.501 indicates chance-level overall discrimination. These results suggest that seizure-related EEG patterns do not generalize equally well across patients and that the average improvement is driven by only a subset of the cohort. A single generalized model appears useful for certain patients, but it does not consistently identify seizure-related patterns in unseen individuals, making averaged results misleading.

<figure id="g_i_results" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/g_models_stats.svg"
    alt="Per-patient performance statistics for generalized models"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Generalized-model results by held-out patient.</figcaption>
</figure>

#### $P_i$ Model

The $P_i$ models produced a mean AUPRC of 0.293, compared with a mean patient baseline of 0.233. However, this improvement was not consistent across patients. The models exceeded baseline for P₀ and P₆ but fell below baseline for the other three patients. The mean AUROC of 0.487 also indicates chance-level overall discrimination. Therefore, personalization appears beneficial for certain patients, but the current results do not show that it reliably improves performance for every patient.

<figure id="p_i_results" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/p_models_stats.svg"
    alt="Per-patient performance statistics for personalized models"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Personalized-model results by patient.</figcaption>
</figure>

#### Gen-$1$ Model

The full-montage Gen-$1$ model achieved a mean held-out score of 0.238, compared with a mean positive-rate baseline of 0.209. It exceeded baseline for 8 of the 14 patients, showing that it learned useful seizure-related patterns for slightly more than half of the cohort. However, performance varied substantially between patients, and six patients remained below baseline. This suggests that a single full-channel model does not generalize equally well to every individual.

<figure id="gen1_results" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/gen1_model_stats.svg"
    alt="Per-patient performance statistics for the full-montage Gen-1 model"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Full-montage Gen-1 model results by patient.</figcaption>
</figure>

## Evaluation

Across Gen1, generalized, and personalized models, performance varied substantially between patients. Gen1 and the G-model showed limited cross-patient generalization, while the P-model produced strong results for only a small subset of patients. No approach consistently separated pre-seizure from non-seizure EEG across the cohort. These findings suggest that seizure-related EEG patterns differ considerably among individuals and that neither a fully generalized nor a fully personalized strategy is sufficient on its own. A hybrid approach, starting with a generalized model and adapting it using patient-specific data, may be more appropriate, but further testing is required.

## Identification of Invariant EEG Sensors

We define an invariant sensor as one selected in every patient-specific model, $P_i$. These sensors may reveal EEG locations that provide useful seizure-prediction information across patients. We use the I-Finder algorithm, a binary classifier that determines whether each sensor belongs in a given $P_i$ configuration.

I-Finder identified $FC6$ as the only invariant sensor.

<figure id="invariant_sensor" style="margin: 2.5rem auto; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/03_channel_selection_frequency.png"
    alt="Frequency with which each EEG sensor was selected across patient-specific models"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border-radius: 6px;">
    <figcaption style="margin-top: 0.65rem; color: #59636e; font-size: 0.92rem; line-height: 1.45;">Sensor-selection frequency across patient-specific models; FC6 was selected in every model.</figcaption>
</figure>

$FC6$ was the electrode our model selected for every $P_i$ model. Earlier research using the Siena dataset examined seizure-related synchronization between $FC5$ and $FC6$ during one seizure, showing that this frontocentral pair can contain useful seizure information (Detti et al., 2020). Another study applied channel reduction to Siena and found that frontal, central, and parietal electrodes could preserve important information about the full pre-seizure brain network (Lee et al., 2025). However, these studies did not prove that $FC6$ is the best electrode for every patient. Our result suggests that $FC6$ may detect changes spreading across the brain before a seizure, rather than showing where the seizure originally starts. Right-side EEG channels repeatedly carried useful warning signals before seizures, even when seizures began elsewhere. This suggests that seizure prediction may depend on changes across a broader brain network rather than solely at the seizure’s starting point, but artifact testing is still needed.

Other frequently selected sensors were $C4$, $CP1$, $F4$, $F8$, $F10$, $FP2$, $P4$, and $T4$, each selected in four models.

## Discussion

Selecting 16 sensors reduced the number of channels while limiting the worst-case AUPRC loss to 0.02. This suggests that a smaller montage can retain much of the seizure-prediction information available in the full set of common channels, an encouraging result for more comfortable and lower-cost wearable systems.

Personalized models were most useful when enough patient-specific seizure data were available. A promising next step is a hybrid approach: begin with a shared set of channels and adapt the sensor selection as individual data accumulate. This study is limited by the simple Gen-1 model and the small dataset of 14 patients and 47 seizures. Because our primary goal was to compare reduced sensor sets with the full 29-channel montage, developing a state-of-the-art prediction model was outside the scope of this project. Larger datasets and stronger base models would provide a more reliable test of the proposed approach.

## Conclusion

This project addressed three questions:
1. How few EEG electrodes can be used without reducing seizure prediction performance? 
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone? 
3. Are there any electrodes that are consistently useful across different patients for predicting seizures?
 
Using 16 sensors—13 fewer than the 29 common EEG channels—limited the maximum AUPRC loss to 0.02. Patient-specific sensor selection was most helpful when sufficient patient-specific seizure data were available. FC6 was the only sensor selected consistently across all patient-specific models, suggesting that frontocentral activity may carry broadly useful predictive information, although this requires further testing. Overall, the results suggest that seizure-prediction systems may be able to use substantially fewer EEG channels without meaningful performance loss, making wearable monitoring more practical. They also indicate that personalization should be applied selectively rather than assumed to improve performance for every patient.

## Acknowledgements

We would like to thank and acknowledge Professor Xiucai Ding, Professor Shizhe Chen, Teaching Fellow Chen Qian, Teaching Assistant Wonjun Seo, and Teaching Intern Phoebe McDonald for their support across the past 4 weeks in this program and this final project. Lastly, we would like to thank COSMOS for the opportunity and resources provided, which enabled us to do this research. 

</div>
