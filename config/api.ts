import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./index";

/**
 * Wrapper `fetch` autour de l'API CoHabitat.
 *
 * Fonctionnalités :
 * - Préfixe automatique de `API_BASE_URL` (on passe juste le path, ex. `/auth/login`).
 * - Injection automatique du header `Authorization: Bearer <token>` si présent
 *   dans AsyncStorage (sauf si `auth: false` est passé).
 * - Injection automatique du header `Content-Type: application/json` quand le
 *   body est un objet sérialisable (et pas un `FormData` pour les uploads).
 * - Gestion centralisée du 401 : on déclenche un handler global (fixé par
 *   l'app au démarrage) qui peut purger le storage et rediriger vers /login.
 *
 * Usage :
 *   const res = await apiFetch('/auth/profile');
 *   const data = await res.json();
 *
 *   await apiFetch('/api/incidents', { method: 'POST', body: formData, isMultipart: true });
 */

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Enregistre un handler qui sera appelé chaque fois qu'une réponse 401 est
 * reçue. À appeler une seule fois (typiquement dans `_layout.tsx`).
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** Body : objet JS (sérialisé en JSON), FormData, ou string brut. */
  body?: any;
  /** Si false, n'injecte pas le header Authorization. Défaut : true. */
  auth?: boolean;
  /** Si true, ne met pas Content-Type (utile pour FormData). Défaut : auto-détecté. */
  isMultipart?: boolean;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { body, auth = true, isMultipart, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  // Auth header
  if (auth) {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        finalHeaders["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Pas critique : on continue sans header
    }
  }

  // Body + Content-Type
  let finalBody: BodyInit | undefined;
  const isFormData =
    isMultipart === true ||
    (typeof FormData !== "undefined" && body instanceof FormData);

  if (body !== undefined && body !== null) {
    if (isFormData) {
      finalBody = body as FormData;
      // ⚠️ Ne JAMAIS fixer Content-Type pour FormData (RN gère le boundary)
    } else if (typeof body === "string") {
      finalBody = body;
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    } else {
      finalBody = JSON.stringify(body);
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    }
  }

  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const response = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: finalBody,
  });

  // Gestion globale du 401 (token expiré ou invalide).
  // On purge le storage pour éviter qu'un token mort traîne et on délègue
  // la redirection à l'app via le handler enregistré.
  if (response.status === 401 && auth) {
    try {
      await AsyncStorage.multiRemove([
        "userToken",
        "userId",
        "userRole",
        "userEmail",
        "userName",
        "userBuildingId",
        "userBuildingName",
        "userBuildingAddress",
      ]);
    } catch {
      // ignore
    }
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
  }

  return response;
}
