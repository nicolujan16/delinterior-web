import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { categories } from '@/data/news';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useAuth } from '@/context/AuthProvider';
import { storage, db } from '@/FirebaseConfig';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import Swal from 'sweetalert2';

// Small toolbar kept visually, controls Quill via ref
const MiniWysiwyg = ({ onAction }) => {
  const actions = [
    { icon: Bold, action: 'bold' },
    { icon: Italic, action: 'italic' },
    { icon: List, action: 'list' },
    { icon: LinkIcon, action: 'link' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-t-md border border-b-0 p-2 bg-gray-50">
      {actions.map(({ icon: Icon, action }) => (
        <Button
          key={action}
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onAction(action)}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

// Helpers
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadTimeFromHtml(html) {
  // convierte HTML a texto simple y calcula minutos (200 wpm)
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  const text = tmp.textContent || tmp.innerText || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 200;
  return Math.max(1, Math.round(words / wpm));
}

const AdminNewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  // form state
  const [title, setTitle] = useState(isEditing ? '' : '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [copete, setCopete] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(categories.find(c => c.id !== 'todas')?.id || '');
  const [active, setActive] = useState(true);

  // image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // loading / progress
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // quill ref
  const quillRef = useRef(null);

  // Load existing article if editing
  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'noticias', id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          Swal.fire({
            icon: 'error',
            title: 'Noticia no encontrada',
            text: 'La Noticia no existe o no pudo ser encontrada'
          }).then(() => {
            navigate('/admin/noticias');
          })
          return;
        }
        const data = snap.data();
        if (cancelled) return;
        setTitle(data.titulo || '');
        setCopete(data.copete || data.summary || '');
        setBody(data.body || '');
        setCategory(data.categoria || categories.find(c => c.id !== 'todas')?.id || '');
        setActive(data.estado ? data.estado === 'activo' : (data.active ?? true));
        if (data.publishedAt && data.publishedAt.toDate) {
          setDate(data.publishedAt.toDate().toISOString().slice(0, 10));
        } else if (data.publishedAt && data.publishedAt.seconds) {
          setDate(new Date(data.publishedAt.seconds * 1000).toISOString().slice(0, 10));
        }
        if (data.imgURL) setImagePreview(data.imgURL);
      } catch (err) {
        console.error('Error cargando noticia:', err);
        toast({ title: 'Error', description: 'No se pudo cargar la noticia.' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEditing, id, navigate, toast]);

  // handle toolbar actions
  const handleWysiwygAction = useCallback((action) => {
    const editor = quillRef.current && quillRef.current.getEditor && quillRef.current.getEditor();
    if (!editor) {
      toast({
        title: `Editor WYSIWYG`,
        description: `Editor no inicializado.`,
      });
      return;
    }

    const range = editor.getSelection(true);

    switch (action) {
      case 'bold':
        editor.format('bold', !editor.getFormat(range).bold);
        break;
      case 'italic':
        editor.format('italic', !editor.getFormat(range).italic);
        break;
      case 'list':
        if (editor.getFormat(range).list) {
          editor.format('list', false);
        } else {
          editor.format('list', 'ordered');
        }
        break;
      case 'link': {
        const url = window.prompt('Ingresá la URL (ej. https://example.com):', 'https://');
        if (url) {
          if (range && range.length > 0) {
            editor.format('link', url);
          } else {
            editor.insertText(range.index, url, 'link', url);
            editor.setSelection(range.index + url.length, 0);
          }
        }
        break;
      }
      case 'image': {
        const url = window.prompt('Ingresá la URL de la imagen:', '');
        if (url) {
          editor.insertEmbed(range.index, 'image', url);
          editor.setSelection(range.index + 1);
        }
        break;
      }
      default:
        toast({ title: 'Editor', description: `Acción "${action}" no implementada.` });
    }
  }, [toast]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      toast({ title: 'Imagen previsualizada.' });
    }
  };

  // Sube la imagen al Storage en la carpeta del docId y devuelve { downloadURL, path }
  const uploadImageToStorage = async (file, docId) => {
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const path = `images/noticias/${docId}/${filename}`;
    const ref = storageRef(storage, path);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(ref, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ downloadURL, path });
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({ title: 'Título requerido', description: 'Agregá un título.' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // create docRef (auto id) or use existing id for edit
      const articlesCol = collection(db, 'noticias');
      const docRef = isEditing ? doc(db, 'noticias', id) : doc(articlesCol);
      const docId = docRef.id;

      // si hay imagen, subirla a images/noticias/{docId}/
      let imgURL = null;
      let imagePath = null;
      if (imageFile) {
        const { downloadURL, path } = await uploadImageToStorage(imageFile, docId);
        imgURL = downloadURL;
        imagePath = path;
      }

      // arma payload
      const payload = {
        titulo: title.trim(),
        copete: copete.trim() || '',
        body: body || '',
        categoria: category || '',
        estado: active ? 'activo' : 'inactivo',
        slug: slugify(title || '') || docId,
        readTime: estimateReadTimeFromHtml(body),
        updatedAt: serverTimestamp(),
        fechaDeSubida: new Date().toISOString().split('T')[0], // "2025-08-08"
      };

      // solo al crear
      if (!isEditing) {
        payload.createdAt = serverTimestamp();
        payload.views = 0;
        payload.publishedAt = active ? serverTimestamp() : null;
        payload.author = {
          id: user?.uid || null,
          name: user?.displayName || user?.email || 'admin',
        };
      } else {
        // al editar, si se activa ahora y no existía publishedAt, setear publishedAt
        if (active) {
          payload.publishedAt = serverTimestamp();
        }
      }

      if (imgURL) {
        payload.imgURL = imgURL;
        payload.imagePath = imagePath;
      }

      // crear o actualizar doc en Firestore
      await setDoc(docRef, payload, { merge: true });

      toast({
        title: 'Noticia guardada con éxito',
        description: isEditing ? 'La noticia se actualizó correctamente.' : 'La noticia se creó correctamente.',
        className: 'bg-green-100 text-green-800 border-green-200',
      });

      navigate('/admin/noticias');
    } catch (err) {
      console.error('Error guardando noticia:', err);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la noticia. Revisá la consola.',
        className: 'bg-red-100 text-red-800 border-red-200',
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/admin/noticias')} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Volver a Noticias
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Noticia' : 'Crear Nueva Noticia'}</CardTitle>
          <CardDescription>Completa los campos para {isEditing ? 'actualizar' : 'crear'} una noticia.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha de Publicación</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="copete">Copete (bajada breve)</Label>
              <textarea
                className="
                  w-full min-h-[80px] resize-none overflow-hidden p-2 border rounded-md auto-resize
                  flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
                placeholder="Escribe tu copete..."
                value={copete}
                onChange={(e) => {setCopete(e.target.value)}}
              ></textarea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Cuerpo</Label>

              <MiniWysiwyg onAction={handleWysiwygAction} />

              <div className="rounded-b-md border">
                <ReactQuill
                  ref={quillRef}
                  value={body}
                  onChange={setBody}
                  theme="snow"
                  modules={{ toolbar: false }}
                  placeholder="Escribe el cuerpo de la noticia aquí..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-md border px-3 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.filter(c => c.id !== 'todas').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={active}
                  onCheckedChange={(val) => setActive(Boolean(val))}
                />
                <Label htmlFor="active" className="text-sm font-normal">Noticia activa</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen Destacada</Label>
              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Vista previa:</p>
                  <img src={imagePreview} alt="Vista previa" className="w-full max-w-xs rounded-md border" />
                </div>
              )}

              {loading && imageFile && (
                <div className="mt-2 text-sm">
                  Subiendo imagen: {uploadProgress}%
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar Noticia' : 'Guardar Noticia')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNewsForm;
