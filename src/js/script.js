document.addEventListener('DOMContentLoaded', () => {
    // --- Referências de Elementos do DOM ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const questScreen = document.getElementById('quest-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('startButton');
    const player = document.getElementById('player');
    const gameMap = document.getElementById('game-map');
    const scoreDisplay = document.getElementById('score-display');
    const questDisplay = document.getElementById('quest-display');
    const npcNameElement = document.getElementById('npc-name');
    const dialogueTextElement = document.getElementById('dialogue-text');
    const continueDialogueButton = document.getElementById('continueDialogueButton');
    const dialogueBox = document.getElementById('dialogue-box');
    const questionBox = document.getElementById('question-box');
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackButton = document.getElementById('feedbackButton');
    const finalScoreElement = document.getElementById('final-score');

    // Elementos de áudio
    const bgm = document.getElementById('bgm');
    const sfxCorrect = document.getElementById('sfxCorrect');
    const sfxWrong = document.getElementById('sfxWrong');
    const sfxQuestComplete = document.getElementById('sfxQuestComplete');

    // --- Variáveis do Jogo ---
    let playerX = 50;
    let playerY = 50;
    const playerSpeed = 3;
    let score = 0;
    let currentQuestIndex = 0;
    let keysPressed = {};
    let currentNPC = null;
    let dialogueStep = 0;
    let canMove = true;

    // --- Dados dos NPCs e Quests ---
    const npcsData = [
        {
            id: 0,
            name: "Mago Codexium",
            element: document.getElementById('npc-0'),
            dialogue: [
                "Olá, jovem aventureiro! Bem-vindo ao mundo da programação!",
                "Eu sou o Mago Codexium, guardião do conhecimento.",
                "Para avançar em sua jornada, você precisa responder algumas perguntas.",
                "Vamos começar com algo básico sobre programação web!"
            ],
            question: {
                text: "O HTML é usado para:",
                options: [
                    { text: "A) Criar estilos e layouts", correct: false },
                    { text: "B) Adicionar interatividade", correct: false },
                    { text: "C) Estruturar o conteúdo de uma página web", correct: true },
                    { text: "D) Armazenar dados em um banco de dados", correct: false }
                ],
                correctFeedback: "Correto! 🎉 O HTML é a espinha dorsal de qualquer página web, definindo sua estrutura e conteúdo.",
                wrongFeedback: "Não exatamente. O HTML é usado para estruturar o conteúdo de uma página web, como textos, imagens e links."
            },
            completed: false
        },
        {
            id: 1,
            name: "Madame PixieBell",
            element: document.getElementById('npc-1'),
            dialogue: [
                "Ora, ora! Vejo que o Mago Codexium te ensinou bem...",
                "Vejo que você venceu o primeiro desafio. Impressionante!",
                "Eu sou a Madame PixieBell, responsável por deixar tudo lindo e colorido!",
                "O HTML cria o corpo do site, mas eu, com o CSS, dou vida, brilho e personalidade a ele!",
                "Vamos ver se você entende um pouco sobre o estilo das páginas?"
            ],
            question: {
                text: "Pra que serve o CSS?",
                options: [
                    { text: "A) Estruturar um site", correct: false },
                    { text: "B) Estilizar o site com cores, fontes e estilos diferentes", correct: true },
                    { text: "C) Pra escrever textos e parágrafos", correct: false },
                    { text: "D) Pra abrir o site no navegador", correct: false }
                ],
                correctFeedback: "Excelente! 🎨 O CSS é o estilista do site. Ele escolhe as cores, as roupas e o visual da página!",
                wrongFeedback: "Hmm... quase! O CSS é quem define as cores, tamanhos, fontes e o visual do site."
            },
            completed: false
        },
        {
            id: 2,
            name: "Cavaleiro Heather",
            element: document.getElementById('npc-2'),
            dialogue: [
                "Saudações, jovem aprendiz do código! 🪄",
                "Sou o Cavaleiro Heather, aqule que faz o site ganhar vida!",
                "O HTML constrói, o CSS enfeita, e eu... faço tudo se mover e reagir.",
                "Você chegou longe, mas um último desafio o aguarda!",
                "Mostre-me que você entende sobre ele, o JavaScript!"
            ],
            question: {
                text: "O que o JavaScript faz em um site?",
                options: [
                    { text: "A) Cuida das imagens e vídeos do site", correct: false },
                    { text: "B) acelera o carregamento do site", correct: false },
                    { text: "C) Dá vida ao site, deixando ele interativo", correct: true },
                    { text: "D) Muda as cores do texto e do fundo", correct: false }
                ],
                correctFeedback: "Maravilhoso! ⚡ O JavaScript é o cérebro do site — ele faz tudo reagir, se mover e responder!",
                wrongFeedback: "Boa tentativa! Mas o JavaScript é quem faz o site reagir e se mover, como um cérebro cheio de energia!"
            },
            completed: false
        }
    ];

    // --- Funções de Controle de Tela ---
    function showScreen(screen) {
        [startScreen, gameScreen, questScreen, endScreen].forEach(s => {
            s.classList.remove('active');
        });
        screen.classList.add('active');
    }

    function startGame() {
        showScreen(gameScreen);
        canMove = true;
        updateUI();
        gameLoop();
        // bgm.play(); // Descomente se tiver áudio
    }

    // --- Sistema de Movimentação ---
    document.addEventListener('keydown', (e) => {
        if (canMove) {
            keysPressed[e.key] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
    });

    function movePlayer() {
        if (!canMove) return;

        const mapRect = gameMap.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (keysPressed['ArrowUp'] || keysPressed['w'] || keysPressed['W']) {
            playerY = Math.max(0, playerY - playerSpeed);
        }
        if (keysPressed['ArrowDown'] || keysPressed['s'] || keysPressed['S']) {
            playerY = Math.min(mapRect.height - playerRect.height, playerY + playerSpeed);
        }
        if (keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']) {
            playerX = Math.max(0, playerX - playerSpeed);
        }
        if (keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']) {
            playerX = Math.min(mapRect.width - playerRect.width, playerX + playerSpeed);
        }

        player.style.left = playerX + 'px';
        player.style.top = playerY + 'px';

        checkCollisions();
    }

    // --- Sistema de Colisão ---
    function checkCollisions() {
        const playerRect = player.getBoundingClientRect();

        npcsData.forEach(npc => {
            if (!npc.completed && npc.element) {
                const npcRect = npc.element.getBoundingClientRect();

                if (isColliding(playerRect, npcRect)) {
                    startQuest(npc);
                }
            }
        });
    }

    function isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    // --- Sistema de Quest e Diálogo ---
    function startQuest(npc) {
        canMove = false;
        currentNPC = npc;
        dialogueStep = 0;

        showScreen(questScreen);
        dialogueBox.classList.remove('hidden');
        questionBox.classList.add('hidden');
        feedbackBox.classList.add('hidden');

        showDialogue();
    }

    function showDialogue() {
        npcNameElement.textContent = currentNPC.name;
        dialogueTextElement.textContent = currentNPC.dialogue[dialogueStep];
        continueDialogueButton.classList.remove('hidden');
    }

    continueDialogueButton.addEventListener('click', () => {
        dialogueStep++;

        if (dialogueStep < currentNPC.dialogue.length) {
            showDialogue();
        } else {
            showQuestion();
        }
    });

    function showQuestion() {
        dialogueBox.classList.add('hidden');
        questionBox.classList.remove('hidden');

        questionText.textContent = currentNPC.question.text;
        answerOptions.innerHTML = '';

        currentNPC.question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'answer-button';
            button.textContent = option.text;
            button.addEventListener('click', () => checkAnswer(option.correct, index));
            answerOptions.appendChild(button);
        });
    }

    function checkAnswer(isCorrect, selectedIndex) {
        questionBox.classList.add('hidden');
        feedbackBox.classList.remove('hidden');

        if (isCorrect) {
            score += 100;
            feedbackText.textContent = currentNPC.question.correctFeedback;
            feedbackText.style.color = '#76ff03';
            // sfxCorrect.play(); // Descomente se tiver áudio

            currentNPC.completed = true;
            if (currentNPC.element) {
                currentNPC.element.style.opacity = '0';
            }

            currentQuestIndex++;
        } else {
            feedbackText.textContent = currentNPC.question.wrongFeedback;
            feedbackText.style.color = '#ff1744';
            // sfxWrong.play(); // Descomente se tiver áudio
        }

        updateUI();
    }

    feedbackButton.addEventListener('click', () => {
        if (currentQuestIndex >= npcsData.length) {
            endGame();
        } else {
            showScreen(gameScreen);
            canMove = true;
            currentNPC = null;
            gameLoop(); // Reinicia o loop do jogo
        }
    });

    // --- Sistema de Atualização de UI ---
    function updateUI() {
        scoreDisplay.textContent = `Pontos: ${score}`;
        questDisplay.textContent = `Missão: ${currentQuestIndex}/${npcsData.length}`;
    }

    // --- Loop do Jogo ---
    function gameLoop() {
        if (gameScreen.classList.contains('active')) {
            movePlayer();
            requestAnimationFrame(gameLoop);
        }
    }

    // --- Fim do Jogo ---
    function endGame() {
        showScreen(endScreen);

        const message = 'Você mostrou estar preparado para dar o próximo passo!'

        finalScoreElement.textContent = message;
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);

    // --- Criação de Sprites 8-bit ---
    function createPlayerSprite() {
        player.innerHTML = `
            <svg width="40" height="40" viewBox="0 0 16 16">
                <!-- Cabeça -->
                <rect x="6" y="2" width="4" height="4" fill="#ffcc99"/>
                <!-- Cabelo -->
                <rect x="5" y="1" width="6" height="2" fill="#8b4513"/>
                <!-- Olhos -->
                <rect x="6" y="3" width="1" height="1" fill="#000"/>
                <rect x="9" y="3" width="1" height="1" fill="#000"/>
                <!-- Corpo -->
                <rect x="6" y="6" width="4" height="4" fill="#0066ff"/>
                <!-- Braços -->
                <rect x="5" y="7" width="1" height="3" fill="#ffcc99"/>
                <rect x="10" y="7" width="1" height="3" fill="#ffcc99"/>
                <!-- Pernas -->
                <rect x="6" y="10" width="2" height="4" fill="#003399"/>
                <rect x="8" y="10" width="2" height="4" fill="#003399"/>
                <!-- Pés -->
                <rect x="6" y="14" width="2" height="1" fill="#654321"/>
                <rect x="8" y="14" width="2" height="1" fill="#654321"/>
            </svg>
        `;
    }

    function createNPCSprites() {
        // Mago Codexium (Roxo - Mago)
        npcsData[0].element.innerHTML = `
            <svg width="45" height="45" viewBox="0 0 16 16">
                <!-- Chapéu de mago -->
                <rect x="7" y="0" width="2" height="1" fill="#ffd700"/>
                <rect x="6" y="1" width="4" height="1" fill="#8b008b"/>
                <rect x="5" y="2" width="6" height="1" fill="#8b008b"/>
                <!-- Cabeça -->
                <rect x="6" y="3" width="4" height="3" fill="#ffcc99"/>
                <!-- Barba -->
                <rect x="6" y="5" width="4" height="2" fill="#d3d3d3"/>
                <!-- Olhos -->
                <rect x="7" y="4" width="1" height="1" fill="#000"/>
                <rect x="8" y="4" width="1" height="1" fill="#000"/>
                <!-- Corpo (manto) -->
                <rect x="5" y="7" width="6" height="5" fill="#9932cc"/>
                <!-- Mangas -->
                <rect x="4" y="8" width="1" height="3" fill="#9932cc"/>
                <rect x="11" y="8" width="1" height="3" fill="#9932cc"/>
                <!-- Mãos -->
                <rect x="4" y="11" width="1" height="1" fill="#ffcc99"/>
                <rect x="11" y="11" width="1" height="1" fill="#ffcc99"/>
                <!-- Livro -->
                <rect x="6" y="9" width="2" height="2" fill="#8b4513"/>
                <!-- Pés -->
                <rect x="6" y="12" width="2" height="2" fill="#4b0082"/>
                <rect x="8" y="12" width="2" height="2" fill="#4b0082"/>
            </svg>
        `;

        // Mestra ByteWise (Dourado - Guerreira)
        npcsData[1].element.innerHTML = `
            <svg width="45" height="45" viewBox="0 0 16 16">
                <!-- Capacete -->
                <rect x="6" y="1" width="4" height="2" fill="#daa520"/>
                <rect x="7" y="0" width="2" height="1" fill="#ffd700"/>
                <!-- Cabeça -->
                <rect x="6" y="3" width="4" height="3" fill="#ffcc99"/>
                <!-- Cabelo -->
                <rect x="5" y="4" width="1" height="3" fill="#ff6347"/>
                <rect x="10" y="4" width="1" height="3" fill="#ff6347"/>
                <!-- Olhos -->
                <rect x="7" y="4" width="1" height="1" fill="#000"/>
                <rect x="8" y="4" width="1" height="1" fill="#000"/>
                <!-- Armadura -->
                <rect x="6" y="6" width="4" height="4" fill="#ffd700"/>
                <rect x="7" y="7" width="2" height="2" fill="#ff6347"/>
                <!-- Braços -->
                <rect x="5" y="7" width="1" height="3" fill="#daa520"/>
                <rect x="10" y="7" width="1" height="3" fill="#daa520"/>
                <!-- Escudo -->
                <rect x="4" y="8" width="1" height="2" fill="#4169e1"/>
                <!-- Espada -->
                <rect x="11" y="6" width="1" height="4" fill="#c0c0c0"/>
                <rect x="11" y="10" width="1" height="1" fill="#8b4513"/>
                <!-- Pernas -->
                <rect x="6" y="10" width="2" height="4" fill="#8b7500"/>
                <rect x="8" y="10" width="2" height="4" fill="#8b7500"/>
            </svg>
        `;

        // Guardião DataShield (Azul - Cavaleiro)
        npcsData[2].element.innerHTML = `
            <svg width="45" height="45" viewBox="0 0 16 16">
                <!-- Elmo -->
                <rect x="6" y="1" width="4" height="1" fill="#4682b4"/>
                <rect x="5" y="2" width="6" height="2" fill="#4682b4"/>
                <rect x="7" y="0" width="2" height="1" fill="#87ceeb"/>
                <!-- Viseira -->
                <rect x="7" y="3" width="2" height="1" fill="#000"/>
                <!-- Cabeça/pescoço -->
                <rect x="6" y="4" width="4" height="2" fill="#4682b4"/>
                <!-- Armadura do corpo -->
                <rect x="5" y="6" width="6" height="5" fill="#5f9ea0"/>
                <!-- Detalhes da armadura -->
                <rect x="7" y="7" width="2" height="3" fill="#4682b4"/>
                <!-- Ombros -->
                <rect x="4" y="6" width="1" height="2" fill="#708090"/>
                <rect x="11" y="6" width="1" height="2" fill="#708090"/>
                <!-- Braços -->
                <rect x="4" y="8" width="1" height="3" fill="#4682b4"/>
                <rect x="11" y="8" width="1" height="3" fill="#4682b4"/>
                <!-- Escudo grande -->
                <rect x="2" y="7" width="2" height="4" fill="#1e90ff"/>
                <rect x="3" y="8" width="1" height="2" fill="#ffd700"/>
                <!-- Pernas -->
                <rect x="6" y="11" width="2" height="3" fill="#2a5276"/>
                <rect x="8" y="11" width="2" height="3" fill="#2a5276"/>
            </svg>
        `;
    }

    // Aplicar sprites ao iniciar
    createPlayerSprite();
    createNPCSprites();

    // Inicialização
    showScreen(startScreen);
});