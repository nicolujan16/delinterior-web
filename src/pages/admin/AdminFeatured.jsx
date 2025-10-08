import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Eye, Image, Bold} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { useAdminNews } from '../../context/AdminNewsContext';
import { Checkbox } from "@/components/ui/checkbox";
import Swal from 'sweetalert2';
import AddNewEditableModal from '../../components/admin/AddNewEditableModal';

const AdminFeatured = () => {
  const { toast } = useToast();
  const [modalState, setModalState] = useState({ open: false, item: null });
  const { getCategorias, contarNoticiasPorCategoria, getAuspiciantes, updateCategorias, updateAuspiciantes } = useAdminNews()
  const [categorias, setCategorias] = useState([])
  const [sponsorsMain, setSponsorsMain] = useState([])
  const [allSponsors, setAllSponsors] = useState([])
  const [sponsorSecondary, setSponsorSecondary] = useState([])
  const [loading, setLoading] = useState(true)
  const [editableModalState, setEditableModalState] = useState(false)

  // Categorias
  useEffect(() => {
    const fetchCategories = async() => {
      let categoriasFinales = []
      let categories = await getCategorias()
      for(let cat of categories) {
        if(cat.value != 'Principales'){
          let cantDeNoticias = await contarNoticiasPorCategoria(cat.value)  
          categoriasFinales.push({
            value: cat.value,
            label: cat.label,
            newsCount: cantDeNoticias
          })
        }
      }
      setCategorias(categoriasFinales)
    }
    fetchCategories()
  },[getCategorias])

  // Auspiciantes
  useEffect(() => {
    const fetchAuspiciantes = async () => {
      let sponsors = await getAuspiciantes()
      setSponsorsMain(sponsors.main)
      setAllSponsors([...sponsors.main, ...sponsors.secondary])
      setSponsorSecondary(sponsors.secondary)
    }
    fetchAuspiciantes()
  },[getAuspiciantes])

  // Manejar loading
  useEffect(() => {
    if(allSponsors.length > 0 && categorias.length > 0){
      setLoading(false)
    }
  },[allSponsors, categorias])

  const confirmDelete = () => {
    if (modalState.item) {
      toast({
        title: "Noticia eliminada (simulado)",
        description: `La noticia "${modalState.item.title}" ha sido eliminada.`,
        action: <Button variant="secondary" size="sm" onClick={() => toast({ title: "Acción Deshacer (simulado)" })}>Deshacer</Button>,
      });
    }
    setModalState({ open: false, item: null });
  };

  const handleCheckedChange = (sp) => {
    // comprobamos por propiedad única; usar id si lo tenés sería mejor
    const isInMain = sponsorsMain.some(s => s.marca === sp.marca);

    // Si ya está en main -> lo movemos a secondary
    if (isInMain) {
      setSponsorsMain(prev => prev.filter(s => s.marca !== sp.marca));
      let newSecSpons = [...sponsorSecondary, sp]
      setSponsorSecondary(newSecSpons)
      return;
    }

    // Si no está en main, intentamos agregarlo a main:
    if (sponsorsMain.length >= 3) {
      Swal.fire({
        icon: "warning",
        title: "Solo puede tener 3 sponsors principales"
      });
      return;
    }
    let newSpMain = [...sponsorsMain, sp]
    setSponsorsMain(newSpMain);
    let newSpSecond = sponsorSecondary.filter(s => s.marca != sp.marca)
    setSponsorSecondary(newSpSecond)

  };

  const handleEditableAdded = async (e) => {
    // Se agrega una categoria
    if(typeof(e) == 'string'){
      if(categorias.map(c => c.value).includes(e) || e == 'Principales'){
        toast({
          title: "Categoria ya existente"
        })
        return
      }

      let newCategories = [{
        value: 'Principales',
        label: 'Principales'
      }]
      categorias.forEach((cat) => {
        newCategories.push({
          value: cat.value,
          label: cat.label
        })
      })
      newCategories.push({
        value: e,
        label: e
      })      
      try{
        await updateCategorias(newCategories)
        setEditableModalState(false)
        Swal.fire({
          icon:"success",
          title: "Categoria actualizada",
          text: "Se ha actualizado categorias exitosamente"
        }).then(() => {
          window.location.reload()
        })
      }catch(err){
        setEditableModalState(false)
        Swal.fire({
          icon: "error",
          title: "Error actualizando categorias.",
          text: err
        }).then(() => {
          window.location.reload
        })
      }



    }
    // Se agrega un sponsor
    if(typeof(e) == 'object'){
      if(allSponsors.map(sp => sp.marca).includes(e.marca)){
        toast({
          title: "Ya existe un auspiciante con ese nombre"
        })
        return
      }
      try{
        let newSponsors = {
          main: sponsorsMain,
          secondary: [
            ...sponsorSecondary,
            e
          ]
        } 
        await updateAuspiciantes(newSponsors)
        return
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error actualizando sponsors",
          text: err
        })
      }
    }
  };

  const handleActionClick = async (action, value) => {
    // Añadir categoria
    if(action == 'AddCategory'){
      setEditableModalState('Categoria')
      return
    }
    // Añadir sponsor
    if(action == 'AddSponsor'){
      setEditableModalState('Auspiciantes')
      return
    }

    if(action == 'delete-sp'){
      Swal.fire({
        icon: "question",
        title: "¿Eliminar auspiciante?",
        text: "Esta acción es irreversible",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
      }).then((e) => {
        if(e.isConfirmed){
          // Eliminar auspiciante
          if(sponsorsMain.includes(value)){
            let newSponsorMain = sponsorsMain.filter(sp => sp.marca != value.marca)
            setSponsorsMain(newSponsorMain)
            let newAllSp = allSponsors.filter(sp => sp.marca != value.marca)
            setAllSponsors(newAllSp)
          }else{
            let newSponsorsSecondary = sponsorSecondary.filter(sp => sp.marca != value.marca)
            setSponsorSecondary(newSponsorsSecondary)
            let newAllSP = allSponsors.filter(sp => sp.marca != value.marca)
            setAllSponsors(newAllSP)
          }

        }
      })
    }

    if(action == 'delete-cat'){
      Swal.fire({
        icon: "question",
        title: "Eliminar categoria?",
        text: "Esta accion es irreversible",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
      }).then(async (e) => {
        if(e.isConfirmed){
          let newCats = [{
            value: 'Principales',
            label: 'Principales'
          }]
          categorias.map((cat) => {
            if(cat.value == value.value){
              return
            }
            newCats.push({
              value: cat.value,
              label: cat.label
            })
          })

          try{
            Swal.fire({
              title: 'Eliminando categoria...',
              text: 'Por favor esperá unos segundos',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            await updateCategorias(newCats)
            Swal.close()
            Swal.fire({
              icon: "success",
              title: "Categoria eliminada!"
            }).then(() => {
              window.location.reload()
            })
          }catch(err){
            Swal.fire({
              icon: "error",
              title: "Error eliminando categoria",
              text: err
            })
          }
        }
      })

    }
  }

  const handleSaveChanges = async (element) => {
    if(element == 'sponsors'){
      try {
        let newAusp = {
          main: sponsorsMain,
          secondary: sponsorSecondary
        }
        let updateSP = await updateAuspiciantes(newAusp)
        Swal.fire({
          icon: "success",
          title: "Auspiciantes actualizados!"
        }).then(()=> {
          window.location.reload()
        })
      }catch(err){
        Swal.fire({
          icon: "error",
          title: "Error guardando auspiciantes",
          text: err
        })
      }

    }
  }

  return (
    <div className="flex gap-4 flex-wrap">
      <ConfirmationModal
        open={modalState.open}
        onOpenChange={(open) => setModalState({ ...modalState, open })}
        onConfirm={confirmDelete}
        title="¿Estás seguro?"
        description={`Esta acción no se puede deshacer. Se eliminará permanentemente la noticia: "${modalState.item?.title}"`}
      />

      <AddNewEditableModal 
        open={editableModalState}
        onOpenChange={setEditableModalState}
        editable={editableModalState}
        handleEditableAdded={handleEditableAdded}
      ></AddNewEditableModal>

      {/* Categorias */}
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Gestiona las categorias</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Categoria</th>
                  <th scope="col" className="px-6 py-3">Noticias</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                loading ?
                <p>Cargando datos...</p>
                :
                categorias.map((cat) => (
                  <tr key={cat.value} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{cat.value}</td>
                    <td className="px-6 py-4">{cat.newsCount}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleActionClick('delete-cat', cat)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex w-full my-4 justify-center items-center flex-col gap-2'>
              <Button className='flex gap-2' onClick={() => { handleActionClick('AddCategory') }}>
                <PlusCircle></PlusCircle>
                Agregar categoria
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auspiciantes */}
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Auspiciantes</CardTitle>
          <CardDescription>Gestiona los auspiciantes</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Auspiciantes</th>
                  <th scope="col" className="px-6 py-3 text-center ">Banner Principal</th>
                  <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                loading ?
                <p>Cargando datos...</p>
                :
                allSponsors.map((sp) => (
                  <tr key={sp.marca} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{sp.marca}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <Checkbox
                        checked={sponsorsMain.includes(sp)}
                        onCheckedChange={() => {handleCheckedChange(sp)}}
                      ></Checkbox>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleActionClick('delete-sp', sp)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='w-full flex justify-center my-4 flex-col items-center gap-2'>
              <Button onClick={() => { handleActionClick('AddSponsor') }}>
                <PlusCircle></PlusCircle>
                Agregar Sponsor
              </Button>
              <Button onClick={() => { handleSaveChanges('sponsors')}}>
                Guardar cambios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      
    </div>
  );
};

export default AdminFeatured;