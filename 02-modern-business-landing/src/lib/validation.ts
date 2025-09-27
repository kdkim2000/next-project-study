// lib/validation.ts
import * as yup from 'yup';

// Contact Form 유효성 검사 스키마
export const contactFormSchema = yup.object({
  name: yup
    .string()
    .required('이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다')
    .max(50, '이름은 최대 50글자까지 입력 가능합니다')
    .matches(/^[가-힣a-zA-Z\s]+$/, '이름에는 한글, 영문, 공백만 사용할 수 있습니다'),
  
  email: yup
    .string()
    .required('이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요')
    .max(100, '이메일은 최대 100글자까지 입력 가능합니다'),
  
  subject: yup
    .string()
    .required('문의 제목을 입력해주세요')
    .min(5, '제목은 최소 5글자 이상이어야 합니다')
    .max(100, '제목은 최대 100글자까지 입력 가능합니다'),
  
  message: yup
    .string()
    .required('문의 내용을 입력해주세요')
    .min(10, '문의 내용은 최소 10글자 이상이어야 합니다')
    .max(1000, '문의 내용은 최대 1000글자까지 입력 가능합니다'),
});

export type ContactFormData = yup.InferType<typeof contactFormSchema>;