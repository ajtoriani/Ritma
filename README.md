#  Ritma - Foco & Fluidez

![Project Status](https://img.shields.io/badge/status-concluído-success)
![Design](https://img.shields.io/badge/design-Claymorphism-purple)
![Tech](https://img.shields.io/badge/tech-Vanilla%20JS-yellow)
![Acessibilidade](https://img.shields.io/badge/a11y-VLibras-blue)

> **Uma aplicação de produtividade que respeita sua energia.**
> O Ritma combina gerenciamento de tarefas com técnicas de foco, sons ambientes e gamificação para reduzir a ansiedade e aumentar a fluidez.

---

##  Sobre o Projeto

O **Ritma** nasceu da necessidade de repensar a produtividade. Diferente de listas tradicionais mecânicas, o Ritma foca no **estado mental do usuário**.

A aplicação utiliza o conceito de **Claymorphism** (interface "macia" e 3D) para transmitir conforto visual, e implementa funcionalidades que estimulam a dopamina de forma saudável, como streaks (ofensiva) e celebrações visuais.

###  Funcionalidades Principais (Versão 4.0)

* **Gestão de Energia:** O fluxo começa perguntando *"Como você está?"*. O app adapta a experiência baseada na sua resposta.
* **Soundscapes (Sons de Foco):** Player integrado com 5 opções de áudio para induzir o estado de flow: *Chuva, Lo-Fi, Cafeteria, Ruído Branco e Lareira*.
* **Dark Mode & Light Mode:** Interface que se adapta à preferência do usuário com paletas de cores refinadas.
* **Dashboard de Estatísticas:**
    * Gráficos de atividade semanal (construídos puramente com CSS).
    * Contador de tempo total de foco.
    * Distribuição de tarefas por nível de energia.
* **Gamificação:** Sistema de "Streak" (dias seguidos) e chuva de confetes ao concluir tarefas.
* **Acessibilidade:** Integração nativa com **VLibras**.
* **PWA (Progressive Web App):** Instalável em dispositivos móveis como um app nativo.

---

##  Tecnologias & Engenharia

O projeto foi desenvolvido intencionalmente **sem frameworks** (React/Vue) para demonstrar domínio profundo dos fundamentos da Web e arquitetura de software.

* **HTML5 Semântico:** Uso extensivo de tags `<template>` para renderização dinâmica e performance.
* **CSS3 Moderno:**
    * **Claymorphism:** Uso avançado de `box-shadow` e `border-radius` para criar profundidade.
    * **CSS Grid & Flexbox:** Para layouts complexos e responsivos.
    * **CSS-Only Charts:** Gráficos de barras criados sem bibliotecas de visualização de dados.
* **JavaScript (ES6+):**
    * **State Management:** Implementação de um padrão `Store` (similar ao Redux) com Vanilla JS para gerenciar o estado global.
    * **Local Storage:** Persistência de dados complexos (histórico, preferências, tarefas).
    * **Date Logic:** Algoritmos para cálculo de ofensiva (Streak) e dias da semana.
* **Bibliotecas Externas (Mínimas):**
    * `canvas-confetti`: Para o efeito visual de celebração.
    * `Phosphor Icons`: Para iconografia consistente.
    * `VLibras`: Para acessibilidade.

---

##  Decisões de UX/UI

Como Designer e Desenvolvedora, cada pixel teve um propósito:

1.  **Estilo Claymorphism:** Escolhi fugir do "Flat Design" tradicional. O estilo "fofo" e 3D reduz a seriedade intimidadora de listas de tarefas corporativas.
2.  **Associação Cognitiva:** A funcionalidade de sons não é aleatória; ela visa criar um "gatilho de foco" no cérebro do usuário (ex: Chuva = Hora de Concentrar).
3.  **Feedback Loop:** A interface nunca deixa o usuário no vácuo. Ações têm sons, mudanças de cor ou animações.
4.  **Eliminação de Atrito:** A opção de deletar tarefas e o reset diário dão ao usuário controle total sobre sua organização, sem punições.

---

##  Como Rodar Localmente

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/ajtoriani/ritma.git](https://github.com/ajtoriani/ritma.git)
    ```
2.  Abra a pasta do projeto.
3.  Abra o arquivo `index.html` no seu navegador.
    * *Recomendação:* Utilize a extensão **Live Server** no VS Code para evitar bloqueios de segurança do navegador com os arquivos de áudio locais.

---

##  Estrutura de Pastas

```text
ritma/
├── sounds/         # Arquivos de áudio (mp3) locais
├── index.html      # Estrutura, Templates e SEO
├── style.css       # Estilização, Variáveis e Animações
├── script.js       # Lógica de Negócio (Store) e UI
├── manifest.json   # Configuração PWA
└── icon.png        # Assets visuais

```

## Contribuições
Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para abrir uma _issue_ ou um _pull request_.

## Contato
Conecte-se comigo no LinkedIn:
Ana Julia


<p align="center"> <a href="https://www.linkedin.com/in/anajuliatoriani/"> <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/> </a> <a href="https://github.com/anajuliatoriani"> <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/> </a> <a href="https://anajuliatorianipessoa.vercel.app/"> <img src="https://img.shields.io/badge/Portfólio-FF5722?style=for-the-badge&logo=html5&logoColor=white"/> </a> <a href="mailto:anajuliatoriani@gmail.com"> <img src="https://img.shields.io/badge/Email-D97706?style=for-the-badge&logo=gmail&logoColor=white"/> </a> </p>

---
## Licença
Este projeto está sob a licença MIT.

---
Desenvolvido por Ana Julia Toriani Pessoa

