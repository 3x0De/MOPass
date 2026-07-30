# ![MOPass](public/logos/max.svg)

## My Own Password

MOPass est un gestionnaire de mots de passe 100 % local, rapide et sécurisé. Conçu pour garder un contrôle total sur vos identifiants, il fonctionne sans dépendre d'un cloud tiers en stockant et gérant vos données directement sur votre machine.

### Fonctionnalités

- **100 % Local :** Vos données restent sur votre machine et ne quittent jamais votre système.
- **Support Multi-protocoles :** Gestion intelligente des favicons et domaines standards (Web, .onion, .loki, .i2p, Freenet).
- **Stockage sécurisé :** Vos identifiants sont sauvegardés localement (~/.config/mopass/comptes.csv) avec des accès réservés à root (permissions 000).

### Stack Technique

- **Desktop Framework :** Electron
- **Frontend :** Vue 3 + TypeScript + Sass
- **Build Tool :** Vite
- **Backend Local :** Express.js (exécuté en sous-processus isolé)
- **Packaging :** electron-builder

### Installation et Développement

#### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou pnpm

#### Installation sous Linux (Debian / Ubuntu)

```bash
git clone [https://github.com/3x0De/MOPass.git](https://github.com/3x0De/MOPass.git)
cd MOPass
npm install
npm run electron:build
sudo dpkg -i release/mopass_1.0.0_amd64.deb
cd ..
sudo rm -rf MOPass
```

#### Accès

```bash
mopass
```

#### Développer

```bash
git clone https://github.com/3x0De/MOPass.git
cd MOPass
npm install
npm run dev
```

### Désinstaller MOPass

```bash
sudo apt purge mopass
```

## Resources

- [Repo Git](https://github.com/3x0De/MOPass)
- [Charte Graphique](./Charte%20garphique.pdf)
