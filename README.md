<br /><br />

<p align="center"><img width="75px" alt="Logo Groupomania" src="https://raw.githubusercontent.com/MaelTst/MaelTissot_7_08122021/main/frontend/src/assets/logo_blue_rounded.png" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img width="300px" alt="Groupomania" src="https://raw.githubusercontent.com/MaelTst/MaelTissot_7_08122021/main/frontend/src/assets/logo_blue_text.png" /></p>

<br /><br />

> ## Présentation

<br />

Projet 7 du parcours Développeur Web OpenClassrooms dont l'objectif est de concevoir un réseau social d'entreprise pour la compagnie fictive Groupomania. L'application doit permettre à l'utilisateur de s'inscrire et se connecter au réseau social afin de pouvoir partager des images et publications avec les autres membres. Les données doivent être stockées à l'aide d'une base de données relationnelle et le développement de l'application doit être effectué à l'aide d'un framework Frontend au choix.

<br /><br />

> ## Environnement et Frameworks

<br />

| Frontend  | Backend |
| :---: | :---: |
| VueJS  | NodeJS  |
| Vuetify  | ExpressJS  |
| Vuex  | Sequelize  |
| Vue Router  | PostgreSQL  |

<br /><br />

> ## Aperçu

<br />

<img alt="Mock-up Groupomania" src="https://i.imgur.com/Xbc4s3c.jpg" />

<br /><br />

> ## Fonctionnalités de l'application

<br />

#### Général
* Création de compte et connexion
* Consultation des dernières publications
* Consultation des publications contenant des images
* Consultation de ses publications favorites
* Consultation des publications les plus likés
* Création, modification et suppression de publications avec ou sans images
* Création, modification et suppression de commentaires
* Interaction avec les publications existantes (like)


#### Profil utilisateur
* Consultation des publications d'un utilisateur
* Personnalisation d'avatar
* Personnalisation de photo de couverture
* Personnalisation de poste
* Modification du mot de passe
* Suppression du compte


#### Droits administrateur
* Bannissement d'utilisateur
* Suppression d'utilisateur
* Suppression et modification de publications et commentaires

<br /><br />

> ## Installation

<br />

```
git clone https://github.com/MaelTst/MaelTissot_7_08122021.git
```

#### Prérequis : 
  * Installation de PostgreSQL
  * Création d'une base de données et d'un utilisateur possédant les droits sur celle-ci

<br />

#### Front
* Depuis la racine du dossier `frontend` executez la commande `npm install`
* Vérifiez et adaptez si besoin les variables d'environnements du fichier `.env`
* Lancez l'application en executant la commande `npm run serve` depuis la racine du dossier `frontend`

<br />

#### Back
* Depuis la racine du dossier `backend` executez la commande `npm install`
* Adaptez les variables d'environnements du fichier `.env`
* Lancez le serveur en executant la commande `npm run start` ou `nodemon` depuis la racine du dossier `backend`