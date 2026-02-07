// PANEL DE ADMINISTRACION MEJORADO CON MULTIPLES SECCIONES
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";
import { footballApiService } from "../services/footballApiService";
import { calcularPuntosGanados } from "../utils/pointsCalculator";
import { validarDatosPartido, validarGoles } from "../utils/validators";
import { Card, Button, Badge } from "../components/ui";
import { useApp } from "../context/AppContext";
import type {
  Partido,
  DatosFormularioPartido,
  DatosFormularioResultado,
  Usuario,
  Prediccion,
} from "../types";

export const AdminMatches = () => {
  const { recargarUsuario } = useApp();
  const location = useLocation();

  // ESTADO PARA NAVEGACION ENTRE TABS
  const [tabActiva, setTabActiva] = useState<
    "dashboard" | "partidos" | "usuarios" | "estadisticas"
  >(location.state?.tabActiva || "dashboard");

  // ESTADOS PARA LOS DATOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // MENSAJES ESPECÍFICOS PARA EL FORMULARIO DE CREACIÓN
  const [errorFormCrear, setErrorFormCrear] = useState<string | null>(null);
  const [successFormCrear, setSuccessFormCrear] = useState<string | null>(null);

  // ESTADOS PARA GESTION PARTIDOS
  const [vistaPartidos, setVistaPartidos] = useState<
    "lista" | "crear" | "actualizar"
  >("lista");
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "pending" | "finished"
  >("todos");
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);
  const [formCrear, setFormCrear] = useState<DatosFormularioPartido>({
    homeTeam: "",
    awayTeam: "",
    date: "",
    matchday: 1,
    homeLogo: "",
    awayLogo: "",
  });
  const [formResultado, setFormResultado] = useState<DatosFormularioResultado>({
    matchId: "",
    homeGoals: 0,
    awayGoals: 0,
  });

  // ESTADOS PARA SINCRONIZACIÓN CON API EXTERNA
  const [sincronizando, setSincronizando] = useState(false);
  const [resultadoSincronizacion, setResultadoSincronizacion] = useState<{
    actualizados: number;
    errores: number;
  } | null>(null);

  // ESTADOS PARA IMPORTACIÓN MASIVA DESDE API
  const [subVistaCrear, setSubVistaCrear] = useState<"manual" | "api">(
    "manual",
  );
  const [jornadaApi, setJornadaApi] = useState<number>(1);
  const [temporadaApi, setTemporadaApi] = useState<number>(2023);
  const [partidosPreviosApi, setPartidosPreviosApi] = useState<any[]>([]);
  const [loadingApiPartidos, setLoadingApiPartidos] = useState(false);

  // CARGAR TODOS LOS DATOS
  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const cargarTodosLosDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const [partidosData, usuariosData, prediccionesData] = await Promise.all([
        matchService.getAll().catch((err) => {
          console.error("Error cargando partidos:", err);
          return [];
        }),
        userService.getAll().catch((err) => {
          console.error("Error cargando usuarios:", err);
          return [];
        }),
        predictionService.getAll().catch((err) => {
          console.error("Error cargando predicciones:", err);
          return [];
        }),
      ]);

      setPartidos(partidosData);
      setUsuarios(usuariosData);
      setPredicciones(prediccionesData);
    } catch (err) {
      console.error("Error crítico al cargar datos:", err);
      setError(
        "Error al cargar los datos del sistema. Verifica que el servidor esté funcionando.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>,
    side: "home" | "away",
  ) => {
    let file: File | undefined;

    if ("files" in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorFormCrear(
          "POR FAVOR, SELECCIONA ÚNICAMENTE ARCHIVOS DE IMAGEN.",
        );
        return;
      }

      // COMPRESIÓN AUTOMÁTICA DE LA IMAGEN
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // REDIMENSIONAR A MÁXIMO 200x200 MANTENIENDO PROPORCIÓN
          const maxSize = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // CONVERTIR A BASE64 CON CALIDAD REDUCIDA
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          // VERIFICAR TAMAÑO FINAL
          const sizeInKB = Math.round((compressedBase64.length * 3) / 4 / 1024);

          if (sizeInKB > 500) {
            setErrorFormCrear(
              `IMAGEN MUY GRANDE (${sizeInKB}KB). USA UNA MÁS SIMPLE.`,
            );
            return;
          }

          setFormCrear((prev) => ({
            ...prev,
            [side === "home" ? "homeLogo" : "awayLogo"]: compressedBase64,
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrearPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFormCrear(null);
    setSuccessFormCrear(null);

    // 1. NORMALIZACIÓN Y VALIDACIÓN INICIAL
    const homeName = formCrear.homeTeam.trim();
    const awayName = formCrear.awayTeam.trim();

    const validacion = validarDatosPartido(
      homeName,
      awayName,
      formCrear.date,
      formCrear.matchday,
    );

    if (!validacion.esValido) {
      setErrorFormCrear(validacion.mensaje);
      return;
    }

    // 2. VALIDACIÓN DE FECHA
    const dateObj = new Date(formCrear.date);
    if (isNaN(dateObj.getTime())) {
      setErrorFormCrear("LA FECHA SELECCIONADA NO ES VÁLIDA.");
      return;
    }

    // 3. VALIDACIÓN DE DUPLICADOS
    const partidoDuplicado = partidos.find(
      (p) =>
        p.homeTeam.toLowerCase().trim() === homeName.toLowerCase() &&
        p.awayTeam.toLowerCase().trim() === awayName.toLowerCase() &&
        p.matchday === formCrear.matchday,
    );

    if (partidoDuplicado) {
      setErrorFormCrear(
        `YA EXISTE UN PARTIDO ENTRE ${homeName.toUpperCase()} Y ${awayName.toUpperCase()} EN LA JORNADA ${formCrear.matchday}.`,
      );
      return;
    }

    try {
      // 4. PREPARAR OBJETO (DUPLICIDAD PARA COMPATIBILIDAD)
      const nuevoPartido = {
        homeTeam: homeName,
        awayTeam: awayName,
        equipoLocal: homeName,
        equipoVisitante: awayName,
        date: dateObj.toISOString(),
        fecha: formCrear.date,
        matchday: formCrear.matchday,
        homeLogo: formCrear.homeLogo,
        awayLogo: formCrear.awayLogo,
        status: "pending" as const,
        estado: "pendiente" as const,
        result: null,
        resultado: null,
      };

      // 5. PERSISTENCIA
      await matchService.create(nuevoPartido as any);

      // 6. ÉXITO Y RESET
      setSuccessFormCrear("¡PARTIDO CREADO EXITOSAMENTE!");
      setFormCrear({
        homeTeam: "",
        awayTeam: "",
        date: "",
        matchday: 1,
        homeLogo: "",
        awayLogo: "",
      });
      setVistaPartidos("lista");
      await cargarTodosLosDatos();
      setTimeout(() => setSuccessFormCrear(null), 3000);
    } catch (err) {
      console.error("ERROR AL CREAR PARTIDO:", err);
      setErrorFormCrear(
        "ERROR AL CREAR EL PARTIDO. VERIFICA LA CONEXIÓN O EL TAMAÑO DE LAS IMÁGENES.",
      );
    }
  };

  // FUNCIÓN PARA CARGAR PREVISUALIZACIÓN DE JORNADA DESDE LA API
  const handleCargarPartidosJornada = async () => {
    try {
      setLoadingApiPartidos(true);
      setError(null);
      const data = await footballApiService.getMatchesBySeason(
        jornadaApi,
        temporadaApi,
      );
      setPartidosPreviosApi(data);
    } catch (err) {
      setError("ERROR AL OBTENER PARTIDOS DE LA API");
      console.error(err);
    } finally {
      setLoadingApiPartidos(false);
    }
  };

  // FUNCIÓN PARA IMPORTAR TODA UNA JORNADA A LA BASE DE DATOS LOCAL
  const handleImportarJornada = async () => {
    if (partidosPreviosApi.length === 0) return;

    if (
      !window.confirm(
        `¿DESEAS IMPORTAR LOS ${partidosPreviosApi.length} PARTIDOS DE LA JORNADA ${jornadaApi}?\n\n(TEMPORADA ${temporadaApi}/${(temporadaApi + 1).toString().slice(-2)})`,
      )
    )
      return;

    try {
      setLoading(true);
      let importados = 0;

      for (const apiMatch of partidosPreviosApi) {
        const mapeado = footballApiService.mapApiMatchToLocal(apiMatch);

        // VERIFICAR SI YA EXISTE (POR NOMBRE DE EQUIPOS Y JORNADA)
        const existe = partidos.find(
          (p) =>
            p.homeTeam === mapeado.homeTeam &&
            p.awayTeam === mapeado.awayTeam &&
            p.matchday === mapeado.matchday,
        );

        if (!existe) {
          await matchService.create({
            homeTeam: mapeado.homeTeam,
            awayTeam: mapeado.awayTeam,
            date: `JORNADA ${temporadaApi}/${(temporadaApi + 1).toString().slice(-2)}`,
            matchday: mapeado.matchday,
            homeLogo: mapeado.homeLogo,
            awayLogo: mapeado.awayLogo,
            status: "pending",
            result: null,
          });
          importados++;
        }
      }

      setSuccess(
        `¡IMPORTACIÓN COMPLETADA! ${importados} PARTIDOS NUEVOS AGREGADOS.`,
      );
      setPartidosPreviosApi([]);
      setVistaPartidos("lista");
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("ERROR EN LA IMPORTACIÓN:", err);
      setError("HUBO UN ERROR DURANTE LA IMPORTACIÓN MASIVA.");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formResultado.matchId) {
      setError("Debes seleccionar un partido");
      return;
    }

    const validacion = validarGoles(
      formResultado.homeGoals,
      formResultado.awayGoals,
    );
    if (!validacion.esValido) {
      setError(validacion.mensaje);
      return;
    }

    try {
      await matchService.updateResult(formResultado.matchId, {
        result: {
          homeGoals: formResultado.homeGoals,
          awayGoals: formResultado.awayGoals,
        },
        status: "finished",
      });

      await calcularPuntos(
        formResultado.matchId,
        formResultado.homeGoals,
        formResultado.awayGoals,
      );

      await recargarUsuario();
      setSuccess("¡Resultado actualizado y puntos distribuidos!");
      setFormResultado({ matchId: "", homeGoals: 0, awayGoals: 0 });
      setVistaPartidos("lista");
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al actualizar el resultado");
      console.error(err);
    }
  };

  const calcularPuntos = async (
    matchId: string,
    golesLocal: number,
    golesVisitante: number,
  ) => {
    try {
      const predicciones = await predictionService.getByMatch(matchId);

      for (const pred of predicciones) {
        // EVITAR SUMAR PUNTOS SI YA HAN SIDO ASIGNADOS PREVIAMENTE
        if (pred.points !== null) continue;

        const puntos = calcularPuntosGanados(
          pred.prediction || pred.prediccion,
          {
            home: pred.exactScore?.home ?? pred.marcadorExacto?.local ?? 0,
            away: pred.exactScore?.away ?? pred.marcadorExacto?.visitante ?? 0,
          },
          { homeGoals: golesLocal, awayGoals: golesVisitante },
        );

        await predictionService.updatePoints(pred.id, puntos);

        const usuario = await userService.getById(pred.userId);
        await userService.updateStats(pred.userId, {
          totalPoints: (usuario.totalPoints || 0) + puntos,
          correctPredictions:
            puntos > 0
              ? (usuario.correctPredictions || 0) + 1
              : usuario.correctPredictions || 0,
          totalPredictions: (usuario.totalPredictions || 0) + 1,
        });
      }
    } catch (err) {
      console.error("Error al calcular puntos:", err);
    }
  };

  // FUNCION PARA SINCRONIZAR LOS RESULTADOS
  // ESTA FUNCION ES LA QUE SE ENCARGA DE SINCRONIZAR LOS RESULTADOS DE LOS PARTIDOS
  // DE LA LIGA Y ACTUALIZA AUTOMÁTICAMENTE LOS RESULTADOS Y PUNTOS
  const handleSincronizarResultados = async () => {
    if (
      !window.confirm(
        "¿Sincronizar resultados reales de La Liga?\n\nEsto buscará resultados para todas las temporadas presentes en tus partidos pendientes y repartirá puntos.",
      )
    )
      return;

    try {
      setSincronizando(true);
      setError(null);
      setResultadoSincronizacion(null);

      const nuestrosPartidos = partidos.filter((p) => p.status === "pending");

      if (nuestrosPartidos.length === 0) {
        setError("NO HAY PARTIDOS PENDIENTES PARA SINCRONIZAR.");
        setSincronizando(false);
        return;
      }

      // IDENTIFICAR QUÉ TEMPORADAS TENEMOS (2022, 2023, ETC)
      const temporadasDetectadas = new Set<number>();
      nuestrosPartidos.forEach((p) => {
        if (p.date.includes("JORNADA")) {
          const año = parseInt(p.date.split(" ")[1].split("/")[0]);
          if (!isNaN(año)) temporadasDetectadas.add(año);
        } else {
          // PARA PARTIDOS MANUALES, POR DEFECTO USAMOS LA TEMPORADA ACTUAL
          temporadasDetectadas.add(2023);
        }
      });

      let totalActualizados = 0;
      let totalErrores = 0;

      // SINCRONIZAMOS CADA TEMPORADA DETECTADA
      for (const season of Array.from(temporadasDetectadas)) {
        console.log(`Sincronizando temporada ${season}...`);
        const partidosReales =
          await footballApiService.getFinishedMatches(season);

        for (const partidoReal of partidosReales) {
          const partidoRealMapeado =
            footballApiService.mapApiMatchToLocal(partidoReal);

          const partidoLocal = nuestrosPartidos.find((p) => {
            // VERIFICAR SI LA TEMPORADA COINCIDE
            const pSeason = p.date.includes("JORNADA")
              ? parseInt(p.date.split(" ")[1].split("/")[0])
              : 2023;

            if (pSeason !== season) return false;

            // VERIFICAR JORNADA
            if (p.matchday !== partidoRealMapeado.matchday) return false;

            // NORMALIZAR NOMBRES PARA COMPARAR
            const nombrar = (name: string) =>
              name
                .toLowerCase()
                .replace("atletico", "atlético")
                .replace("almeria", "almería")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            const localNormalizado = nombrar(p.homeTeam);
            const visitanteNormalizado = nombrar(p.awayTeam);
            const apiLocalNormalizado = nombrar(partidoReal.teams.home.name);
            const apiVisitanteNormalizado = nombrar(
              partidoReal.teams.away.name,
            );

            // COINCIDENCIA SI UN NOMBRE CONTIENE AL OTRO (EJ EN DB "REAL MADRID", EN API "REAL MADRID")
            const matchHome =
              localNormalizado.includes(apiLocalNormalizado) ||
              apiLocalNormalizado.includes(localNormalizado);
            const matchAway =
              visitanteNormalizado.includes(apiVisitanteNormalizado) ||
              apiVisitanteNormalizado.includes(visitanteNormalizado);

            return matchHome && matchAway;
          });

          if (partidoLocal && partidoReal.score.fulltime.home !== null) {
            try {
              const golesL = partidoReal.score.fulltime.home;
              const golesV = partidoReal.score.fulltime.away!;

              await matchService.updateResult(partidoLocal.id, {
                result: { homeGoals: golesL, awayGoals: golesV },
                status: "finished",
              });

              await calcularPuntos(partidoLocal.id, golesL, golesV);
              totalActualizados++;
            } catch (err) {
              console.error(`Error sync ${partidoLocal.homeTeam}:`, err);
              totalErrores++;
            }
          }
        }
      }

      await cargarTodosLosDatos();
      await recargarUsuario();

      if (totalActualizados > 0) {
        setResultadoSincronizacion({
          actualizados: totalActualizados,
          errores: totalErrores,
        });
        setSuccess(
          `¡SINCRONIZACIÓN COMPLETADA! ${totalActualizados} PARTIDOS ACTUALIZADOS.`,
        );
        setTimeout(() => {
          setSuccess(null);
          setResultadoSincronizacion(null);
        }, 5000);
      } else {
        setError("NO SE ENCONTRARON RESULTADOS NUEVOS PARA TUS PARTIDOS.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error en sincronización:", err);
      setError("ERROR AL CONECTAR CON LA API. INTÉNTALO DE NUEVO.");
    } finally {
      setSincronizando(false);
    }
  };

  // FUNCIÓN PARA ELIMINAR SOLO LOS PARTIDOS (MANTIENE PUNTOS Y PREDICCIONES)
  const handleEliminarSoloPartidos = async () => {
    if (partidos.length === 0) {
      setError("NO HAY PARTIDOS PARA ELIMINAR.");
      return;
    }

    if (
      !window.confirm(
        "¿ELIMINAR SOLO LOS PARTIDOS?\n\nLas predicciones y los puntos de los usuarios se mantendrán intactos. ¡Usa esto si solo quieres limpiar la lista de encuentros!",
      )
    )
      return;

    try {
      setLoading(true);
      setError(null);

      // ELIMINAMOS CADA PARTIDO PERO NO TOCAMOS NADA MÁS
      await Promise.all(partidos.map((p) => matchService.delete(p.id)));

      setSuccess(
        "PARTIDOS ELIMINADOS. SE HAN RESPETADO LOS PUNTOS Y APUESTAS.",
      );
      await cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("ERROR AL ELIMINAR PARTIDOS:", err);
      setError("ERROR AL INTENTAR ELIMINAR LOS PARTIDOS.");
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN PARA ELIMINAR TODOS LOS PARTIDOS DEL SISTEMA (RESET TOTAL)
  // FUNCIÓN PARA ELIMINAR TODOS LOS PARTIDOS DEL SISTEMA (RESET TOTAL)
  const handleEliminarTodosLosPartidos = async () => {
    // MENSAJE DE ADVERTENCIA DETALLADO
    const mensajeConfirmacion = `⚠️ ¡ATENCIÓN! ACCIÓN DESTRUCTIVA ⚠️

¿ESTÁS SEGURO DE QUE DESEAS RESETEAR TODO EL SISTEMA?

Esta acción es IRREVERSIBLE y realizará lo siguiente:
1. Eliminará TODOS los partidos registrados.
2. Eliminará TODAS las predicciones de los usuarios.
3. Reseteará a 0 los puntos y estadísticas de TODOS los jugadores.

Si procedes, se perderán todos los datos actuales del juego.

¿Confirmas que quieres proceder?`;

    if (!window.confirm(mensajeConfirmacion)) return;

    try {
      setLoading(true);
      setError(null);

      // 1. ELIMINAR TODAS LAS PREDICCIONES PRIMERO
      const todasLasPredicciones = await predictionService.getAll();
      await Promise.all(
        todasLasPredicciones.map((p) => predictionService.delete(p.id)),
      );

      // 2. ELIMINAMOS CADA PARTIDO
      await Promise.all(partidos.map((p) => matchService.delete(p.id)));

      // 3. RESETEAR PUNTOS DE TODOS LOS USUARIOS
      await Promise.all(
        usuarios.map((u) => {
          if (u.role === "admin") return Promise.resolve();
          return userService.updateStats(u.id, {
            totalPoints: 0,
            correctPredictions: 0,
            totalPredictions: 0,
          });
        }),
      );

      setSuccess(
        "SISTEMA RESETEADO: SE HAN ELIMINADO PARTIDOS, PREDICCIONES Y PUNTOS.",
      );
      await cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("ERROR AL ELIMINAR TODO:", err);
      setError("ERROR AL INTENTAR LIMPIAR EL SISTEMA.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPartido = async (partido: Partido) => {
    if (
      !window.confirm(
        `¿Eliminar "${partido.homeTeam} vs ${partido.awayTeam}"?\n\nSe eliminarán todas las predicciones asociadas.`,
      )
    )
      return;

    try {
      const prediccionesDelPartido = await predictionService.getByMatch(
        partido.id,
      );

      // RESTAR PUNTOS A LOS USUARIOS ANTES DE BORRAR
      for (const pred of prediccionesDelPartido) {
        if (pred.points && pred.points > 0) {
          const u = await userService.getById(pred.userId);
          await userService.updateStats(pred.userId, {
            totalPoints: Math.max(0, (u.totalPoints || 0) - pred.points),
            correctPredictions: Math.max(0, (u.correctPredictions || 0) - 1),
            totalPredictions: Math.max(0, (u.totalPredictions || 0) - 1),
          });
        }
        await predictionService.delete(pred.id);
      }

      await matchService.delete(partido.id);
      setSuccess(
        `Partido eliminado y puntos revertidos para ${prediccionesDelPartido.length} predicciones`,
      );
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar el partido");
      console.error(err);
    }
  };

  const handleEliminarUsuario = async (usuario: Usuario) => {
    if (
      !window.confirm(
        `¿Eliminar al usuario "${usuario.nombre}"?\n\n⚠️ Se eliminarán todas sus predicciones.`,
      )
    )
      return;

    try {
      const prediccionesUsuario = predicciones.filter(
        (p) => p.userId === usuario.id,
      );
      for (const pred of prediccionesUsuario) {
        await predictionService.delete(pred.id);
      }
      await userService.delete(usuario.id);
      setSuccess(
        `Usuario eliminado (${prediccionesUsuario.length} predicciones)`,
      );
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar el usuario");
      console.error(err);
    }
  };

  // ESTADÍSTICAS CALCULADAS
  const partidosPendientes = partidos.filter((p) => p.status === "pending");
  const partidosFinalizados = partidos.filter((p) => p.status === "finished");
  const usuariosJugadores = usuarios.filter((u) => u.role !== "admin");
  const prediccionesAcertadas = predicciones.filter((p) => (p.points ?? 0) > 0);
  const tasaAcierto =
    predicciones.length > 0
      ? ((prediccionesAcertadas.length / predicciones.length) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-2xl font-black animate-pulse uppercase tracking-widest">
          CARGANDO PANEL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">
            🔧 PANEL DE ADMINISTRACIÓN CON MÚLTIPLES SECCIONES
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-bold">
            GESTIÓN CENTRALIZADA DEL SISTEMA GOALZ
          </p>
        </div>

        {/* MENSAJES GLOBALES (PARA SINCRONIZAR, BORRAR, ETC.) */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl animate-shake">
            <p className="text-danger font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-primary font-bold flex items-center gap-2">
              <span>✅</span> {success}
            </p>
          </div>
        )}

        {/* NAVEGACIÓN POR TABS */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
          <button
            onClick={() => setTabActiva("dashboard")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "dashboard"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            📊 DASHBOARD
          </button>
          <button
            onClick={() => setTabActiva("partidos")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "partidos"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            ⚽ PARTIDOS
          </button>
          <button
            onClick={() => setTabActiva("usuarios")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "usuarios"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            👥 USUARIOS
          </button>
          <button
            onClick={() => setTabActiva("estadisticas")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "estadisticas"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            📈 ESTADÍSTICAS
          </button>
        </div>

        {/* CONTENIDO SEGÚN TAB ACTIVA */}
        {tabActiva === "dashboard" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Resumen del Sistema
              </h2>
            </div>

            {/* TARJETAS DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-primary/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">⚽</div>
                  <div className="text-4xl font-black text-primary mb-1">
                    {partidos.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Total Partidos
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-accent/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">👥</div>
                  <div className="text-4xl font-black text-accent mb-1">
                    {usuariosJugadores.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Jugadores Activos
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-blue-500/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">📊</div>
                  <div className="text-4xl font-black text-blue-500 mb-1">
                    {predicciones.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Predicciones Totales
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-emerald-500/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">🎯</div>
                  <div className="text-4xl font-black text-emerald-500 mb-1">
                    {tasaAcierto}%
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Tasa de Acierto
                  </div>
                </div>
              </Card>
            </div>

            {/* RESUMEN DE JORNADA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📅</span> Partidos Pendientes
                </h3>
                <div className="space-y-3">
                  {partidosPendientes.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.homeTeam} vs {p.awayTeam}
                      </span>
                      <Badge text="PENDIENTE" variant="warning" />
                    </div>
                  ))}
                  {partidosPendientes.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No hay partidos pendientes
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> Top 5 Clasificación
                </h3>
                <div className="space-y-3">
                  {usuariosJugadores
                    .sort((a, b) => (b.puntosTotal ?? 0) - (a.puntosTotal ?? 0))
                    .slice(0, 5)
                    .map((u, i) => (
                      <div
                        key={u.id}
                        className="p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-primary">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {u.nombre}
                          </span>
                        </div>
                        <span className="font-black text-primary">
                          {u.puntosTotal} pts
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB PARTIDOS - CONTENIDO ORIGINAL */}
        {tabActiva === "partidos" && (
          <div>
            {/* NAVEGACIÓN INTERNA Y BOTÓN DE SINCRONIZACIÓN */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setVistaPartidos("lista")}
                  variant={vistaPartidos === "lista" ? "primary" : "secondary"}
                >
                  📋 LISTA
                </Button>
                <Button
                  onClick={() => setVistaPartidos("crear")}
                  variant={vistaPartidos === "crear" ? "primary" : "secondary"}
                >
                  ➕ CREAR
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleSincronizarResultados}
                  disabled={sincronizando}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black px-6 py-2 shadow-lg"
                >
                  {sincronizando ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⚙️</span>
                      SINCRONIZANDO...
                    </>
                  ) : (
                    <>🔄 SINCRONIZAR API REAL</>
                  )}
                </Button>

                <Button
                  onClick={handleEliminarSoloPartidos}
                  variant="secondary"
                  className="font-black px-6 py-2 border-2 border-slate-300 dark:border-white/10"
                >
                  🗑️ BORRAR TODOS LOS PARTIDOS
                </Button>

                <Button
                  onClick={handleEliminarTodosLosPartidos}
                  variant="danger"
                  className="font-black px-6 py-2 transition-all shadow-lg shadow-danger/20"
                >
                  ☢️ RESETEAR SISTEMA
                </Button>
              </div>
            </div>

            {/* RESULTADO DE LA SINCRONIZACIÓN */}
            {resultadoSincronizacion && (
              <Card className="p-4 mb-8 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">
                      Sincronización completada
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                      ✅ {resultadoSincronizacion.actualizados} partido(s)
                      actualizado(s)
                      {resultadoSincronizacion.errores > 0 &&
                        ` • ⚠️ ${resultadoSincronizacion.errores} error(es)`}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* LISTA DE PARTIDOS */}
            {vistaPartidos === "lista" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    BASE DE DATOS DE PARTIDOS
                  </h2>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setFiltroEstado("todos")}
                      variant={
                        filtroEstado === "todos" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      TODOS ({partidos.length})
                    </Button>
                    <Button
                      onClick={() => setFiltroEstado("pending")}
                      variant={
                        filtroEstado === "pending" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      PENDIENTES ({partidosPendientes.length})
                    </Button>
                    <Button
                      onClick={() => setFiltroEstado("finished")}
                      variant={
                        filtroEstado === "finished" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      FINALIZADOS ({partidosFinalizados.length})
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {partidos
                    .filter(
                      (partido) =>
                        filtroEstado === "todos" ||
                        partido.status === filtroEstado,
                    )
                    .map((partido) => (
                      <Card
                        key={partido.id}
                        hover
                        className="border-primary/20"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                              JORNADA {partido.matchday} •{" "}
                              {isNaN(new Date(partido.date).getTime())
                                ? partido.date
                                : new Date(partido.date).toLocaleDateString(
                                    "es-ES",
                                  )}
                            </div>
                            <div className="grid grid-cols-3 gap-8 items-center">
                              <div className="flex flex-col items-end gap-2 text-right">
                                {partido.homeLogo && (
                                  <img
                                    src={partido.homeLogo}
                                    alt={partido.homeTeam}
                                    className="w-10 h-10 object-contain"
                                  />
                                )}
                                <p className="font-black text-slate-900 dark:text-white text-xl">
                                  {partido.homeTeam}
                                </p>
                              </div>
                              <div className="text-center">
                                {partido.result ? (
                                  <div className="text-3xl font-black text-primary">
                                    {partido.result.homeGoals} -{" "}
                                    {partido.result.awayGoals}
                                  </div>
                                ) : (
                                  <div className="text-gray-400 font-black border-2 border-gray-200 dark:border-gray-700 rounded-lg py-1">
                                    VS
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-start gap-2 text-left">
                                {partido.awayLogo && (
                                  <img
                                    src={partido.awayLogo}
                                    alt={partido.awayTeam}
                                    className="w-10 h-10 object-contain"
                                  />
                                )}
                                <p className="font-black text-slate-900 dark:text-white text-xl">
                                  {partido.awayTeam}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              text={
                                partido.status === "finished"
                                  ? "FINALIZADO"
                                  : "PENDIENTE"
                              }
                              variant={
                                partido.status === "finished"
                                  ? "success"
                                  : "warning"
                              }
                            />
                            {partido.status === "pending" && (
                              <Button
                                onClick={() => {
                                  setPartidoSeleccionado(partido);
                                  setFormResultado({
                                    matchId: partido.id,
                                    homeGoals: 0,
                                    awayGoals: 0,
                                  });
                                  setVistaPartidos("actualizar");
                                }}
                              >
                                ACTUALIZAR
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEliminarPartido(partido)}
                              variant="danger"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* SECCIÓN DE CREACIÓN DE PARTIDOS (REDISEÑADA) */}
            {vistaPartidos === "crear" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center">
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-white/5">
                    <button
                      onClick={() => setSubVistaCrear("manual")}
                      className={`px-8 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${
                        subVistaCrear === "manual"
                          ? "bg-white dark:bg-dark-bg text-primary shadow-xl"
                          : "text-gray-500 hover:text-primary"
                      }`}
                    >
                      ✍️ CREACIÓN MANUAL
                    </button>
                    <button
                      onClick={() => setSubVistaCrear("api")}
                      className={`px-8 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${
                        subVistaCrear === "api"
                          ? "bg-white dark:bg-dark-bg text-primary shadow-xl"
                          : "text-gray-500 hover:text-primary"
                      }`}
                    >
                      🚀 IMPORTAR LIGA 23/24
                    </button>
                  </div>
                </div>

                {subVistaCrear === "manual" ? (
                  <Card className="max-w-2xl mx-auto border-primary/20">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase">
                      NUEVO PARTIDO LOCAL
                    </h2>

                    {/* MENSAJES DE ERROR/ÉXITO DENTRO DEL FORMULARIO */}
                    {errorFormCrear && (
                      <div className="mb-6 p-4 bg-danger/10 border-2 border-danger/30 rounded-xl animate-shake">
                        <p className="text-danger font-bold flex items-center gap-2">
                          <span>⚠️</span> {errorFormCrear}
                        </p>
                      </div>
                    )}

                    {successFormCrear && (
                      <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl">
                        <p className="text-primary font-bold flex items-center gap-2">
                          <span>✅</span> {successFormCrear}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleCrearPartido} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            EQUIPO LOCAL
                          </label>
                          <input
                            type="text"
                            value={formCrear.homeTeam}
                            onChange={(e) =>
                              setFormCrear({
                                ...formCrear,
                                homeTeam: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                            placeholder="EJ: MIS AMIGOS FC"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            EQUIPO VISITANTE
                          </label>
                          <input
                            type="text"
                            value={formCrear.awayTeam}
                            onChange={(e) =>
                              setFormCrear({
                                ...formCrear,
                                awayTeam: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                            placeholder="EJ: PROFESORES UNITED"
                          />
                        </div>

                        {/* SECCIÓN DE LOGOS DRAG & DROP */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* LOGO LOCAL */}
                          <div className="space-y-2">
                            <label className="block text-slate-700 dark:text-slate-300 font-black mb-1 uppercase text-[10px] tracking-wider">
                              LOGO LOCAL{" "}
                              <span className="text-gray-400 font-normal">
                                (Opcional)
                              </span>
                            </label>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-2">
                              PNG, JPG, WEBP • Cualquier tamaño
                            </p>
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleFileUpload(e, "home")}
                              className="relative group h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "home")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              {formCrear.homeLogo ? (
                                <div className="relative w-full h-full flex items-center justify-center p-2">
                                  <img
                                    src={formCrear.homeLogo}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain drop-shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormCrear({
                                        ...formCrear,
                                        homeLogo: "",
                                      });
                                    }}
                                    className="absolute top-2 right-2 bg-danger text-white w-6 h-6 rounded-full flex items-center justify-center text-xs z-20 hover:scale-110 transition-transform"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center p-4">
                                  <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">
                                    🖼️
                                  </span>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                                    SOLTAR O CLICK
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* LOGO VISITANTE */}
                          <div className="space-y-2">
                            <label className="block text-slate-700 dark:text-slate-300 font-black mb-1 uppercase text-[10px] tracking-wider">
                              LOGO VISITANTE{" "}
                              <span className="text-gray-400 font-normal">
                                (Opcional)
                              </span>
                            </label>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-2">
                              PNG, JPG, WEBP • Cualquier tamaño
                            </p>
                            <div
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleFileUpload(e, "away")}
                              className="relative group h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-bg/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer overflow-hidden"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, "away")}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              {formCrear.awayLogo ? (
                                <div className="relative w-full h-full flex items-center justify-center p-2">
                                  <img
                                    src={formCrear.awayLogo}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain drop-shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormCrear({
                                        ...formCrear,
                                        awayLogo: "",
                                      });
                                    }}
                                    className="absolute top-2 right-2 bg-danger text-white w-6 h-6 rounded-full flex items-center justify-center text-xs z-20 hover:scale-110 transition-transform"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="text-center p-4">
                                  <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">
                                    🖼️
                                  </span>
                                  <p className="text-[10px] font-bold text-gray-500 uppercase">
                                    SOLTAR O CLICK
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            FECHA Y HORA
                          </label>
                          <input
                            type="datetime-local"
                            value={formCrear.date}
                            onChange={(e) =>
                              setFormCrear({
                                ...formCrear,
                                date: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            JORNADA
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formCrear.matchday}
                            onChange={(e) =>
                              setFormCrear({
                                ...formCrear,
                                matchday: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full py-4 text-lg">
                        🚀 CREAR PARTIDO LOCAL
                      </Button>
                    </form>
                  </Card>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <Card className="border-accent/20">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase">
                        IMPORTAR JORNADA DE LA LIGA
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="w-full">
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            TEMPORADA
                          </label>
                          <select
                            value={temporadaApi}
                            onChange={(e) =>
                              setTemporadaApi(parseInt(e.target.value))
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all font-bold"
                          >
                            <option value={2022}>2022/23</option>
                            <option value={2023}>2023/24</option>
                          </select>
                        </div>
                        <div className="w-full">
                          <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                            JORNADA
                          </label>
                          <select
                            value={jornadaApi}
                            onChange={(e) =>
                              setJornadaApi(parseInt(e.target.value))
                            }
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all font-bold"
                          >
                            {Array.from({ length: 38 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                JORNADA {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-end gap-6">
                        <Button
                          onClick={handleCargarPartidosJornada}
                          disabled={loadingApiPartidos}
                          className="w-full md:w-auto px-10"
                        >
                          {loadingApiPartidos
                            ? "BUSCANDO..."
                            : "🔍 VER PARTIDOS"}
                        </Button>
                      </div>
                    </Card>

                    {partidosPreviosApi.length > 0 && (
                      <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between bg-primary/10 p-4 rounded-xl border border-primary/20">
                          <p className="font-black text-primary text-sm uppercase">
                            {partidosPreviosApi.length} PARTIDOS ENCONTRADOS
                            PARA LA JORNADA {jornadaApi}
                          </p>
                          <Button
                            onClick={handleImportarJornada}
                            className="bg-primary text-dark-bg px-6 py-2 text-xs"
                          >
                            📥 IMPORTAR TODO A MI APP
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {partidosPreviosApi.map((p: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-4 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-white/5 flex gap-4 items-center shadow-sm"
                            >
                              <div className="flex-1 flex items-center justify-end gap-2 w-2/5">
                                <span className="text-[10px] font-black dark:text-gray-300 uppercase truncate">
                                  {p.teams.home.name}
                                </span>
                                <img
                                  src={p.teams.home.logo}
                                  alt=""
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <span className="bg-slate-100 dark:bg-dark-bg px-2 py-1 rounded-lg font-black text-primary text-[10px]">
                                VS
                              </span>
                              <div className="flex-1 flex items-center justify-start gap-2 w-2/5">
                                <img
                                  src={p.teams.away.logo}
                                  alt=""
                                  className="w-8 h-8 object-contain"
                                />
                                <span className="text-[10px] font-black dark:text-gray-300 uppercase truncate">
                                  {p.teams.away.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Formulario actualizar resultado */}
            {vistaPartidos === "actualizar" && partidoSeleccionado && (
              <Card className="max-w-2xl mx-auto border-accent/20">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                  REGISTRAR RESULTADO FINAL
                </h2>
                <div className="mb-8 p-6 bg-slate-50 dark:bg-dark-bg/50 rounded-2xl border border-slate-200 dark:border-white/10">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <p className="text-right font-black text-slate-900 dark:text-white text-2xl uppercase">
                      {partidoSeleccionado.homeTeam}
                    </p>
                    <div className="text-center text-gray-400 font-bold">
                      VS
                    </div>
                    <p className="text-left font-black text-slate-900 dark:text-white text-2xl uppercase">
                      {partidoSeleccionado.awayTeam}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleActualizarResultado}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        GOLES LOCAL
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formResultado.homeGoals}
                        onChange={(e) =>
                          setFormResultado({
                            ...formResultado,
                            homeGoals: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-6 bg-slate-50 dark:bg-dark-bg border-2 border-slate-200 dark:border-primary/20 rounded-2xl text-slate-900 dark:text-white text-4xl font-black text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        GOLES VISITANTE
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formResultado.awayGoals}
                        onChange={(e) =>
                          setFormResultado({
                            ...formResultado,
                            awayGoals: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-6 bg-slate-50 dark:bg-dark-bg border-2 border-slate-200 dark:border-primary/20 rounded-2xl text-slate-900 dark:text-white text-4xl font-black text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/20 text-center">
                    <span className="text-gray-500 dark:text-gray-400 font-bold block mb-2">
                      MARCADOR FINAL:
                    </span>
                    <span className="text-5xl font-black text-primary tracking-tighter">
                      {formResultado.homeGoals} - {formResultado.awayGoals}
                    </span>
                  </div>

                  <Button type="submit" className="w-full py-5 text-xl">
                    🎯 CONFIRMAR Y DISTRIBUIR PUNTOS
                  </Button>
                  <Button
                    onClick={() => setVistaPartidos("lista")}
                    variant="secondary"
                    className="w-full"
                  >
                    CANCELAR
                  </Button>
                </form>
              </Card>
            )}
          </div>
        )}

        {/* TAB USUARIOS */}
        {tabActiva === "usuarios" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              GESTIÓN DE USUARIOS
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {usuarios.map((usuario) => (
                <Card key={usuario.id} hover className="border-primary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-black text-xl">
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {usuario.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                          {usuario.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        text={usuario.role === "admin" ? "ADMIN" : "JUGADOR"}
                        variant={usuario.role === "admin" ? "primary" : "info"}
                      />
                      {usuario.role !== "admin" && (
                        <>
                          <div className="text-right">
                            <div className="text-2xl font-black text-primary">
                              {usuario.puntosTotal}
                            </div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              PUNTOS
                            </div>
                          </div>
                          <Button
                            onClick={() => handleEliminarUsuario(usuario)}
                            variant="danger"
                            className="text-sm"
                          >
                            🗑️ ELIMINAR
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB ESTADÍSTICAS */}
        {tabActiva === "estadisticas" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ESTADÍSTICAS GENERALES
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Resumen de Predicciones
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Total de predicciones:
                    </span>
                    <span className="font-black text-2xl text-primary">
                      {predicciones.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Predicciones acertadas:
                    </span>
                    <span className="font-black text-2xl text-emerald-500">
                      {prediccionesAcertadas.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Tasa de acierto global:
                    </span>
                    <span className="font-black text-2xl text-accent">
                      {tasaAcierto}%
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Estado del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Partidos creados:
                    </span>
                    <span className="font-black text-2xl text-primary">
                      {partidos.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Partidos pendientes:
                    </span>
                    <span className="font-black text-2xl text-blue-500">
                      {partidosPendientes.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Usuarios registrados:
                    </span>
                    <span className="font-black text-2xl text-accent">
                      {usuarios.length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
