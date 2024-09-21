const socket = io("http://localhost:3000");

// Função para renderizar mensagens na tela
function renderMessage(message) {
  const messagesDiv = document.querySelector(".messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `<strong>${message.author}</strong>: ${message.message}`;
  messagesDiv.appendChild(messageElement);
}

// Função para salvar as mensagens no localStorage
function saveMessagesToLocalStorage(messages) {
  localStorage.setItem("chatMessages", JSON.stringify(messages));
}

// Função para carregar as mensagens do localStorage e renderizá-las na tela
function loadMessagesFromLocalStorage() {
  const storedMessages = localStorage.getItem("chatMessages");
  return storedMessages ? JSON.parse(storedMessages) : [];
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
  }
});

// Ouvir a mensagem recebida do servidor e exibi-la
socket.on("message", (message) => {
  // Adiciona a mensagem recebida à lista de mensagens
  messages.push(message);

  // Salva as mensagens no localStorage
  saveMessagesToLocalStorage(messages);

  // Renderiza a mensagem recebida
  renderMessage(message);
});

// Registrar o Service Worker para transformar em PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js") // Certifique-se de que este caminho esteja correto
      .then(function (registration) {
        console.log("Service Worker registrado com sucesso:", registration);
      })
      .catch(function (error) {
        console.log("Falha ao registrar o Service Worker:", error);
      });
  });
}
