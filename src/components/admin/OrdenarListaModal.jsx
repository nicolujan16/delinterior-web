import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminNews } from "../../context/AdminNewsContext";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

/**
 * OrdenarListaModal
 * Props:
 *  - open: boolean
 *  - onOpenChange: function(bool)
 *  - category: string
 *  - onSave?: function(selectedArray) // opcional, recibe [{id, order}, ...]
 */
const OrdenarListaModal = ({ open, onOpenChange, category }) => {
  const { getCoverNewsByCategory, setTapaPorCategoria } = useAdminNews();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  // mapa { [id]: number|null }
  const [orders, setOrders] = useState({});

  // Fetch cuando se abre
  useEffect(() => {
    let mounted = true;
    const fetchNewsList = async () => {
      if (!open) return;
      setLoading(true);
      try {
        const newsList = await getCoverNewsByCategory({category: category.toLowerCase()});
        if (!mounted) return;
        setNews(newsList || []);
        // inicializar orders: si la noticia trae un campo order lo usamos, sino null
        const initial = {};
        (newsList || []).forEach((n) => {
          initial[n.id] = (n.order ?? null);
        });
        setOrders(initial);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error obteniendo noticias",
          text: String(err),
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNewsList();
    return () => {
      mounted = false;
    };
  }, [open, category, getCoverNewsByCategory]);

  // limpiar estado cuando se cierra el modal completamente
  useEffect(() => {
    if (!open) {
      setNews([]);
      setOrders({});
      setLoading(true);
    }
  }, [open]);

  // mapa tomado: {1: id, 2: id, 3: id}
  const taken = useMemo(() => {
    const t = {};
    Object.entries(orders).forEach(([id, order]) => {
      if (order != null) t[order] = id;
    });
    return t;
  }, [orders]);

  const selectedCount = useMemo(
    () => Object.values(orders).filter((v) => v != null).length,
    [orders]
  );
  const hasPrincipal = useMemo(
    () => Object.values(orders).includes(1),
    [orders]
  );

  function handleChangeOrder(id, value) {
    setOrders((prev) => ({
      ...prev,
      [id]: value === "" ? null : Number(value),
    }));
  }

  function handleClear() {
    const clean = {};
    news.forEach((n) => (clean[n.id] = null));
    setOrders(clean);
  }

  async function handleSave() {
    // validación de frontend
    if (selectedCount !== 3 || !hasPrincipal) {
      await Swal.fire({
        icon: "warning",
        title: "Orden incompleto",
        text: "Debés asignar 3 noticias y marcar la número 1 como principal.",
      });
      return;
    }

    const arr = Object.entries(orders)
      .filter(([, order]) => order != null)
      .map(([id, order]) => ({ id, order }))
      .sort((a, b) => a.order - b.order).map(el => el.id);

    try {
      let categoriaLowerCased = category.toLowerCase()
      let updateCategoriasTapaIDs = await setTapaPorCategoria(categoriaLowerCased, arr)
      if(updateCategoriasTapaIDs){
        Swal.fire({
          icon: "success",
          title: "Actualizado con exito"
        })
        window.location.reload()
      }else{
        throw new Error("Error actualizando IDs")
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: err,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[605px]">
        <DialogHeader>
          <DialogTitle>Cambiar orden de noticias - {category}</DialogTitle>
          <DialogDescription>Selecciona el orden de las noticias (1 = principal)</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-600">Cargando noticias...</p>
            ) : (
              news.map((noticia) => {
                const currentOrder = orders[noticia.id] ?? null;
                return (
                  <div key={noticia.id} className="flex items-center gap-4 p-2 rounded-lg border">
                    {/* Selector numérico manual */}
                    <div className="w-14 flex items-center justify-center">
                      <select
                        aria-label={`Orden para ${noticia.titulo}`}
                        value={currentOrder ?? ""}
                        onChange={(e) => handleChangeOrder(noticia.id, e.target.value)}
                        className="px-3 py-2 rounded border bg-white cursor-pointer"
                      >
                        <option value="">—</option>
                        {[1, 2, 3].map((num) => {
                          const takenBy = taken[num];
                          const disabled = Boolean(takenBy && takenBy !== noticia.id);
                          return (
                            <option key={num} value={num} disabled={disabled}>
                              {num}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <label htmlFor={`news-${noticia.id}`} className="flex items-center gap-4 cursor-pointer flex-1">
                      <img
                        src={noticia.imgURL}
                        alt={noticia.titulo}
                        className="w-20 h-14 object-cover rounded-md bg-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{noticia.titulo}</span>
                        <span className="text-xs text-gray-500">ID: {noticia.id}</span>
                      </div>
                    </label>

                    {/* badge preview */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full border ${currentOrder ? "bg-white" : "bg-gray-50"
                        }`}
                      aria-hidden
                    >
                      {currentOrder ? <span className="font-semibold">{currentOrder}</span> : <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <div className="w-full flex flex-col justify-center items-center gap-2">
            <div className="w-full flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Seleccionadas: <span className="font-medium">{selectedCount}</span> / 3 — Principal:{" "}
                <span className="font-medium">{hasPrincipal ? "Sí" : "No"}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleClear}>
                  Limpiar
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={!(selectedCount === 3 && hasPrincipal)}
                  className={`ml-2 ${selectedCount === 3 && hasPrincipal ? "" : "opacity-70 pointer-events-none"}`}
                >
                  Guardar orden
                </Button>
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrdenarListaModal;
