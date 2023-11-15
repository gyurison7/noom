const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");

const socket = new WebSocket(`ws://${window.location.host}`);

let myNickname = "";

function makeMessage(type, payload, sender) {
  const msg = { type, payload, sender };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connented to Server ✅");
});

socket.addEventListener("message", (message) => {
  const { payload, sender } = JSON.parse(message.data);
  const li = document.createElement("li");
  li.innerText = `${sender} : ${payload}`;
  if (sender === myNickname) {
    li.style.textAlign = "right";
    li.style.marginLeft = "64%";
    li.style.backgroundColor = "#f9ca24";
  }
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnented from Server ❌");
});

function hadelSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value, myNickname));
  //const li = document.createElement("li");
  //li.innerText = `You : ${input.value}`;
  //messageList.append(li);
  input.value = "";
}

function hadelNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  myNickname = input.value;
  socket.send(makeMessage("nickname", myNickname));
  alert("닉네임이 설정되었습니다!");
  input.value = "";
}

messageForm.addEventListener("submit", hadelSubmit);
nicknameForm.addEventListener("submit", hadelNicknameSubmit);
