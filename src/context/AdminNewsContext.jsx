import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
  getDocs
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../FirebaseConfig.js"; // asumimos que ya tenés firebase.js

const AdminNewsContext = createContext();

export function useAdminNews() {
  return useContext(AdminNewsContext);
}

export function AdminNewsProvider({ children }) {
  const [news, setNews] = useState([]); // todas las noticias (incluye published: false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Traemos todas las noticias en tiempo real ordenadas por createdAt desc
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "noticias"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNews(arr);
        setLoading(false);
      },
      (err) => {
        console.error("admin news onSnapshot err", err);
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);


// --------------------VERIFICAR CRUD------------------------------

  // Crear noticia (draft por defecto)
  async function createNews(payload = {}) {
    try {
      setError(null);
      const data = {
        titulo: payload.titulo || "Nueva noticia",
        slug: payload.slug || null,
        copete: payload.copete || "",
        body: payload.body || "",
        author: payload.author || null,
        imageUrl: payload.imageUrl || null,
        tags: payload.tags || [],
        isFeatured: payload.isFeatured || false,
        estado: payload.estado || false,
        publishedAt: payload.published ? serverTimestamp() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...payload,
      };
      const ref = await addDoc(collection(db, "news"), data);
      return ref.id;
    } catch (e) {
      console.error("createNews error", e);
      setError(e);
      throw e;
    }
  }

  // Actualizar noticia
  async function updateNews(id, updates = {}) {
    try {
      setError(null);
      const refDoc = doc(db, "news", id);
      const payload = {
        ...updates,
        updatedAt: serverTimestamp(),
      };
      // Si se publica ahora y no tenía publishedAt -> setear publishedAt
      if (updates.published === true && updates.publishedAt === undefined) {
        payload.publishedAt = serverTimestamp();
      }
      await updateDoc(refDoc, payload);
    } catch (e) {
      console.error("updateNews error", e);
      setError(e);
      throw e;
    }
  }

  // Borrar noticia
  async function deleteNews(id) {
    try {
      setError(null);
      await deleteDoc(doc(db, "news", id));
    } catch (e) {
      console.error("deleteNews error", e);
      setError(e);
      throw e;
    }
  }

  // Toggle publish
  async function togglePublish(id, currentPublished) {
    try {
      setError(null);
      const refDoc = doc(db, "noticias", id);
      const updates = {
        published: !currentPublished,
        updatedAt: serverTimestamp(),
      };
      if (!currentPublished) updates.activo = serverTimestamp();
      await updateDoc(refDoc, updates);
    } catch (e) {
      console.error("togglePublish error", e);
      setError(e);
      throw e;
    }
  }

  // Subir imagen a Storage (devuelve URL)
  // file: File object (input[type=file].files[0])
  async function uploadImage(file, path = "news_images") {
    if (!file) throw new Error("No file provided");
    try {
      setError(null);
      const filename = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${path}/${filename}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (e) {
      console.error("uploadImage error", e);
      setError(e);
      throw e;
    }
  }

  // Opcional: fetch por slug (no realtime) — puede usarse en preview
  async function fetchBySlug(slug) {
    try {
      const q = query(collection(db, "noticias"), where("slug", "==", slug));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    } catch (e) {
      console.error("fetchBySlug error", e);
      setError(e);
      throw e;
    }
  }

  const value = {
    news,
    loading,
    error,
    createNews,
    updateNews,
    deleteNews,
    togglePublish,
    uploadImage,
    fetchBySlug,
  };

  return (
    <AdminNewsContext.Provider value={value}>
      {children}
    </AdminNewsContext.Provider>
  );
}
