import { pick } from "lodash"


export const slugify = (val) => {
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



export const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

