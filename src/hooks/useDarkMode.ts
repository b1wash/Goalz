// HOOK PARA EL MODO OSCURO
import { useState, useEffect } from "react";

export const useDarkMode = () => {
  //DEFINIMOS ESTADO INICIAL ENCENDIDO O APAGADO
  const [isDark, setIsDark] = useState(() => {
    //BUSCAMOS SI HAY UN VALOR GUARDADO EN EL LOCALSTORAGE ES DECIR SI EL USUARIO YA HA ELEGIDO UN MODO ANTES
    const saved = localStorage.getItem("goalz_theme");
    //SI HAY UN VALOR GUARDADO Y ES DARK LO USAMOS
    if (saved) return saved === "dark";
    //SI NO HAY UN VALOR GUARDADO LO USAMOS PERO EN ESTE CASO SERIA EL MODO OSCURO O CLARO DEPENDIENDO DE LA CONFIGURACION DE LA PC

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  //PARA APLICAR LOS CAMBIOS DE ESTILOS DEL MODO OSCURO O CLARO FUERA DEL COMPONENTE REACT
  useEffect(() => {
    //OBTENEMOS EL ELEMENTO RAIZ DEL DOCUMENTO
    const root = window.document.documentElement;
    //SI ESTA EN MODO OSCURO
    if (isDark) {
      //AGREGAMOS LA CLASE DARK
      root.classList.add("dark");
      //GUARDAMOS EN EL LOCALSTORAGE
      localStorage.setItem("goalz_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("goalz_theme", "light");
    }
  }, [isDark]); //ESTE EFFECT SE EJECUTA CADA VEZ QUE CAMBIA EL ESTADO DE ISDARK

  //FUNCION PARA CAMBIAR EL ESTADO DE ISDARK
  //SIMPLEMENTE CAMBIA EL VALOR DE ISDARK A SU OPUESTO
  const toggleDarkMode = () => setIsDark(!isDark);
  //DEVOLVEMOS EL ESTADO ACTUAL Y LA FUNCION PARA CAMBIARLO
  return { isDark, toggleDarkMode };
};
