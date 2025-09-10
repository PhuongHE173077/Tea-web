import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gamil.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'


export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file: any) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}

export const multipleFilesValidator = (files: FileList) => {
  const errors: string[] = []
  const validFiles: File[] = []

  if (!files || files.length === 0) {
    return { errors: ['No files selected'], validFiles: [] }
  }

  if (files.length > 10) {
    return { errors: ['Maximum 10 files allowed'], validFiles: [] }
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const error = singleFileValidator(file)
    if (error) {
      errors.push(`${file.name}: ${error}`)
    } else {
      validFiles.push(file)
    }
  }

  return { errors, validFiles }
}

export const slugify = (val: string) => {
  if (!val) return ''
  return String(val)
    .replace(/Đ/g, 'D') // xử lý riêng Đ
    .replace(/đ/g, 'd') // xử lý riêng đ
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
