import { isQuery } from './data';
export type ChatMessage = { text: string; query: import('./data').Query | null };
type SavedChat = { messages: ChatMessage[]; pins: string[] };
const key = 'studio-chat-v1';
let memory: SavedChat = { messages: [], pins: [] };
export function readChat(): { data: SavedChat; warning: string } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { data: memory, warning: '' };
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.pins) || !Array.isArray(saved.messages)) throw new Error('Invalid saved data');
    const pins = [...new Set<string>(saved.pins.filter((pin: unknown) => {
      try { return typeof pin === 'string' && isQuery(JSON.parse(pin)); } catch { return false; }
    }))];
    const messages = saved.messages.filter((m: ChatMessage) => m && typeof m.text === 'string' && (m.query === null || isQuery(m.query)));
    memory = { messages, pins };
    return { data: memory, warning: pins.length !== saved.pins.length || messages.length !== saved.messages.length ? 'Some saved items could not be restored.' : '' };
  } catch {
    return { data: memory, warning: 'Saved insights could not be loaded. Changes remain available for this session.' };
  }
}
export function writeChat(data: SavedChat): string {
  memory = data;
  try { localStorage.setItem(key, JSON.stringify(data)); return ''; }
  catch { return 'Changes last for this session; browser storage is unavailable.'; }
}
