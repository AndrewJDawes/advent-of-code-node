import path from 'path';
import { fileURLToPath } from 'url';
import { open } from 'lmdb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '_db_201611');
let db = open<boolean, string>({
    path: dbPath,
    compression: true,
    noSync: true,
    useWritemap: true,
});

export default db;
