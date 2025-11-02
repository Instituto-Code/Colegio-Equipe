import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { api_url } from "@/contexts/coordenadorContext";
import { useAuth } from "@/contexts/authContext";

const socket_url = api_url;

export const useNotifications = (userId: string, grupos: string) => {
    const { user } = useAuth();

    useEffect(() => {
        const socket = io(socket_url, {
            query: {
                userId,
                grupos
            }
        });

        socket.on("connect", () => {
            console.log("Conectado ao servidor Socket.IO:", socket.id);
        });

        socket.on("new_notification", (data) => {
            toast.info(`Nova notificação: ${data.conteudo}`);
        })

        return () => {
            socket.disconnect()
        }
    }, [userId, grupos]);
};