const socket = io();

const nickname = document.getElementById("nickname");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");
const chat = document.getElementById("chat");

let roomName;
let nickName;

room.hidden = true;
chat.hidden = true;

const nameForm = nickname.querySelector("#name");
nameForm.addEventListener("submit", handelNicknameSubmit);

function addMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function showRoom() {
  nickname.hidden = true;
  room.hidden = false;
}

function showChatRoom() {
  room.hidden = true;
  chat.hidden = false;
  chat.style.display = "flex";
  const h3 = chat.querySelector("h3");
  h3.innerText = `채팅방 ${roomName}`;
  const msgForm = chat.querySelector("#msg");
  msgForm.addEventListener("submit", handelMessageSubmit);
}

function handelNicknameSubmit(event) {
  event.preventDefault();
  const input = nickname.querySelector("#name input");
  socket.emit("nickname", input.value, showRoom);
  nickName = input.value;
  input.value = "";
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("enter_room", input.value, showChatRoom);
  roomName = input.value;
  input.value = "";
}

function handelMessageSubmit(event) {
  event.preventDefault();
  const input = chat.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${nickName}: ${value}`;
    ul.appendChild(li);
    li.style.textAlign = "right";
    li.style.marginLeft = "74%";
    li.style.backgroundColor = "#fd9644";
  });
  input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, count) => {
  const h3 = chat.querySelector("h3");
  h3.innerText = `채팅방 ${roomName} (${count})`;
  addMessage(`${user}님이 들어왔어요👋`);
});

socket.on("bye", (user, count) => {
  const h3 = chat.querySelector("h3");
  h3.innerText = `채팅방 ${roomName} (${count})`;
  addMessage(`${user}님이 나갔습니다😭`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = room.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
