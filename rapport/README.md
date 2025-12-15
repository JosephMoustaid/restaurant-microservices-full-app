# Guide de Compilation du Rapport LaTeX

## Structure du Projet

```
rapport/
├── main.tex                 # Fichier principal LaTeX
├── Biblio.bib              # Bibliographie
├── Chapitres/              # Dossier des chapitres
│   ├── abstract.tex        # Résumé français et anglais
│   ├── introduction.tex    # Introduction générale
│   ├── chapitre1.tex      # État de l'art
│   ├── chapitre2.tex      # Conception et architecture
│   ├── chapitre3.tex      # Implémentation et résultats
│   ├── conclusion.tex     # Conclusion
│   └── appendix.tex       # Annexes
└── Images/                 # Dossier des images
    └── README.md          # Guide pour les images
```

## Prérequis

### Option 1 : TeX Live (Recommandé pour Linux)
```bash
sudo apt-get install texlive-full
sudo apt-get install texlive-lang-french
```

### Option 2 : MiKTeX (Windows)
Télécharger depuis : https://miktex.org/download

### Option 3 : MacTeX (macOS)
Télécharger depuis : https://www.tug.org/mactex/

## Compilation

### Méthode 1 : Ligne de commande

```bash
cd rapport

# Compilation complète (4 passes pour les références)
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

### Méthode 2 : Script automatique

Créer un fichier `compile.sh` :

```bash
#!/bin/bash
pdflatex -interaction=nonstopmode main.tex
bibtex main
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex

# Nettoyage des fichiers temporaires
rm -f *.aux *.log *.out *.toc *.lof *.lot *.bbl *.blg *.idx *.ilg *.ind
echo "Compilation terminée ! Voir main.pdf"
```

Rendre exécutable et lancer :
```bash
chmod +x compile.sh
./compile.sh
```

### Méthode 3 : Overleaf (en ligne)

1. Créer un compte sur https://www.overleaf.com
2. Créer un nouveau projet (Upload Project)
3. Zipper le dossier `rapport` et l'uploader
4. Overleaf compile automatiquement

## Personnalisation

### Informations personnelles (main.tex)

Modifier ces commandes :
```latex
\newcommand{\reportAuthor}{Youssef \textsc{Moustaid}}
\newcommand{\dateSoutenance}{15/12/2025}
\newcommand{\studyDepartment}{Projet de Fin d'Études}

% Jury members
\newcommand{\juryPresident}{M. Prénom \textsc{Nom}}
\newcommand{\juryMemberOne}{Mme Prénom \textsc{Nom}}
% etc.
```

### Ajouter les images

1. Placer les captures d'écran dans le dossier `Images/`
2. Nommer selon le README dans Images/
3. Formats supportés : PNG, JPG, PDF

### Modifier les chapitres

Chaque chapitre est dans un fichier séparé dans `Chapitres/`. Modifier directement ces fichiers pour ajuster le contenu.

## Résolution de Problèmes

### Erreur : Package not found
```bash
# TeX Live
sudo tlmgr update --self
sudo tlmgr install <package-name>

# MiKTeX : installer automatiquement les packages manquants
# Activer dans les paramètres MiKTeX
```

### Erreur : Images non trouvées
- Vérifier que les images sont dans `Images/`
- Vérifier les noms de fichiers (sensibles à la casse)
- Utiliser des chemins relatifs

### Erreur : Bibliographie vide
- Vérifier que `Biblio.bib` existe
- Relancer `bibtex main`
- Compiler 2 fois après bibtex

## Contenu du Rapport

Le rapport complet comprend :

### Pages liminaires
- Page de garde
- Dédicace
- Remerciements
- Résumé (français/anglais)
- Tables des matières, figures, tableaux
- Glossaire et acronymes

### Corps du rapport (~20 pages)
- **Introduction** : Contexte, problématique, objectifs
- **Chapitre 1** : État de l'art sur les microservices
- **Chapitre 2** : Conception de l'architecture
- **Chapitre 3** : Implémentation et résultats
- **Conclusion** : Bilan et perspectives

### Annexes
- Exemples de code
- Diagrammes supplémentaires
- Configurations
- Guide d'installation

## Notes Importantes

1. **Images manquantes** : Le PDF compilera avec des boîtes vides si les images ne sont pas présentes. Ajouter les captures avant compilation finale.

2. **Longueur** : Le contenu actuel est optimisé pour ~20 pages. Ajuster si nécessaire en :
   - Réduisant les annexes
   - Condensant les sections techniques
   - Retirant des exemples de code

3. **Langue** : Tout est en français comme demandé, avec un abstract en anglais.

4. **Citations** : Ajouter `\cite{reference}` pour citer la bibliographie.

## Compilation Rapide (sans bibliographie)

Pour un aperçu rapide :
```bash
pdflatex main.tex
```

## Résultat Final

Le fichier `main.pdf` contiendra le rapport complet avec :
- Numérotation automatique des chapitres
- Table des matières cliquable
- Liens hypertexte
- Bibliographie formatée
- Index des figures et tableaux

## Support

Pour toute question :
- Documentation LaTeX : https://www.latex-project.org/help/documentation/
- Forum TeX.StackExchange : https://tex.stackexchange.com/
- Guide Overleaf : https://www.overleaf.com/learn
