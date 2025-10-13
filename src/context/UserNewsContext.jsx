import { collection, documentId, getDoc, getDocs, limit, orderBy, query, startAfter, where, doc, getCountFromServer} from "firebase/firestore";
import { createContext, useContext } from "react";
import { db } from "../FirebaseConfig";

const UserNewsContext = createContext();
export function useUserNews() { return useContext(UserNewsContext); }

const TAPAS_ID = 'noticiasTapaPorCategoria'

export function UserNewsProvider ({ children }) {


  // ------------ NOTICIAS ------------ 
  const getUserNewsPagination = async ({ page = 0, pageSize = 20, category = "all" }) => {
    try{
      const noticiasRef = collection(db, "noticias");

      // Si hay categoria, filtramos por categoria
      let baseQuery = noticiasRef;
      if (category && category !== "all" && category !== "Principales") {
        baseQuery = query(noticiasRef, where("categoria", "==", category));
      }

      // Obtener cantidad total acorde al filtro (para calcular páginas)
      const countSnapshot = await getCountFromServer(baseQuery);
      const totalNews = countSnapshot.data().count || 0;
      const paginasTotales = Math.max(1, Math.ceil(totalNews / pageSize));

      // Query final con orden y límite
      let q = query(baseQuery, orderBy("fechaDeSubida", "desc"), limit(pageSize));

      // Si page > 0 necesitamos startAfter; para eso traemos el último doc de la página anterior
      if (page > 0) {
        // traemos page * pageSize docs con el mismo filtro y orden, para obtener el último
        const prevPageQuery = query(baseQuery, orderBy("fechaDeSubida", "desc"), limit(page * pageSize));
        const prevPageLastDocSnap = await getDocs(prevPageQuery);
        const lastDoc = prevPageLastDocSnap.docs[prevPageLastDocSnap.docs.length - 1];
        if (lastDoc) {
          q = query(baseQuery, orderBy("fechaDeSubida", "desc"), startAfter(lastDoc), limit(pageSize));
        } else {
          return [[], paginasTotales];
        }
      }

      const snap = await getDocs(q);
      const news = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return [news, paginasTotales];
    }catch(err){
      throw new Error(err)
    }


  }

  const getCoverNewsByCategory = async ({ category = 'principales' }) => {
    try {
      // Paso 1: traer los IDs guardados en noticiasTapaPorCategoria
      let categoriaLowered = category.toLowerCase()
      let IDs = await getNoticiasEnTapaID(categoriaLowered); // ej: ["id1", "id2", "id3"]

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
      throw error;
    }
  };

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

  const getNewByID = async (id) => {
    try {
      const docRef = doc(db, "noticias", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Noticia no encontrada")
      }
    } catch (error) {
      throw error;
    }
  }

  // ------------ CATEGORIAS ------------

  const getCategories = async () => {
    try{

      const editableDocRef = doc(db, "editable", "categorias");
      const editableSnap = await getDoc(editableDocRef);
      
      if (editableSnap.exists()) {
        const data = editableSnap.data();
        const cats = data?.categorias ?? data?.categories ?? [];
        
        // Asegurarnos que devuelve siempre un array
        return Array.isArray(cats) ? cats : [];
      }
    }catch(err){
      throw new Error(err)
    }
      
  }

  // ------------ SPONSORS ------------

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

  // ------------ STREAMING ------------
  
  async function getStreamingLinkAndState() {
    try{
      const docRef = doc(db, "redes", "vivo");
      const snap = await getDoc(docRef);

      if (!snap.exists()) return ""; // documento no existe -> vació
      const data = snap.data();
      return [data.url, data.isLive]
    }catch(err){
      throw new Error(err)
    }
  }

  // ------------ TIK TOK  ------------

  async function getClips() {
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


  const value = {
    getUserNewsPagination,
    getCoverNewsByCategory,
    getNoticiasEnTapaID,
    getNewByID,
    getCategories,
    getAuspiciantes,
    getStreamingLinkAndState,
    getClips
  }


  return <UserNewsContext.Provider value={value}>{children}</UserNewsContext.Provider>;

}