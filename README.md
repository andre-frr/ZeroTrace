# 💻 ZeroTrace: Infiltração FIB

> Digita. Invade. Desaparece.

**ZeroTrace** é um jogo de digitação arcade desenvolvido como projeto académico de média dimensão. O jogador assume o papel de um hacker contratado para infiltrar os sistemas da FIB digitando comandos simulados o mais rápido possível antes que o sistema de deteção o apanhe.

## 🎯 Objetivo

Digitar frases rapidamente e com precisão para infiltrar vários terminais da FIB. Erros aumentam a barra de alarme. Completa todos os terminais para vencer.

## 🎮 Género

Typing Game / Arcade

## 👥 Público-alvo

Estudantes e entusiastas de programação com gosto por desafios de digitação e estética hacker.

## 🧩 Mecânicas

- Frases com dificuldade progressiva.
- Barra de alarme que aumenta com erros.
- Glitches visuais, letras falsas e distorções a aumentar a dificuldade.
- Níveis encadeados por uma narrativa simples.
- Interface estilo terminal retro-futurista com efeitos neon.

## 🕹 Controlo

- Exclusivamente com **teclado físico**
- Penalização opcional no tempo ao usar `Backspace`

## 🗂 Estrutura do Projeto

- `assets/`: Sons, imagens e fontes do HUD e ambiente
- `css/`: Estilo visual estilo terminal
- `js/core/`: Ciclo de jogo, input, IA da deteção, som
- `js/ui/`: HUD, menus e transições
- `levels/`: Scripts de cada terminal
- `index.html`: Ponto de entrada
- `main.js`: Inicialização

## 📜 Níveis

- **Tutorial**: Introdução às mecânicas
- **Nível 1 – Terminal Externo**: Frase simples, tempo generoso
- **Nível 2 – Base de Dados**: Frase média, tempo moderado
- **Nível 3 – Firewall Interna**: Frase longa, tempo apertado
- **Nível 4 – Arquivo Secreto**: Glitches, letras falsas, tempo crítico

## 🧠 IA (Deteção)

- Aumenta dificuldade com erros
- Introduz efeitos visuais (glitches) e perturbações

## 🔊 Áudio

- Sons de tecla e erro
- Música eletrónica ambiente
- Alarme progressivo

## 🛠 Tecnologias

- **HTML5 Canvas**
- **JavaScript** orientado a objetos
- **CSS3**
- **Framework `extend.js` (da UC)**
- **WebStorm** / VS Code

## 📦 Requisitos

- Navegador moderno (Chrome, Firefox, Edge)
- Funciona **offline**

---

Desenvolvido por:

- André Ferreira – 220001208  
- David Berec – 220000909  
- Diogo Pedro – 220000891
