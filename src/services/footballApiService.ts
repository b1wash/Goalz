// SERVICIO DE INTEGRACION CON API-FOOTBALL
// PROPORCIONA ACCESO A DATOS REALES DE PARTIDOS DE LA LIGA

const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;
const API_HOST = import.meta.env.VITE_FOOTBALL_API_HOST;
const BASE_URL = `https://${API_HOST}`;

const LA_LIGA_ID = 140;
const CURRENT_SEASON = 2023; // COMO ES PLAN FREE NO SE PUEDE USAR LA TEMPORADA ACTUAL SOLO SE PUEDE USAR LA TEMPORADA DESDE 2022 HASTA 2024

// ESTRUCTURA DE DATOS DE UN PARTIDO SEGÚN LA API EXTERNA
interface ApiFootballMatch {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface ApiFootballResponse {
  response: ApiFootballMatch[];
}

// FUNCION PARA REALIZAR UNA PETICION A LA API EXTERNA
const fetchFromApi = async (endpoint: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Error en la API: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

// FUNCION PARA OBTENER PARTIDOS DE LA LIGA POR JORNADA O RANGO DE FECHAS
const getMatches = async (round?: number): Promise<ApiFootballMatch[]> => {
  let endpoint = `/fixtures?league=${LA_LIGA_ID}&season=${CURRENT_SEASON}`;

  if (round) {
    endpoint += `&round=Regular Season - ${round}`;
  } else {
    // PLAN FREE NO PERMITE PARÁMETRO 'LAST', USAMOS RANGO DE FECHAS
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    const from = hace30Dias.toISOString().split("T")[0];
    const to = hoy.toISOString().split("T")[0];

    endpoint += `&from=${from}&to=${to}`;
  }

  const data: ApiFootballResponse = await fetchFromApi(endpoint);
  return data.response;
};

// FUNCION PARA OBTENER PARTIDOS POR TEMPORADA ESPECÍFICA
const getMatchesBySeason = async (
  round: number,
  season: number,
): Promise<ApiFootballMatch[]> => {
  const endpoint = `/fixtures?league=${LA_LIGA_ID}&season=${season}&round=Regular Season - ${round}`;
  const data: ApiFootballResponse = await fetchFromApi(endpoint);
  return data.response || [];
};

// FUNCION PARA OBTENER PARTIDOS FINALIZADOS RECIENTES
// BUSCA PARTIDOS DE UNA TEMPORADA ESPECÍFICA
const getFinishedMatches = async (
  season?: number,
): Promise<ApiFootballMatch[]> => {
  // PARA PLAN FREE: BUSCAR TODOS LOS PARTIDOS FINALIZADOS DE LA TEMPORADA
  const selectedSeason = season || CURRENT_SEASON;
  const endpoint = `/fixtures?league=${LA_LIGA_ID}&season=${selectedSeason}&status=FT`;
  const data: ApiFootballResponse = await fetchFromApi(endpoint);
  return data.response || [];
};

/**
 * EXTRAE EL NÚMERO DE JORNADA DEL FORMATO "REGULAR SEASON - X"
 */
const extractMatchday = (round: string): number => {
  const match = round.match(/Regular Season - (\d+)/);
  return match ? parseInt(match[1]) : 1;
};

/**
 * TRANSFORMA LOS DATOS DE LA API AL FORMATO DE LA APLICACIÓN
 */
export const mapApiMatchToLocal = (apiMatch: ApiFootballMatch) => {
  const isFinished = apiMatch.fixture.status.short === "FT";

  return {
    id: `api-${apiMatch.fixture.id}`,
    homeTeam: apiMatch.teams.home.name,
    awayTeam: apiMatch.teams.away.name,
    equipoLocal: apiMatch.teams.home.name,
    equipoVisitante: apiMatch.teams.away.name,
    date: apiMatch.fixture.date,
    matchday: extractMatchday(apiMatch.league.round),
    status: isFinished ? "finished" : "pending",
    estado: isFinished ? "finalizado" : "pendiente",
    result:
      isFinished &&
      apiMatch.score.fulltime.home !== null &&
      apiMatch.score.fulltime.away !== null
        ? {
            homeGoals: apiMatch.score.fulltime.home,
            awayGoals: apiMatch.score.fulltime.away,
            local: apiMatch.score.fulltime.home,
            visitante: apiMatch.score.fulltime.away,
          }
        : null,
    homeLogo: apiMatch.teams.home.logo,
    awayLogo: apiMatch.teams.away.logo,
  };
};

export const footballApiService = {
  getMatches,
  getMatchesBySeason,
  getFinishedMatches,
  mapApiMatchToLocal,
};
