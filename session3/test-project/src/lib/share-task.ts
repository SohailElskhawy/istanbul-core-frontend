import { type Task, getTaskStatus } from './tasks'

export function formatTaskForSharing(task: Task): string {
  const status = getTaskStatus(task)
  return [
    `Task: ${task.title}`,
    `Dates: ${task.startDate} to ${task.endDate}`,
    `Status: ${status}`,
  ].join('\n')
}

export type ShareResult = {
  success: boolean
  method: 'native' | 'clipboard' | 'failed'
  message?: string
}

export async function shareTask(task: Task): Promise<ShareResult> {
  const formattedText = formatTaskForSharing(task)

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: task.title,
        text: formattedText,
      })
      return {
        success: true,
        method: 'native',
        message: 'Task shared successfully.',
      }
    } catch (err: unknown) {
      // If user aborted/cancelled the native share sheet, do not treat as error
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          method: 'native',
          message: 'Share cancelled.',
        }
      }
      // If native share failed for another reason, fallback to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(formattedText)
      return {
        success: true,
        method: 'clipboard',
        message: 'Task copied to clipboard!',
      }
    } catch (err: unknown) {
      return {
        success: false,
        method: 'failed',
        message: err instanceof Error ? err.message : 'Could not copy task to clipboard.',
      }
    }
  }

  // Fallback for older browsers without clipboard API
  try {
    const textArea = document.createElement('textarea')
    textArea.value = formattedText
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    if (successful) {
      return {
        success: true,
        method: 'clipboard',
        message: 'Task copied to clipboard!',
      }
    }
  } catch {
    // Fallback failed
  }

  return {
    success: false,
    method: 'failed',
    message: 'Sharing is not supported on this browser.',
  }
}
