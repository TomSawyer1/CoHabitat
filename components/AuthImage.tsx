import { useEffect, useState } from "react";
import { Image, ImageProps } from "react-native";
import { getToken } from "../config/tokenStorage";

type AuthImageProps = Omit<ImageProps, "source"> & { uri: string };

/**
 * Image chargée avec le header Authorization : le dossier /uploads du backend
 * n'est plus public, chaque requête d'image doit être authentifiée.
 */
export default function AuthImage({ uri, ...rest }: AuthImageProps) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getToken().then((t) => {
      if (mounted) setToken(t);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!token) return null;

  return (
    <Image
      {...rest}
      source={{ uri, headers: { Authorization: `Bearer ${token}` } }}
    />
  );
}
