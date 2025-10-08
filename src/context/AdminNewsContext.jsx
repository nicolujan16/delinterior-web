// AdminNewsContextEditableDocs.jsx
import React, { createContext, useContext, useState } from "react";
import {
  collection,
  query,
  orderBy,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
  where,
  limit,
  startAfter,
  getCountFromServer,
  documentId,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { db, storage } from "../FirebaseConfig.js";

const AdminNewsContext = createContext();
export function useAdminNews() { return useContext(AdminNewsContext); }

/**
 Expected structure in 'editable' collection:
 - doc id: "categorias" -> { categorias: ["Locales","Nacionales","Politica"], createdAt, updatedAt }
 - doc id: "auspiciantes" -> { auspiciantes: [{ nombre, url, imageUrl, orden }, ...], createdAt, updatedAt }
 - doc id: "noticiasTapaPorCategoria" -> { topByCategory: { "Locales": ["id1","id2","id3"], ... }, createdAt, updatedAt }
*/
export function AdminNewsProvider({ children }) {
  const [loadingNews, setLoadingNews] = useState(true);
  const [error, setError] = useState(null);

  // IDs previstos (si querés usar otros, cambiá aquí)
  const CATEGORIAS_ID = "categorias";
  const AUSPICIANTES_ID = "auspiciantes";
  const TAPAS_ID = "noticiasTapaPorCategoria";

  // ---------------- CRUD noticias (same as antes) ----------------

  // Obtener noticias por paginación  
  const getNewsPerPage = async ({ page = 0, pageSize = 20, category = "all"}) => {
    setLoadingNews(true);
    setError(null);

    try {
      const noticiasRef = collection(db, "noticias");

      // Construyo la query base (sin order/limit) para poder reutilizarla para count y para paginación
      let baseQuery = noticiasRef;
      if (category && category !== "all" && category !== "Principales") {
        baseQuery = query(noticiasRef, where("categoria", "==", category));
      }

      // Obtener cantidad total acorde al filtro (para calcular páginas)
      const countSnapshot = await getCountFromServer(baseQuery);
      const totalNews = countSnapshot.data().count || 0;
      const paginasTotales = Math.max(1, Math.ceil(totalNews / pageSize));

      // Query final con orden y límite
      let q = query(baseQuery, orderBy("createdAt", "desc"), limit(pageSize));

      // Si page > 0 necesitamos startAfter; para eso traemos el último doc de la página anterior
      if (page > 0) {
        // traemos page * pageSize docs con el mismo filtro y orden, para obtener el último
        const prevPageQuery = query(baseQuery, orderBy("createdAt", "desc"), limit(page * pageSize));
        const prevPageLastDocSnap = await getDocs(prevPageQuery);
        const lastDoc = prevPageLastDocSnap.docs[prevPageLastDocSnap.docs.length - 1];
        if (lastDoc) {
          q = query(baseQuery, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize));
        } else {
          // si no existe lastDoc (p. ej. page demasiado alto), devolvemos vacío
          setLoadingNews(false);
          return [[], paginasTotales];
        }
      }

      const snap = await getDocs(q);
      const news = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setLoadingNews(false);
      return [news, paginasTotales];
    } catch (err) {
      console.error("getNewsPerPage err", err);
      setError(err);
      setLoadingNews(false);
      return [];
      }
  };

  const getCoverNewsByCategory = async ({ category = 'principales' }) => {
    try {
      // Paso 1: traer los IDs guardados en noticiasTapaPorCategoria
      let IDs = await getNoticiasEnTapaID(category); // ej: ["id1", "id2", "id3"]

      if (!IDs || IDs.length === 0) {
        console.warn(`No se encontraron IDs para la categoría ${category}`);
        return [];
      }

      // Paso 2: query con "in" (máx 10 IDs por query)
      const noticiasRef = collection(db, "noticias");
      const q = query(noticiasRef, where(documentId(), "in", IDs));
      const snap = await getDocs(q);

      // Paso 3: mapear los docs
      const noticias = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Paso 4: devolver el array final
      let noticiasOrdenadas = []
      noticiasOrdenadas[0] = noticias.filter(not => not.id == IDs[0])[0]
      noticiasOrdenadas[1] = noticias.filter(not => not.id == IDs[1])[0]
      noticiasOrdenadas[2] = noticias.filter(not => not.id == IDs[2])[0]
      return noticiasOrdenadas ; // array de objetos noticia
    } catch (error) {
      console.error("Error obteniendo las noticias en tapa:", error);
      throw error;
    }
  };

  async function searchNoticia(titulo) { 
  }

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
        categoryIds: payload.categoryIds || [],
        publishedAt: payload.published ? serverTimestamp() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...payload,
      };
      const refDoc = await addDoc(collection(db, "noticias"), data);
      return refDoc.id;
    } catch (e) {
      console.error("createNews error", e);
      setError(e);
      throw e;
    }
  }

  async function updateNews(id, updates = {}) {
    try {
      setError(null);
      const refDoc = doc(db, "noticias", id);
      const payload = { ...updates, updatedAt: serverTimestamp() };
      if (updates.published === true && updates.publishedAt === undefined) payload.publishedAt = serverTimestamp();
      await updateDoc(refDoc, payload);
    } catch (e) {
      console.error("updateNews error", e);
      setError(e);
      throw e;
    }
  }

  async function deleteNews(id) {
    try {
      setError(null);
      const docRef = doc(db, "noticias", id);

      // 1) intentar borrar todos los archivos dentro de images/noticias/:id
      try {
        const folderRef = ref(storage, `images/noticias/${id}`);
        // listAll devuelve todos los items (archivos) dentro del folder
        const listResult = await listAll(folderRef);
        const deletePromises = listResult.items.map(async (itemRef) => {
          try {
            await deleteObject(itemRef);
            console.log("Archivo eliminado:", itemRef.fullPath);
          } catch (err) {
            console.warn("No se pudo borrar archivo:", itemRef.fullPath, err);
            // no throw: seguimos con los demás
          }
        });
        await Promise.all(deletePromises);
      } catch (err) {
        // Si listAll falla (por permisos u otro), lo logueamos pero no evitamos el borrado del doc
        console.warn("No se pudo listar/borrar archivos en Storage para noticia", id, err);
      }

      // 2) borrar doc de Firestore
      await deleteDoc(docRef);

      // 3) limpiar referencias en 'noticiasTapaPorCategoria'
      if (typeof removeNewsIdFromAllTops === "function") {
        await removeNewsIdFromAllTops(id);
      }

      return true;
    } catch (e) {
      console.error("deleteNews error", e);
      setError(e);
      throw e;
    }
  }

  // ---------------- CATEGORIAS (doc: editable/categorias) ----------------
  async function getCategorias() {
    try {
      const docRef = doc(db, "editable", CATEGORIAS_ID);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        return snap.data().categorias
      } else {
        throw new Error("El documento no existe");
      }
    } catch (err) {
      throw new Error("Error al obtener categorías: " + err.message);
    }
  }

  async function contarNoticiasPorCategoria(categoria) {
    const q = query(collection(db, "noticias"), where("categoria", "==", categoria));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async function updateCategorias(newCategories) {
    if (!Array.isArray(newCategories)) {
      const err = new Error("nuevas cateogrias debe ser un array");
      throw err;
    }
    const categoriasRef = doc(db, "editable", "categorias");
    try {
      await updateDoc(categoriasRef, { categorias: newCategories });
      return newCategories;
    } catch (e) {
      setError(e);
      throw e;
    }
  }

  // ---------------- AUSPICIANTES (doc: editable/auspiciantes) ----------------
  async function getAuspiciantes() {
    try{

      let docRef = doc(db, 'editable', 'auspiciantes')
      let docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        return docSnap.data()
      }else{
        throw new Error("Auspiciantes no existe en base de datos")
      }
    }catch(err){
      return err
    }
  }

  // Reemplazar lista completa
  async function updateAuspiciantes(data = {}) {
    try {
      // Validaciones
      if (
        typeof data !== "object" ||
        !Array.isArray(data.main) ||
        !Array.isArray(data.secondary)
      ) {
        const err = new Error("Error 400 cargando auspiciantes - Bad request");
        setError?.(err);
        throw err;
      }
      const docRef = doc(db, "editable", "auspiciantes");
      await setDoc(
        docRef,
        {
          main: data.main,
          secondary: data.secondary,
          updatedAt: serverTimestamp(),
        },
        { merge: false } 
      );
      return data;
    } catch (e) {
      console.error("setAuspiciantes error", e);
      setError?.(e);
      throw e;
    }
  }

  // Para subir imagen de auspiciante
  async function uploadFileAndGetURL(file, folder = 'sponsors') {
    if (!file) throw new Error('No file provided');

    try {
      const fileName = `${Date.now()}-${file.name}`; // nombre único
      const fileRef = ref(storage, `${folder}/${fileName}`);

      // sube el archivo
      await uploadBytes(fileRef, file);

      // obtiene la URL pública
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (err) {
      console.error('Error subiendo archivo a Firebase:', err);
      throw err;
    }
  }

  // ---------------- TOPS (doc: editable/noticiasTapaPorCategoria) ----------------
  const getNoticiasEnTapaID = async (category) => {
    try {
      let tapasRef = doc(db, "editable", TAPAS_ID);
      const snapshot = await getDoc(tapasRef);
      if (snapshot.exists()) {
        const data = snapshot.data()
        return data[category]; 
      } else {
        console.warn("El documento no existe");
        return null;
      }
    } catch (error) {
      console.error("Error obteniendo tapas por categoría:", error);
      throw error;
    }
  };

  // Reemplaza el array de ids para una categoria
  const setTapaPorCategoria = async (categoria, nuevasNoticias) => {
    try {
      let tapasRef = doc(db, "editable", TAPAS_ID);
      await updateDoc(tapasRef, {
        [categoria]: nuevasNoticias, 
      });
      return true
    } catch (error) {
      throw error;
    }
  };

  // Quitar un newsId de todas las listas top
  async function removeNewsIdFromAllTops(newsId) {
    if (!newsId) return;
    try {
      return true;
    } catch (e) {
      console.error("removeNewsIdFromAllTops error", e);
      setError(e);
      throw e;
    }
  }

  // ---------------- upload image ----------------
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

  // ---------------- fetch util ----------------
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

  // ---------------- REDES ----------------

  async function getTikToksLinks() {
    try{
      const docRef = doc(db, "redes", "recortes");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.tiktoks || [];
      } else {
        throw new Error("Colección de Tik Toks no existe")
      }
    }catch(err){
      throw new Error("Error obteniendo Tik Toks")
    }
  } 

  async function addTikTok(link) {
    try {
      const docRef = doc(db, "redes", "recortes");

      await updateDoc(docRef, {
        tiktoks: arrayUnion(link)
      });

      return true
    } catch (err) {
      throw new Error("Error agregando TikTok");
    }
  }

  async function deleteTikTok(link) {
    try {
      const docRef = doc(db, "redes", "recortes");

      await updateDoc(docRef, {
        tiktoks: arrayRemove(link)
      });

      return
    } catch (err) {
      throw new Error(err);
    }
  }



  // ---------------- value ----------------
  const value = {
    // noticias
    getNewsPerPage,
    getCoverNewsByCategory,
    createNews,
    updateNews,
    deleteNews,
    fetchBySlug,

    // categorias helpers
    getCategorias,
    contarNoticiasPorCategoria,
    updateCategorias,

    // auspiciantes
    getAuspiciantes,
    updateAuspiciantes,
    uploadFileAndGetURL,

    // redes
    getTikToksLinks,
    addTikTok,
    deleteTikTok,

    // tops
    getNoticiasEnTapa: getNoticiasEnTapaID,
    setTapaPorCategoria,
    removeNewsIdFromAllTops,

    // util
    uploadImage,
  };

  return <AdminNewsContext.Provider value={value}>{children}</AdminNewsContext.Provider>;
}
