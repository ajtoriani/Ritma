#  Ritma - Foco & Fluidez

![Project Status](https://img.shields.io/badge/status-concluído-success)
![Design](https://img.shields.io/badge/design-UX%2FUI-purple)
![Tech](https://img.shields.io/badge/tech-Vanilla%20JS-yellow)

> Uma aplicação web de produtividade focada no ritmo natural do usuário, combinando gerenciamento de tarefas com técnicas de foco e áudio ambiente.


[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajtp/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajtoriani)
[![Behance](https://img.shields.io/badge/Behance-1769ff?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/ajtp)
[![E-mail](https://img.shields.io/badge/-Email-000?style=for-the-badge&logo=gmail&logoColor=AA42F7)](mailto:anajuliatoriani@gmail.com)

---

##  Sobre o Projeto

O **Ritma** nasceu da necessidade de uma ferramenta de "To-Do List" que fosse menos mecânica e mais humana. Diferente de listas tradicionais, o Ritma começa perguntando: *"Como está sua energia agora?"*.

Com base na resposta (Baixa, Moderada ou Alta), o app sugere tarefas adequadas para aquele momento ou permite que o usuário crie suas próprias, respeitando seu ciclo produtivo.

###  Funcionalidades Principais
* **Check-in de Energia:** Interface inicial para calibrar as tarefas sugeridas.
* **Modo Foco Imersivo:** Timer embutido com áudio de chuva (White Noise) para concentração profunda.
* **Gamificação Leve:** Feedback visual e sonoro ao concluir tarefas.
* **PWA (Progressive Web App):** Pode ser instalado no celular como um aplicativo nativo.
* **Persistência de Dados:** O estado do app é salvo automaticamente, permitindo fechar e reabrir sem perder o progresso.

---

##  Tecnologias Utilizadas

O projeto foi construído sem o uso de frameworks (como React ou Vue) para consolidar os fundamentos da web moderna e arquitetura de software.

* **HTML5 Semântico:** Uso da tag `<template>` para renderização dinâmica e performática.
* **CSS3 Moderno:**
    * Variáveis CSS (`:root`) para consistência de Design System.
    * Flexbox para layouts responsivos.
    * Animações nativas (`@keyframes`) para micro-interações fluidas (60fps).
* **JavaScript (ES6+):**
    * **State Management:** Implementação de um sistema de estado centralizado (Store) similar ao Redux/Vuex, mas com Vanilla JS.
    * **LocalStorage API:** Para persistência de dados do usuário.
    * **Audio API:** Manipulação de sons de ambiente e efeitos.

---

##  Decisões de UX/UI

Como Designer e Front-End, o foco foi na experiência do usuário:

1.  **Mobile First:** O layout foi pensado primariamente para o toque e telas verticais. No desktop, ele simula uma "app experience" flutuante.
2.  **Feedback Imediato:** Cada ação (clicar, focar, concluir) possui uma resposta visual ou sonora, garantindo que o sistema pareça vivo.
3.  **Carga Cognitiva Reduzida:** O app mostra apenas uma tarefa principal por vez ("Hero Card"), evitando a ansiedade causada por listas longas.

---

##  Como Rodar Localmente

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/SEU_USUARIO/ritma.git](https://github.com/SEU_USUARIO/ritma.git)
    ```
2.  Abra a pasta do projeto.
3.  Abra o arquivo `index.html` no seu navegador.
    * *Dica:* Para que os áudios funcionem perfeitamente sem bloqueios de CORS, recomenda-se usar a extensão **Live Server** do VS Code.

---

##  Estrutura de Pastas

```text
ritma/
├── index.html      # Estrutura e Templates
├── style.css       # Estilos e Animações
├── script.js       # Lógica de Estado e UI
├── manifest.json   # Configuração PWA
└── preview.png     # Imagem para o README
```

## Contribuições
Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para abrir uma _issue_ ou um _pull request_.

## Contato
Conecte-se comigo no LinkedIn:
Ana Julia


[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajtp/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajtoriani)
[![Behance](https://img.shields.io/badge/Behance-1769ff?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/ajtp)
[![E-mail](https://img.shields.io/badge/-Email-000?style=for-the-badge&logo=gmail&logoColor=AA42F7)](mailto:anajuliatoriani@gmail.com)
---
## Licença
Este projeto está sob a licença MIT.

---
Desenvolvido por Ana Julia Toriani Pessoa

