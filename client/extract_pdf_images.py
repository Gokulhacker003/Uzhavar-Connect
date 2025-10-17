from pdf2image import convert_from_path
import os

pdf_path = 'public/Masala packet.pdf'
output_dir = 'public/masala_images'
os.makedirs(output_dir, exist_ok=True)

pages = convert_from_path(pdf_path)
for i, page in enumerate(pages):
    img_path = os.path.join(output_dir, f'masala_page_{i+1}.jpg')
    page.save(img_path, 'JPEG')
print(f'Extracted {len(pages)} pages as images to {output_dir}')
