// Import the Firebase and Firestore functions and types
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { query, getDocs, collection } from "firebase/firestore";

// NOTE: Credentials should not be part of source code, but since this is a coding challenge project, I will keep them here
const firebaseConfig = {
  apiKey: "AIzaSyDLA4do-tPhK-xnouWh3JsG5nL4pWNwtrg",
  authDomain: "updateobject.firebaseapp.com",
  databaseURL: "https://updateobject-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "updateobject",
  storageBucket: "updateobject.appspot.com",
  messagingSenderId: "735146376779",
  appId: "1:735146376779:web:d16f65794cc84cbdb897ce",
  measurementId: "G-22SHD0NCPT"
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// Create an instance of the Firestore service
const db = getFirestore(firebaseApp);

// Define a function to get a document by its id and collection name
export async function get(id: string, collectionName: string) {
  // Create a document reference
  const docRef = doc(db, collectionName, id);

  // Get the document snapshot
  const docSnap = await getDoc(docRef);

  // Return the document data or null if it doesn't exist
  return docSnap.exists() ? docSnap.data() : null;
}

// Define a function to load all documents from a given collection name
export async function loadAll(collectionName: string) {
  // Create a query for the collection
  const q = query(collection(db, collectionName));

  // Get the query snapshot
  const querySnapshot = await getDocs(q);

  // Create an array to store the documents data
  const docsData: any[] = [];

  // Loop through the documents in the query snapshot
  querySnapshot.forEach((doc) => {
    // Get the document data and id
    const docData = doc.data();
    const docId = doc.id;

    // Add the document data and id to the array
    docsData.push({ ...docData, id: docId });
  });

  // Return the array of documents data
  return docsData;
}

// Define a function to save a document with a given id, data and collection name
export async function save(id: string, data: any, collectionName: string) {
  // Create a document reference
  const docRef = doc(db, collectionName, id);

  // Set the document data with the merge option to avoid overwriting existing fields
  await setDoc(docRef, data, { merge: true });

  // Return the document id
  return id;
}

// Define a function to update a document with a given id, data and collection name
export async function update(id: string, data: any, collectionName: string) {
  // Create a document reference
  const docRef = doc(db, collectionName, id);

  // Update the document data with the given fields and values
  await updateDoc(docRef, data);

  // Return the document id
  return id;
}

// Define a function to delete a document by its id and collection name
export async function deleteObject(id: string, collectionName: string) {
  // Create a document reference
  const docRef = doc(db, collectionName, id);

  // Delete the document
  await deleteDoc(docRef);

  // Return the document id
  return id;
}

