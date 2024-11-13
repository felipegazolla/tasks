import fs from "node:fs";
import { parse } from "csv-parse";
import fetch from "node-fetch";

const csvFilePath = "./src/tasks.csv";

async function importTasks() {
	const fileStream = fs.createReadStream(csvFilePath);

	const parser = fileStream.pipe(
		parse({
			delimiter: ",",
			columns: true,
			trim: true,
		}),
	);

	for await (const row of parser) {
		const { title, description } = row;

		await fetch("http://localhost:3333/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ title, description }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Erro ao criar a tarefa: ${response.statusText}`);
				}
				console.log(`Tarefa "${title}" criada com sucesso!`);
			})
			.catch((error) => {
				console.error(
					`Erro ao processar a tarefa "${title}": ${error.message}`,
				);
			});
	}
}

importTasks()
	.then(() => {
		console.log("Importação de tarefas concluída.");
	})
	.catch((error) => {
		console.error("Erro durante a importação de tarefas:", error);
	});
