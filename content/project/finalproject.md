---
title: "Choosing the Best EEG Sensors for Each Patient to Predict Seizures"
date: 2026-08-01
author: "The Optimizers"
description: "Exploring whether using a small, personalized set of EEG sensors for each patient can predict seizures as accurately as using many sensors."
---

<div style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

## *Introduction and Motivation*

Before a seizure happens, changes in brain activity can often be detected using electroencephalograms (EEGs). Predicting seizures early can give patients time to prepare and improve their safety and quality of life. However, standard EEG systems use many electrodes, making them uncomfortable for long-term or wearable use.

Most seizure prediction methods use the same EEG electrodes for every patient, even though seizure patterns vary from person to person. This means some electrodes may be useful for one patient but not for another. In this study, we test whether choosing EEG electrodes for each individual patient can maintain prediction accuracy while using fewer sensors.

We focus on three questions:

1. How few EEG electrodes can be used without reducing seizure prediction performance?
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone?
3. Are there any electrodes that are consistently useful across different patients for predicting seizures?

## *Dataset and Preprocessing*

We used EEG recordings from the Siena Scalp EEG Database, which includes recordings from 14 patients. Across all recordings and patients, the EEG data consists of signatures for 47 seizures. 

Only EEG signals were used. Other recorded signals, such as heart activity (EKG), were removed. The EEG data were cleaned to reduce noise and recording errors while keeping the original recordings unchanged.

For each EEG electrode, we extracted features that describe brain activity, including power in different frequency bands and measures of signal strength and quality. These features summarized the previous two minutes of EEG and allowed the model to evaluate the importance of each electrode.

To test patient-specific models, seizures were ordered by time. Earlier seizures were used for training, while the most recent seizures (about 20%) were kept for testing.

## Gen-1 Model

The goal of the Gen-1 model is to use the previous 2 minutes of EEG data to predict whether a seizure may begin within the next 5 minutes. It also estimates when, within that 5-minute future window, the seizure is most likely to start.

The model begins making predictions 5 minutes before a seizure. It makes a new prediction every 5 seconds. At any prediction time $t$, it uses EEG data from the previous 2 minutes, $[t-2, t)$, as context. It then predicts seizure onset over the next 5 minutes, $[t, t+5]$.

The 5-minute prediction window is divided into 60 intervals of 5 seconds each. For every prediction, the model gives a probability that a seizure will start in each of these 60 future intervals, as well as a probability that no seizure will occur within the next 5 minutes. When the next 5-second boundary is reached, the model updates its prediction window using the newest available EEG data.

The model can show the future interval with the highest predicted seizure probability as a simple summary. However, it keeps and uses the full set of 60 probabilities, rather than relying only on the single highest-probability interval.


## *Determining the Optimal Number of EEG Sensors*

Using fewer EEG sensors could make seizure-monitoring systems more comfortable, portable, and easier to use. It could also reduce setup time and make wearable or home-based devices more practical and representative of full brain scans done in a normal environment.

### K-Finder
K-Finder estimates the smallest number of EEG sensors needed for seizure prediction. It used 14 subjects, 29 EEG channels common to every subject, and 14,100 time-window examples. Each channel was represented by 21 predefined signal features. Those 21 features are the relative power of alpha, beta, delta, and theta waves, log RMS amplitude, log line length, and usable channel indicator. For each of these, we record the mean, most recent value, and temporal slope (change in feature across time).

It performs leave-one-out testing across all 14 patients, with 13 of them being the training, and the remaining person being the test group. Within the 13, split it into 4 folds, with 3-4 patients per fold. Treat three of the folds as training, and the remaining fold as a validation for the model. It systematically adds channels with the best validation score and maximizes macro-patient AUPRC which is calculated using the following formula: $$\frac{1}{N}\sum_{i=1}^{N}AUPRC_i.$$ Here, AUPRC is useful for prediction since seizure windows are relatively uncommon. This effectively orders the channels in order of prediction ability for each of the training patients.

Our $K$-Finder algorithm was programmed to find the value of $k$ such that some optimal configuration of $k$ sensors leads to a worst-case AUPRC loss of $0.02$ across all patients. Running the algorithm under a $95%$ confidence interval resulted in $k=16$.

## *Determining the Exact $16$ Sensors*

The $K$-Finder algorithm gives us the optimum number of sensors. The $K$-Suiter algorithm finds which exact sensors are chosen to generate an optimal model. 

### *$K$-Suiter Algorithm*

The algorithm first starts by selecting channels iteratively in such a way the binary cross-entropy is minimized. It uses cross-entropy to optimize since it “rewards” correct prediction and “penalizes” incorrect predictions. At every step it averages the seizure-risk values for all the active channels, giving the seizure risk. This procedure selects and ranks the sensors.


## *$P$ Models*

Denote $P_i$ as the model trained on patient $i$. It only takes into account the patients with more than $4$ seizures to ensure that the model has enough train and test data. In this case, we assign $max(0.2s, 2)$ seizures for testing ($s$ denotes the number of seizures the patient has). This model has similar architecture to the Gen-$1$ model, but it only trains and tests on one patient, and with a limited amount of sensors. Using the value of $k$ from $K$-Finder, $K$-Suiter finds the optimal sensor configuration for the $16$ sensors on the scalp EEG. It then runs a regularized logistic regression model based on GEN-$1$.

## *$G$ Models*
The reason we have $G_i$ (generalized) models is to compare personalized models against a one-size-fits-all approach. In some sense, however, the generalized models themselves are personalized. Our methodology uses a 5-Fold Validation strategy across subjects, in which one patient $i$ is left out of the training set and later tested against the aforementioned personalized model for said patient. Given that only 5/14 patients had more than 3 reported seizures, we created only 5 $G_i$ models to be compared with the 5 $P_i$ models. The architecture of the model itself is consistent with the Gen-$1$ and $P_i$ models (regularized logistic regression)  to reduce the number of extraneous causes of difference in performance.

## *Comparison of $P$ and $G$ Models*

Put images of comparison here.

The Gen-$1$, $P_i$, and $G_i$ models all use the same architecture: one balanced, L2-regularized logistic regression per channel (C=0.1), with selected-channel probabilities averaged and calibrated. G and P were compared primarily using cross-entropy loss. Secondary metrics were AUPRC, AUROC, and Brier score, calculated on the same held-out seizure sessions; event-level versions were also reported. Cross-entropy loss measures how wrong a model’s predicted probabilities are. If the correctly predicted probability is high (80%), the loss is low and vice versa. Analysis of improvements or limitations of personalized approaches. For each patient, we noticed (blank finding) citation to appropriate figure. When directly comparing loss between the personalized and generalized (trained) models, $P_i$ provides the greatest benefit when more training data is available, as its loss is lower than $G_i$ for patients with more available seizures for training (PN00, PN06, PN10). 

## *Identification of Invariant EEG Sensors*

We define an invariant sensor to be a sensor present in every model $P_i$. Invariant sensors provide an insight into seizure detection across multiple users. It identifies which sensors are the most accurate predictors of seizures. To do this, we implement the $I$-Finder algorithm. This algorithm uses binary classification to see whether a sensor is part of $P_i$ or not. 



Implementing the algorithm gives us that the invariant sensor is $FC6$.



$FC6$ was the electrode our model selected for every $P_i$ model. Earlier research using the Siena dataset examined seizure-related synchronization between $FC5$ and $FC6$ during one seizure, showing that this frontocentral pair can contain useful seizure information (Detti et al., 2020). Another study applied channel reduction to Siena and found that frontal, central, and parietal electrodes could preserve important information about the full pre-seizure brain network (Lee et al., 2025). However, these studies did not prove that $FC6$ is the best electrode for every patient. Our result suggests that $FC6$ may detect changes spreading across the brain before a seizure, rather than showing where the seizure originally starts. Right-side EEG channels repeatedly carried useful warning signals before seizures, even when seizures began elsewhere. This suggests seizure prediction may depend on changes across a wider brain network rather than only at the seizure’s starting point, but artifact testing is still needed.

Other commonly utilised sensors: $C4, CP1, F4, F8, F10, FP2, P4,$ and $T4$ - $4$ times

## *Discussion*

Our models show that keeping $16$ optimally selected sensors leaves a worst-case AUPRC of $0.02$, showing that they accurately can represent and predict from the data using 31 channels. Implementing invariant EEG sensors can have applications to more widespread wearable EEG detection devices. They can help reduce the cost of personalized detection devices.

Personalized models outperform general models whenever there is more seizure data to train the model on. Another version of the study using a set of shared channels as a general base and adding more sensors on for patient specific purposes may increase personalized model performance, and is a future possibility. Currently, some of the limitations of our study are having a weak Gen-$1$ model and using limited data. Since our original goal was to compare models with $k$ sensors to a model with 31 sensors (with $k<31$), having a state-of-the-art model was a secondary aspect, and with time constraints, it was forced to take a backseat. Additionally, the Sienna Scalp EEG dataset that we used consisted of only $14$ patients and $47$ total seizures. In the context of a predictive model, these numbers are very small, and a future experiment done using more data would help reduce such issues.


## *Conclusion*

Entering this research project, we asked 3 key questions: 
1. How few EEG electrodes can be used without reducing seizure prediction performance? 
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone? 
3. Are there any electrodes that are consistently useful across different patients for predicting seizures? 
When representing the data with a $k$ of 16 sensors, which is 13 fewer than the original 29 EEG channels, we found a maximum data loss of 0.02



</div>


