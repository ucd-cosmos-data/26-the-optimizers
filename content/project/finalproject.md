---
title: "Choosing the Best EEG Sensors for Each Patient to Predict Seizures"
date: 2026-08-01
author: "The Optimizers"
description: "Exploring whether using a small, personalized set of EEG sensors for each patient can predict seizures as accurately as using many sensors."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">
regularized logistic regression models 

## Introduction and Motivation

Before a seizure happens, changes in brain activity can often be detected using electroencephalograms (EEGs). Predicting seizures early can give patients time to prepare and improve their safety and quality of life. However, standard EEG systems use many electrodes, making them uncomfortable for long-term or wearable use.

Most seizure prediction methods use the same EEG electrodes for every patient, even though seizure patterns vary from person to person. This means some electrodes may be useful for one patient but not for another. In this study, we test whether choosing EEG electrodes for each individual patient can maintain prediction accuracy while using fewer sensors.

We focus on three questions:

1. How few EEG electrodes can be used without reducing seizure prediction performance?
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone?
3. Are there any electrodes that are consistently useful across different patients for predicting seizures?

## Dataset and Preprocessing

We used EEG recordings from the Siena Scalp EEG Database, which includes recordings from 14 patients. Across all recordings and patients, the EEG data contains signatures of 47 seizures. 

Only EEG signals were used. Other recorded signals, such as heart activity (EKG), were removed. The EEG data were cleaned to reduce noise and recording errors while preserving the original recordings.

<figure id="artifact_cleanup" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/04_artifact_cleaning.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

For each EEG electrode, we extracted features describing brain activity, including power across different frequency bands and measures of signal strength and quality. These features summarized the previous 2 minutes of EEG data and enabled the model to evaluate the importance of each electrode.

To test patient-specific models, seizures were ordered by time. Earlier seizures were used for training, while the most recent seizures (about 20%) were kept for testing.

<figure id="dataset_coverage" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/00_dataset_coverage.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

## Gen-1 Model

The goal of the Gen-1 model is to use the previous 2 minutes of EEG data to predict whether a seizure may begin within the next 5 minutes. It also estimates when, within that 5-minute future window, the seizure is most likely to start.

The architecture the model follows is an L2-regularized logistic regression per channel ($C=0.1$), with selected-channel probabilities averaged and calibrated. This architecture trains on each sensor individually and determines the probability that the patient is in a pre-seizure state. Then it averages all the predictions across each channel and calibrates the mean, maintaining realistic accuracy. As the model is regularized with $C=0.1$, it is fit to have strong stability and simplicity. Given that the model is a lower priority than optimizing the sensors, we wanted to keep the model simple for training on varying subsets of our existing data.

The model begins making predictions 5 minutes before a seizure. It makes a new prediction every 5 seconds. At any prediction time $t$, it uses EEG data from the previous 2 minutes, $[t-2, t)$, as context. It then predicts seizure onset over the next 5 minutes, $[t, t+5]$.

The 5-minute prediction window is divided into 60 5-second intervals. For each prediction, the model provides a probability that a seizure will start in each of the 60 future intervals, as well as a probability that no seizure will occur within the next 5 minutes. When the next 5-second boundary is reached, the model updates its prediction window using the newest available EEG data.

The model can show the future interval with the highest predicted seizure probability as a simple summary. However, it keeps and uses the full set of 60 probabilities, rather than relying only on the single highest-probability interval. 

## Determining the Optimal Number of EEG Sensors

Using fewer EEG sensors could make seizure-monitoring systems more comfortable, portable, and easier to use. It could also reduce setup time and make wearable or home-based devices more practical and representative of full brain scans done in a normal environment.

### K-Finder
K-Finder estimates the smallest number of EEG sensors needed for seizure prediction. It used 14 subjects, 29 EEG channels common to every subject, and 14,100 time-window examples. Each channel was represented by 21 predefined signal features. Those 21 features are the relative power of alpha, beta, delta, and theta waves, log RMS amplitude, log line length, and usable channel indicator. For each of these, we record the mean, the most recent value, and the temporal slope (change in the feature over time).

It performs leave-one-out testing across all 14 patients, with 13 as the training set and the remaining patient as the test set. Within the 13, split it into 4 folds, with 3-4 patients per fold. Treat three of the folds as training data, and the remaining fold as validation for the model. It systematically adds channels with the best validation score and maximizes macro-patient AUPRC which is calculated using the following formula: $$\frac{1}{N}\sum_{i=1}^{N}AUPRC_i$$. 
AUPRC is defined as the Area Under Precision-Recall Curve where $\text{Precision}=\frac{\text{True Seizure}}{\text{Total Seizure Predictions}}$ and $\text{Recall}=\frac{\text{Seizures Windows Correctly Identified}}{\text{Total Seizure Windows}}$. Precision calculates “What percent of seizure warnings from the model were actually seizures,” and Recall answers “How many true seizures were correctly labeled as seizures.” In general, a model with a high AUPRC is more accurate. Here, AUPRC is useful for prediction since seizure windows are relatively uncommon. Out of all $101,520$ 5-second intervals, $949$ of them contain seizure activity, making our random baseline AUPRC $0.00935$.

Our $K$-Finder algorithm was designed to find the value of $k$ for which an optimal configuration of $k$ sensors yields a worst-case AUPRC loss of $0.02$ across all patients. 
This effectively ranks the channels by predictive ability for each training patient. Running the algorithm with a $95%$ confidence interval resulted in $k=16$.

<figure id="k_finder" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/01_k_finder.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

## Determining the Exact $16$ Sensors

The $K$-Finder algorithm yields the optimal number of sensors. The $K$-Suiter algorithm finds which exact sensors are chosen to generate an optimal model. 

### $K$-Suiter Algorithm

The algorithm starts by iteratively selecting channels to minimize binary cross-entropy. It uses cross-entropy to optimize since it “rewards” correct predictions and “penalizes” incorrect predictions. At every step, it averages the seizure-risk values across all active channels, yielding the seizure risk. This procedure selects and ranks the sensors. 

The binary cross-entropy function is defined as $L=-[y\log(p)+(1-y)\log(1-p)]$ where $L$ is the loss, $p$ is the probability of classifying it as a seizure, and $y$ is the true outcome represented in binary data ($1$ represents a true seizure and $0$ represents no seizure). Testing a few numbers reveals that confident correct predictions are rewarded, while confident incorrect predictions are penalized.

## $P$ Models

Denote $P_i$ as the model trained on patient $i$. It only considers patients with more than $4$ seizures to ensure the model has sufficient training and test data. In this case, we assign $max(0.2s, 2)$ seizures for testing ($s$ denotes the number of seizures the patient has). This model has a similar architecture to the Gen-$1$ model, but it trains and tests on a single patient and uses a limited number of sensors. Using the value of $k$ from $K$-Finder, $K$-Suiter finds the optimal sensor configuration for the $16$ scalp EEG sensors. It then runs a regularized logistic regression model based on Gen-$1$.

## $G$ Models

The reason we have $G_i$ (generalized) models is to compare personalized (patient-specific) models against a one-size-fits-all approach. In some sense, however, the generalized models themselves are personalized. Our methodology uses a 5-Fold Validation strategy across subjects, in which one patient $i$ is left out of the training set and later tested against the corresponding patient-specific model. Given that only 5/14 patients had more than 3 reported seizures, we created only 5 $G_i$ models to be compared with the 5 $P_i$ models. The architecture of the model itself is consistent with the Gen-$1$ and $P_i$ models (regularized logistic regression)  to reduce the number of extraneous causes of difference in performance.

## Model Results

### Comparison of $P$ and $G$ Models

The Gen-$1$, $P_i$, and $G_i$ models all use the same architecture. $G$ and $P$ were compared primarily using cross-entropy loss. Secondary metrics were AUPRC, AUROC, and Brier score, calculated on the same held-out seizure sessions; event-level versions were also reported. Brier score is calculated as the following: $B=\frac{1}{N}\sum_{i=1}^{N}{p_i-y)^2$ where $y$ is the true outcome and $p_i$ is the probability of having a seizure. Similar to cross-entropy, it penalizes confident but incorrect predictions, but rewards confident correct predictions. Cross-entropy loss measures how wrong a model’s predicted probabilities are. If the correctly predicted probability is high (80%), the loss is low and vice versa. Analysis of improvements or limitations of personalized approaches. For each patient, we noticed (blank finding) citations to appropriate figures. When directly comparing loss between the patient-specific and generalized (trained) models, $P_i$ provides the greatest benefit when more training data is available, as its loss is lower than $G_i$ for patients with more seizures in the training and testing sets (PN00, PN06, and PN10 have 5+ seizures).

<figure id="p_vs_g" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/02_personalized_vs_generalized.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>
 
#### $G_i$ Model

The $G_i$ Model achieved a mean AUPRC of 0.277, compared with a baseline mean patient positive rate of 0.233. Although this represents a modest average improvement, performance varied substantially across patients. The model clearly exceeded the baseline for $G_12$ and $G_14$, performed approximately at baseline for $G_0$, and fell below the baseline for $G_6$ and $G_10$. In addition, the mean AUROC of 0.501 indicates chance-level overall discrimination. These results suggest that seizure-related EEG patterns do not generalize equally well across patients and that the average improvement is driven by only a subset of the cohort. A single generalized model appears useful for certain patients, but it does not consistently identify seizure-related patterns in unseen individuals, making averaged results misleading.

<figure id="g_i_results" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/g_models_stats.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

#### $P_i$ Model

The $P_i$ models produced a mean AUPRC of 0.293, compared with a mean patient baseline of 0.233. However, this improvement was not consistent across patients. The models exceeded baseline for P₀ and P₆ but fell below baseline for the other three patients. The mean AUROC of 0.487 also indicates chance-level overall discrimination. Therefore, personalization appears beneficial for certain patients, but the current results do not show that it reliably improves performance for every patient.

<figure id="p_i_results" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/p_models_stats.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

#### Gen-$1$ Model

The full-montage Gen-$1$ model achieved a mean held-out score of 0.238, compared with a mean positive-rate baseline of 0.209. It exceeded baseline for 8 of the 14 patients, showing that it learned useful seizure-related patterns for slightly more than half of the cohort. However, performance varied substantially between patients, and six patients remained below baseline. This suggests that a single full-channel model does not generalize equally well to every individual.

<figure id="gen1_results" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/gen1_model_stats.svg"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

## Evaluation

Across Gen1, generalized, and personalized models, performance varied substantially between patients. Gen1 and the G-model showed limited cross-patient generalization, while the P-model produced strong results for only a small subset of patients. No approach consistently separated pre-seizure from non-seizure EEG across the cohort. These findings suggest that seizure-related EEG patterns differ considerably among individuals and that neither a fully generalized nor a fully personalized strategy is sufficient on its own. A hybrid approach, starting with a generalized model and adapting it using patient-specific data, may be more appropriate, but further testing is required.

## Identification of Invariant EEG Sensors

We define an invariant sensor to be a sensor present in every model $P_i$. Invariant sensors provide insight into seizure detection across multiple users. It identifies which sensors are the most accurate predictors of seizures. To do this, we implement the $I$-Finder algorithm. This algorithm uses binary classification to determine whether a sensor belongs to $P_i$. 

Implementing the algorithm gives us that the invariant sensor is $FC6$.

<figure id="invariant_sensor" style="margin: 2rem auto; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); background: #ffffff; text-align: center;">
    <img src="/26-the-optimizers/projects/finalproject/03_channel_selection_frequency.png"
    style="display: block; width: 100%; max-width: 900px; margin: 0 auto; border: none; border-radius: 6px;">
</figure>

$FC6$ was the electrode our model selected for every $P_i$ model. Earlier research using the Siena dataset examined seizure-related synchronization between $FC5$ and $FC6$ during one seizure, showing that this frontocentral pair can contain useful seizure information (Detti et al., 2020). Another study applied channel reduction to Siena and found that frontal, central, and parietal electrodes could preserve important information about the full pre-seizure brain network (Lee et al., 2025). However, these studies did not prove that $FC6$ is the best electrode for every patient. Our result suggests that $FC6$ may detect changes spreading across the brain before a seizure, rather than showing where the seizure originally starts. Right-side EEG channels repeatedly carried useful warning signals before seizures, even when seizures began elsewhere. This suggests that seizure prediction may depend on changes across a broader brain network rather than solely at the seizure’s starting point, but artifact testing is still needed.

Other commonly utilised sensors: $C4, CP1, F4, F8, F10, FP2, P4,$ and $T4$ - $4$ times

## Discussion

Our models show that keeping $16$ optimally selected sensors leaves a worst-case AUPRC of $0.02$, showing that they can accurately represent and predict from the data using 31 channels. Implementing invariant EEG sensors can enable more widespread wearable EEG detection devices. They can help reduce the cost of personalized detection devices.

Personalized models outperform general models when more seizure data is available for training. Another version of the study, using a set of shared channels as a general basis and adding more sensors for patient-specific purposes, may improve the performance of personalized models and is a future possibility. Currently, some of the limitations of our study are having a weak Gen-$1$ model and using limited data. Since our original goal was to compare models with $k$ sensors to a model with 31 sensors ($k<31$), a state-of-the-art model was a secondary priority and, given time constraints, had to take a back seat. Additionally, the Sienna Scalp EEG dataset we used comprised only $14$ patients and $47$ seizures. In the context of a predictive model, these numbers are very small, and a future experiment with more data would help reduce these issues.

## Conclusion

Entering this research project, we asked 3 key questions: 
1. How few EEG electrodes can be used without reducing seizure prediction performance? 
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone? 
3. Are there any electrodes that are consistently useful across different patients for predicting seizures? 
When representing the data with a $k$ of 16 sensors, which is 13 fewer than the original 29 EEG channels, we observed a maximum AUPRC loss of 0.02, indicating that seizure-prediction information from the 29 sensors was almost fully retained. With regard to the second task, we observed that patient-specific electrodes perform well when sufficient patient-specific data exists. Across all patients in the Siena Scalp EEG Dataset, only one consistent channel was identified: FC6, suggesting that more meaningful seizure-prediction information is found in the frontocentral area of the brain, although further testing would be needed. This research suggests future seizure-prediction systems may use substantially fewer EEG channels without meaningfully reducing predictive performance, making wearable systems more practical. It also shows that personalization should be applied selectively, as certain situations prioritize a generalized approach. 

## Acknowledgements

We would like to thank and acknowledge Professor Xiucai Ding, Professor Shizhe Chen, Teaching Fellow Chen Qian, Teaching Assistant Wonjun Seo, and Teaching Intern Phoebe McDonald for their support across the past 4 weeks in this program and this final project. Lastly, we would like to thank COSMOS for the opportunity and resources provided, which enabled us to do this research. 

</div>