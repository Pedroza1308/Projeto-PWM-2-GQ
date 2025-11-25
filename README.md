# 🍳 Daily Meals: Conectando Cozinhas, Compartilhando Histórias

[![GitHub Repository](https://img.shields.io/badge/GitHub-Acessar%20Repositório-100000?style=for-the-badge&logo=github)](https://github.com/pedroza1308/projeto-pwm-2-gq)

O **Daily Meals** é mais do que um livro de receitas digital; é uma comunidade vibrante e colaborativa onde cozinheiros de todos os níveis podem registrar suas criações, trocar experiências e explorar um mundo de novos sabores. Nosso objetivo é transformar qualquer usuário em um chef, permitindo o compartilhamento e o gerenciamento fácil de suas próprias obras culinárias.

---

## 🤝 Integrantes

Este projeto foi desenvolvido por:

* Marina Durand
* Nunno Wakiyama
* Pablo Felipe
* Pedro Alves

---

## ✨ Funcionalidades Principais

O aplicativo foi projetado com foco na experiência do usuário e na gestão de conteúdo:

* **Criar:** Adicione suas próprias receitas com detalhes ricos (ingredientes, modo de preparo, tempo, nível de dificuldade e tipo de culinária).
* **Explorar:** Navegue por um *feed* diversificado de pratos compartilhados pela comunidade.
* **Filtrar e Visualizar:** Encontre receitas rapidamente por tipo de culinária e dificuldade.
* **Gerenciar:** Tenha controle total sobre seu conteúdo. Edite informações ou remova registros antigos facilmente.

---

## 💻 Tech Stack

Este projeto foi desenvolvido utilizando uma *stack* moderna e escalável, ideal para aplicações mobile:

| Categoria | Tecnologia | Uso |
| :--- | :--- | :--- |
| **Mobile Framework** | **React Native** | Biblioteca principal para construção da interface e lógica nativa. |
| **Desenvolvimento** | **Expo** | Gerenciamento do ciclo de desenvolvimento, builds e execução. |
| **Linguagem** | **TypeScript** | Garante código mais robusto e seguro. |
| **Gerenciamento de Estado** | **Zustand** | Solução simples e performática para estado global. |
| **Backend/Banco de Dados** | **Parse Server** | API de backend para CRUD de receitas e autenticação. |
| **Hospedagem Backend** | **Back4App** | Plataforma que hospeda e gerencia a instância do Parse. |

---

## ⚙️ Configuração e Instalação

Siga os passos abaixo para rodar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/en) (versão LTS recomendada)
* [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

### Passos de Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/pedroza1308/projeto-pwm-2-gq.git](https://github.com/pedroza1308/projeto-pwm-2-gq.git)
    cd projeto-pwm-2-gq
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração do Backend (Back4App):**

    * Crie uma conta gratuita no [Back4App](https://www.back4app.com/).
    * Crie um novo aplicativo Parse e obtenha o `Application ID` e o `Client Key`.
    * Crie um arquivo de configuração de ambiente (ex: `.env`) na raiz do projeto e insira suas chaves:

    ```bash
    # Exemplo de .env
    REACT_APP_PARSE_APP_ID="SUA_APPLICATION_ID_DO_BACK4APP"
    REACT_APP_PARSE_CLIENT_KEY="SUA_CLIENT_KEY_DO_BACK4APP"
    REACT_APP_PARSE_SERVER_URL="[https://parseapi.back4app.com/](https://parseapi.back4app.com/)"
    ```

4.  **Inicie o projeto Expo:**
    ```bash
    npx expo start
    ```

    O Expo abrirá um menu interativo no seu terminal e um QR Code. Use o aplicativo **Expo Go** no seu celular para escanear o código e visualizar o projeto.

---

## 📜 Licença

© 2025 Daily Meals Team. Todos os direitos reservados.
