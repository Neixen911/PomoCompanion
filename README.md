## PomoCompanion

### Description
PomoCompanion est une application de bureau simple permettant de gérer des sessions de travail basée sur la techinque Pomodoro (25 minutes de travail, 5 minutes de pause).
L'application vis a maximiser la productivité en alternant des périodes de concentration intense avec des pauses régulières.
L'interface utilisateur est conçue pour être intuitve et non intrusive, permettant aux utilisateurs de se concentrer sur leur travail tout en gardant un œil sur le temps restant. La présence d'un minuteur visuel prenant la majeure partie de l'application contribue à cette non distraction.

### Fonctionnalités
- [X] Minuteur visuel pour les sessions de travail et de pause
- [X] Historique des sessions passées via un dashbaord
- [X] Musique détente pendant les sessions de travail

### Base de données
```
users {
  id,
  username
}

timer_sessions {
  id,
  user_id,
  total_time_seconds,
  effective_time_seconds,
  pause_time_seconds,
  started_at
}
```

### Contribution
Pour contribuer à ce projet, veuillez suivre les étapes suivantes :
1. Créer une issue décrivant la fonctionnalité / bug que vous souhaitez aborder.
2. Discuter de votre proposition dans l'issue pour confirmer son adéquation avec le projet.
3. Créer une branche dédiée.
4. Commiter les améliorations / corrections sur cette branche.
5. Soumettre une pull request pour revue.
6. Intégration dans le projet.
