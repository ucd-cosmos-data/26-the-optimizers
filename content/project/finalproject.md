---
title: "Choosing the Best EEG Sensors for Each Patient to Predict Seizures"
date: 2026-08-01
author: "The Optimizers"
description: "Exploring whether using a small, personalized set of EEG sensors for each patient can predict seizures as accurately as using many sensors."
---

<style>
  .report-switcher input[type="radio"] { position: absolute; opacity: 0; pointer-events: none; }
  .report-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1.25rem auto 1.5rem; max-width: 1000px; padding: 0 1rem; }
  .report-controls label { border: 1px solid #cbd5e1; border-radius: 999px; color: #475569; cursor: pointer; font-size: 0.94rem; font-weight: 600; padding: 0.55rem 1rem; transition: 0.15s ease; }
  .report-controls label:hover { border-color: #64748b; color: #0f172a; }
  #slides-companion:checked ~ .report-controls label[for="slides-companion"],
  #technical-version:checked ~ .report-controls label[for="technical-version"],
  #plain-language-version:checked ~ .report-controls label[for="plain-language-version"] { background: #1e3a5f; border-color: #1e3a5f; color: #ffffff; }
  .technical-report, .plain-language-report { display: none; }
  #technical-version:checked ~ .technical-report,
  #plain-language-version:checked ~ .plain-language-report { display: block; }
  #technical-version:checked ~ .slides-companion,
  #plain-language-version:checked ~ .slides-companion { display: none; }
  .plain-language-report .plain-note { background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 0 6px 6px 0; color: #1e3a5f; margin: 0 0 2rem; padding: 1rem 1.15rem; }
  .plain-language-report figure { margin: 2.5rem auto; text-align: center; }
  .plain-language-report figure img { border-radius: 6px; display: block; margin: 0 auto; max-width: 900px; width: 100%; }
  .plain-language-report figcaption { color: #59636e; font-size: 0.92rem; line-height: 1.45; margin-top: 0.65rem; }
  .slides-companion { color: #ffffff; margin: 0 auto; max-width: 720px; padding: 0 1rem 2rem; }
  .slides-companion .companion-intro { background: #eff6ff; border-radius: 14px; margin-bottom: 1rem; padding: 1.25rem; }
  .slides-companion .companion-intro h2 { color: #1e3a5f; font-size: 1.65rem; line-height: 1.2; margin: 0 0 0.6rem; }
  .slides-companion .companion-intro p { color: #172033; margin: 0.6rem 0 0; }
  .slides-companion .slide-card { background: #1e293b; border: 1px solid #334155; border-radius: 14px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.16); margin: 1rem 0; overflow: hidden; padding: 1.25rem; }
  .slides-companion .slide-label { color: #93c5fd; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; margin: 0 0 0.35rem; text-transform: uppercase; }
  .slides-companion h3 { color: #f8fafc; font-size: 1.3rem; line-height: 1.25; margin: 0 0 0.65rem; }
  .slides-companion p, .slides-companion li { line-height: 1.55; }
  .slides-companion ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .slides-companion figure { margin: 1rem 0 0; text-align: center; }
  .slides-companion figure img { border-radius: 8px; display: block; height: auto; margin: 0 auto; max-width: 100%; width: 100%; }
  .slides-companion figcaption { color: #cbd5e1; font-size: 0.88rem; line-height: 1.4; margin-top: 0.55rem; }
  .slides-companion .key-result { background: #e8f5ee; border-left: 4px solid #15803d; border-radius: 0 8px 8px 0; color: #172033; font-weight: 600; margin: 0.8rem 0 0; padding: 0.8rem 0.9rem; }
  .slides-companion .presentation-link { display: inline-block; font-weight: 600; margin-top: 0.8rem; }
  @media (max-width: 520px) { .report-controls { flex-wrap: nowrap; gap: 0.35rem; overflow-x: auto; padding-bottom: 0.2rem; } .report-controls label { font-size: 0.82rem; padding: 0.5rem 0.7rem; white-space: nowrap; } .slides-companion { padding-left: 0.75rem; padding-right: 0.75rem; } .slides-companion .slide-card { padding: 1rem; } }
</style>

<div class="report-switcher">
  <input type="radio" name="report-version" id="slides-companion" checked>
  <input type="radio" name="report-version" id="technical-version">
  <input type="radio" name="report-version" id="plain-language-version">
  <div class="report-controls" aria-label="Choose report version">
    <label for="slides-companion">Slides companion</label>
    <label for="technical-version">Raw technical report</label>
    <label for="plain-language-version">Raw simple report</label>
  </div>

<div class="slides-companion">
  <div class="companion-intro">
    <h2>Follow along with the presentation</h2>
    <p>A quick, phone-friendly guide to our project: can seizure prediction use fewer EEG sensors while still keeping useful information?</p>
    <a class="presentation-link" href="https://docs.google.com/presentation/d/1_abt6y5PC3gHAjjK1f-If-OtQK9rjge2rrbgm5XiD9A/edit?slide=id.g3f605c68456_2_167">Open the slideshow</a>
  </div>

  <section class="slide-card">
    <p class="slide-label">The problem</p>
    <h3>Wearable seizure warnings need fewer sensors</h3>
    <p>EEG can reveal changes in brain activity before a seizure, but conventional systems use many scalp sensors. We investigated whether smaller, personalized sensor sets can support a more practical warning system.</p>
    <ul><li>How few sensors can we use?</li><li>Does personalizing a model help?</li><li>Do any sensors work well across patients?</li></ul>
  </section>

  <section class="slide-card">
    <p class="slide-label">Data</p>
    <h3>14 patients and 47 recorded seizures</h3>
    <p>We used EEG recordings from the Siena Scalp EEG Database. We cleaned recording artifacts, then summarized the previous two minutes of EEG activity for each prediction.</p>
    <figure><img src="/26-the-optimizers/projects/finalproject/04_artifact_cleaning.png" alt="EEG recording before and after artifact cleaning"><figcaption>Cleaning reduces recording artifacts before feature extraction.</figcaption></figure>
    <figure><img src="/26-the-optimizers/projects/finalproject/00_dataset_coverage.png" alt="Dataset coverage across 14 patients and 47 seizures"><figcaption>The amount of seizure data differs across patients.</figcaption></figure>
  </section>

  <section class="slide-card">
    <p class="slide-label">Sensor selection</p>
    <h3>Sixteen sensors met our performance target</h3>
    <p>K-Finder tested sensor sets of different sizes across 29 channels shared by all patients. We required no more than a 0.03 drop in AUPRC for any held-out patient.</p>
    <p class="key-result">Result: 16 sensors was the smallest observed set that met the criterion — 13 fewer than the full 29-channel layout.</p>
    <figure><img src="/26-the-optimizers/projects/finalproject/01_k_finder.png" alt="K-Finder results showing model performance as the number of sensors increases"><figcaption>Performance versus number of selected sensors.</figcaption></figure>
  </section>

  <section class="slide-card">
    <p class="slide-label">Personalized vs. shared</p>
    <h3>Neither approach won for everyone</h3>
    <p>We compared patient-specific models with models trained on other patients. Personalization helped most when a patient had enough earlier seizures available for training; generalized models did not transfer reliably to every new patient.</p>
    <figure><img src="/26-the-optimizers/projects/finalproject/02_personalized_vs_generalized.png" alt="Comparison of personalized and generalized model performance by patient"><figcaption>Both approaches were evaluated on the same held-out sessions.</figcaption></figure>
    <figure><img src="/26-the-optimizers/projects/finalproject/g_models_stats.svg" alt="Per-patient performance statistics for generalized models"><figcaption>Generalized-model results varied substantially by patient.</figcaption></figure>
    <figure><img src="/26-the-optimizers/projects/finalproject/p_models_stats.svg" alt="Per-patient performance statistics for patient-specific models"><figcaption>Patient-specific models also helped inconsistently across the cohort.</figcaption></figure>
    <figure><img src="/26-the-optimizers/projects/finalproject/gen1_model_stats.svg" alt="Per-patient performance statistics for the full-montage Gen-1 model"><figcaption>The full-sensor baseline showed the same patient-to-patient variation.</figcaption></figure>
  </section>

  <section class="slide-card">
    <p class="slide-label">One shared signal</p>
    <h3>FC6 appeared in every patient-specific sensor set</h3>
    <p>FC6 was the only sensor selected by every patient-specific model. It is a promising starting point for future study, but it is not proof that one sensor is best for every person.</p>
    <figure><img src="/26-the-optimizers/projects/finalproject/03_channel_selection_frequency.png" alt="Frequency with which EEG sensors were selected across patient-specific models"><figcaption>FC6 was selected in every patient-specific model.</figcaption></figure>
  </section>

  <section class="slide-card">
    <p class="slide-label">Takeaway</p>
    <h3>Start smaller, then personalize</h3>
    <p>A 16-sensor layout retained much of the seizure-prediction information in this small study. A practical future system could begin with a shared sensor set, then adapt as it gathers more data from each person.</p>
    <p>More patients, more seizures, and stronger models are needed before these findings could be used in a clinical device.</p>
  </section>
</div>

<div class="plain-language-report" style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

<div class="plain-note"><strong>About this version:</strong> This is the same project, evidence, and conclusions as the technical report. It uses everyday language and explains specialized terms as they appear.</div>

## Introduction and Motivation

Seizures can sometimes be preceded by changes in brain activity. An electroencephalogram, or EEG, records that activity through small sensors placed on the scalp. If a system can recognize warning signs before a seizure begins, it could give a person time to get somewhere safe, alert someone, or prepare.

The problem is that standard EEG systems use many sensors. They can be inconvenient to set up and uncomfortable to wear for long periods. That makes them less practical for a wearable or at-home warning system. We asked whether a system could use fewer sensors without losing much of its ability to predict seizures.

We also asked whether the best sensors are different for different people. Seizures do not look exactly the same in every person's EEG, so using one fixed sensor layout for everyone may miss useful information. Our project therefore focused on three questions:

1. What is the smallest number of EEG sensors we can use while keeping similar prediction performance?
2. Is a model tailored to one patient better than a model trained on many patients?
3. Are any sensors useful often enough to be shared across patients?

## Dataset and Preprocessing

We used the Siena Scalp EEG Database. It includes EEG recordings from 14 patients and 47 recorded seizures. We used only EEG signals; other measurements, such as heart activity, were removed because they were not part of this study.

EEG recordings can include noise from movement, loose sensors, and other recording problems. We cleaned the data to reduce those problems while preserving the brain-activity patterns that might be useful for seizure prediction.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/04_artifact_cleaning.png" alt="EEG recording before and after artifact cleaning">
  <figcaption>Cleaning removes recording artifacts so the model can focus on the EEG signal.</figcaption>
</figure>

For every EEG sensor, we created numerical descriptions of the signal. These included how much activity appeared in different frequency ranges, the overall signal strength, and measures of signal quality. Each prediction used information from the previous two minutes of EEG data.

For patient-specific testing, we kept the order of seizures in time. Earlier seizures were used to train a model, and the most recent seizures—about 20%—were saved for testing. This better represents the real situation in which a system learns from a person's past recordings before making predictions about their future recordings.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/00_dataset_coverage.png" alt="Dataset coverage across 14 patients and 47 seizures">
  <figcaption>The number of seizures varied by patient, which affects how much training information each personalized model receives.</figcaption>
</figure>

## Gen-1 Model

Our starting model, Gen-1, is intentionally simple. It uses a type of model called regularized logistic regression. In plain terms, each EEG sensor gives its own estimate of seizure risk, and the model combines the estimates from the selected sensors. The regularization prevents the model from becoming overly complicated or relying too heavily on small quirks in the training data.

The model updates every five seconds. At any point in time, it looks at the previous two minutes of EEG activity and asks whether a seizure is likely to start in the next five minutes. That five-minute future window is divided into 60 intervals of five seconds each. The model gives a probability for each interval, plus a probability that no seizure will begin during the window.

This project was mainly about choosing sensors, not building the most advanced possible prediction model. Keeping the model consistent and relatively simple allowed us to compare different sensor choices more fairly.

## Determining the Optimal Number of EEG Sensors

Fewer sensors could make an EEG system lighter, faster to set up, and more realistic for everyday use. To find a good number of sensors, we created K-Finder. K-Finder tests sensor sets of different sizes and looks for the smallest set that still performs nearly as well as the larger set.

K-Finder used 29 EEG channels that were available for all 14 patients. For each channel, it used 21 measurements describing signal activity over time. It tested the method by holding out one patient at a time, training on the other patients, and checking performance on the held-out patient. Within the training group, it used additional folds of data to decide which channels to add.

We measured performance with AUPRC, short for Area Under the Precision-Recall Curve. This is helpful when seizures are rare. Precision asks, “When the model gives a warning, how often is it right?” Recall asks, “How many seizure windows did the model find?” In our data, only 949 of 101,520 five-second intervals contained seizure activity, so a random model would have a very low AUPRC of 0.00935.

We chose a rule allowing no more than a 0.03 drop in AUPRC for any held-out patient. Across all 14 tests, 16 was the smallest observed sensor count that met this rule. The specific 16 sensors could differ from one test to another.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/01_k_finder.png" alt="K-Finder results showing model performance as the number of sensors increases">
  <figcaption>Sixteen sensors were enough to meet our performance-loss criterion while removing 13 of the 29 common channels.</figcaption>
</figure>

## Determining the Exact 16 Sensors

Knowing that we need 16 sensors is only the first step; we also need to know which 16 to use. K-Suiter selects and ranks sensors one at a time. At each step, it chooses the sensor that improves the model's predictions the most.

K-Suiter uses binary cross-entropy to judge a choice. This is a scoring method that rewards confident correct predictions and penalizes confident incorrect ones. At each stage, it combines the seizure-risk estimates from the sensors selected so far, then checks whether adding another sensor improves the score.

## Patient-Specific Models

We call a model trained for one patient $P_i$, where $i$ represents that patient. A patient-specific model learns only from that person's EEG recordings. We used these models only for patients with more than four seizures, so there would be enough data for both training and testing. For each patient, we used the 16-sensor layout chosen by K-Suiter and the same basic model structure used by Gen-1.

Patient-specific models can adapt to patterns that may be unique to one person. Their weakness is that they need enough earlier seizures to learn from, which is not always available.

## Generalized Models

We call a cross-patient model $G_i$. To build one, we train on other patients and hold out patient $i$ until testing. This tests whether seizure-warning patterns learned from one group of people also work for someone new.

Only five patients had more than three recorded seizures, so we made five generalized models to compare with the corresponding patient-specific models. The generalized and patient-specific models used the same kind of logistic-regression model. That way, differences in the results are more likely to come from who the model learned from, rather than from a different model design.

## Model Results

### Comparing Patient-Specific and Generalized Models

We compared the two approaches mainly using cross-entropy loss, which measures how far predicted probabilities are from the true outcome. Lower loss is better. We also used AUPRC, AUROC, and Brier score. These give different views of whether the model can tell pre-seizure periods from non-seizure periods and whether its probability estimates are well calibrated.

The main pattern was that patient-specific models helped most when a patient had more seizure data available for training. For PN00, PN06, and PN10, each with five or more seizures, the patient-specific model had lower loss than the generalized model.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/02_personalized_vs_generalized.png" alt="Comparison of personalized and generalized model performance by patient">
  <figcaption>Personalized and generalized models were evaluated on the same held-out patient sessions.</figcaption>
</figure>

### Generalized Models

Across the five generalized models, mean AUPRC was 0.277, compared with a mean patient baseline of 0.233. This is a modest improvement overall, but the average hides large differences between people. The model clearly beat baseline for $G_{12}$ and $G_{14}$, was about the same as baseline for $G_0$, and was below baseline for $G_6$ and $G_{10}$. Its mean AUROC was 0.501, which is essentially chance performance.

These results tell us that a model trained on other people does not reliably transfer to everyone. It may be useful for some patients, but the average result is driven by a small part of the group.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/g_models_stats.svg" alt="Per-patient performance statistics for generalized models">
  <figcaption>Generalized-model performance varied substantially across held-out patients.</figcaption>
</figure>

### Patient-Specific Models

The patient-specific models had a mean AUPRC of 0.293, compared with the same mean patient baseline of 0.233. Again, the improvement was uneven. The models beat baseline for $P_0$ and $P_6$ but were below baseline for the other three patients. Their mean AUROC was 0.487, also close to chance.

Personalization is therefore not automatically better. It appears most useful when the model has enough earlier seizures from the same person to learn from.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/p_models_stats.svg" alt="Per-patient performance statistics for patient-specific models">
  <figcaption>Patient-specific models helped some patients but did not improve performance consistently across the cohort.</figcaption>
</figure>

### Gen-1 Model

The full-sensor Gen-1 model had a mean held-out score of 0.238, compared with a mean positive-rate baseline of 0.209. It performed above baseline for 8 of the 14 patients, but below baseline for the other 6. This reinforces the larger result: seizure-related EEG patterns differ greatly from person to person, so no single approach worked equally well for everyone in this small dataset.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/gen1_model_stats.svg" alt="Per-patient performance statistics for the full-montage Gen-1 model">
  <figcaption>The full-montage model also showed strong differences in performance between patients.</figcaption>
</figure>

## Evaluation

Across the full-sensor, generalized, and patient-specific models, performance changed substantially from patient to patient. The generalized model had limited ability to carry patterns from one person to another. Personalized models produced strong results only for a subset of patients. None of the approaches consistently separated pre-seizure and non-seizure EEG throughout the cohort.

The most promising next step is a hybrid system. It could begin with a model trained from shared data, then adapt as it collects more recordings from a particular patient. This would be more practical than waiting for a large number of seizures from each new user, while still allowing the system to become more personal over time.

## Finding Sensors That Work Across Patients

We call a sensor invariant if K-Suiter chose it in every patient-specific model. An invariant sensor may be a useful starting point for a shared sensor layout. We used I-Finder, a method that checks whether a sensor belongs in each patient's 16-sensor set.

FC6 was the only invariant sensor. It appeared in every patient-specific model. This does not prove that FC6 is the best sensor for every patient or that it shows exactly where a seizure begins. Instead, it suggests that activity near this right frontocentral location may often contain useful warning information.

<figure>
  <img src="/26-the-optimizers/projects/finalproject/03_channel_selection_frequency.png" alt="Frequency with which EEG sensors were selected across patient-specific models">
  <figcaption>FC6 was selected in every patient-specific model; several other channels were selected in four models.</figcaption>
</figure>

Previous work with the Siena dataset has also found useful seizure-related information in frontal, central, and parietal areas. Our result is consistent with the idea that seizure prediction may depend on broader brain-network changes, not only on the place where a seizure begins. However, more testing is needed to rule out artifacts and to see whether this pattern holds in larger datasets.

## Discussion

Our strongest result is that 16 carefully chosen sensors were enough to keep the worst performance drop to 0.03 AUPRC. In other words, we removed 13 of the 29 common channels while retaining much of the information used for seizure prediction. This could help make future wearable EEG systems less expensive and more comfortable.

Our model-comparison results are more cautious. Patient-specific sensor selection can be helpful, but mainly when enough training data are available. A one-size-fits-all model also worked for some people and not for others. Because of that, a shared starting layout plus patient-specific adjustments may be more useful than choosing only one of these approaches.

This study has important limits. The dataset was small: 14 patients and 47 seizures. Our starting model was also intentionally simple because the project focused on sensor selection. A larger study with more seizures, more patients, and stronger prediction models would be needed before using these findings in a real clinical device.

## Conclusion

This project showed that seizure-prediction research may not need a full 29-sensor EEG layout. A set of 16 selected sensors limited the worst-case AUPRC loss to 0.03. Personalized models were most useful when enough patient-specific seizure data were available, while generalized models did not transfer reliably to every person. FC6 was the only sensor selected in every patient-specific model, making it a promising channel for future study.

Together, these findings support a practical direction for future seizure-warning systems: use a smaller shared sensor set, then personalize it when enough individual data are available. More data and stronger models are needed, but reducing the number of sensors could make long-term wearable EEG monitoring more realistic.

## Acknowledgements

We thank Professor Xiucai Ding, Professor Shizhe Chen, Teaching Fellow Chen Qian, Teaching Assistant Wonjun Seo, Teaching Intern Phoebe McDonald, and COSMOS for their guidance, support, and resources throughout this project.

</div>

<div class="technical-report" style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">

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

Our $K$-Finder algorithm selected the smallest sensor count $k$ for which the worst held-out-patient AUPRC loss, compared with the full 29-sensor model, was at most $0.03$.
Across the 14 held-out-patient tests, the smallest observed count meeting this criterion was $k=16$.

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

Selecting 16 sensors reduced the number of channels while limiting the worst-case AUPRC loss to 0.03. This suggests that a smaller montage can retain much of the seizure-prediction information available in the full set of common channels, an encouraging result for more comfortable and lower-cost wearable systems.

Personalized models were most useful when enough patient-specific seizure data were available. A promising next step is a hybrid approach: begin with a shared set of channels and adapt the sensor selection as individual data accumulate. This study is limited by the simple Gen-1 model and the small dataset of 14 patients and 47 seizures. Because our primary goal was to compare reduced sensor sets with the full 29-channel montage, developing a state-of-the-art prediction model was outside the scope of this project. Larger datasets and stronger base models would provide a more reliable test of the proposed approach.

## Conclusion

This project addressed three questions:
1. How few EEG electrodes can be used without reducing seizure prediction performance? 
2. Does choosing electrodes for each patient work better than using the same electrodes for everyone? 
3. Are there any electrodes that are consistently useful across different patients for predicting seizures?
 
Using 16 sensors—13 fewer than the 29 common EEG channels—limited the maximum AUPRC loss to 0.03. Patient-specific sensor selection was most helpful when sufficient patient-specific seizure data were available. FC6 was the only sensor selected consistently across all patient-specific models, suggesting that frontocentral activity may carry broadly useful predictive information, although this requires further testing. Overall, the results suggest that seizure-prediction systems may be able to use substantially fewer EEG channels without meaningful performance loss, making wearable monitoring more practical. They also indicate that personalization should be applied selectively rather than assumed to improve performance for every patient.

## Acknowledgements

We would like to thank and acknowledge Professor Xiucai Ding, Professor Shizhe Chen, Teaching Fellow Chen Qian, Teaching Assistant Wonjun Seo, and Teaching Intern Phoebe McDonald for their support across the past 4 weeks in this program and this final project. Lastly, we would like to thank COSMOS for the opportunity and resources provided, which enabled us to do this research. 

</div>

</div>
