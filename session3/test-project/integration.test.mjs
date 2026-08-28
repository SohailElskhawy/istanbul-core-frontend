import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const appSource = await readFile('src/App.tsx', 'utf8')
const headerSource = await readFile('src/components/TaskManager/Header.tsx', 'utf8')
const storageSource = await readFile('src/lib/task-storage.ts', 'utf8')

assert.match(appSource, /<TaskForm\b/)
assert.match(appSource, /<TaskList\b/)
assert.match(headerSource, /<LiveClock\b/)
assert.match(storageSource, /taskmanager\.tasks/)

console.log('Task manager integration contract passes')
