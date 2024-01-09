import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, setDoc, getDocs, onSnapshot, orderBy, query, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJXW2pepjmGv3w_Sl8ZMfIan_P6cI8Nps",
    authDomain: "chat-app-c2a33.firebaseapp.com",
    projectId: "chat-app-c2a33",
    storageBucket: "chat-app-c2a33.appspot.com",
    messagingSenderId: "988985148789",
    appId: "1:988985148789:web:5baca0b6332205076c7f3c"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

let groupChatID = ''
  async function fetchData() {
    const collectionList = document.getElementById('collectionList');
  
    try {
      const dbRef = query(collection(db, "groups"), orderBy("group_name", "asc"));
  
      collectionList.innerHTML = '';
  
      onSnapshot(dbRef, (docSnap) => {
        collectionList.innerHTML = '';
  
        docSnap.forEach(doc => {
          const li = document.createElement('li');
          const link = document.createElement('a');
  
          link.textContent = doc.data().group_name;
          link.addEventListener('click', (event) => {
            groupChatID = doc.id
            getChatByID(doc.id)
          }); 
          li.appendChild(link);
          collectionList.appendChild(li);
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  
  fetchData();

  const username = prompt("Please Tell Us Your Name");

  const createGroupForm = document.getElementById("create-group");
  createGroupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const messageInput = document.getElementById("message-input");
    const group_name = messageInput.value;
  
    const groupsCollectionRef = collection(db, "groups");
  
    try {
      const newGroupDocRef = doc(groupsCollectionRef);
  
      await setDoc(newGroupDocRef, { group_name });
  
      alert("Group added successfully!");
      messageInput.value = "";
    } catch (error) {
      console.error("Error adding group:", error.message);
      alert("Error adding group. Please try again.");
    }
  });

  const getChatByID = async (groupId) => {
    const collectionList = document.getElementById('messages');
    collectionList.innerHTML = '';
  
    try {
      const groupDocRef = doc(db, "groups", groupId); 
      const groupSnapshot = await getDoc(groupDocRef);
      
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.data();
        const messagesCollectionRef = query(collection(groupDocRef, "messages"), orderBy("timestamp", "asc"));
        
        const unsubscribe = onSnapshot(messagesCollectionRef, (querySnapshot) => {
          collectionList.innerHTML = '';
  
          querySnapshot.forEach((doc) => {

            const message = `<li class=${
              username === doc.data().username ? "sent" : "receive"
            }><span>${doc.data().username}: </span>${doc.data().message}</li>`;
            document.getElementById("messages").innerHTML += message;
          });
        });
      } else {
        console.log("Group document does not exist");
      }
    } catch (error) {
      console.error("Error fetching document:", error.message);
    }
  };



  const getChatID = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(groupRef);

      
  
      if (groupDoc.exists()) {
        const messagesCollectionRef = collection(groupRef, "messages");
        const messageInput = document.getElementById("message-text");
        const message = messageInput.value;

        document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  
        await addDoc(messagesCollectionRef, {
          username: username,
          message: message,
          timestamp: serverTimestamp(),
        });

        messageInput.value = ""
      } else {
        console.log("Group document does not exist!");
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  


  document.getElementById('message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    getChatID(groupChatID);
  });




  
