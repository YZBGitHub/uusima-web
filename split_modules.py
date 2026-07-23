import re
import os

def split_personal():
    os.makedirs('src/pages/personal', exist_ok=True)
    with open('src/pages/Personal.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    print("Length of Personal.tsx:", len(content))

split_personal()
