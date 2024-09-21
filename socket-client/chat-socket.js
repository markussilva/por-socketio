const socket = io("http://localhost:3000");

// Função para renderizar mensagens na tela
function renderMessage(message) {
  const messagesDiv = document.querySelector(".messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<strong>${message.author}</strong>: ${message.message}`;
  messagesDiv.appendChild(messageElement);
}

// Função para renderizar a lista de usuários
function renderUserList(users) {
  const usersDiv = document.querySelector(".users"); // Certifique-se de ter um elemento com essa classe no HTML
  usersDiv.innerHTML = ""; // Limpa a lista atual

  users.forEach((user) => {
    const userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.textContent = user.username; // Ou use outro campo se você tiver um nome personalizado
    usersDiv.appendChild(userElement);
  });
}

// Função para carregar mensagens do localStorage
function loadMessagesFromLocalStorage() {
  const storedMessages = localStorage.getItem("chatMessages");
  return storedMessages ? JSON.parse(storedMessages) : [];
}

// Função para salvar mensagens no localStorage
function saveMessagesToLocalStorage(messages) {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Carregar mensagens salvas ao carregar a página
const messages = loadMessagesFromLocalStorage();
messages.forEach(renderMessage); // Renderiza todas as mensagens salvas

// Escutar o evento de envio de mensagem no formulário
document.querySelector("#chat").addEventListener("submit", function (event) {
  event.preventDefault();

  const author = document.querySelector("#username").value;
  const messageInput = document.querySelector("#message");
  const message = messageInput.value;

  if (author.length && message.length) {
    const messageObject = {
      author: author,
      message: message,
    };

    // Envia a mensagem para o servidor
    socket.emit("sendmessage", messageObject);

    // Limpa o campo de mensagem após o envio
    messageInput.value = "";

    // Renderiza a mensagem localmente também
    // renderMessage(messageObject);

    // Salva as mensagens no localStorage
    messages.push(messageObject);
    saveMessagesToLocalStorage(messages);
  }
});

// Ouvir a mensagem recebida do servidor e exibi-la
socket.on("message", (message) => {
  renderMessage(message);
});

// Ouvir a lista de usuários recebida do servidor e exibi-la
socket.on("userList", (users) => {
  renderUserList(users);
});

// Registrar o Service Worker para transformar em PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch(function (error) {
        console.log("Falha ao registrar o Service Worker:", error);
      });
  });
}
