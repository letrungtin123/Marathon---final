import { useCallback, useRef } from 'react'

import { uploadImage } from '@/apis/upload-image.api'
import { useAuth } from '@/contexts/auth-context'
import ReactQuill from 'react-quill'

interface IQuillEditorProps {
  value: string
  onChange: (value: string) => void
}

// onChange: (value: string) => void
// onChange: (value: string) => string[]

const QuillEditor = ({ value, onChange }: IQuillEditorProps) => {
  const { accessToken } = useAuth()

  const reactQuillRef = useRef<ReactQuill>(null)

  const handleUploadImage = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    // onchange
    input.onchange = async () => {
      if (input !== null && input.files) {
        const file = input.files[0]

        const formData = new FormData()
        formData.append('images', file)

        const response = await uploadImage(formData, accessToken)
        const url = response.data.urls[0].url

        const quill = reactQuillRef.current

        if (quill) {
          // insrt image từ api chèn vào trong react quill
          const range = quill.getEditorSelection()
          range && quill.getEditor().insertEmbed(range.index, 'image', url)
        }
      }
    }
  }, [])

  // re-render

  return (
    <ReactQuill
      ref={reactQuillRef}
      theme='snow'
      value={value}
      onChange={onChange}
      modules={{
        toolbar: {
          container: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            ['image']
          ],
          handlers: {
            image: handleUploadImage
          }
        }
      }}
      formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'list', 'image']}
    />
  )
}

export default QuillEditor
