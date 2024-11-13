import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const tasks = database.select("tasks");
            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { title, description } = req.body;

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            database.insert("tasks", task);
            return res.writeHead(201).end("Tarefa Criada!");
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;

            database.update("tasks", id, {
                title,
                description,
                updated_at: new Date(),
            });

            return res.writeHead(204).end();
        },
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params;

            const task = database.update("tasks", id, {
                completed_at: new Date(),
                updated_at: new Date(), 
            });

            if (task) {
                return res.writeHead(204).end("Tarefa concluída!");
            }
                return res.writeHead(404).end("Tarefa não encontrada.");
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;

            database.delete("tasks", id);
            return res.writeHead(204).end("Tarefa Excluída!");
        },
    },
];
