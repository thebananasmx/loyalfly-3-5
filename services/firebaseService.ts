import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import type { Customer } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAnW9n-Ou53G1RmD0amMXJfQ_OadfefVug",
  authDomain: "loyalflyapp-3-5.firebaseapp.com",
  projectId: "loyalflyapp-3-5",
  storageBucket: "loyalflyapp-3-5.appspot.com",
  messagingSenderId: "110326324187",
  appId: "1:110326324187:web:6516c54fab30370bf825fe",
  measurementId: "G-Z4DE1F8NTK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- HELPERS ---

const slugify = (str: string) => {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to   = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};


// --- AUTH FUNCTIONS ---

export const registerBusiness = async (email: string, password: string, businessName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Generate a unique slug
  let slug = slugify(businessName);
  let slugDoc = await getDoc(doc(db, "slugs", slug));
  let counter = 1;
  while(slugDoc.exists()) {
    slug = `${slugify(businessName)}-${counter}`;
    slugDoc = await getDoc(doc(db, "slugs", slug));
    counter++;
  }

  await setDoc(doc(db, "slugs", slug), { businessId: user.uid });
  
  // Create the main business document
  await setDoc(doc(db, "businesses", user.uid), {
    name: businessName,
    email: user.email,
    slug: slug,
    createdAt: serverTimestamp(),
  });

  // Create the card configuration in a subcollection
  const cardConfigRef = doc(db, "businesses", user.uid, "config", "card");
  await setDoc(cardConfigRef, {
    name: businessName,
    reward: 'Tu Recompensa',
    color: '#FEF3C7',
    textColorScheme: 'dark',
    logoUrl: ''
  });
  
  return { uid: user.uid, email: user.email };
};

export const loginWithEmail = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
  };
};

export const logout = async () => {
  await signOut(auth);
};

export const onAuthUserChanged = (callback: (user: any) => void) => onAuthStateChanged(auth, callback);

export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};


// --- FIRESTORE FUNCTIONS ---

export const getBusinessData = async (businessId: string) => {
    const businessDocRef = doc(db, "businesses", businessId);
    const cardConfigRef = doc(db, "businesses", businessId, "config", "card");

    const [businessSnap, cardConfigSnap] = await Promise.all([
        getDoc(businessDocRef),
        getDoc(cardConfigRef)
    ]);

    if (businessSnap.exists()) {
        const businessData = businessSnap.data();
        const cardSettings = cardConfigSnap.exists() ? cardConfigSnap.data() : null;
        
        // Merge the data to maintain the same return structure for the frontend
        return {
            ...businessData,
            cardSettings: cardSettings
        };
    } else {
        console.log("No such business document!");
        return null;
    }
}

export const getBusinessIdBySlug = async (slug: string): Promise<string | null> => {
    const slugDocRef = doc(db, "slugs", slug);
    const slugDocSnap = await getDoc(slugDocRef);
    if (slugDocSnap.exists()) {
        return slugDocSnap.data().businessId;
    }
    return null;
}

export const getPublicCardSettings = async (businessId: string) => {
    const cardConfigRef = doc(db, "businesses", businessId, "config", "card");
    const cardConfigSnap = await getDoc(cardConfigRef);

    if (cardConfigSnap.exists()) {
        return cardConfigSnap.data();
    } else {
        console.log("No such card configuration!");
        return null;
    }
}

export const getCustomers = async (businessId: string): Promise<Customer[]> => {
    const customersCol = collection(db, `businesses/${businessId}/customers`);
    const customerSnapshot = await getDocs(customersCol);
    return customerSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        enrollmentDate: (doc.data().enrollmentDate as Timestamp)?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
    } as Customer));
};

export const updateCardSettings = async (businessId: string, settings: { name: string; reward: string; color: string; textColorScheme: string; logoUrl?: string; }) => {
    const cardConfigRef = doc(db, "businesses", businessId, "config", "card");
    // Use setDoc with merge: true to create the document if it doesn't exist,
    // or update it if it does. This is more robust than updateDoc.
    await setDoc(cardConfigRef, settings, { merge: true });
    return { success: true, settings };
};

export const getCustomerByPhone = async (businessId: string, phone: string): Promise<Customer | null> => {
    const customersCol = collection(db, `businesses/${businessId}/customers`);
    const q = query(customersCol, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    } else {
        const docSnap = querySnapshot.docs[0];
        return { 
            id: docSnap.id, 
            ...docSnap.data(),
            enrollmentDate: (docSnap.data().enrollmentDate as Timestamp)?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        } as Customer;
    }
};

export const addStampToCustomer = async (businessId: string, customerId: string, quantity: number = 1): Promise<Customer> => {
    const customerDocRef = doc(db, `businesses/${businessId}/customers`, customerId);
    const customerSnap = await getDoc(customerDocRef);
    if (customerSnap.exists()) {
        const currentStamps = customerSnap.data().stamps || 0;
        await updateDoc(customerDocRef, {
            stamps: currentStamps + quantity
        });
        const updatedSnap = await getDoc(customerDocRef);
        return { 
            id: updatedSnap.id, 
            ...updatedSnap.data(),
            enrollmentDate: (updatedSnap.data().enrollmentDate as Timestamp)?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        } as Customer;
    } else {
        throw new Error("Customer not found");
    }
};

export const createNewCustomer = async (businessId: string, data: { name: string, phone: string, email: string }): Promise<Customer> => {
    const customersCol = collection(db, `businesses/${businessId}/customers`);
    const newCustomerData = {
        ...data,
        enrollmentDate: serverTimestamp(),
        stamps: 0,
        rewardsRedeemed: 0,
    };
    const docRef = await addDoc(customersCol, newCustomerData);
    return {
        id: docRef.id,
        ...data,
        enrollmentDate: new Date().toISOString().split('T')[0],
        stamps: 0,
        rewardsRedeemed: 0,
    };
};

export const getCustomerById = async (businessId: string, customerId: string): Promise<Customer | null> => {
    const customerDocRef = doc(db, `businesses/${businessId}/customers`, customerId);
    const docSnap = await getDoc(customerDocRef);
    if (docSnap.exists()) {
        return { 
            id: docSnap.id, 
            ...docSnap.data(),
            enrollmentDate: (docSnap.data().enrollmentDate as Timestamp)?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        } as Customer;
    }
    return null;
};

export const updateCustomer = async (businessId: string, customerId: string, data: { name: string, phone: string, email: string }): Promise<void> => {
    const customerDocRef = doc(db, `businesses/${businessId}/customers`, customerId);
    await updateDoc(customerDocRef, data as any);
};

export const deleteCustomer = async (businessId: string, customerId: string): Promise<void> => {
    const customerDocRef = doc(db, `businesses/${businessId}/customers`, customerId);
    await deleteDoc(customerDocRef);
};