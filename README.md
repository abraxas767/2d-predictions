 EA3 - Predict 2D - Data Documentation

## Tech-Stack
- React 18.1.0
- typescript 4.7.3
- dbeining/react-atom 4.1.21
- mui/material 5.8.3
- tensorflowjs/tfjs 3.18.0
- tensorflow/tfvis 1.5.1

## Dokumentation

Ich habe beschlossen diese Einsendeaufgabe mit React zu lösen, da ich vorallem Material-Design sehr mag und dass hier sehr leicht und einfach einzubauen ist. Für State-Management (React) benutze ich gerne die library "react-atom". Für ein besseres Coding-Erlebnis verwende ich Typescript. Für die eigentlichen Kernaufgaben nutze ich Tensorflowjs und Tensorflowvis für die Visualisierung der Daten.

### Trainings Daten

Um die Trainingsdaten zu generieren habe ich mir zuerst die gegebene Funktion geplottet und anschließend gleichverteilt N Y-Werte zu verteilen. N kann hierbei auf 5 10 20 50 100 oder 1000 gestellt werden. Bei 1000 Trainingsdaten kann man die unterliegenden Funktionen trotz des später hinzugefügten Rauschens noch sehr gut erkennen.

### Model Setup

Unter Model-Setup kann man die wichtigsten Einstellungen machen die man an einem Tensorflow-netzwerk so machen kann. Dabei gebe ich die eingegebenen Daten einfach direkt als parameter an Tensorflow weiter (nachdem ich sie validiert habe). Unter "edit architecture" können beliebig viele Layers dem Netzwerk hinzugefügt werden. Auch können jedem Layer eine eigene Anzahl an Units mitgegeben werden.

### Training und Prediction

Hat man sich für ein setup entschieden kann man auf den "trainieren" - Button klicken und das Netzwerk wird trainiert. Ursprünglich wollte ich eigentlich nicht das Tensorflowvis - visor für die Visualierung nutzen, es stellte sich aber heraus dass dann doch zu viel Arbeit gewesen wäre.
Ist das Netzwerk fertig trainiert wird der Button "predict" unter den Trainingsdaten aktiviert und wenn man ihn benutzt werden 100 - Datenpunkte gleichverteilt über den Graphen vom Netzwerk vorhergesehen. Dadurch kann man gut erkennen ob sich das Netzwerk gut angepasst hat oder nicht.

## Experimente

### Learning-Rate
Nach einigem Experimentieren mit der Anwendung kann man feststellen dass eine Lernrate von 0.08 bis 0.1 in den meisten Fällen angebracht ist.

### Epochs
Die 35 voreingestellten Epochen reichen meist nicht aus um die maximale Minimierung des Fehlers zu erreichen. Gute Werte sind hier je nach Rechenleistung und Trainingsdatenmenge (sowie Lernratenwahl), 100 - 200 Epochen.

### Activation Function

Es ist sehr interessant die selben Trainingsdaten über unterschiedliche Aktivierungs-funktionen zu trainieren. Die besten Ergebnisse, also mit dem geringsten Fehler, konnte ich mit dem Tangens Hyperbolicus erreichen, mit einem "mse" von bis zu 0.008.

