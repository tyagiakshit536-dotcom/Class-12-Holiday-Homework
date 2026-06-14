import re
import html

# The file paths
input_file = r'E:\Class 12 Holiday Homework\Maths\Formulas.html'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject MathJax into the head
mathjax_script = """
<!-- MathJax -->
<script>
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
      displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
      packages: {'[+]': ['noerrors']}
    },
    chtml: {
      displayAlign: 'left',
      displayIndent: '2em'
    }
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
"""

if 'MathJax-script' not in content:
    content = content.replace('</head>', mathjax_script + '\n</head>')

# 2. Process all formula blocks
def process_formula(match):
    original_text = match.group(1)
    # Unescape HTML entities so we can process < and > easily
    text = html.unescape(original_text)
    
    # Replace unicode and special characters
    replacements = {
        'α': r'\alpha ', 'β': r'\beta ', 'γ': r'\gamma ', 'Δ': r'\Delta ',
        'θ': r'\theta ', 'π': r'\pi ', 'Σ': r'\Sigma ', 'σ': r'\sigma ',
        '²': '^2', '³': '^3', '₁': '_1', '₂': '_2', '₃': '_3', 'ₖ': '_k',
        '→': r'\Rightarrow ', '≤': r'\le ', '≥': r'\ge ', '≠': r'\neq ',
        '×': r'\times ', '−': '-', '–': '-', '—': '-'
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
        
    # Replace √(...) with \sqrt{...}
    # We will do a simple non-greedy regex for parentheses
    text = re.sub(r'√\((.*?)\)', r'\\sqrt{\1}', text)
    # Replace √x with \sqrt{x}
    text = re.sub(r'√([a-zA-Z0-9_]+)', r'\\sqrt{\1}', text)
    
    # Wrap words like 'where', 'For', 'If' in \text{}
    text = re.sub(r'\b(where|For|If|when|and|or|is|not)\b', r'\\text{\1}', text, flags=re.IGNORECASE)
    
    # Handle newlines for LaTeX gather* environment
    lines = text.strip().split('\n')
    processed_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            processed_lines.append(r'\\') # Empty line
        else:
            processed_lines.append(line + r' \\')
            
    # Remove the trailing \\ from the last line
    if processed_lines and processed_lines[-1].endswith(r' \\'):
        processed_lines[-1] = processed_lines[-1][:-3]
        
    latex_content = '\n'.join(processed_lines)
    
    # Wrap in gather* environment for multiline, centered/aligned display
    return f'<div class="formula-block">\n\\begin{{gather*}}\n{latex_content}\n\\end{{gather*}}\n</div>'

new_content = re.sub(r'<div class="formula-block">(.*?)</div>', process_formula, content, flags=re.DOTALL)

with open(input_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Formula blocks successfully converted to LaTeX syntax and MathJax injected!")
