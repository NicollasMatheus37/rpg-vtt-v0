import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import Database from "better-sqlite3";
import { uuid } from "./utils";

type SerializedGridSnapshot = {
	grid: {
		width: number;
		height: number;
		tileSize: number;
		backgroundImageUrl: string | null;
		name?: string | null;
	};
	characters: Array<{
		id: string;
		name: string;
		status: string;
		currentHp: number;
		hp: number;
		movement: number | null;
		size: string;
		range: string;
		type: string;
		kind: "player" | "enemy";
		position: { x: number; y: number };
		color: string;
		borderColor: string;
		textColor: string;
	}>;
	logs: Array<{
		id: string;
		timestamp: number;
		type: string;
		message: string;
		actorName?: string;
		targetName?: string;
		amount?: number;
		fromPosition?: { x: number; y: number };
		toPosition?: { x: number; y: number };
	}>;
};

let db: Database.Database | null = null;

function initDatabase() {
	const userDataPath = app.getPath("userData");
	const dbPath = path.join(userDataPath, "rpg-vtt.sqlite");

	db = new Database(dbPath);
	db.pragma("journal_mode = WAL");

	db.exec(`
		PRAGMA foreign_keys = ON;

		CREATE TABLE IF NOT EXISTS grids (
			id TEXT PRIMARY KEY,
			name TEXT,
			width INTEGER NOT NULL,
			height INTEGER NOT NULL,
			tile_size INTEGER NOT NULL,
			background_image_url TEXT,
			created_at INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS personagens (
			id TEXT PRIMARY KEY,
			grid_id TEXT NOT NULL,
			kind TEXT NOT NULL, -- 'player' | 'enemy'
			name TEXT NOT NULL,
			status TEXT NOT NULL,
			current_hp INTEGER NOT NULL,
			hp INTEGER NOT NULL,
			movement INTEGER,
			size TEXT NOT NULL,
			range TEXT NOT NULL,
			type TEXT NOT NULL,
			pos_x INTEGER NOT NULL,
			pos_y INTEGER NOT NULL,
			color TEXT,
			border_color TEXT,
			text_color TEXT,
			FOREIGN KEY (grid_id) REFERENCES grids(id) ON DELETE CASCADE
		);

		CREATE TABLE IF NOT EXISTS logs (
			id TEXT PRIMARY KEY,
			grid_id TEXT NOT NULL,
			timestamp INTEGER NOT NULL,
			type TEXT NOT NULL,
			message TEXT NOT NULL,
			actor_name TEXT,
			target_name TEXT,
			amount INTEGER,
			from_x INTEGER,
			from_y INTEGER,
			to_x INTEGER,
			to_y INTEGER,
			actor_character_id TEXT,
			target_character_id TEXT,
			FOREIGN KEY (grid_id) REFERENCES grids(id) ON DELETE CASCADE,
			FOREIGN KEY (actor_character_id) REFERENCES personagens(id),
			FOREIGN KEY (target_character_id) REFERENCES personagens(id)
		);
	`);
}

function registerIpcHandlers() {
	if (!db) return;

	const insertGrid = db.prepare(
		`INSERT INTO grids (id, name, width, height, tile_size, background_image_url, created_at)
		 VALUES (@id, @name, @width, @height, @tile_size, @background_image_url, @created_at)`
	);

	const insertPersonagem = db.prepare(
		`INSERT INTO personagens (
			id, grid_id, kind, name, status, current_hp, hp, movement,
			size, range, type, pos_x, pos_y, color, border_color, text_color
		) VALUES (
			@id, @grid_id, @kind, @name, @status, @current_hp, @hp, @movement,
			@size, @range, @type, @pos_x, @pos_y, @color, @border_color, @text_color
		)`
	);

	const insertLog = db.prepare(
		`INSERT INTO logs (
			id, grid_id, timestamp, type, message, actor_name, target_name, amount,
			from_x, from_y, to_x, to_y, actor_character_id, target_character_id
		) VALUES (
			@id, @grid_id, @timestamp, @type, @message, @actor_name, @target_name, @amount,
			@from_x, @from_y, @to_x, @to_y, @actor_character_id, @target_character_id
		)`
	);

	const saveGridTx = db.transaction((snapshot: SerializedGridSnapshot) => {
		const gridId = uuid();
		const createdAt = Date.now();

		insertGrid.run({
			id: gridId,
			name: snapshot.grid.name ?? null,
			width: snapshot.grid.width,
			height: snapshot.grid.height,
			tile_size: snapshot.grid.tileSize,
			background_image_url: snapshot.grid.backgroundImageUrl ?? null,
			created_at: createdAt,
		});

		const charactersByName = new Map<string, string>();

		for (const character of snapshot.characters) {
			insertPersonagem.run({
				id: character.id,
				grid_id: gridId,
				kind: character.kind,
				name: character.name,
				status: character.status,
				current_hp: character.currentHp,
				hp: character.hp,
				movement: character.movement ?? null,
				size: character.size,
				range: character.range,
				type: character.type,
				pos_x: character.position.x,
				pos_y: character.position.y,
				color: character.color,
				border_color: character.borderColor,
				text_color: character.textColor,
			});

			// Usado depois para ligar logs a personagens por nome (se possível).
			if (!charactersByName.has(character.name)) {
				charactersByName.set(character.name, character.id);
			}
		}

		for (const log of snapshot.logs) {
			const actorCharacterId = log.actorName ? charactersByName.get(log.actorName) ?? null : null;
			const targetCharacterId = log.targetName ? charactersByName.get(log.targetName) ?? null : null;

			insertLog.run({
				id: log.id,
				grid_id: gridId,
				timestamp: log.timestamp,
				type: log.type,
				message: log.message,
				actor_name: log.actorName ?? null,
				target_name: log.targetName ?? null,
				amount: typeof log.amount === "number" ? log.amount : null,
				from_x: log.fromPosition?.x ?? null,
				from_y: log.fromPosition?.y ?? null,
				to_x: log.toPosition?.x ?? null,
				to_y: log.toPosition?.y ?? null,
				actor_character_id: actorCharacterId,
				target_character_id: targetCharacterId,
			});
		}

		return gridId;
	});

	ipcMain.handle("grid:saveCurrent", (_event, snapshot: SerializedGridSnapshot) => {
		const gridId = saveGridTx(snapshot);
		return { gridId };
	});
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererPath = path.join(__dirname, "renderer", "index.html");
  const hasBuiltFiles = fs.existsSync(rendererPath);

  // Handle load failures
  window.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
    if (errorCode === -106 || errorCode === -105) {
      // ERR_CONNECTION_REFUSED or ERR_NAME_NOT_RESOLVED
      console.error("Failed to load:", errorDescription);
      window.webContents.executeJavaScript(`
        document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif; text-align: center;">
          <h1>⚠️ Connection Error</h1>
          <p>Could not connect to Vite dev server at http://localhost:5173</p>
          <p><strong>For development:</strong> Run <code>npm run dev</code></p>
          <p><strong>For production:</strong> Run <code>npm run build</code> first, then <code>npm run start</code></p>
        </div>';
      `);
    }
  });

  if (hasBuiltFiles) {
    // Use built files (production or after build)
    window.loadFile(rendererPath);
  } else if (!app.isPackaged) {
    // Development mode: try to load from Vite dev server
    window.loadURL("http://localhost:5173");
  } else {
    // Packaged app: should have built files
    window.loadFile(rendererPath);
  }
}

// listeners
app.whenReady().then(() => {
	initDatabase();
	registerIpcHandlers();
	createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
