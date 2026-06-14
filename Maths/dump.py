import re

with open(r'E:\Class 12 Holiday Homework\Maths\Formulas.html', 'r', encoding='utf-8') as f:
    text = f.read()

blocks = re.findall(r'<div class="formula-block">(.*?)</div>', text, re.DOTALL)
for i, b in enumerate(blocks[:5]):
    print(f"BLOCK {i}:")
    print(b.strip())
    print("-" * 20)
